import React from 'react';
import './PopupStyles.css';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

// 🔗 Main Popup
const ResultPopup = ({
  onClose,
  showChatbotPopup,
  setShowChatbotPopup,
  setShowResultPopup,
  darkMode,
  selectedHazards = [],
}) => {
  const allHazards = [
    {
      name: 'Flooding',
      description: 'Flooding in low-lying areas',
      recommendation: 'Use flood barriers and evacuate',
    },
    {
      name: 'Rainfall',
      description: 'Heavy rainfall expected',
      recommendation: 'Stay indoors, avoid flooding zones',
    },
    {
      name: 'Heat Index',
      description: 'High heat risk',
      recommendation: 'Drink water and stay cool',
    },
  ];

  // Only include hazards that are selected
  const hazardData = allHazards.filter((h) => selectedHazards.includes(h.name));

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: '#fff',
    },
    section: {
      marginBottom: 10,
    },
    table: {
      display: 'table',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#000',
    },
    tableCell: {
      flex: 1,
      padding: 5,
      fontSize: 12,
      textAlign: 'center',
      borderRightWidth: 1,
      borderColor: '#000',
    },
    lastCell: {
      borderRightWidth: 0, // no right border on the last cell
    },

    tableHeader: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      backgroundColor: '#f0f0f0',
    },
  });

  // PDF Component
  const MyDocument = ({ data }) => (
    <Document>
      <Page style={styles.page}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Weather & Hazard Report
        </Text>
        <View style={styles.section}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            Assessment Results
          </Text>

          <View style={styles.table}>
            {/* Header Row */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell]}>Hazard</Text>
              <Text style={[styles.tableCell]}>Description</Text>
              <Text style={[styles.tableCell, styles.lastCell]}>
                AI Recommendation
              </Text>
            </View>

            {/* Data Rows */}
            {data.map((hazard, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{hazard.name}</Text>
                <Text style={styles.tableCell}>{hazard.description}</Text>
                <Text style={[styles.tableCell, styles.lastCell]}>
                  {hazard.recommendation}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  // Dynamic hazard data from selectedHazards
  const hazardDetails = {
    Flooding: {
      description: 'Flooding in low-lying areas',
      recommendation: 'Use flood barriers and evacuate',
    },
    Rainfall: {
      description: 'Heavy rainfall expected',
      recommendation: 'Stay indoors, avoid flooding zones',
    },
    'Heat Index': {
      description: 'High heat risk',
      recommendation: 'Drink water and stay cool',
    },
  };

  const dynamicHazards = selectedHazards.map((name) => ({
    name,
    description: hazardDetails[name]?.description || 'N/A',
    recommendation: hazardDetails[name]?.recommendation || 'N/A',
  }));

  return (
    <div className="profile-popup-overlay">
      <div className={`profile-popup ${darkMode ? 'dark-mode' : ''}`}>
        {/* Panel */}
        <div className="profile-panel">
          <div className="panel-left">
            <button className="active" onClick={() => {}}>
              <img src="/icons/result.png" alt="Assessment Result" />
            </button>
            <button
              className={showChatbotPopup ? 'active' : ''}
              onClick={() => {
                setShowChatbotPopup(true);
                setShowResultPopup(false);
              }}
            >
              <img src="/icons/chatbot.png" alt="Chat Bot" />
            </button>
          </div>

          <div className="panel-right">
            <button onClick={onClose}>
              <img src="/icons/close.png" alt="Close" className="close-icon" />
            </button>
          </div>
        </div>

        {/* Top Panel */}
        <div className="result-top-panel">ASSESSMENT RESULTS</div>

        {/* Content Panels */}
        <div className="result-content">
          {dynamicHazards.length > 0 ? (
            dynamicHazards.map((hazard, index) => (
              <div key={index} className="result-content-panel">
                {hazard.name} Assessment
              </div>
            ))
          ) : (
            <div className="result-content-panel">No hazards selected.</div>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="result-bottom-panel">
          <PDFDownloadLink
            document={<MyDocument data={hazardData} />}
            fileName="Assessment Results.pdf"
            disabled={hazardData.length === 0}
          >
            {({ loading }) => (
              <button
                className="view-report-button"
                disabled={hazardData.length === 0}
                style={{
                  opacity: hazardData.length === 0 ? 0.5 : 1,
                  cursor: hazardData.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {loading
                  ? 'Generating PDF...'
                  : 'View Result with AI Recommendation (PDF)'}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
