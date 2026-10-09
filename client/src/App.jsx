import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AIChatAssistant from './components/AIChatAssistant';
import PlantHealthHelper from './components/PlantHealthHelper';
import GardenCalendar from './components/GardenCalendar';
import SettingsModal from './components/SettingsModal';
import { fetchHealthStatus } from './utils/api';
import { MessageSquare, Camera, Sparkles, Sprout } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat'); // Default to 1-on-1 AI Chat
  const [healthInfo, setHealthInfo] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const loadHealth = async () => {
    const data = await fetchHealthStatus();
    setHealthInfo(data);
  };

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // 3 Generic online tree & garden images requested by user
  const showcaseImages = [
    {
      title: 'Neem & Shade Tree Plantation',
      subtitle: 'Lush evergreen canopy for outdoor gardens & eco restoration',
      url: '/images/neem.jpg'
    },
    {
      title: 'Balcony & Indoor Botanical Haven',
      subtitle: 'Air-purifying foliage suited for modern urban architecture',
      url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Organic Vegetable & Herb Garden Bed',
      subtitle: 'Rich soil cultivation with automated watering schedules',
      url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#eaf1e9] text-[#172d13] font-sans flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthInfo={healthInfo}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Botanical Hero Banner */}
        <div className="bg-white border border-[#b8d5b2] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-widest bg-[#6bb77b] px-3.5 py-1 rounded-full border border-[#529c61] font-heading flex items-center space-x-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Local Open-Weight AI Assistant</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172d13] tracking-tight font-heading leading-tight flex items-center space-x-3">
              <span>Tree & Botanical Garden Care Assistant</span>
            </h1>
            <p className="text-sm text-[#3d5a37] leading-relaxed">
              Chat 1-on-1 with local AI for instant advice on plant care, soil prep, indoor foliage, and tree plantation. Scan leaf photos for disease diagnostics and track your watering calendar locally.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('chat')}
                className="px-5 py-2.5 bg-[#d76f30] hover:bg-[#bf5c20] text-white font-bold rounded-xl text-sm transition shadow-md font-heading flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start 1-on-1 AI Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('health')}
                className="px-5 py-2.5 bg-[#6bb77b] hover:bg-[#529c61] text-white font-bold rounded-xl text-sm transition border border-[#529c61] font-heading shadow-sm flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Plant Photo</span>
              </button>
            </div>
          </div>

          {/* Featured Visual Image Gallery (2-3 Trees & Garden Photos) */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            {showcaseImages.map((img, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-2xl border border-[#b8d5b2] bg-[#dfebd9] h-28 w-full sm:w-28 shadow-md">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172d13]/90 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-1.5 left-2 right-2 text-[9px] font-bold text-white leading-tight font-heading truncate">
                  {img.title.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Components */}
        {activeTab === 'chat' && <AIChatAssistant />}

        {activeTab === 'health' && <PlantHealthHelper />}

        {activeTab === 'calendar' && <GardenCalendar />}
      </main>

      {/* Footer */}
      <footer className="bg-[#172d13] border-t border-[#294a23] py-6 text-center text-xs text-[#a8d3b0] mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sprout className="w-4 h-4 text-[#6bb77b]" />
            <span className="font-bold text-white font-heading">TinyGarden AI</span> — Botanical AI Assistant
          </div>
          <div className="text-[#a8d3b0]">
            Powered by Ollama Open-Weight Models & React
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={loadHealth}
      />
    </div>
  );
}
