import React, { useState } from 'react';
import { Volume2, VolumeX, Save, CheckCircle, Compass, Eye, Sparkles, MapPin, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ItineraryCard({ plan, onSave, onComplete }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [actualTime, setActualTime] = useState(plan.estimatedDurationMinutes || 30);

  if (!plan) return null;

  const handleAudioSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const text = plan.audioNarrative || `${plan.title}. ${plan.tagline}. Enjoy your walking route.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveClick = async () => {
    await onSave(plan);
    setIsSaved(true);
  };

  const handleConfirmComplete = async () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    await onComplete(plan.planId || plan.id, actualTime, userNotes);
    setShowNotesModal(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Source Model */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '0.75rem',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34D399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontWeight: 600
          }}>
            {plan.modelSource || 'Open-Weight LLM'}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Audio Speech Button */}
            <button
              onClick={handleAudioSpeech}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: isPlayingAudio ? 'rgba(52, 211, 153, 0.2)' : undefined }}
            >
              {isPlayingAudio ? <VolumeX size={16} color="#34D399" /> : <Volume2 size={16} color="#10B981" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen Brief'}</span>
            </button>

            {/* Save Walk Button */}
            <button
              onClick={handleSaveClick}
              disabled={isSaved}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: isSaved ? '#34D399' : undefined }}
            >
              <Save size={16} />
              <span>{isSaved ? 'Saved!' : 'Save Plan'}</span>
            </button>
          </div>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 6px 0', letterSpacing: '-0.5px' }}>
          {plan.title}
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#34D399', fontStyle: 'italic', margin: 0 }}>
          "{plan.tagline}"
        </p>
      </div>

      {/* Walk Metrics Pill Bar */}
      <div style={{
        display: 'flex',
        gap: '16px',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block' }}>EST. DURATION</span>
          <strong style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>{plan.estimatedDurationMinutes || plan.timeMinutes} mins</strong>
        </div>
        <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
        <div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block' }}>DISTANCE</span>
          <strong style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>{plan.actualRouteDistanceKm || plan.targetDistanceKm} km</strong>
        </div>
        <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
        <div>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block' }}>STOPS & POIs</span>
          <strong style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>{(plan.stops || []).length} Waypoints</strong>
        </div>
      </div>

      {/* Theme Overview */}
      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', borderLeft: '3px solid #10B981' }}>
        <p style={{ fontSize: '0.88rem', color: '#D1D5DB', margin: 0, lineHeight: '1.5' }}>
          {plan.themeDescription}
        </p>
      </div>

      {/* Waypoints Breakdown */}
      <div>
        <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} color="#10B981" /> Recommended Waypoints & Sensory Prompts
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(plan.stops || []).map((stop, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                padding: '14px',
                borderRadius: '12px',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#10B981',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                {idx + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{stop.name}</h4>
                  {stop.category && (
                    <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '8px', fontWeight: 600 }}>
                      {stop.category}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#D1D5DB', margin: '0 0 8px 0', lineHeight: '1.4' }}>{stop.activity}</p>
                
                {stop.sensoryPrompt && (
                  <div style={{ fontSize: '0.8rem', color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', padding: '6px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={14} /> <span>{stop.sensoryPrompt}</span>
                  </div>
                )}
              </div>

              {stop.image && (
                <div style={{ width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                  <img src={stop.image} alt={stop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Outdoor Mission Banner */}
      {plan.outdoorChallenge && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          padding: '16px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}>
          <Award size={28} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase' }}>Outdoor Mission</span>
              <span style={{ fontSize: '0.75rem', background: '#F59E0B', color: '#000', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>+{plan.outdoorChallenge.rewardXp || 50} XP</span>
            </div>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', margin: '0 0 4px 0' }}>{plan.outdoorChallenge.title}</h4>
            <p style={{ fontSize: '0.85rem', color: '#D1D5DB', margin: 0 }}>{plan.outdoorChallenge.description}</p>
          </div>
        </div>
      )}

      {/* Complete Walk Action */}
      <button
        onClick={() => setShowNotesModal(true)}
        className="btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: '1rem', background: 'linear-gradient(135deg, #10B981, #047857)' }}
      >
        <CheckCircle size={20} />
        <span>Complete This Walk & Log Experience</span>
      </button>

      {/* Complete Walk Reflection Modal */}
      {showNotesModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '8px' }}>Walk Summary and Reflection</h3>
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '16px' }}>Log your duration and any nature/sensory observations.</p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.85rem', color: '#D1D5DB', display: 'block', marginBottom: '6px' }}>Actual Minutes Walked</label>
              <input
                type="number"
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.4)', color: '#FFF' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', color: '#D1D5DB', display: 'block', marginBottom: '6px' }}>Outdoor Notes / Discoveries (Optional)</label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                rows={3}
                placeholder="e.g., Spotted a blue jay near the oak tree, enjoyed the quiet bench moment..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.4)', color: '#FFF', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNotesModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleConfirmComplete} className="btn-primary">Confirm & Earn XP!</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
