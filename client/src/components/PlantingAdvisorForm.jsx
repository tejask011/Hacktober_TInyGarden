import React, { useState } from 'react';
import { Compass, Sun, MapPin, Sprout, Sparkles, Sliders } from 'lucide-react';

export default function PlantingAdvisorForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    location: 'Northern Temperate / Subtropical',
    soil: 'Loamy (Balanced Drainage)',
    sunlight: 'Full Sun (6+ hours direct daily)',
    space: 'Medium Raised Bed (3x2 meters)',
    season: 'Spring / Early Summer',
    preferences: 'Organic edible vegetables and culinary herbs'
  });

  const [customFields, setCustomFields] = useState({
    soil: false,
    sunlight: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === '__CUSTOM__') {
      setCustomFields(prev => ({ ...prev, [name]: true }));
      setFormData(prev => ({ ...prev, [name]: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="border-b border-[#b8d5b2] pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172d13] font-heading flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#6bb77b]" />
            <span>AI Planting Advisor</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#3d5a37] font-medium mt-0.5">
            Specify your custom location, soil type, and sunlight parameters to receive a custom AI recommendation report.
          </p>
        </div>
        <span className="text-xs font-bold text-white bg-[#6bb77b] px-3 py-1 rounded-full border border-[#529c61] self-start sm:self-center font-heading flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Custom Region & Soil Supported</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location / Region Input */}
          <div>
            <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
              Garden Location or Climate Region
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter any city, state, or region (e.g. Pune, California, Subtropical Coast)"
              className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
              required
            />
          </div>

          {/* Soil Type Input with Custom Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider font-heading">
                Soil Type & Condition
              </label>
              <button
                type="button"
                onClick={() => setCustomFields(p => ({ ...p, soil: !p.soil }))}
                className="text-xs text-[#d76f30] hover:underline font-extrabold"
              >
                {customFields.soil ? 'Use Dropdown Presets' : '+ Type Custom Soil'}
              </button>
            </div>
            {customFields.soil ? (
              <input
                type="text"
                name="soil"
                value={formData.soil}
                onChange={handleChange}
                placeholder="Type your exact local soil (e.g. Red Laterite, Black Cotton Soil, Peat)"
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                required
              />
            ) : (
              <select
                name="soil"
                value={formData.soil}
                onChange={handleChange}
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
              >
                <option value="Loamy (Balanced Drainage)">Loamy (Rich in organic matter, balanced)</option>
                <option value="Sandy Loam (Fast Draining)">Sandy Loam (Quick draining, warm)</option>
                <option value="Clay Soil (Heavy Moisture Retention)">Clay Soil (Dense, moisture retaining)</option>
                <option value="Red Laterite Soil">Red Laterite Soil (Iron rich, porous)</option>
                <option value="Black Cotton Soil">Black Cotton Soil (Clay rich, expansion prone)</option>
                <option value="Potting Mix (Container / Balcony)">Potting Mix (Container / Balcony)</option>
              </select>
            )}
          </div>

          {/* Sunlight Input with Custom Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider font-heading">
                Sunlight Exposure
              </label>
              <button
                type="button"
                onClick={() => setCustomFields(p => ({ ...p, sunlight: !p.sunlight }))}
                className="text-xs text-[#d76f30] hover:underline font-extrabold"
              >
                {customFields.sunlight ? 'Use Dropdown Presets' : '+ Type Custom Sunlight'}
              </button>
            </div>
            {customFields.sunlight ? (
              <input
                type="text"
                name="sunlight"
                value={formData.sunlight}
                onChange={handleChange}
                placeholder="Type sunlight detail (e.g. 4 hours morning sun, Indirect balcony light)"
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                required
              />
            ) : (
              <select
                name="sunlight"
                value={formData.sunlight}
                onChange={handleChange}
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
              >
                <option value="Full Sun (6+ hours direct daily)">Full Sun (6+ hours direct daily)</option>
                <option value="Partial Shade (3-6 hours sun)">Partial Shade (3-6 hours sun)</option>
                <option value="Low Light / Indoor Shadow">Low Light / Indoor Shadow</option>
                <option value="Bright Indirect Balcony Light">Bright Indirect Balcony Light</option>
              </select>
            )}
          </div>

          {/* Available Space */}
          <div>
            <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
              Available Space
            </label>
            <select
              name="space"
              value={formData.space}
              onChange={handleChange}
              className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
            >
              <option value="Small Balcony Containers (Pots / Growbags)">Small Balcony Containers (Pots / Growbags)</option>
              <option value="Medium Raised Bed (3x2 meters)">Medium Raised Bed (3x2 meters)</option>
              <option value="Large Yard / Open Ground Plot">Large Yard / Open Ground Plot</option>
              <option value="Indoor Window Sill / Vertical Planter">Indoor Window Sill / Vertical Planter</option>
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
              Current Planting Season
            </label>
            <select
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
            >
              <option value="Spring / Early Summer">Spring / Early Summer</option>
              <option value="Monsoon / Rainy Season">Monsoon / Rainy Season</option>
              <option value="Autumn / Late Season">Autumn / Late Season</option>
              <option value="Winter / Mild Season">Winter / Mild Season</option>
            </select>
          </div>

          {/* Harvest & Crop Preferences */}
          <div>
            <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
              Harvesting Preferences
            </label>
            <input
              type="text"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              placeholder="e.g. Fresh salad greens, aromatic tea herbs, fruit trees"
              className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
              required
            />
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d76f30] hover:bg-[#bf5c20] disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center space-x-2 font-heading uppercase tracking-wide text-xs sm:text-sm"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Running Local AI Recommendation Model...</span>
            </span>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              <span>Generate Custom Planting Plan</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
