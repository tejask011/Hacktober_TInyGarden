import React, { useState } from 'react';
import { createJournalEntry } from '../utils/api';

export default function AIPlanResult({ planData, onRefresh }) {
  const [addedItems, setAddedItems] = useState({});

  if (!planData) return null;

  const { summary, recommendedPlants = [], seasonalTasks = [], soilCareAdvice } = planData;

  // Fallback plant image map for high quality visual display
  const plantImages = {
    'Neem': '/images/neem.jpg',
    'Tulsi': 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80',
    'Tomato': 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    'Moringa': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    'Aloe': 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
    'Mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    'Basil': 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80'
  };

  const getPlantImage = (name) => {
    for (const key in plantImages) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return plantImages[key];
      }
    }
    // High quality botanical fallback
    return 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80';
  };

  const handleAddToJournal = async (plant) => {
    try {
      await createJournalEntry({
        plantName: plant.name,
        type: plant.category || 'Crop',
        plantedDate: new Date().toISOString().split('T')[0],
        location: 'Garden Bed',
        soilType: 'Prepared Soil',
        sunlight: plant.sunlightRequirement || 'Full Sun',
        wateringFrequency: plant.wateringSchedule || 'Regular',
        status: 'Planted',
        notes: plant.plantingSteps || 'Added via AI Advisor plan.'
      });
      setAddedItems(prev => ({ ...prev, [plant.name]: true }));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to add plant to journal:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Strategy Banner */}
      <div className="bg-[#dfebd9] border border-[#b8d5b2] rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d76f30] animate-pulse"></span>
          <h3 className="text-xs font-bold text-[#172d13] uppercase tracking-widest font-heading">
            AI Personalized Gardening Blueprint
          </h3>
        </div>
        <p className="text-[#172d13] text-base leading-relaxed font-medium">{summary}</p>
      </div>

      {/* Recommended Plants Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#172d13] font-heading">Recommended Species & Cultivars</h3>
          <span className="text-xs text-[#3d5a37] font-semibold">
            {recommendedPlants.length} Recommended Species
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedPlants.map((plant, index) => {
            const imgSrc = getPlantImage(plant.name);
            return (
              <div key={index} className="bg-white border border-[#b8d5b2] hover:border-[#6bb77b] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition">
                {/* Visual Plant Header Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#dfebd9]">
                  <img
                    src={imgSrc}
                    alt={plant.name}
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172d13]/90 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <span className="bg-[#6bb77b] text-white text-xs font-bold px-2.5 py-1 rounded-full border border-[#529c61] font-heading">
                      {plant.category || 'Garden Crop'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h4 className="text-xl font-extrabold text-white drop-shadow font-heading">{plant.name}</h4>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-4">
                  {/* Suitability Pill */}
                  <div className="bg-[#dfebd9] p-3 rounded-xl border border-[#b8d5b2] text-xs">
                    <span className="text-[#172d13] block font-bold uppercase tracking-wider mb-1 font-heading">Suitability Analysis</span>
                    <p className="text-[#172d13]">{plant.suitabilityReason}</p>
                  </div>

                  {/* Requirements Matrix */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#dfebd9] p-3 rounded-xl border border-[#b8d5b2]">
                    <div>
                      <span className="text-[#3d5a37] font-medium block">Sunlight Need</span>
                      <span className="text-[#172d13] font-semibold">{plant.sunlightRequirement}</span>
                    </div>
                    <div>
                      <span className="text-[#3d5a37] font-medium block">Watering Routine</span>
                      <span className="text-[#172d13] font-semibold">{plant.wateringSchedule}</span>
                    </div>
                  </div>

                  {/* Detailed Planting Steps */}
                  <div className="space-y-1.5 text-xs text-[#3d5a37]">
                    <span className="text-[#172d13] font-bold uppercase tracking-wider block font-heading">Step-by-Step Planting</span>
                    <p className="bg-[#dfebd9] p-3 rounded-xl border border-[#b8d5b2] text-[#172d13] leading-relaxed">
                      {plant.plantingSteps}
                    </p>
                  </div>

                  {/* Timeline Badge */}
                  {plant.expectedHarvestOrGrowth && (
                    <div className="text-xs text-[#3d5a37] flex items-center justify-between pt-1">
                      <span>Harvest / Maturity:</span>
                      <span className="font-bold text-[#172d13]">{plant.expectedHarvestOrGrowth}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-[#dfebd9] border-t border-[#b8d5b2] flex justify-end">
                  {addedItems[plant.name] ? (
                    <span className="text-xs font-bold text-white bg-[#6bb77b] px-3.5 py-1.5 rounded-full border border-[#529c61] font-heading">
                      Tracked in Journal
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddToJournal(plant)}
                      className="text-xs font-extrabold bg-[#d76f30] hover:bg-[#bf5c20] text-white px-4 py-2 rounded-xl transition shadow-sm font-heading"
                    >
                      Track in Garden Journal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Tasks & Soil Care Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seasonal Tasks */}
        <div className="bg-white border border-[#b8d5b2] rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-base font-bold text-[#172d13] border-b border-[#b8d5b2] pb-2 font-heading">Seasonal Action Checklist</h3>
          <ul className="space-y-2.5">
            {seasonalTasks.map((task, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-xs text-[#172d13] bg-[#dfebd9] p-3 rounded-xl border border-[#b8d5b2]">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-[#d76f30] flex-shrink-0"></span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Soil Care Advice */}
        <div className="bg-white border border-[#b8d5b2] rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-base font-bold text-[#172d13] border-b border-[#b8d5b2] pb-2 font-heading">Soil Preparation & Fertility</h3>
          <p className="text-xs text-[#172d13] leading-relaxed bg-[#dfebd9] p-4 rounded-xl border border-[#b8d5b2]">
            {soilCareAdvice}
          </p>
        </div>
      </div>
    </div>
  );
}
