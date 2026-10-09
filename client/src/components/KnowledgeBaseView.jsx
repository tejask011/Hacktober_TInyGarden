import React, { useState, useEffect } from 'react';
import { fetchKnowledgeBase } from '../utils/api';

export default function KnowledgeBaseView() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Trees', 'Herbs & Medicinal', 'Vegetables', 'Succulents & Medicinal'];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchKnowledgeBase(category, search);
      setItems(data.items || []);
    } catch (err) {
      console.error('Error fetching knowledge base:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category, search]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-[#b8d5b2] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-[#b8d5b2] pb-3">
          <h2 className="text-xl font-bold text-[#172d13] font-heading">Offline Gardening Knowledge Base</h2>
          <p className="text-sm text-[#3d5a37] mt-1">
            Bundled planting reference data allowing AI and users to access regional growing advice without internet access.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search plants, soil types, or medicinal uses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl px-4 py-2.5 text-[#172d13] text-sm focus:outline-none focus:border-[#d76f30]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="w-full sm:w-1/2 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-bold transition font-heading ${
                  category === cat
                    ? 'bg-[#d76f30] text-white shadow-sm'
                    : 'bg-[#eaf1e9] text-[#172d13] border border-[#b8d5b2] hover:bg-[#6bb77b] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Species Reference Cards */}
      {loading ? (
        <div className="bg-white border border-[#b8d5b2] rounded-2xl p-8 text-center text-[#3d5a37]">
          Searching bundled offline reference files...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#b8d5b2] rounded-2xl p-8 text-center text-[#3d5a37]">
          No offline knowledge records matched your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-[#b8d5b2] rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4 hover:border-[#6bb77b] transition">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#172d13] font-heading">{item.name}</h3>
                    <span className="inline-block mt-1 text-xs font-bold text-white bg-[#6bb77b] px-2.5 py-0.5 rounded-full border border-[#529c61] font-heading">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xs text-[#172d13] bg-[#eaf1e9] px-2.5 py-1 rounded-lg border border-[#b8d5b2] font-semibold">
                    Spacing: {item.spacingMeters}m
                  </span>
                </div>

                <p className="text-xs text-[#3d5a37] mt-3 leading-relaxed">{item.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-[#dfebd9] p-3 rounded-xl border border-[#b8d5b2]">
                  <div>
                    <span className="text-[#3d5a37] block font-medium">Sunlight</span>
                    <span className="text-[#172d13] font-semibold">{item.sunlight}</span>
                  </div>
                  <div>
                    <span className="text-[#3d5a37] block font-medium">Soil Type</span>
                    <span className="text-[#172d13] font-semibold">{item.soil}</span>
                  </div>
                  <div>
                    <span className="text-[#3d5a37] block font-medium">Watering</span>
                    <span className="text-[#172d13] font-semibold">{item.waterFrequency}</span>
                  </div>
                  <div>
                    <span className="text-[#3d5a37] block font-medium">Best Season</span>
                    <span className="text-[#172d13] font-semibold">{item.season}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xs font-bold text-[#172d13] uppercase tracking-wider mb-1 font-heading">Planting Advice</h4>
                  <p className="text-xs text-[#172d13] leading-relaxed bg-[#dfebd9] p-3 rounded-xl border border-[#b8d5b2]">
                    {item.plantingAdvice}
                  </p>
                </div>
              </div>

              {item.aftercareChecklist && (
                <div className="border-t border-[#b8d5b2] pt-3">
                  <h4 className="text-xs font-bold text-[#172d13] uppercase tracking-wider mb-2 font-heading">Aftercare Rules</h4>
                  <ul className="space-y-1">
                    {item.aftercareChecklist.map((c, i) => (
                      <li key={i} className="text-xs text-[#172d13] flex items-start space-x-2">
                        <span className="text-[#d76f30] font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
