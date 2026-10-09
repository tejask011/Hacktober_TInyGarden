import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getJournalEntries, 
  addJournalEntry, 
  deleteJournalEntry, 
  getCareTasks, 
  addCareTask, 
  toggleCareTask, 
  deleteCareTask,
  getSettings,
  saveSettings 
} from './db.js';
import { generatePlantingAdvice, generateTreePlan, generateChatResponse } from './services/llmService.js';
import { analyzePlantHealth } from './services/plantHealthService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Serve static frontend build if dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Load local offline knowledge base
const knowledgePath = path.resolve('server/data/gardening_knowledge.json');
let knowledgeBase = [];
try {
  if (fs.existsSync(knowledgePath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
  }
} catch (e) {
  console.error('Failed to read knowledge file:', e.message);
}

// Root route fallback
app.get('/', (req, res) => {
  if (fs.existsSync(path.join(clientDistPath, 'index.html'))) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }
  res.json({
    app: 'TinyGarden AI Backend API',
    status: 'online',
    frontendUrl: 'http://localhost:5173',
    apiDocs: 'Access /api/health for system status'
  });
});

// System status endpoint
app.get('/api/health', async (req, res) => {
  const settings = getSettings();
  let ollamaStatus = 'disconnected';
  
  try {
    const response = await fetch(`${settings.ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(2000) });
    if (response.ok) {
      ollamaStatus = 'connected';
    }
  } catch (err) {
    ollamaStatus = 'offline';
  }

  res.json({
    status: 'ok',
    app: 'TinyGarden AI',
    version: '1.0.0',
    ollamaStatus,
    activeModel: settings.modelName,
    offlineKnowledgeCount: knowledgeBase.length
  });
});

// 1-on-1 AI Gardening Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    const reply = await generateChatResponse(message, history || []);
    res.json({ success: true, reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ success: false, error: 'Failed to process chat response' });
  }
});

// Offline Knowledge Base Endpoint
app.get('/api/knowledge', (req, res) => {
  const { category, search } = req.query;
  let results = [...knowledgeBase];

  if (category && category !== 'All') {
    results = results.filter(k => k.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(k => 
      k.name.toLowerCase().includes(q) || 
      k.description.toLowerCase().includes(q) ||
      k.soil.toLowerCase().includes(q)
    );
  }

  res.json({ items: results });
});

// AI Planting Advisor Endpoint
app.post('/api/plant/advisor', async (req, res) => {
  try {
    const advice = await generatePlantingAdvice(req.body);
    res.json({ success: true, data: advice });
  } catch (error) {
    console.error('Advisor Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate planting advice.' });
  }
});

// Tree Plantation Planner Endpoint
app.post('/api/tree/planter', async (req, res) => {
  try {
    const plan = await generateTreePlan(req.body);
    res.json({ success: true, data: plan });
  } catch (error) {
    console.error('Tree Planter Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate tree plantation plan.' });
  }
});

// Plant Health Diagnostic Endpoint
app.post('/api/health/analyze', async (req, res) => {
  try {
    const diagnosis = await analyzePlantHealth(req.body);
    res.json({ success: true, data: diagnosis });
  } catch (error) {
    console.error('Health Analyze Error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze plant health.' });
  }
});

// Journal Endpoints
app.get('/api/journal', (req, res) => {
  const entries = getJournalEntries();
  res.json({ entries });
});

app.post('/api/journal', (req, res) => {
  const entry = addJournalEntry(req.body);
  res.json({ success: true, entry });
});

app.delete('/api/journal/:id', (req, res) => {
  deleteJournalEntry(req.params.id);
  res.json({ success: true });
});

// Care Tasks & Calendar Endpoints
app.get('/api/tasks', (req, res) => {
  const tasks = getCareTasks();
  res.json({ tasks });
});

app.post('/api/tasks', (req, res) => {
  const task = addCareTask(req.body);
  res.json({ success: true, task });
});

app.patch('/api/tasks/:id', (req, res) => {
  const updated = toggleCareTask(req.params.id, req.body.completed);
  res.json({ success: true, task: updated });
});

app.delete('/api/tasks/:id', (req, res) => {
  deleteCareTask(req.params.id);
  res.json({ success: true });
});

// Settings Endpoints
app.get('/api/settings', (req, res) => {
  const settings = getSettings();
  res.json({ settings });
});

app.post('/api/settings', (req, res) => {
  const settings = saveSettings(req.body);
  res.json({ success: true, settings });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TinyGarden AI backend running on http://0.0.0.0:${PORT}`);
});
