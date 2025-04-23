import React, { useState, useEffect } from "react";
import ResultPopup from "./ResultPopup";

const SubmissionHistoryPopup = ({
  onClose,
  showProfilePopup,
  setShowProfilePopup,
  setShowSubmissionHistoryPopup,
  selectedHazards = [],
  selectedLocation = "",
}) => {
  const [submissions, setSubmissions] = useState([]);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [locationNames, setLocationNames] = useState({});
  const [currentLocation, setCurrentLocation] = useState(selectedLocation);
  const [hasSubmitted, setHasSubmitted] = useState(false);

 // Update the validation function
const validateSubmissionData = (location, hazards) => {
  // First validate hazards
  if (!Array.isArray(hazards) || hazards.length === 0) {
    throw new Error('At least one hazard must be selected');
  }

  // Then validate location format
  if (!location) {
    throw new Error('Location is required');
  }

  // Convert to string and clean up
  const locationStr = location.toString().trim();
  
  // Check if location is in correct format (lat,lng)
  const coords = locationStr.split(',').map(coord => coord.trim());
  
  if (coords.length !== 2) {
    throw new Error('Location must be in format: latitude,longitude');
  }

  const [lat, lng] = coords.map(Number);

  // Validate latitude (-90 to 90)
  if (isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude value');
  }

  // Validate longitude (-180 to 180)
  if (isNaN(lng) || lng < -180 || lng > 180) {
    throw new Error('Invalid longitude value');
  }

  return true;
};

// Update the formatLocation function to handle coordinates properly
const formatLocation = (location) => {
  if (!location) return '';
  
  const coords = location.toString().trim().split(',');
  if (coords.length !== 2) return location.toString().trim();
  
  // Format to fixed decimal places for consistency
  const [lat, lng] = coords.map(coord => Number(coord.trim()));
  if (isNaN(lat) || isNaN(lng)) return location.toString().trim();
  
  return `${lat.toFixed(7)},${lng.toFixed(7)}`;
};
  
  // Update the submission handling effect
 // Update the submission handling effect
useEffect(() => {
  const saveSubmission = async () => {
    // Check if already submitted first
    if (hasSubmitted) {
      console.log('Already submitted, skipping save');
      return;
    }

    // Check if this location/hazards combination already exists in submissions
    const isDuplicate = submissions.some(sub => 
      formatLocation(sub.location) === formatLocation(selectedLocation) && 
      sub.hazards.length === selectedHazards.length &&
      sub.hazards.every(h => selectedHazards.includes(h))
    );

    if (isDuplicate) {
      console.log('Duplicate submission found, skipping save');
      setHasSubmitted(true);
      return;
    }

    try {
      // Validate inputs first
      validateSubmissionData(selectedLocation, selectedHazards);

      const submissionData = {
        location: formatLocation(selectedLocation),
        hazards: selectedHazards.map(h => h.trim()).filter(Boolean),
        timestamp: new Date().toISOString()
      };

      console.log('Submitting new data:', submissionData);

      const saveResponse = await fetch('http://localhost:5000/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const responseData = await saveResponse.json();

      if (!saveResponse.ok) {
        // If it's a duplicate on the server side, just mark as submitted
        if (saveResponse.status === 409) {
          console.log('Server indicates duplicate, marking as submitted');
          setHasSubmitted(true);
          return;
        }
        throw new Error(responseData?.message || `Server error (${saveResponse.status})`);
      }

      // Add to submissions only if it's new
      setSubmissions(prev => {
        const exists = prev.some(sub => 
          formatLocation(sub.location) === formatLocation(selectedLocation)
        );
        return exists ? prev : [...prev, responseData];
      });
      
      setHasSubmitted(true);

    } catch (error) {
      console.error('Submission error:', error);
      // Only show alert for non-duplicate errors
      if (!error.message.includes('duplicate')) {
        alert(`Failed to save: ${error.message}`);
      }
    }
  };

  saveSubmission();
}, [selectedLocation, selectedHazards, hasSubmitted, submissions]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Don't clear localStorage on unmount
      // Only reset component state
      setHasSubmitted(false);
    };
  }, []);
  
  const formatLocationDisplay = (location) => {
    if (!location) return '';
    const [lat, lng] = location.includes(',') 
      ? location.split(',')
      : [location.slice(0, 9), location.slice(9)];
    return `${lat}, ${lng}`;
  };

  const handleViewResult = (submission) => {
    setActiveSubmission({
      ...submission,
      location: submission.location,
      hazards: submission.hazards,
      timestamp: submission.timestamp
    });
    setShowResultPopup(true);
  };

  const getLocationName = async (coordinates) => {
    try {
      const [lat, lng] = coordinates.split(',').map(coord => coord.trim());
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      }
      return coordinates;
    } catch (error) {
      console.error('Error getting location name:', error);
      return coordinates;
    }
  };


  useEffect(() => {
    const fetchLocationNames = async () => {
      const names = {};
      for (const submission of submissions) {
        if (submission.location && !locationNames[submission._id]) {
          const name = await getLocationName(submission.location);
          names[submission._id] = name;
        }
      }
      setLocationNames(prev => ({ ...prev, ...names }));
    };
  
    fetchLocationNames();
  }, [submissions]);

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        {/* Panel */}
        <div className="profile-panel" style={{ backgroundColor: '#41AB5D' }}>
          <div className="panel-left">
            <button
              className={showProfilePopup ? 'active' : ''}
              onClick={() => {
                setShowProfilePopup(true);
                setShowSubmissionHistoryPopup(false);
              }}
            >
              <img src="/icons/profile.png" alt="Profile" />
            </button>
            <button className="active">
              <img src="/icons/result.png" alt="Submission History" />
            </button>
          </div>
          <div className="panel-center">SUBMISSION HISTORY</div>
          <div className="panel-right">
            <button onClick={onClose}>
              <img src="/icons/close.png" alt="Close" className="close-icon" />
            </button>
          </div>
        </div>

        <div className="my-profile-section">
          <table className="submission-history-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Hazard Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {submissions && submissions.length > 0 ? (
    submissions.map((submission) => {
      // Use the stored location name or the coordinates
      const locationDisplay = locationNames[submission._id] || submission.location;
      
      return (
        <tr key={submission._id}>
          <td>{locationDisplay}</td>
          <td>{submission.hazards?.join(', ') || 'No hazards'}</td>
          <td>
            <div className="submission-buttons">
              <button
                className="view-result-button"
                onClick={() => handleViewResult(submission)}
              >
                View Result
              </button>
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="3" style={{ textAlign: 'center' }}>
        No submissions found.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>

      {showResultPopup && activeSubmission && (
        <ResultPopup
          onClose={() => setShowResultPopup(false)}
          selectedLocation={currentLocation}
          selectedHazards={selectedHazards}
          submission={activeSubmission}
        />
      )}
    </div>
  );
};

export default SubmissionHistoryPopup;