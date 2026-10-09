import React from 'react';
import { Award, Footprints, Flame, Compass, Trees, Eye, Trophy, Calendar, CheckCircle, Download } from 'lucide-react';

const BADGE_ICONS = {
  Footprints: Footprints,
  Trees: Trees,
  Compass: Compass,
  Flame: Flame,
  Eye: Eye,
  Trophy: Trophy
};

export default function SavedWalksModal({ userStats, badges = [], savedWalks = [], completedWalks = [] }) {
  const stats = userStats || { totalWalksCount: 0, totalDistanceKm: 0, totalMinutesWalked: 0, currentStreak: 0, level: 1, xp: 0 };
  const nextLevelXp = stats.level * 200;
  const currentLevelXp = stats.xp % 200;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / 200) * 100));

  const exportWalkAsMarkdown = (walk) => {
    const md = `# WalkWise AI - ${walk.title || 'Saved Walk'}
**Date:** ${new Date(walk.createdAt || Date.now()).toLocaleDateString()}
**Theme:** ${walk.theme || 'General Walk'}
**Distance:** ${walk.actualRouteDistanceKm || walk.targetDistanceKm || 2.0} km
**Estimated Duration:** ${walk.estimatedDurationMinutes || walk.timeMinutes || 30} minutes

## Story & Overview
> ${walk.themeDescription || walk.tagline || 'Screen-free walk experience'}

## Waypoints
${(walk.stops || []).map((s, idx) => `${idx + 1}. **${s.name}** - ${s.activity} (${s.sensoryPrompt || ''})`).join('\n')}

## Outdoor Mission
- **${walk.outdoorChallenge?.title || 'Mission'}**: ${walk.outdoorChallenge?.description || 'Enjoy the outdoors.'}

---
*Generated with WalkWise AI - Privacy-Friendly Open-Weight Walk Companion*
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `walkwise_${(walk.title || 'walk').toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Explorer Level & Streak Header */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Explorer Status</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Level {stats.level} Outdoor Wanderer
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#FBBF24', display: 'block' }}>Current Streak</span>
              <strong style={{ fontSize: '1.2rem', color: '#F59E0B' }}>{stats.currentStreak} Days</strong>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#34D399', display: 'block' }}>Total XP</span>
              <strong style={{ fontSize: '1.2rem', color: '#10B981' }}>{stats.xp} XP</strong>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '6px' }}>
            <span>Progress to Level {stats.level + 1}</span>
            <span>{currentLevelXp} / 200 XP</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* Lifetime Stats Counter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>TOTAL WALKS</span>
          <strong style={{ fontSize: '1.6rem', color: '#FFFFFF' }}>{stats.totalWalksCount} Walks</strong>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>DISTANCE COVERED</span>
          <strong style={{ fontSize: '1.6rem', color: '#34D399' }}>{stats.totalDistanceKm} km</strong>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>TIME OUTDOORS</span>
          <strong style={{ fontSize: '1.6rem', color: '#FBBF24' }}>{stats.totalMinutesWalked} mins</strong>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="#F59E0B" /> Explorer Badges & Achievements
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
          {badges.map((b) => {
            const IconComponent = BADGE_ICONS[b.icon] || Award;
            return (
              <div
                key={b.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: b.unlocked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                  background: b.unlocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  opacity: b.unlocked ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: b.unlocked ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComponent size={22} color={b.unlocked ? '#FFF' : '#9CA3AF'} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: b.unlocked ? '#FFF' : '#9CA3AF', margin: '0 0 2px 0' }}>{b.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: 0 }}>{b.description}</p>
                  {b.unlocked && (
                    <span style={{ fontSize: '0.7rem', color: '#34D399', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                      Unlocked!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Walks History */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="#10B981" /> Saved Walks & Itinerary History
        </h3>

        {savedWalks.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF', fontStyle: 'italic', margin: 0 }}>
            No saved walks yet. Generate a walk and click "Save Plan" to build your log!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {savedWalks.map((w) => (
              <div
                key={w.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1.05rem', color: '#FFF', margin: 0 }}>{w.title}</h4>
                    {w.completed && (
                      <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        Completed
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#9CA3AF', margin: 0 }}>
                    {w.theme} • {w.targetDistanceKm || 2.0} km • {w.timeMinutes || 30} mins
                  </p>
                </div>

                <button
                  onClick={() => exportWalkAsMarkdown(w)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <Download size={14} /> Export Markdown
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
