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
// Update these imports to match the exact filenames
import bacolodData from '../Datasets/Bacolod.json';
import bayuganData from '../Datasets/Bayugan.json';
import butuanData from '../Datasets/Butuan.json';
import cabadbaranData from '../Datasets/Cabadbaran.json';
import bisligData from '../Datasets/Bislig.json';

const pdfStyles = StyleSheet.create({
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
    borderRightWidth: 0,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  noData: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});

const MyDocument = ({ data = [], locationName = '' }) => {
  const filteredData = data.filter((hazard) => hazard && hazard.name);

  return (
    <Document>
      <Page style={pdfStyles.page}>
        <Text style={pdfStyles.title}>Weather & Hazard Report</Text>
        <Text style={pdfStyles.subtitle}>{locationName}</Text>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Assessment Results</Text>
          {filteredData.length > 0 ? (
            <View style={pdfStyles.table}>
              <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                <Text style={pdfStyles.tableCell}>Hazard</Text>
                <Text style={pdfStyles.tableCell}>Description</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.lastCell]}>
                  AI Recommendation
                </Text>
              </View>
              {filteredData.map((hazard, index) => (
                <View style={pdfStyles.tableRow} key={index}>
                  <Text style={pdfStyles.tableCell}>
                    {hazard.name || 'N/A'}
                  </Text>
                  <Text style={pdfStyles.tableCell}>
                    {hazard.description || 'N/A'}
                  </Text>
                  <Text style={[pdfStyles.tableCell, pdfStyles.lastCell]}>
                    {hazard.recommendation || 'N/A'}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={pdfStyles.noData}>No hazards selected</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

const DEFAULT_WEATHER = {
  temp: 0,
  precip: 0,
  precipprob: 0,
  cloudcover: 0,
  windspeed: 0,
  feelslike: 0,
  humidity: 0,
};

const weatherDatasets = {
  bacolod: bacolodData,
  bayugan: bayuganData,
  butuan: butuanData,
  bislig: bisligData,
  cabadbaran: cabadbaranData,
  // Add other datasets here as needed
};

const getWeatherData = async (location) => {
  if (!location || location === 'No location selected') {
    console.log('No location provided');
    return {
      hasData: false,
      resolvedAddress: 'No location selected',
      days: [DEFAULT_WEATHER],
    };
  }

  try {
    const locationLower = location.toLowerCase();
    const cityMappings = {
      bacolod: ['bacolod', 'bacolod-1', 'bacolod city', 'negros'],
      bayugan: ['bayugan', 'bayugan city', 'agusan del sur'],
      butuan: [
        'butuan',
        'butuan city',
        'caraga',
        'j. c. aquino',
        'datu silongan',
        'agusan del norte',
      ],
      bislig: ['bislig'],
      cabadbaran: ['cabadbaran', 'cabadbaran city', 'agusan del norte'],
      //Add more mappings here (3rd STEP)
    };

    // Improved matching logic
    let matchedCity = null;
    let bestMatchScore = 0;

    for (const [city, variations] of Object.entries(cityMappings)) {
      for (const variant of variations) {
        if (locationLower.includes(variant)) {
          // Calculate match score based on variant length
          const matchScore = variant.length;
          if (matchScore > bestMatchScore) {
            bestMatchScore = matchScore;
            matchedCity = city;
          }
        }
      }
    }

    console.log('Location string:', locationLower);
    console.log('Matched city:', matchedCity);

    if (!matchedCity || !weatherDatasets[matchedCity]) {
      console.log('Available cities:', Object.keys(weatherDatasets));
      throw new Error('No dataset available for this location');
    }

    const weatherDataRaw = weatherDatasets[matchedCity];
    console.log('Loaded weather data for:', matchedCity);

    const currentDay = weatherDataRaw.days[0];
    return {
      hasData: true,
      resolvedAddress: location,
      latitude: weatherDataRaw.latitude,
      longitude: weatherDataRaw.longitude,
      days: [
        {
          temp: currentDay.temp || 0,
          feelslike: currentDay.feelslike || 0,
          humidity: currentDay.humidity || 0,
          precip: currentDay.precip || 0,
          precipprob: currentDay.precipprob || 0,
          cloudcover: currentDay.cloudcover || 0,
          windspeed: currentDay.windspeed || 0,
        },
      ],
    };
  } catch (error) {
    console.error('Error loading weather data:', error);
    return {
      hasData: false,
      resolvedAddress: location,
      days: [DEFAULT_WEATHER],
    };
  }
};

// 🔗 Main Popup
const ResultPopup = ({
  onClose,
  showChatbotPopup,
  setShowChatbotPopup,
  setShowResultPopup,
  darkMode,
  selectedHazards = [],
  selectedLocation,
}) => {
  console.log('ResultPopup received props:', {
    selectedLocation,
    selectedHazards,
    showChatbotPopup,
    darkMode,
  });

  const [weatherData, setWeatherData] = React.useState({
    hasData: false,
    days: [DEFAULT_WEATHER],
  });
  // Replace the existing location constant
  const location = selectedLocation?.trim() || 'No location selected';

  // Load weather data when location changes
  React.useEffect(() => {
    const loadWeatherData = async () => {
      if (selectedLocation && selectedLocation !== 'No location selected') {
        console.log('Loading weather data for:', selectedLocation);
        const data = await getWeatherData(selectedLocation);
        console.log('Loaded data:', data);
        setWeatherData(data);
      } else {
        console.log('No valid location provided');
        setWeatherData({
          hasData: false,
          days: [DEFAULT_WEATHER],
          resolvedAddress: 'No location selected',
        });
      }
    };
    loadWeatherData();
  }, [selectedLocation]);

  console.log('Selected Location:', location); // Debug log
  console.log('Weather Data:', weatherData); // Debug log

  // Get location details
  const locationDetails = React.useMemo(
    () => ({
      name:
        weatherData?.resolvedAddress ||
        selectedLocation ||
        'No location selected',
      coordinates:
        weatherData?.latitude && weatherData?.longitude
          ? `${weatherData.latitude.toFixed(
              4
            )}°N, ${weatherData.longitude.toFixed(4)}°E`
          : '',
    }),
    [weatherData, selectedLocation]
  );
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

  const getWeatherMetrics = (hazardType) => {
    const today = weatherData?.days?.[0] || DEFAULT_WEATHER;

    switch (hazardType) {
      case 'Flooding':
        return {
          risk: today.precip > 4 ? 'High' : today.precip > 2 ? 'Medium' : 'Low',
          metrics: {
            'Temperature:': `${today.temp}°C`,
            'Precipitation:': `${today.precip} mm`,
            'Probability:': `${today.precipprob}%`,
          },
          description: 'Heavy rainfall expected',
        };
      case 'Rainfall':
        return {
          metrics: {
            'Amount:': `${today.precip} mm`,
            'Cloud Cover:': `${today.cloudcover}%`,
            'Wind Speed:': `${today.windspeed} km/h`,
          },
          description: 'High rainfall intensity',
        };
      case 'Heat Index':
        return {
          risk: today.temp > 27 ? 'High' : today.temp > 25 ? 'Moderate' : 'Low',
          metrics: {
            'Temperature:': `${today.temp}°C`,
            'Feels Like:': `${today.feelslike}°C`,
            'Humidity:': `${today.humidity}%`,
          },
          description: 'High heat risk',
        };
      default:
        return null;
    }
  };

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
  // Update the MyDocument component to be more resilient

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

  const dynamicHazards = React.useMemo(
    () =>
      Array.isArray(selectedHazards)
        ? selectedHazards.map((name) => ({
            name,
            description: hazardDetails[name]?.description || 'N/A',
            recommendation: hazardDetails[name]?.recommendation || 'N/A',
            weather: getWeatherMetrics(name),
          }))
        : [],
    [selectedHazards, hazardDetails, getWeatherMetrics]
  );
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
        {/* Top Panel with Location */}
        <div className="result-top-panel">
          <div className="assessment-title">ASSESSMENT RESULTS</div>
          <div className="location-name">{selectedLocation}</div>
        </div>
        {/* Content Panels */}
        <div className="result-content">
          {!weatherData.hasData ? (
            <div className="result-content-panel no-data">
              <h3>No Data Available</h3>
              <p>We currently don't have data for {selectedLocation}.</p>
            </div>
          ) : dynamicHazards.length > 0 ? (
            dynamicHazards.map((hazard, index) => (
              <div
                className="result-content-panel"
                key={`hazard-${hazard.name}-${index}`}
              >
                <h3>{hazard.name} Assessment</h3>
                <div className="hazard-content">
                  <p className="description">{hazard.description}</p>
                  {hazard.weather && (
                    <div className="weather-metrics">
                      {hazard.weather.risk && (
                        <div
                          className={`risk-level ${hazard.weather.risk.toLowerCase()}`}
                        >
                          Risk Level: {hazard.weather.risk}
                        </div>
                      )}
                      <div className="metrics-grid">
                        {Object.entries(hazard.weather.metrics).map(
                          ([key, value]) => (
                            <div key={key} className="metric-item">
                              <label>{key}</label>
                              <span>{value}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  <p className="recommendation">
                    <strong>Recommendation:</strong> {hazard.recommendation}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="result-content-panel">No hazards selected.</div>
          )}
        </div>
        {/* Bottom Panel */}
        <div className="result-bottom-panel">
          {weatherData.hasData && dynamicHazards.length > 0 ? (
            <PDFDownloadLink
              document={
                <MyDocument
                  data={dynamicHazards}
                  locationName={locationDetails.name}
                />
              }
              fileName="Assessment_Results.pdf"
              className="view-report-button"
            >
              {({ blob, url, loading, error }) =>
                loading
                  ? 'Generating PDF...'
                  : error
                  ? 'Error generating PDF'
                  : 'View Result with AI Recommendation (PDF)'
              }
            </PDFDownloadLink>
          ) : (
            <button
              className="view-report-button"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              {!weatherData.hasData
                ? 'Select a location first'
                : 'Select hazards to generate report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
