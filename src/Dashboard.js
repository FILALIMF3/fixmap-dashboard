// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import MiniMap from './MiniMap';
import PhotoMarker from './PhotoMarker'; // Import the custom PhotoMarker

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 34.03313, // Fes, Morocco
  lng: -5.00028
};

function Dashboard() {
  const = useState();
  const = useState(null);
  const = useState(false);

  useEffect(() => {
    fetchReports();
  },);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const response = await axios.get('https://fixmap-server.onrender.com/api/reports-all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReports(response.data.filter(report => report.status === 'Submitted'));
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      if (error.response && (error.response.status === 401 |

| error.response.status === 403)) {
          localStorage.removeItem('token');
          window.location.href = '/login';
      }
    }
  };

  const handleMarkerClick = (report) => {
    setSelectedReport(report);
    setIsSidebarOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleStatusChange = async (reportId, newStatus) => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`https://fixmap-server.onrender.com/api/reports/${reportId}`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setReports(prevReports => prevReports.filter(report => report.id!== reportId));
      setIsSidebarOpen(false);
      setSelectedReport(null);
    } catch (error) {
        console.error('Failed to update status:', error);
        alert('Failed to update report status.');
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyD97SAhf9HZGF5kX2mOgx7fnao9mGMB53Y" // <-- PASTE YOUR API KEY HERE
    >
      <div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={() => setIsSidebarOpen(false)}
        >
          {reports.map((report) => (
            <PhotoMarker
              key={report.id}
              lat={parseFloat(report.latitude)}
              lng={parseFloat(report.longitude)}
              imageUrl={report.image_url}
              onClick={() => handleMarkerClick(report)}
            />
          ))}
        </GoogleMap>

        <button onClick={handleLogout} style={{ /*... button styles... */ }}>Logout</button>

        <div style={{ /*... sidebar styles... */ }}>
          {selectedReport && (
            <div>
              <button onClick={() => setIsSidebarOpen(false)} style={{ /*... close button styles... */ }}>&times;</button>
              <h2>Report Details</h2>
              <hr />
              <p><strong>Status:</strong> {selectedReport.status}</p>
              <p><strong>Submitted by:</strong> {selectedReport.citizen_name}</p>
              <p><strong>Date:</strong> {formatDate(selectedReport.created_at)}</p>
              <p><strong>Location Preview:</strong></p>
              <MiniMap 
                lat={parseFloat(selectedReport.latitude)} 
                lng={parseFloat(selectedReport.longitude)} 
              />
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => handleStatusChange(selectedReport.id, 'Rejected')} style={{ /*... reject button styles... */ }}>Reject</button>
                  <button onClick={() => handleStatusChange(selectedReport.id, 'Resolved')} style={{ /*... resolve button styles... */ }}>Mark as Resolved</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LoadScript>
  );
}

export default Dashboard;
