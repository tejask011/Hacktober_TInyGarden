import React from 'react';
import { Sprout, MessageSquare, Activity, CalendarDays, Settings } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, healthInfo, onOpenSettings }) {
  const isOllamaActive = healthInfo?.ollamaStatus === 'connected';

  const navItems = [
    { id: 'chat', label: '1-on-1 AI Chat', icon: MessageSquare },
    { id: 'health', label: 'Plant Health Helper', icon: Activity },
    { id: 'calendar', label: 'Garden Journal & Calendar', icon: CalendarDays }
  ];

  return (
    <header className="bg-[#172d13] border-b border-[#294a23] sticky top-0 z-40 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="w-10 h-10 rounded-xl bg-[#d76f30] flex items-center justify-center font-black text-white text-xl shadow-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold text-white tracking-wide font-heading">TinyGarden AI</span>
                <span className="bg-[#6bb77b] text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#529c61]">
                  Botanical AI
                </span>
              </div>
              <p className="text-xs text-[#a8d3b0]">Offline Gardening & Plantation Assistant</p>
            </div>
          </div>

          {/* Navigation Tabs (3 Main Tabs) */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 font-heading ${
                    active
                      ? 'bg-[#d76f30] text-white shadow-md'
                      : 'text-[#eaf1e9] hover:bg-[#294a23] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Badge & Settings */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 bg-[#23421d] rounded-full border border-[#3b6333] text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isOllamaActive ? 'bg-[#6bb77b] animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-[#eaf1e9] font-medium">
                {isOllamaActive ? `Ollama (${healthInfo?.activeModel || 'gemma2:2b'})` : 'Local AI Engine'}
              </span>
            </div>

            <button
              onClick={onOpenSettings}
              className="px-3.5 py-1.5 text-xs font-bold text-white hover:text-white bg-[#6bb77b] hover:bg-[#d76f30] rounded-lg border border-[#529c61] transition shadow-sm flex items-center space-x-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-[#294a23] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-bold font-heading flex items-center space-x-1.5 ${
                  activeTab === item.id ? 'bg-[#d76f30] text-white' : 'text-[#eaf1e9] bg-[#23421d]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
