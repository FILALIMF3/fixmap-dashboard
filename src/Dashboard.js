// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 34.03313, // Fes, Morocco
  lng: -5.00028
};

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

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
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
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
      
      setReports(prevReports => prevReports.filter(report => report.id !== reportId));
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
            <Marker
              key={report.id}
              position={{
                lat: parseFloat(report.latitude),
                lng: parseFloat(report.longitude)
              }}
              onClick={() => handleMarkerClick(report)}
            />
          ))}
        </GoogleMap>

        <button 
          onClick={handleLogout} 
          style={{
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            padding: '10px 20px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 1
          }}>
          Logout
        </button>

        <div
          style={{
            position: 'absolute',
            top: 0,
            right: isSidebarOpen ? 0 : '-400px',
            height: '100%',
            width: '350px',
            backgroundColor: 'white',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            transition: 'right 0.3s ease-in-out',
            zIndex: 2,
            padding: '20px',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}>
          {selectedReport && (
            <div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                style={{ float: 'right', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                &times;
              </button>
              <h2>Report Details</h2>
              <hr />
              <p><strong>Status:</strong> {selectedReport.status}</p>
              <p><strong>Submitted by:</strong> {selectedReport.citizen_name}</p>
              <p><strong>Date:</strong> {formatDate(selectedReport.created_at)}</p>
              <p><strong>Image:</strong></p>
              <img src={selectedReport.image_url} alt="Report" style={{ width: '100%', borderRadius: '8px' }} />
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <button 
                    onClick={() => handleStatusChange(selectedReport.id, 'Rejected')}
                    style={{ padding: '10px 20px', border: '1px solid grey', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedReport.id, 'Resolved')}
                    style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: 'teal', color: 'white', cursor: 'pointer' }}
                  >
                    Mark as Resolved
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LoadScript>
  );
}

export default Dashboard;
