import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css';

interface RouteMapProps {
  startLocation?: string;
  endLocation?: string;
  distance?: number;
}

const RouteMap = ({ startLocation, endLocation, distance }: RouteMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map (centered on India)
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

      // Add OpenStreetMap tiles (free, no API key needed!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstance.current);
    }

    // Clear existing markers and polylines
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    // Add markers if locations are provided
    if (startLocation || endLocation) {
      // For demo, use fixed coordinates (in real app, you'd geocode the location names)
      const startCoords: [number, number] = [28.6139, 77.2090]; // Delhi
      const endCoords: [number, number] = [32.0840, 77.5714]; // Manali

      // Custom marker icons
      const startIcon = L.divIcon({
        html: '<div class="custom-marker start-marker">🚩</div>',
        className: 'custom-marker-wrapper',
        iconSize: [40, 40],
      });

      const endIcon = L.divIcon({
        html: '<div class="custom-marker end-marker">🏁</div>',
        className: 'custom-marker-wrapper',
        iconSize: [40, 40],
      });

      // Add start marker
      if (startLocation) {
        L.marker(startCoords, { icon: startIcon })
          .addTo(mapInstance.current)
          .bindPopup(`<strong>Start:</strong> ${startLocation}`);
      }

      // Add end marker
      if (endLocation) {
        L.marker(endCoords, { icon: endIcon })
          .addTo(mapInstance.current)
          .bindPopup(`<strong>End:</strong> ${endLocation}`);
      }

      // Draw route line
      if (startLocation && endLocation) {
        const routeLine = L.polyline([startCoords, endCoords], {
          color: '#ff9900',
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10',
        }).addTo(mapInstance.current);

        // Fit map to show entire route
        mapInstance.current.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [startLocation, endLocation]);

  return (
    <div className="route-map-container">
      <div className="map-header">
        <div className="map-icon">🗺️</div>
        <div className="map-title">
          <h4>Route Visualization</h4>
          <p>Visual representation of your ride route</p>
        </div>
      </div>
      <div ref={mapRef} className="route-map" />
      {distance && (
        <div className="map-footer">
          <span className="map-info">📏 Total Distance: <strong>{distance} km</strong></span>
        </div>
      )}
      <div className="map-note">
        <span className="note-icon">💡</span>
        <span className="note-text">
          Interactive map shows approximate route. Enter start/end locations in Route Planner!
        </span>
      </div>
    </div>
  );
};

export default RouteMap;

