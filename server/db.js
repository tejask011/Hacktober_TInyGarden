import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'tinygarden_store.json');

const defaultData = {
  gardenJournal: [
    {
      id: 'p_1',
      plantName: 'Sweet Basil',
      type: 'Herb',
      plantedDate: new Date().toISOString().split('T')[0],
      location: 'Balcony Container',
      soilType: 'Loamy Potting Mix',
      sunlight: 'Full Sun (6+ hrs)',
      wateringFrequency: 'Every 2 days',
      status: 'Healthy & Growing',
      notes: 'Planted from seeds. First true leaves emerged!'
    },
    {
      id: 'p_2',
      plantName: 'Neem Tree (Azadirachta indica)',
      type: 'Tree',
      plantedDate: new Date().toISOString().split('T')[0],
      location: 'Front Yard Garden',
      soilType: 'Well-draining Sandy Loam',
      sunlight: 'Direct Full Sun',
      wateringFrequency: 'Twice weekly',
      status: 'Sapling Stage',
      notes: 'Planted as part of neighborhood plantation drive.'
    }
  ],
  careTasks: [
    {
      id: 't_1',
      plantName: 'Sweet Basil',
      taskType: 'Watering',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      notes: 'Water deeply until drainage holes moisten.'
    },
    {
      id: 't_2',
      plantName: 'Neem Tree',
      taskType: 'Organic Fertilizer',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      completed: false,
      notes: 'Apply vermicompost around sapling drip line.'
    }
  ],
  savedPlans: [],
  settings: {
    modelProvider: 'ollama',
    modelName: 'gemma2:2b',
    ollamaUrl: 'http://localhost:11434',
    privacyMode: true
  }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading TinyGarden DB:', err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing TinyGarden DB:', err);
  }
}

export function getJournalEntries() {
  const data = readDb();
  return data.gardenJournal || [];
}

export function addJournalEntry(entry) {
  const data = readDb();
  const newEntry = {
    id: 'plant_' + Date.now(),
    createdAt: new Date().toISOString(),
    ...entry
  };
  data.gardenJournal.unshift(newEntry);

  data.careTasks.unshift({
    id: 'task_' + Date.now(),
    plantName: newEntry.plantName,
    taskType: 'Watering',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    notes: `Watering task for ${newEntry.plantName}`
  });

  writeDb(data);
  return newEntry;
}

export function deleteJournalEntry(id) {
  const data = readDb();
  data.gardenJournal = data.gardenJournal.filter(p => p.id !== id);
  writeDb(data);
  return true;
}

export function getCareTasks() {
  const data = readDb();
  return data.careTasks || [];
}

export function addCareTask(task) {
  const data = readDb();
  const newTask = {
    id: 'task_' + Date.now(),
    completed: false,
    ...task
  };
  data.careTasks.unshift(newTask);
  writeDb(data);
  return newTask;
}

export function toggleCareTask(taskId, forceState = null) {
  const data = readDb();
  const task = data.careTasks.find(t => t.id === taskId);
  if (task) {
    task.completed = forceState !== null ? forceState : !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    writeDb(data);
  }
  return task;
}

export function deleteCareTask(id) {
  const data = readDb();
  data.careTasks = data.careTasks.filter(t => t.id !== id);
  writeDb(data);
  return true;
}

export function getSettings() {
  const data = readDb();
  return data.settings || defaultData.settings;
}

export function saveSettings(newSettings) {
  const data = readDb();
  data.settings = { ...data.settings, ...newSettings };
  writeDb(data);
  return data.settings;
}
