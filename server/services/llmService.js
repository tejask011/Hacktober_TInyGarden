import fs from 'fs';
import path from 'path';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'gemma2:2b';

// Load offline reference data
const knowledgePath = path.resolve('server/data/gardening_knowledge.json');
let knowledgeBase = [];
try {
  if (fs.existsSync(knowledgePath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load local knowledge base:', err.message);
}

/**
 * Call local Ollama inference server with num_gpu: 0 for 100% stable CPU execution
 * preventing GPU NTSTATUS VRAM crashes (0xe06d7363) on Windows consumer machines.
 */
async function callOllama(prompt, model = DEFAULT_MODEL) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          num_gpu: 0,
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama status ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return cleanOutput(data.response);
  } catch (error) {
    console.warn(`Ollama local inference notice (${error.message}). Reverting to local knowledge engine.`);
    return null;
  }
}

/**
 * Clean text to enforce no-emoji constraint
 */
function cleanOutput(text) {
  if (!text) return '';
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
}

/**
 * 1. AI Planting Advisor Recommendation Generator
 */
export async function generatePlantingAdvice(userCriteria) {
  const { location, soil, sunlight, space, preferences, season } = userCriteria;

  const relevantKB = knowledgeBase.filter(k => 
    k.sunlight.toLowerCase().includes((sunlight || '').toLowerCase()) ||
    k.soil.toLowerCase().includes((soil || '').toLowerCase()) ||
    k.season.toLowerCase().includes((season || '').toLowerCase())
  );

  const prompt = `You are TinyGarden AI, a professional offline gardening and plantation assistant.
IMPORTANT RULE: Do not use any emojis or decorative symbols anywhere in your output.

User Conditions:
- Location/Region: ${location || 'General Regional Garden'}
- Soil Type: ${soil || 'Loamy / Well-draining'}
- Sunlight: ${sunlight || 'Full Sun'}
- Available Space: ${space || 'Medium Garden Bed'}
- Planting Season: ${season || 'Current Season'}
- User Preferences: ${preferences || 'Organic vegetable and herb growing'}

Available Local Reference Knowledge:
${JSON.stringify(relevantKB.slice(0, 3), null, 2)}

Provide a structured, personalized planting recommendation in raw JSON format with the following keys:
{
  "summary": "Short overview of suitabilities for this region and space",
  "recommendedPlants": [
    {
      "name": "Plant Name",
      "category": "Herb/Vegetable/Tree",
      "suitabilityReason": "Why it fits soil and sunlight",
      "plantingSteps": "Detailed step-by-step planting instructions",
      "wateringSchedule": "Watering frequency and advice",
      "sunlightRequirement": "Sunlight details",
      "expectedHarvestOrGrowth": "Timeline to harvest or maturity"
    }
  ],
  "seasonalTasks": ["Task 1", "Task 2", "Task 3"],
  "soilCareAdvice": "Detailed soil preparation tips for this soil type"
}
Return ONLY valid JSON. No markdown formatting code blocks. No emojis.`;

  const rawLLMResponse = await callOllama(prompt);

  if (rawLLMResponse) {
    try {
      const cleanJsonStr = rawLLMResponse.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      return parsed;
    } catch (e) {
      console.warn('Ollama JSON parsing failed, cleaning output string');
    }
  }

  // Local Rule-Guided Offline Fallback Generator
  return {
    summary: `Based on your location (${location || 'Local Region'}), ${soil || 'loamy'} soil, and ${sunlight || 'full'} sunlight, these selected species will thrive with optimal yield and minimal maintenance.`,
    recommendedPlants: (relevantKB.length > 0 ? relevantKB : knowledgeBase.slice(0, 3)).map(item => ({
      name: item.name,
      category: item.category,
      suitabilityReason: `Well suited for ${item.soil} and ${item.sunlight} condition in ${item.season}.`,
      plantingSteps: item.plantingAdvice,
      wateringSchedule: item.waterFrequency,
      sunlightRequirement: item.sunlight,
      expectedHarvestOrGrowth: "30 to 90 days depending on climate conditions"
    })),
    seasonalTasks: [
      `Prepare ${soil || 'soil'} bed by mixing organic compost 15 days prior to planting.`,
      `Establish drip or early morning watering schedule during active sun hours.`,
      `Apply organic mulch around plant bases to retain moisture and prevent weed competition.`
    ],
    soilCareAdvice: `Maintain optimal soil drainage for ${soil || 'your garden'}. Aerate the top 5cm of soil bi-weekly and add worm castings or compost monthly.`
  };
}

/**
 * 2. Tree Plantation Planner Generator
 */
export async function generateTreePlan(treeCriteria) {
  const { treeSpecies, purpose, areaSize, region } = treeCriteria;

  const prompt = `You are TinyGarden AI, a tree plantation specialist.
IMPORTANT RULE: Do not use any emojis or decorative symbols anywhere in your output.

Parameters:
- Target Tree Species / Type: ${treeSpecies || 'Neem or Shade Native Tree'}
- Plantation Purpose: ${purpose || 'Shade and Eco Restoration'}
- Area Size: ${areaSize || '100 sq meters'}
- Region: ${region || 'Subtropical'}

Provide a comprehensive tree plantation plan in valid JSON format:
{
  "treeName": "Species Full Name",
  "recommendedSpacing": "Spacing distance between trees",
  "estimatedCapacity": "Estimated total trees for this area size",
  "pitPreparation": "Pitting size, soil amendment, and pre-planting guide",
  "aftercareChecklist": ["Checklist item 1", "Checklist item 2", "Checklist item 3", "Checklist item 4"],
  "longTermBenefits": "Ecological and shade benefits over 3-5 years"
}
Return ONLY valid JSON. No markdown code block markers. No emojis.`;

  const rawLLMResponse = await callOllama(prompt);

  if (rawLLMResponse) {
    try {
      const cleanJsonStr = rawLLMResponse.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJsonStr);
    } catch (e) {
      console.warn('Ollama tree plan JSON parse error, reverting to rule engine');
    }
  }

  // Offline Fallback for Tree Planner
  const matchedTree = knowledgeBase.find(k => k.category === 'Trees' && k.name.toLowerCase().includes((treeSpecies || '').toLowerCase())) || knowledgeBase[0];

  return {
    treeName: matchedTree ? matchedTree.name : (treeSpecies || "Neem Tree (Azadirachta indica)"),
    recommendedSpacing: matchedTree ? `${matchedTree.spacingMeters} meters apart` : "5 to 6 meters between saplings",
    estimatedCapacity: "Suitable for 4 to 8 saplings in the specified plot area",
    pitPreparation: "Dig pits measuring 60cm x 60cm x 60cm at least 10 days before planting. Expose dug soil to sunlight to sterilize pests, then mix topsoil with 5kg organic farmyard manure per pit.",
    aftercareChecklist: matchedTree ? matchedTree.aftercareChecklist : [
      "Water thoroughly twice weekly during the first 6 months",
      "Install sturdy bamboo stake supports to protect against strong winds",
      "Maintain a 1-meter weed-free ring around each sapling base",
      "Apply protective neem oil spray if leaf-chewing caterpillars appear"
    ],
    longTermBenefits: "Improves local microclimate, enhances soil nitrogen retention, provides deep shade, and attracts beneficial native pollinators."
  };
}

/**
 * 3. Interactive 1-on-1 AI Gardening Chat response generator
 */
export async function generateChatResponse(userMessage, chatHistory = []) {
  const historyText = chatHistory.slice(-6).map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
  
  const prompt = `You are TinyGarden AI, an expert, friendly offline gardening and plantation assistant.
CRITICAL RULE: Do not use any emojis or decorative symbols anywhere in your response. Keep your advice practical, encouraging, and specific to the user's question.

Recent Conversation Context:
${historyText}

User Question: ${userMessage}

Provide a helpful, direct, and detailed response:`;

  const response = await callOllama(prompt);
  if (response) return response;

  // Rich Intelligent Offline Knowledge Engine Fallback (when Ollama is completely uninstalled/stopped)
  const q = (userMessage || '').toLowerCase();

  if (q.includes('sugarcane') || q.includes('duration') || q.includes('month') || q.includes('grow')) {
    return "Sugarcane takes approximately 10 to 12 months to reach full maturity from planting to harvest in tropical/subtropical climates. Early varieties can be harvested in 9-10 months, while long-duration crops take up to 14-18 months.";
  }

  if (q.includes('rose') || q.includes('colour') || q.includes('color')) {
    return "Roses naturally grow in thousands of colors and shades, including red, pink, yellow, white, orange, peach, lavender, purple, and multi-color bi-blends. (True blue roses do not exist naturally in plant genetics).";
  }

  if (q.includes('medicinal') || q.includes('herb') || q.includes('tulsi') || q.includes('aloe')) {
    return "Top medicinal plants for home gardens include:\n1. Holy Basil (Tulsi) - Respiratory & immune support\n2. Aloe Vera - Skin soothing & burn recovery\n3. Neem - Antifungal & natural pest repellent\n4. Mint (Pudina) - Digestive health\n5. Lemongrass - Detoxifying teas & aroma";
  }

  if (q.includes('pathway') || q.includes('outdoor') || q.includes('walkway') || q.includes('border')) {
    return "Ideal outdoor pathway and walkway border plants include:\n1. Mondo Grass & Ophiopogon - Low border edging\n2. Rosemary & Lavender - Fragrant foot-traffic foliage\n3. Creeping Thyme - Soft ground cover between stone pavers\n4. Marigolds - Pest-repellent colorful border blooms";
  }

  if (q.includes('indoor') || q.includes('small') || q.includes('balcony') || q.includes('modern') || q.includes('architecture')) {
    return "For a balcony or indoor space with modern aesthetic, consider:\n1. Snake Plant (Sansevieria) - Vertical sword foliage, drought hardy\n2. ZZ Plant (Zamioculcas) - Glossy dark leaves, low light tolerant\n3. Peace Lily - Elegant white blooms\n4. Jade Plant (Crassula) - Compact architectural succulent";
  }

  if (q.includes('soil') || q.includes('types')) {
    return "Major garden soil types include:\n1. Loam Soil - Ideal 40-40-20 mix of sand, silt, and clay with rich organic compost\n2. Sandy Soil - Fast draining, light texture\n3. Clay Soil - Dense, moisture & nutrient retaining\n4. Red Laterite Soil - Iron-rich, porous tropical soil\n5. Black Cotton Soil - Moisture expanding clay soil";
  }

  return `Regarding "${userMessage}": Choose healthy nursery saplings or seeds suitable for your local climate. Maintain well-draining loamy soil with 30% compost, and ensure regular watering when topsoil dries out.`;
}
