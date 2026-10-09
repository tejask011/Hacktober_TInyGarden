import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Sprout, 
  Scissors, 
  Bug, 
  Apple, 
  Leaf, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Clock, 
  MapPin, 
  Sun, 
  Sparkles,
  CalendarDays,
  Tag,
  Info
} from 'lucide-react';
import { 
  fetchJournalEntries, 
  createJournalEntry, 
  removeJournalEntry,
  fetchCareTasks, 
  createCareTask, 
  updateTaskStatus, 
  removeCareTask 
} from '../utils/api';

export default function GardenCalendar() {
  const [activeSection, setActiveSection] = useState('calendar'); // 'calendar' | 'journal'
  const [journal, setJournal] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Month navigation state
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  // Selected Date for Quick Add
  const [selectedDateStr, setSelectedDateStr] = useState(today.toISOString().split('T')[0]);

  // New Reminder Form state
  const [newTask, setNewTask] = useState({
    plantName: '',
    taskType: 'Watering',
    dueDate: today.toISOString().split('T')[0],
    notes: ''
  });

  // New Journal Entry Form state
  const [newJournal, setNewJournal] = useState({
    plantName: '',
    type: 'Vegetable',
    plantedDate: today.toISOString().split('T')[0],
    location: 'Backyard Bed',
    soilType: 'Loamy Organic Mix',
    sunlight: 'Full Direct Sun',
    wateringFrequency: 'Every 2 days',
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [jRes, tRes] = await Promise.all([
        fetchJournalEntries(),
        fetchCareTasks()
      ]);
      setJournal(jRes.entries || []);
      setTasks(tRes.tasks || []);
    } catch (err) {
      console.error('Failed to load garden records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync selected date with task form
  const handleSelectDay = (dayNum) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const dateFormatted = `${currentYear}-${mStr}-${dStr}`;
    setSelectedDateStr(dateFormatted);
    setNewTask(prev => ({ ...prev, dueDate: dateFormatted }));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDateStr(now.toISOString().split('T')[0]);
    setNewTask(prev => ({ ...prev, dueDate: now.toISOString().split('T')[0] }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.plantName.trim()) return;
    try {
      await createCareTask(newTask);
      setNewTask({
        plantName: '',
        taskType: 'Watering',
        dueDate: selectedDateStr || today.toISOString().split('T')[0],
        notes: ''
      });
      loadData();
    } catch (err) {
      console.error('Add task failed:', err);
    }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      await updateTaskStatus(id, !currentStatus);
      loadData();
    } catch (err) {
      console.error('Toggle task failed:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await removeCareTask(id);
      loadData();
    } catch (err) {
      console.error('Delete task failed:', err);
    }
  };

  const handleAddJournal = async (e) => {
    e.preventDefault();
    if (!newJournal.plantName.trim()) return;
    try {
      await createJournalEntry(newJournal);
      setNewJournal({
        plantName: '',
        type: 'Vegetable',
        plantedDate: today.toISOString().split('T')[0],
        location: 'Backyard Bed',
        soilType: 'Loamy Organic Mix',
        sunlight: 'Full Direct Sun',
        wateringFrequency: 'Every 2 days',
        notes: ''
      });
      loadData();
    } catch (err) {
      console.error('Add journal failed:', err);
    }
  };

  const handleDeleteJournal = async (id) => {
    try {
      await removeJournalEntry(id);
      loadData();
    } catch (err) {
      console.error('Delete journal entry failed:', err);
    }
  };

  // Calendar Date Math
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Helper to map tasks by date string YYYY-MM-DD
  const getTasksForDate = (dayNum) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const dateKey = `${currentYear}-${mStr}-${dStr}`;
    return tasks.filter(t => t.dueDate === dateKey);
  };

  const getTaskBadgeStyle = (taskType) => {
    switch (taskType) {
      case 'Watering':
        return 'bg-[#d76f30] text-white';
      case 'Add Soil / Fertilizer':
      case 'Organic Fertilizer':
        return 'bg-[#6bb77b] text-white';
      case 'Pruning & Mulching':
        return 'bg-[#172d13] text-white';
      case 'Pest Inspection':
        return 'bg-amber-600 text-white';
      case 'Harvesting':
        return 'bg-purple-700 text-white';
      default:
        return 'bg-[#294a23] text-white';
    }
  };

  const getTaskIcon = (taskType, className = "w-3.5 h-3.5 inline-block shrink-0") => {
    switch (taskType) {
      case 'Watering': return <Droplets className={className} />;
      case 'Add Soil / Fertilizer':
      case 'Organic Fertilizer': return <Sprout className={className} />;
      case 'Pruning & Mulching': return <Scissors className={className} />;
      case 'Pest Inspection': return <Bug className={className} />;
      case 'Harvesting': return <Apple className={className} />;
      default: return <Leaf className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 2 Main Sections Header Navigation */}
      <div className="bg-white border border-[#b8d5b2] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#172d13] text-white flex items-center justify-center font-bold text-lg font-heading shadow-md">
            <CalendarDays className="w-5 h-5 text-[#6bb77b]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172d13] font-heading">
              Garden Calendar & Journal Hub
            </h2>
            <p className="text-xs sm:text-sm text-[#3d5a37] font-medium">
              Schedule watering & soil reminders or log plant growth notes
            </p>
          </div>
        </div>

        {/* Section Switches */}
        <div className="flex space-x-2 bg-[#eaf1e9] p-1.5 rounded-xl border border-[#b8d5b2] w-full sm:w-auto">
          <button
            onClick={() => setActiveSection('calendar')}
            className={`flex-1 sm:flex-initial px-4.5 py-2 text-xs sm:text-sm font-extrabold rounded-lg transition flex items-center justify-center space-x-2 font-heading ${
              activeSection === 'calendar'
                ? 'bg-[#d76f30] text-white shadow-md'
                : 'text-[#172d13] hover:bg-[#dfebd9]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>1. Calendar & Reminders ({tasks.filter(t => !t.completed).length} Active)</span>
          </button>
          <button
            onClick={() => setActiveSection('journal')}
            className={`flex-1 sm:flex-initial px-4.5 py-2 text-xs sm:text-sm font-extrabold rounded-lg transition flex items-center justify-center space-x-2 font-heading ${
              activeSection === 'journal'
                ? 'bg-[#d76f30] text-white shadow-md'
                : 'text-[#172d13] hover:bg-[#dfebd9]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. Garden Journal ({journal.length} Entries)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#b8d5b2] rounded-2xl p-8 text-center text-[#172d13] font-semibold text-sm shadow-sm flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#d76f30] animate-spin" />
          <span>Loading local garden schedule and journal...</span>
        </div>
      ) : activeSection === 'calendar' ? (
        /* ==================== SECTION 1: GOOGLE CALENDAR MONTH GRID & REMINDERS ==================== */
        <div className="space-y-6">
          {/* Add Reminder Form */}
          <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#b8d5b2] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#172d13] font-heading flex items-center space-x-2">
                  <Plus className="w-4.5 h-4.5 text-[#d76f30]" />
                  <span>Add Reminder for Water, Soil & Care</span>
                </h3>
                <p className="text-xs text-[#3d5a37] font-medium mt-0.5">
                  Select a date or click any day on the calendar below to pin an event
                </p>
              </div>
              <span className="text-xs font-bold bg-[#dfebd9] text-[#172d13] px-3 py-1 rounded-full border border-[#b8d5b2] font-heading self-start sm:self-center flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d76f30]" />
                <span>Selected Date: {selectedDateStr}</span>
              </span>
            </div>

            <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Plant Name */}
              <div>
                <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                  Plant / Tree Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sweet Basil, Tomato, Neem"
                  value={newTask.plantName}
                  onChange={(e) => setNewTask({ ...newTask, plantName: e.target.value })}
                  className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                  required
                />
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                  Reminder Type
                </label>
                <select
                  value={newTask.taskType}
                  onChange={(e) => setNewTask({ ...newTask, taskType: e.target.value })}
                  className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                >
                  <option value="Watering">Watering</option>
                  <option value="Add Soil / Fertilizer">Add Soil / Fertilizer</option>
                  <option value="Pruning & Mulching">Pruning & Mulching</option>
                  <option value="Pest Inspection">Pest Inspection</option>
                  <option value="Harvesting">Harvesting</option>
                  <option value="General Care">General Care</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                  Event Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => {
                    setNewTask({ ...newTask, dueDate: e.target.value });
                    setSelectedDateStr(e.target.value);
                  }}
                  className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#d76f30] hover:bg-[#bf5c20] text-white font-extrabold rounded-xl text-xs sm:text-sm py-3 px-4 transition shadow-md font-heading flex items-center justify-center space-x-1.5 uppercase tracking-wide"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </div>
            </form>
          </div>

          {/* Month Calendar Card Grid */}
          <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
            {/* Calendar Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#b8d5b2] pb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-2xl font-bold text-[#172d13] font-heading">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <span className="text-xs bg-[#6bb77b] text-white px-3 py-0.5 rounded-full font-bold flex items-center space-x-1">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Google Calendar View</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToday}
                  className="px-3.5 py-1.5 bg-[#dfebd9] hover:bg-[#6bb77b] hover:text-white text-[#172d13] text-xs font-bold rounded-lg border border-[#b8d5b2] transition"
                >
                  Today
                </button>
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 bg-[#eaf1e9] hover:bg-[#dfebd9] text-[#172d13] font-bold rounded-lg border border-[#b8d5b2] transition"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 bg-[#eaf1e9] hover:bg-[#dfebd9] text-[#172d13] font-bold rounded-lg border border-[#b8d5b2] transition"
                  title="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 7-Day Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs sm:text-sm text-[#172d13] uppercase font-heading bg-[#dfebd9] py-2.5 rounded-xl border border-[#b8d5b2]">
              {daysOfWeek.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-24 sm:h-28 bg-[#f7faf6] rounded-xl border border-dashed border-[#d2e3d0]/60 opacity-40"></div>
              ))}

              {/* Month Day Cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const mStr = String(currentMonth + 1).padStart(2, '0');
                const dStr = String(dayNum).padStart(2, '0');
                const dateKey = `${currentYear}-${mStr}-${dStr}`;
                const isSelected = selectedDateStr === dateKey;
                const isToday = 
                  today.getFullYear() === currentYear && 
                  today.getMonth() === currentMonth && 
                  today.getDate() === dayNum;

                const dayTasks = getTasksForDate(dayNum);

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer overflow-hidden ${
                      isToday
                        ? 'bg-[#eaf1e9] border-[#d76f30] ring-2 ring-[#d76f30]/40 shadow-sm'
                        : isSelected
                        ? 'bg-[#dfebd9] border-[#6bb77b] shadow-md'
                        : 'bg-white border-[#b8d5b2] hover:border-[#6bb77b] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-extrabold font-heading ${
                        isToday
                          ? 'bg-[#d76f30] text-white w-6 h-6 rounded-full flex items-center justify-center'
                          : 'text-[#172d13]'
                      }`}>
                        {dayNum}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-[10px] font-bold bg-[#172d13] text-white px-1.5 py-0.2 rounded-full">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    {/* Event Chips (Google Calendar Style) */}
                    <div className="space-y-1 my-1 overflow-y-auto no-scrollbar flex-1">
                      {dayTasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-bold truncate flex items-center space-x-1 shadow-xs ${
                            t.completed ? 'line-through opacity-50 bg-gray-200 text-gray-700' : getTaskBadgeStyle(t.taskType)
                          }`}
                          title={`${t.taskType}: ${t.plantName}`}
                        >
                          {getTaskIcon(t.taskType, "w-2.5 h-2.5 shrink-0")}
                          <span className="truncate">{t.plantName}</span>
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-[9px] font-bold text-[#d76f30] pl-1">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Tasks & Reminders List */}
          <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#172d13] font-heading border-b border-[#b8d5b2] pb-2 flex items-center justify-between">
              <span>All Scheduled Reminders & Care Tasks ({tasks.length})</span>
            </h3>

            {tasks.length === 0 ? (
              <p className="text-xs text-[#3d5a37] font-medium text-center py-6">
                No reminders scheduled yet. Add your first water or soil reminder above.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                      task.completed
                        ? 'bg-[#dfebd9] border-[#b8d5b2] opacity-60'
                        : 'bg-white border-[#b8d5b2] hover:border-[#6bb77b]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleToggleTask(task.id, task.completed)}
                        className="text-[#d76f30] hover:scale-110 transition"
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5 text-[#6bb77b]" /> : <Circle className="w-5 h-5 text-[#b8d5b2]" />}
                      </button>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${getTaskBadgeStyle(task.taskType)}`}>
                            {getTaskIcon(task.taskType, "w-3 h-3")}
                            <span>{task.taskType}</span>
                          </span>
                          <span className={`text-sm font-bold ${task.completed ? 'line-through text-[#3d5a37]' : 'text-[#172d13]'}`}>
                            {task.plantName}
                          </span>
                        </div>
                        <div className="text-xs text-[#3d5a37] mt-1 font-medium flex items-center space-x-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#d76f30]" />
                          <span>Scheduled: <strong>{task.dueDate}</strong> {task.notes && `• ${task.notes}`}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================== SECTION 2: GARDEN JOURNAL ==================== */
        <div className="space-y-6">
          {/* Write & Save Journal Entry Form */}
          <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="border-b border-[#b8d5b2] pb-3 flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#d76f30] text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#172d13] font-heading">
                  Write & Save Garden Journal Entry
                </h3>
                <p className="text-xs text-[#3d5a37] font-medium mt-0.5">
                  Record your plant observations, soil preparation logs, sapling growth notes, and harvesting updates.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddJournal} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Plant Name */}
                <div>
                  <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                    Plant or Tree Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Neem Tree, Sweet Basil, Tomato"
                    value={newJournal.plantName}
                    onChange={(e) => setNewJournal({ ...newJournal, plantName: e.target.value })}
                    className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] placeholder-[#3d5a37]/70 focus:outline-none focus:border-[#d76f30]"
                    required
                  />
                </div>

                {/* Plant Category */}
                <div>
                  <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                    Plant Category
                  </label>
                  <select
                    value={newJournal.type}
                    onChange={(e) => setNewJournal({ ...newJournal, type: e.target.value })}
                    className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                  >
                    <option value="Herb">Herb</option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Tree">Tree</option>
                    <option value="Indoor Foliage">Indoor Foliage</option>
                    <option value="Medicinal">Medicinal</option>
                    <option value="Flower">Flower</option>
                  </select>
                </div>

                {/* Planted Date */}
                <div>
                  <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                    Planted / Log Date
                  </label>
                  <input
                    type="date"
                    value={newJournal.plantedDate}
                    onChange={(e) => setNewJournal({ ...newJournal, plantedDate: e.target.value })}
                    className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                    Garden Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Balcony Pot #2, Backyard Bed"
                    value={newJournal.location}
                    onChange={(e) => setNewJournal({ ...newJournal, location: e.target.value })}
                    className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] placeholder-[#3d5a37]/70 focus:outline-none focus:border-[#d76f30]"
                  />
                </div>
              </div>

              {/* Journal Notes Text Area */}
              <div>
                <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                  Journal Growth & Care Notes
                </label>
                <textarea
                  rows={3}
                  value={newJournal.notes}
                  onChange={(e) => setNewJournal({ ...newJournal, notes: e.target.value })}
                  placeholder="Write details about soil mix, new leaf sprouts, fertilizer added, or pruning done..."
                  className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] placeholder-[#3d5a37]/70 focus:outline-none focus:border-[#d76f30]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#d76f30] hover:bg-[#bf5c20] text-white font-extrabold rounded-xl text-xs sm:text-sm py-3.5 transition shadow-md font-heading flex items-center justify-center space-x-2 uppercase tracking-wide border border-[#bf5c20]"
              >
                <Save className="w-4 h-4" />
                <span>Save Journal Entry</span>
              </button>
            </form>
          </div>

          {/* Saved Journal Entries List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {journal.length === 0 ? (
              <div className="col-span-full bg-white border border-[#b8d5b2] rounded-2xl p-8 text-center text-[#3d5a37] font-semibold text-sm">
                No plant journal entries saved yet. Write your first entry above.
              </div>
            ) : (
              journal.map((item) => (
                <div key={item.id} className="bg-white border border-[#b8d5b2] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-[#6bb77b] transition space-y-4">
                  <div>
                    <div className="flex items-start justify-between border-b border-[#dfebd9] pb-2.5">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-[#172d13] font-heading flex items-center space-x-2">
                          <Leaf className="w-4.5 h-4.5 text-[#6bb77b] shrink-0" />
                          <span>{item.plantName}</span>
                        </h4>
                        <span className="inline-block mt-1 text-xs font-bold text-white bg-[#6bb77b] px-3 py-0.5 rounded-full border border-[#529c61] font-heading">
                          {item.type}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteJournal(item.id)}
                        className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition"
                        title="Remove Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3.5 space-y-2 text-xs sm:text-sm text-[#3d5a37] font-medium">
                      <p className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-[#d76f30] shrink-0" />
                        <span><strong className="text-[#172d13] font-bold">Planted Date:</strong> {item.plantedDate}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#6bb77b] shrink-0" />
                        <span><strong className="text-[#172d13] font-bold">Location:</strong> {item.location}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Sprout className="w-4 h-4 text-[#172d13] shrink-0" />
                        <span><strong className="text-[#172d13] font-bold">Soil Type:</strong> {item.soilType}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong className="text-[#172d13] font-bold">Sunlight:</strong> {item.sunlight}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                        <span><strong className="text-[#172d13] font-bold">Watering:</strong> {item.wateringFrequency}</span>
                      </p>
                      {item.notes && (
                        <div className="mt-3 text-[#172d13] font-medium bg-[#dfebd9] p-3.5 rounded-xl border border-[#b8d5b2] text-xs sm:text-sm leading-relaxed">
                          "{item.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
