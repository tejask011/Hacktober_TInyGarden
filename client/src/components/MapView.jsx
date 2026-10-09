import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

const MAP_LAYERS = {
  googleStreets: {
    name: 'Google Maps (Streets)',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20
  },
  googleSatellite: {
    name: 'Google Maps (Satellite Hybrid)',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20
  },
  osmStandard: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  }
};

export default function MapView({ startLocation, nearbyPlaces = [], routeGeometry = [], turnByTurnSteps = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [activeLayerKey, setActiveLayerKey] = useState('googleStreets');

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = startLocation?.lat || 12.9716;
    const initialLon = startLocation?.lon || 77.5946;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 15,
        zoomControl: true
      });

      const selectedLayer = MAP_LAYERS[activeLayerKey];
      const tileLayer = L.tileLayer(selectedLayer.url, {
        attribution: '&copy; Google Maps / OpenStreetMap',
        subdomains: selectedLayer.subdomains,
        maxZoom: selectedLayer.maxZoom
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  // Update Tile Layer on Switch
  const handleSwitchLayer = (layerKey) => {
    setActiveLayerKey(layerKey);
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const selectedLayer = MAP_LAYERS[layerKey];
    const newTileLayer = L.tileLayer(selectedLayer.url, {
      attribution: '&copy; Google Maps / OpenStreetMap',
      subdomains: selectedLayer.subdomains,
      maxZoom: selectedLayer.maxZoom
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  };

  // Re-render Markers, Polylines, and Bounds whenever startLocation, nearbyPlaces, or routeGeometry changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const lat = startLocation?.lat;
    const lon = startLocation?.lon;

    if (!lat || !lon) return;

    // 1. Current Location Pin (Glowing Mint Ring)
    const startIcon = L.divIcon({
      className: 'custom-start-marker',
      html: `
        <div style="
          width: 36px; height: 36px;
          background: #10B981;
          border: 3px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 0 20px #10B981;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: 14px;
        ">
          A
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const startMarker = L.marker([lat, lon], { icon: startIcon }).addTo(layerGroup);
    startMarker.bindPopup(`
      <div style="padding: 4px;">
        <h4 style="margin:0 0 2px 0; color:#34D399;">Active Location</h4>
        <p style="margin:0; font-size:12px; color:#FFF;">${startLocation?.name || 'Detected Location'}</p>
      </div>
    `).openPopup();

    const bounds = L.latLngBounds([[lat, lon]]);

    // 2. Nearby POI Markers
    if (nearbyPlaces && nearbyPlaces.length > 0) {
      nearbyPlaces.forEach((place, index) => {
        if (!place.lat || !place.lon) return;

        const poiIcon = L.divIcon({
          className: 'custom-poi-marker',
          html: `
            <div style="
              width: 30px; height: 30px;
              background: #34D399;
              border: 2px solid #0B1311;
              border-radius: 50%;
              box-shadow: 0 0 12px rgba(52, 211, 153, 0.8);
              display: flex; align-items: center; justify-content: center;
              color: #0B1311; font-weight: bold; font-size: 13px;
            ">
              ${index + 1}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([place.lat, place.lon], { icon: poiIcon }).addTo(layerGroup);
        marker.bindPopup(`
          <div style="padding: 4px;">
            <h4 style="margin: 0 0 4px 0; color: #34D399;">${place.name}</h4>
            <span style="font-size: 11px; background: rgba(16,185,129,0.2); padding: 2px 6px; border-radius: 4px; color: #10B981;">${place.category || 'POI'}</span>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #D1D5DB;">${place.distanceKm || 0.5} km from start</p>
          </div>
        `);

        bounds.extend([place.lat, place.lon]);
      });
    }

    // 3. Draw OSRM Route Polyline
    if (routeGeometry && routeGeometry.length > 0) {
      L.polyline(routeGeometry, {
        color: '#10B981',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup);

      routeGeometry.forEach(pt => bounds.extend(pt));
    }

    // Dynamic Fly to Location
    if (nearbyPlaces.length > 0 || routeGeometry.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.flyTo([lat, lon], 16, { animate: true, duration: 1.2 });
    }

  }, [startLocation, nearbyPlaces, routeGeometry]);

  return (
    <div className="glass-panel" style={{ padding: '16px', height: '100%', minHeight: '440px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header & Tile Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Interactive Outdoor Map
        </h3>

        {/* Map Layer Switcher Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => handleSwitchLayer('googleStreets')}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: activeLayerKey === 'googleStreets' ? '1px solid #10B981' : '1px solid var(--border-subtle)',
              background: activeLayerKey === 'googleStreets' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
              color: activeLayerKey === 'googleStreets' ? '#34D399' : '#9CA3AF',
              cursor: 'pointer'
            }}
          >
            Google Streets
          </button>

          <button
            onClick={() => handleSwitchLayer('googleSatellite')}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: activeLayerKey === 'googleSatellite' ? '1px solid #10B981' : '1px solid var(--border-subtle)',
              background: activeLayerKey === 'googleSatellite' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
              color: activeLayerKey === 'googleSatellite' ? '#34D399' : '#9CA3AF',
              cursor: 'pointer'
            }}
          >
            Satellite Hybrid
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div style={{ flex: 1, minHeight: '360px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '360px' }} />
      </div>

      {/* Turn-by-Turn Guidance Steps */}
      {turnByTurnSteps && turnByTurnSteps.length > 0 && (
        <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', maxHeight: '120px', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Turn-by-Turn Directions ({turnByTurnSteps.length} steps)
          </h4>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#D1D5DB' }}>
            {turnByTurnSteps.slice(0, 6).map((step, idx) => (
              <li key={idx} style={{ marginBottom: '3px' }}>
                {step.instruction} ({step.distanceMeters}m)
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
