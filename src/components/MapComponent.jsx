import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-ruler"; // Import Ruler Plugin
import "leaflet-compass"; // Import Compass Plugin

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Component for Adding Tools (Zoom, Ruler, Compass)
const MapTools = () => {
  const map = useMap();

  useEffect(() => {
    // Remove existing controls if they exist
    map.eachLayer((layer) => {
      if (layer instanceof L.Control) {
        map.removeControl(layer);
      }
    });

    // Add Zoom Control (Beside Sidebar)
    const zoomControl = L.control.zoom({
      position: "topleft",
    }).addTo(map);

    // Add Compass (Lower Left)
    const compassControl = L.control.compass({
      position: "bottomleft",
      title: "Compass",
    }).addTo(map);

    // Add Ruler Tool (Upper Left)
    const rulerControl = L.control.ruler({
      position: "topleft",
      lengthUnit: { display: "km", decimal: 2 },
    }).addTo(map);

    return () => {
      map.removeControl(zoomControl);
      map.removeControl(compassControl);
      map.removeControl(rulerControl);
    };
  }, [map]);

  return null;
};

const MapComponent = ({ searchLocation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [satelliteMode, setSatelliteMode] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  useEffect(() => {
    if (searchLocation && mapRef.current) {
      const map = mapRef.current;
      map.flyTo(searchLocation, 15);
    }
  }, [searchLocation]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }}>
      <MapContainer
        center={[12.8797, 121.7740]} // Default center (Philippines)
        zoom={6}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url={
            satelliteMode
              ? "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution="&copy; OpenStreetMap contributors"
          subdomains={satelliteMode ? ["mt0", "mt1", "mt2", "mt3"] : ["a", "b", "c"]}
        />

        {/* Add Tools (Zoom, Compass, Ruler) */}
        <MapTools />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Search Location Marker */}
        {searchLocation && (
          <Marker position={searchLocation}>
            <Popup>Search Result</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Toggle Button for Satellite View */}
      <button
        onClick={() => setSatelliteMode(!satelliteMode)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: "1000",
          padding: "8px 12px",
          background: "#41AB5D",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {satelliteMode ? "Switch to Map View" : "Switch to Satellite View"}
      </button>
    </div>
  );
};

export default MapComponent;
