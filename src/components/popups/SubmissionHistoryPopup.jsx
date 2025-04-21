import React, { useState, useEffect } from "react";

const SubmissionHistoryPopup = ({
  onClose,
  showProfilePopup,
  setShowProfilePopup,
  setShowSubmissionHistoryPopup,
  selectedHazards,
  selectedLocation, // Update this to match the correct prop name
}) => {
  const [submissions, setSubmissions] = useState([]);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);

  useEffect(() => {
    console.log('selectedLocation in SubmissionHistoryPopup:', selectedLocation);
    console.log('selectedHazards in SubmissionHistoryPopup:', selectedHazards);

    const fetchSubmissions = async () => {
      if (!selectedLocation || !selectedHazards || selectedHazards.length === 0) {
        console.error('Missing selectedLocation or selectedHazards');
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/submissions?location=${selectedLocation}&hazards=${selectedHazards.join(',')}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [selectedLocation, selectedHazards]);

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

        {/* Content */}
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
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.location}</td>
                  <td>{submission.hazards.join(', ')}</td>
                  <td>
                    <div className="submission-buttons">
                      <button
                        className="view-result-button"
                        onClick={() => {
                          setActiveSubmission(submission);
                          setShowResultPopup(true);
                        }}
                      >
                        View Result
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showResultPopup && activeSubmission && (
        <ResultPopup
          onClose={() => setShowResultPopup(false)}
          selectedLocation={selectedLocation} // Pass the correct prop
          selectedHazards={selectedHazards}
        />
      )}
    </div>
  );
};

export default SubmissionHistoryPopup;