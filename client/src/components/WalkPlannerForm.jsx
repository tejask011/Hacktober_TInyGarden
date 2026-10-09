import React, { useState, useEffect } from 'react';
import { Clock, Navigation, Sparkles, Trees, Landmark, Palette, Heart, Zap, MapPin, Search, Locate, Check } from 'lucide-react';
import { reverseGeocodeApi, searchLocationApi } from '../utils/api';

const PRESET_LOCATIONS = [
  { label: 'Central Park, NYC', lat: 40.7812, lon: -73.9665 },
  { label: 'Hyde Park, London', lat: 51.5074, lon: -0.1657 },
  { label: 'Luxembourg Gardens, Paris', lat: 48.8462, lon: 2.3372 },
  { label: 'Imperial Palace Gardens, Tokyo', lat: 35.6852, lon: 139.7528 },
  { label: 'Golden Gate Park, SF', lat: 37.7694, lon: -122.4862 }
];

const THEMES = [
  { id: 'Peaceful Nature Walk', label: 'Peaceful Nature', icon: Trees, color: '#10B981', desc: 'Parks, tree canopies, quiet foliage' },
  { id: 'Historical Exploration', label: 'Historic & Heritage', icon: Landmark, color: '#F59E0B', desc: 'Landmarks, historic markers, old streets' },
  { id: 'Art & Cultural Stroll', label: 'Art & Culture', icon: Palette, color: '#EC4899', desc: 'Murals, statues, architectural detail' },
  { id: 'Mindful Sensory Walk', label: 'Mindful Sensory', icon: Heart, color: '#8B5CF6', desc: 'Breathing pauses, audio prompts, soundscapes' },
  { id: 'Short Outdoor Adventure', label: 'Outdoor Mission', icon: Zap, color: '#3B82F6', desc: 'Brisk pace, active observation goals' }
];

export default function WalkPlannerForm({ onGenerate, onLocationChange, isLoading }) {
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [distanceKm, setDistanceKm] = useState(1.0);
  const [routeType, setRouteType] = useState('loop'); // 'loop' (round-trip) | 'one_way'
  const [selectedTheme, setSelectedTheme] = useState('Peaceful Nature Walk');
  const [interests, setInterests] = useState('Quiet benches, greenery, quiet streets');
  
  const [locationName, setLocationName] = useState('Current GPS Location');
  const [lat, setLat] = useState(18.495);
  const [lon, setLon] = useState(73.852);
  const [gpsActive, setGpsActive] = useState(false);
  const [isRealGps, setIsRealGps] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Notify parent component of location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({ lat, lon, name: locationName });
    }
  }, [lat, lon, locationName]);

  // Automatically request real GPS location on initial load
  useEffect(() => {
    handleUseGps(true);
  }, []);

  const handleUseGps = (isAuto = false) => {
    if (!navigator.geolocation) {
      if (!isAuto) alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsActive(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;
        setLat(userLat);
        setLon(userLon);
        setIsRealGps(true);

        try {
          const locInfo = await reverseGeocodeApi(userLat, userLon);
          setLocationName(locInfo.name || 'Your Live GPS Location');
        } catch (err) {
          setLocationName(`GPS (${userLat.toFixed(3)}, ${userLon.toFixed(3)})`);
        } finally {
          setGpsActive(false);
        }
      },
      (err) => {
        console.warn('GPS location access notice:', err.message);
        setGpsActive(false);
        if (!isAuto) {
          alert('Could not access live GPS: ' + err.message + '. Please select a location preset or type in search.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectPreset = (preset) => {
    setLocationName(preset.label);
    setLat(preset.lat);
    setLon(preset.lon);
    setIsRealGps(false);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchLocationApi(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Location search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    setLocationName(result.name);
    setLat(result.lat);
    setLon(result.lon);
    setIsRealGps(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      lat,
      lon,
      timeMinutes,
      targetDistanceKm: distanceKm,
      routeType,
      theme: selectedTheme,
      interests,
      startLocationName: locationName
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="#34D399" size={22} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
            Personalize Your Walk
          </h2>
        </div>

        {/* Live GPS Active Status Badge */}
        {isRealGps && (
          <span style={{
            fontSize: '0.75rem',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34D399',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '3px 10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} className="animate-pulse-slow" />
            Live GPS Connected
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Starting Location Bar */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#10B981" /> Active Location: <strong style={{ color: '#34D399' }}>{locationName}</strong>
            </label>
            
            {/* Live GPS Button */}
            <button
              type="button"
              onClick={() => handleUseGps(false)}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', height: 'auto' }}
              title="Detect live GPS coordinates"
            >
              <Locate size={14} />
              <span>{gpsActive ? 'Locating...' : 'Use My Live Location'}</span>
            </button>
          </div>

          {/* Location Search Input */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any neighborhood, city, or address..."
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#FFF',
                  fontSize: '0.85rem'
                }}
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.8rem' }}
              >
                <Search size={14} />
                <span>Search</span>
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#12201D',
                border: '1px solid #10B981',
                borderRadius: '8px',
                marginTop: '4px',
                zIndex: 100,
                maxHeight: '180px',
                overflowY: 'auto'
              }}>
                {searchResults.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSearchResult(res)}
                    style={{
                      padding: '10px 12px',
                      fontSize: '0.82rem',
                      color: '#FFF',
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <strong>{res.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block' }}>{res.fullName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preset Pill Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {PRESET_LOCATIONS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '14px',
                  fontSize: '0.78rem',
                  border: locationName === p.label ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                  background: locationName === p.label ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: locationName === p.label ? '#34D399' : '#9CA3AF',
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Route Type Selector (Loop Walk vs One-Way) */}
        <div>
          <label style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
            Route Format
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setRouteType('loop')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: routeType === 'loop' ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                background: routeType === 'loop' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: routeType === 'loop' ? '#34D399' : '#9CA3AF',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Circular Loop Walk (Start & Finish at Same Point)
            </button>
            <button
              type="button"
              onClick={() => setRouteType('one_way')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: routeType === 'one_way' ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                background: routeType === 'one_way' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: routeType === 'one_way' ? '#34D399' : '#9CA3AF',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              One-Way Route
            </button>
          </div>
        </div>

        {/* Time & Distance Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          {/* Time Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Clock size={16} color="#10B981" /> Time: <strong style={{ color: '#F3F4F6' }}>{timeMinutes} Mins</strong>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[15, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTimeMinutes(mins)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: timeMinutes === mins ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                    background: timeMinutes === mins ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: timeMinutes === mins ? '#34D399' : '#D1D5DB',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Distance Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Navigation size={16} color="#10B981" /> Distance: <strong style={{ color: '#F3F4F6' }}>{distanceKm} km</strong>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1.0, 2.0, 3.5, 5.0].map(dist => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setDistanceKm(dist)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: distanceKm === dist ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                    background: distanceKm === dist ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: distanceKm === dist ? '#34D399' : '#D1D5DB',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {dist} km
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Theme Selector */}
        <div>
          <label style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
            Choose Walking Theme
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {THEMES.map(theme => {
              const IconComp = theme.icon;
              const isSelected = selectedTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: isSelected ? `1.5px solid ${theme.color}` : '1px solid var(--border-subtle)',
                    background: isSelected ? `${theme.color}15` : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <IconComp size={18} color={theme.color} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isSelected ? '#FFFFFF' : '#D1D5DB' }}>
                      {theme.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{theme.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Preferences */}
        <div>
          <label style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>
            Specific Preferences / Interests
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. Quiet park benches, old monuments, tree trails..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(0, 0, 0, 0.3)',
              color: '#F3F4F6',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
        >
          {isLoading ? (
            <>
              <Sparkles className="animate-pulse-slow" size={20} />
              <span>Generating Walk Plan from Real POIs...</span>
            </>
          ) : (
            <>
              <Trees size={20} />
              <span>Generate Live Walk Plan</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
