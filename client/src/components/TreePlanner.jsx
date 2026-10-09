import React, { useState } from 'react';
import { fetchTreePlan, createJournalEntry } from '../utils/api';
import { Trees, Sprout, CheckCircle2, BookmarkPlus, Compass, Layers, Sparkles, MapPin } from 'lucide-react';

export default function TreePlanner({ onRefresh }) {
  const [formData, setFormData] = useState({
    treeSpecies: 'Neem Tree (Azadirachta indica)',
    purpose: 'Eco Restoration & Shade',
    areaSize: '100 sq meters',
    region: 'Subtropical'
  });

  const [isCustomTree, setIsCustomTree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const presetTrees = [
    'Neem Tree (Azadirachta indica)',
    'Moringa / Drumstick Tree (Moringa oleifera)',
    'Mango Tree (Mangifera indica)',
    'Banyan / Sacred Fig (Ficus benghalensis)',
    'Teak Wood Tree (Tectona grandis)',
    'Gulmohar / Royal Poinciana',
    'Jackfruit Tree (Artocarpus heterophyllus)',
    'Coconut Palm'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'treeSpecies' && value === '__CUSTOM__') {
      setIsCustomTree(true);
      setFormData(prev => ({ ...prev, treeSpecies: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      const response = await fetchTreePlan(formData);
      if (response.success) {
        setResult(response.data);
      }
    } catch (err) {
      console.error('Tree planning failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToJournal = async () => {
    if (!result) return;
    try {
      await createJournalEntry({
        plantName: result.treeName || formData.treeSpecies,
        type: 'Tree Plantation',
        plantedDate: new Date().toISOString().split('T')[0],
        location: `${formData.areaSize} Plot (${formData.region})`,
        soilType: 'Prepared Plantation Pit',
        sunlight: 'Full Direct Sun',
        wateringFrequency: 'Twice Weekly',
        status: 'Planned Plantation',
        notes: `Spacing: ${result.recommendedSpacing}. Capacity: ${result.estimatedCapacity}`
      });
      setSaved(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save tree plan:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="border-b border-[#b8d5b2] pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172d13] font-heading flex items-center space-x-2">
              <Trees className="w-5 h-5 text-[#6bb77b]" />
              <span>Tree Plantation Planner</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#3d5a37] font-medium mt-0.5">
              Plan community or private tree plantation drives with precise spacing guidelines, pit preparation, and long-term aftercare checklists.
            </p>
          </div>
          <span className="text-xs font-bold text-white bg-[#6bb77b] px-3 py-1 rounded-full border border-[#529c61] self-start sm:self-center font-heading flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Species Supported</span>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tree Species Selector with Custom Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider font-heading">
                  Target Tree Species / Type
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomTree(!isCustomTree);
                    setFormData(prev => ({ ...prev, treeSpecies: '' }));
                  }}
                  className="text-xs font-extrabold text-[#d76f30] hover:underline"
                >
                  {isCustomTree ? 'Select from Presets' : '+ Type Custom Tree'}
                </button>
              </div>

              {isCustomTree ? (
                <input
                  type="text"
                  name="treeSpecies"
                  value={formData.treeSpecies}
                  onChange={handleChange}
                  placeholder="Enter any custom tree name (e.g. Mahua, Peepal, Sandalwood)..."
                  className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                  required
                />
              ) : (
                <select
                  name="treeSpecies"
                  value={formData.treeSpecies}
                  onChange={handleChange}
                  className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                >
                  {presetTrees.map((tree) => (
                    <option key={tree} value={tree}>
                      {tree}
                    </option>
                  ))}
                  <option value="__CUSTOM__">+ Type Custom Tree Name...</option>
                </select>
              )}
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                Plantation Purpose
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
              >
                <option value="Eco Restoration & Shade">Eco Restoration & Shade</option>
                <option value="Fruit Yield & Orchard">Fruit Yield & Orchard</option>
                <option value="Timber & Forestry">Timber & Forestry</option>
                <option value="Boundary & Windbreak">Boundary & Windbreak</option>
                <option value="Balcony Container Planting">Balcony Container Planting</option>
              </select>
            </div>

            {/* Plot Area Size */}
            <div>
              <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                Available Plot / Yard Area
              </label>
              <input
                type="text"
                name="areaSize"
                value={formData.areaSize}
                onChange={handleChange}
                placeholder="e.g. 100 sq meters, 1 Acre, 20 sq ft"
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                required
              />
            </div>

            {/* Region / Climate */}
            <div>
              <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                Climate Region
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
              >
                <option value="Tropical / Subtropical">Tropical / Subtropical</option>
                <option value="Arid / Semi-Arid">Arid / Semi-Arid</option>
                <option value="Temperate / Cool">Temperate / Cool</option>
                <option value="Coastal / High Humidity">Coastal / High Humidity</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d76f30] hover:bg-[#bf5c20] disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center space-x-2 font-heading uppercase tracking-wide text-xs sm:text-sm"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Generating Blueprint...</span>
              </span>
            ) : (
              <>
                <Compass className="w-4 h-4" />
                <span>Generate Plantation Blueprint</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Blueprint Result Card */}
      {result && (
        <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#b8d5b2] pb-3 gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#172d13] font-heading flex items-center space-x-2">
                <Trees className="w-5 h-5 text-[#d76f30]" />
                <span>{result.treeName} Plantation Blueprint</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#3d5a37] font-medium mt-0.5">Customized for {formData.areaSize} plot</p>
            </div>

            <button
              onClick={handleSaveToJournal}
              disabled={saved}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition flex items-center space-x-1.5 shadow-sm ${
                saved
                  ? 'bg-[#dfebd9] text-[#172d13] border border-[#b8d5b2]'
                  : 'bg-[#6bb77b] hover:bg-[#529c61] text-white border border-[#529c61]'
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#6bb77b]" />
                  <span>Saved to Garden Journal</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save Plan to Journal</span>
                </>
              )}
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#dfebd9] p-4 rounded-xl border border-[#b8d5b2]">
              <span className="text-xs font-extrabold text-[#172d13] uppercase tracking-wider font-heading">Recommended Spacing</span>
              <p className="text-sm font-bold text-[#172d13] mt-1">{result.recommendedSpacing}</p>
            </div>
            <div className="bg-[#dfebd9] p-4 rounded-xl border border-[#b8d5b2]">
              <span className="text-xs font-extrabold text-[#172d13] uppercase tracking-wider font-heading">Estimated Capacity</span>
              <p className="text-sm font-bold text-[#172d13] mt-1">{result.estimatedCapacity}</p>
            </div>
            <div className="bg-[#dfebd9] p-4 rounded-xl border border-[#b8d5b2]">
              <span className="text-xs font-extrabold text-[#172d13] uppercase tracking-wider font-heading">Sunlight & Water Needs</span>
              <p className="text-sm font-bold text-[#172d13] mt-1">{result.sunlightWater}</p>
            </div>
          </div>

          {/* Pit Preparation Guide */}
          <div>
            <h4 className="text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-2 font-heading">Pit Preparation & Soil Mix</h4>
            <p className="text-xs sm:text-sm text-[#172d13] leading-relaxed bg-[#eaf1e9] border border-[#b8d5b2] p-4 rounded-xl font-medium">
              {result.pitPrepGuide}
            </p>
          </div>

          {/* Plantation Steps Checklist */}
          <div>
            <h4 className="text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-2 font-heading">Step-by-Step Planting Checklist</h4>
            <div className="bg-[#eaf1e9] border border-[#b8d5b2] p-4 rounded-xl">
              <ul className="space-y-2.5">
                {result.checklist && result.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-[#172d13] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#d76f30] text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5 font-heading">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
