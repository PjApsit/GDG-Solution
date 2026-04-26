import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getPriorityLevel } from '../utils/priority';

/**
 * HeatMap — Leaflet map showing priority by location
 * WHY: Spatial visualization lets NGO operators see geographic clusters instantly.
 * Per design system: grayscale base map (Positron) so data overlays dominate.
 */

const colorMap = {
  Critical: '#ba1a1a',
  High: '#bc4800',
  Medium: '#2563eb',
  Low: '#585f6c',
};

const HeatMap = ({ events }) => {
  const center = events.length > 0
    ? [events[0].latitude, events[0].longitude]
    : [20.5937, 78.9629]; // Default: center of India

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
        <h2 className="text-h3 text-on-surface">Priority Heatmap</h2>
        <div className="flex items-center gap-3 text-body-sm">
          {Object.entries(colorMap).map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-[400px] z-0"
      >
        {/* Grayscale Positron map per design system */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {events.map((event) => {
          const level = getPriorityLevel(event.priority_score);
          const color = colorMap[level.label];
          const radius = Math.max(8, Math.min(20, event.affected_count / 200));

          return (
            <CircleMarker
              key={event.id}
              center={[event.latitude, event.longitude]}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.35,
                weight: 2,
              }}
            >
              <Popup>
                <div className="font-inter text-body-base">
                  <p className="font-semibold text-on-surface">{event.location}</p>
                  <p className="text-body-sm text-on-surface-variant">{event.problem_type}</p>
                  <p className="mt-1">
                    <span className="font-semibold">Score:</span> {event.priority_score}
                  </p>
                  <p className="text-body-sm mt-1 text-on-surface-variant italic">
                    {event.why}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HeatMap;
