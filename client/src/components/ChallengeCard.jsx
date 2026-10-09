import React from 'react';
import { Target, CheckCircle2, Award, Zap, Trees, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ChallengeCard({ challenges = [], onCompleteChallenge }) {
  const handleComplete = async (chId) => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    await onCompleteChallenge(chId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Overview Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(18, 32, 29, 0.8) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Target size={28} color="#34D399" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Outdoor Missions & Micro-Challenges
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#9CA3AF', margin: 0, maxWidth: '680px' }}>
          Put your phone away and complete quick, achievable observation prompts during your daily walk. Earn XP, maintain your streak, and level up your outdoor explorer profile!
        </p>
      </div>

      {/* Mission Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {challenges.map((ch) => {
          return (
            <div
              key={ch.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: ch.completed ? '1px solid rgba(16, 185, 129, 0.5)' : undefined,
                background: ch.completed ? 'rgba(16, 185, 129, 0.08)' : undefined
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#34D399',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 600
                  }}>
                    {ch.theme || 'Outdoor Mission'}
                  </span>

                  <span style={{
                    fontSize: '0.75rem',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#FBBF24',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Zap size={12} /> +{ch.rewardXp || 50} XP
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                  {ch.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                  {ch.description}
                </p>
              </div>

              {ch.completed ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#34D399',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '10px',
                  borderRadius: '8px',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={18} /> Mission Completed!
                </div>
              ) : (
                <button
                  onClick={() => handleComplete(ch.id)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <Award size={16} /> Mark Completed
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
