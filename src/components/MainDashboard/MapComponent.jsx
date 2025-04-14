import React, { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-ruler";
import "leaflet-compass";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icon for current location
const currentLocationIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "current-location-marker"
});

const MapTools = () => {
  const map = useMap();

  useEffect(() => {
    // Remove existing controls if they exist
    map.eachLayer((layer) => {
      if (layer instanceof L.Control) {
        map.removeControl(layer);
      }
    });

    // Add controls
    const zoomControl = L.control.zoom({ position: "topleft" }).addTo(map);
    const compassControl = L.control.compass({ 
      position: "bottomleft",
      title: "Compass"
    }).addTo(map);
    const rulerControl = L.control.ruler({
      position: "topleft",
      lengthUnit: { display: "km", decimal: 2 }
    }).addTo(map);

    return () => {
      map.removeControl(zoomControl);
      map.removeControl(compassControl);
      map.removeControl(rulerControl);
    };
  }, [map]);

  return null;
};

const MapComponent = ({ searchLocation, selectedBasemap = "Satellite Imagery", onLocate }) => {
  const mapRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [setShowPopup] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleLocate = useCallback(() => {
    if (!mapRef.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          setCurrentLocation(location);
          setMarkerPosition(location);
          mapRef.current.flyTo(location, 15);
          setShowPopup(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your current location");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  }, []);

  useEffect(() => {
    if (onLocate) {
      handleLocate();
    }
  }, [onLocate, handleLocate]);

  useEffect(() => {
    if (searchLocation && mapRef.current) {
      const map = mapRef.current;
      map.flyTo(searchLocation, 15);
    }
  }, [searchLocation]);

  const handleMapDoubleClick = (e) => {
    setMarkerPosition([e.latlng.lat, e.latlng.lng]);
    setShowPopup(true);
    setShowInstructions(false); // Hide instructions when user double-clicks on the map
  };

  const baseLayers = {
    "Streets": {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: ["a", "b", "c"]
    },
    "Satellite Imagery": {
    // Imagery only
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    subdomains: []
  },
    "Terrain": {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors',
      subdomains: ["a", "b", "c"]
    }
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }}>
      <MapContainer
        center={[12.8797, 121.7740]}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
        doubleClickZoom={false}
        onDblClick={handleMapDoubleClick}
      >
        <TileLayer
        url={baseLayers[selectedBasemap].url}
        attribution={baseLayers[selectedBasemap].attribution}
        subdomains={baseLayers[selectedBasemap].subdomains}
      />

      {selectedBasemap === "Satellite Imagery" && (
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution='Labels &copy; Esri'
          pane="overlayPane"
        />
      )}
        <MapTools />

        {/* Marker for locations */}
        {markerPosition && (
          <Marker 
            position={markerPosition}
            icon={currentLocation === markerPosition ? currentLocationIcon : undefined}
          >
            <Popup>
              {currentLocation === markerPosition ? "Your Location" : "Assessment Location"}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: "1000",
        padding: "8px 12px",
        background: "#41AB5D",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px"
      }}>
        {selectedBasemap}
      </div>

      {/* Floating instruction banner - persistent until closed or map is double-clicked */}
      {showInstructions && (
        <div style={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "1000",
          padding: "12px 24px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          maxWidth: "90%",
          animationName: "fadeInUp",
          animationDuration: "0.5s",
          animationTimingFunction: "ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}>
          <span style={{ flex: 1 }}>Double-Click/tap a location to start the assessment</span>
          <button 
            onClick={() => setShowInstructions(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              marginLeft: "8px"
            }}
            aria-label="Close instructions"
          >
            ✕
          </button>
        </div>
      )}

      {/* Add CSS for animation */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translate(-50%, 20px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default MapComponent;