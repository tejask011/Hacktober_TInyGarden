import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../utils/api';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const [settings, setSettings] = useState({
    modelProvider: 'ollama',
    modelName: 'gemma2:2b',
    ollamaUrl: 'http://localhost:11434',
    privacyMode: true
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSettings().then(res => {
        if (res.settings) setSettings(res.settings);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      if (onSettingsUpdated) onSettingsUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172d13]/70 backdrop-blur-md p-4">
      <div className="bg-white border border-[#b8d5b2] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#b8d5b2] pb-4">
          <h3 className="text-lg font-bold text-[#172d13] font-heading">TinyGarden AI Settings</h3>
          <button
            onClick={onClose}
            className="text-[#3d5a37] hover:text-[#172d13] text-sm font-bold p-1"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#172d13] uppercase tracking-wider mb-2 font-heading">
              Ollama Host Endpoint
            </label>
            <input
              type="text"
              value={settings.ollamaUrl}
              onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
              className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl px-4 py-3 text-[#172d13] text-sm focus:outline-none focus:border-[#d76f30]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172d13] uppercase tracking-wider mb-2 font-heading">
              Local Model Name (e.g. gemma2:2b, llava)
            </label>
            <input
              type="text"
              value={settings.modelName}
              onChange={(e) => setSettings({ ...settings, modelName: e.target.value })}
              placeholder="e.g. gemma2:2b, llava, qwen:1.8b"
              className="w-full bg-[#eaf1e9] border border-[#b8d5b2] rounded-xl px-4 py-3 text-[#172d13] text-sm focus:outline-none focus:border-[#d76f30]"
              required
            />
          </div>

          <div className="bg-[#dfebd9] p-4 rounded-xl border border-[#b8d5b2] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#172d13] font-heading">Privacy & Data Storage</span>
              <span className="text-[#6bb77b] font-extrabold">100% Offline / Local</span>
            </div>
            <p className="text-[#3d5a37]">
              No cloud AI APIs, telemetry, or external billing accounts. All garden records stay on your local disk.
            </p>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#eaf1e9] hover:bg-[#dfebd9] text-[#172d13] text-xs font-semibold rounded-lg border border-[#b8d5b2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#d76f30] hover:bg-[#bf5c20] text-white text-xs font-extrabold rounded-lg shadow-md font-heading"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
