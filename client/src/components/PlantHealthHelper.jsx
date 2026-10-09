import React, { useState } from 'react';
import { analyzePlantSymptom } from '../utils/api';
import { Camera, Activity, FileText, CheckCircle2, AlertTriangle, Trash2, Upload, Sparkles, ShieldCheck } from 'lucide-react';

export default function PlantHealthHelper() {
  const [plantType, setPlantType] = useState('Sweet Basil');
  const [symptoms, setSymptoms] = useState('Leaves turning yellow at margins with lower leaves dropping');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await analyzePlantSymptom({
        plantType,
        symptoms,
        imageData: imagePreview
      });
      if (res.success) {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.error('Health analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="border-b border-[#b8d5b2] pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172d13] font-heading flex items-center space-x-2">
              <Activity className="w-5 h-5 text-[#6bb77b]" />
              <span>Plant Health & Vision Helper</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#3d5a37] font-medium mt-0.5">
              Upload a leaf or tree photograph for live local AI vision scanning and organic remedy advice.
            </p>
          </div>
          <span className="text-xs font-bold text-white bg-[#6bb77b] px-3 py-1 rounded-full border border-[#529c61] self-start sm:self-center font-heading flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Local Vision & Health AI</span>
          </span>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plant Name */}
            <div>
              <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                Plant or Tree Name
              </label>
              <input
                type="text"
                value={plantType}
                onChange={(e) => setPlantType(e.target.value)}
                placeholder="e.g. Tomato, Neem Tree, Tulsi, Rose, Mango Tree"
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
                Leaf / Foliage Photo Upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-2.5 text-[#3d5a37] text-xs sm:text-sm font-semibold focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#6bb77b] file:text-white hover:file:bg-[#529c61]"
              />
            </div>
          </div>

          {/* Image Preview if provided */}
          {imagePreview && (
            <div className="bg-[#dfebd9] p-3.5 rounded-xl border border-[#b8d5b2] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={imagePreview} alt="Uploaded plant sample" className="w-16 h-16 object-cover rounded-lg border border-[#b8d5b2]" />
                <div>
                  <span className="text-xs font-bold text-[#172d13] font-heading flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-[#6bb77b]" />
                    <span>Photo Payload Loaded</span>
                  </span>
                  <p className="text-xs text-[#3d5a37] font-medium mt-0.5">Ready for vision feature extraction</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg font-bold flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          )}

          {/* Symptoms Description */}
          <div>
            <label className="block text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">
              Observed Symptoms & Conditions
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe leaf discoloration, brown spots, wilting pattern, pest presence, or watering changes..."
              className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl p-3 text-xs sm:text-sm font-semibold text-[#172d13] focus:outline-none focus:border-[#d76f30]"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d76f30] hover:bg-[#bf5c20] disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center space-x-2 font-heading uppercase tracking-wide text-xs sm:text-sm"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Scanning Image & Running AI Diagnostics...</span>
              </span>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Analyze Plant Photo & Symptoms</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Diagnostic Report */}
      {analysis && (
        <div className="bg-white border border-[#b8d5b2] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#b8d5b2] pb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#172d13] font-heading flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#6bb77b]" />
                <span>Diagnostic Report</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#3d5a37] font-medium mt-0.5">Specimen: {analysis.possibleIdentification}</p>
            </div>
            <span className="text-xs font-bold text-white bg-[#6bb77b] px-3 py-1 rounded-full border border-[#529c61] font-heading flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{analysis.confidenceScore}</span>
            </span>
          </div>

          {/* Suspected Issue */}
          <div className="bg-[#fceae0] border border-[#f5c6b0] p-4 rounded-xl flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-[#d76f30] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-extrabold text-[#d76f30] uppercase tracking-wider font-heading">Suspected Issue</span>
              <p className="text-sm sm:text-base font-bold text-[#d76f30] mt-0.5">{analysis.suspectedIssue}</p>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h4 className="text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">Diagnostic Explanation</h4>
            <p className="text-xs sm:text-sm text-[#172d13] font-medium leading-relaxed bg-[#dfebd9] border border-[#b8d5b2] p-3.5 rounded-xl">
              {analysis.explanation}
            </p>
          </div>

          {/* Recommended Organic Actions */}
          <div>
            <h4 className="text-xs font-extrabold text-[#172d13] uppercase tracking-wider mb-1.5 font-heading">Recommended Care & Treatment Steps</h4>
            <div className="bg-[#dfebd9] border border-[#b8d5b2] p-3.5 rounded-xl">
              <ul className="space-y-2.5">
                {analysis.recommendedAction && analysis.recommendedAction.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-[#172d13] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#6bb77b] text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5 font-heading">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-[#b8d5b2] pt-3 text-xs text-[#3d5a37] font-medium italic">
            Note: {analysis.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}
