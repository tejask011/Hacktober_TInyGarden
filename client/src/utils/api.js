const API_BASE = 'http://localhost:3001/api';

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'error', ollamaStatus: 'offline' };
  }
}

export async function sendChatMessage(message, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  if (!res.ok) throw new Error('Failed to send message to AI Assistant');
  return await res.json();
}

export async function fetchKnowledgeBase(category = 'All', search = '') {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/knowledge?${params.toString()}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch knowledge base:', err);
    return { items: [] };
  }
}

export async function fetchPlantingAdvice(formData) {
  const res = await fetch(`${API_BASE}/plant/advisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) throw new Error('Failed to generate planting advice');
  return await res.json();
}

export async function fetchTreePlan(formData) {
  const res = await fetch(`${API_BASE}/tree/planter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) throw new Error('Failed to generate tree plantation plan');
  return await res.json();
}

export async function analyzePlantSymptom(formData) {
  const res = await fetch(`${API_BASE}/health/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) throw new Error('Failed to analyze plant health');
  return await res.json();
}

export async function fetchJournalEntries() {
  const res = await fetch(`${API_BASE}/journal`);
  return await res.json();
}

export async function createJournalEntry(entry) {
  const res = await fetch(`${API_BASE}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  return await res.json();
}

export async function removeJournalEntry(id) {
  const res = await fetch(`${API_BASE}/journal/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function fetchCareTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  return await res.json();
}

export async function createCareTask(task) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return await res.json();
}

export async function updateTaskStatus(id, completed) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  return await res.json();
}

export async function removeCareTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return await res.json();
}

export async function updateSettings(settings) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return await res.json();
}
