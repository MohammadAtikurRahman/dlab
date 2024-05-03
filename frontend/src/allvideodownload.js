import React, { useState, useEffect, useCallback } from "react";

function AllVideoDownload() {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/get-video`);
        if (response.ok) {
          const data = await response.json();
          setVideoData(data);
        } else {
          throw new Error("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const convertToCSV = useCallback((data) => {
    const headersMap = {
      video_name: "Video Name",
      video_start_date_time: "Start Date Time",
      video_end_date_time: "End Date Time",
      duration: "Duration (s)",
      pcname: "PC Name",
      schoolname: "School Name",
      labnum: "Lab Number",
      pcnum: "PC Number",
      eiin: "EIIN"
    };

    if (!Array.isArray(data) || data.length === 0) {
      console.error('Invalid or empty data provided to convertToCSV');
      return '';
    }
    
    try {
      const keys = Object.keys(data[0]).filter(key => key in headersMap);
      const csvHeaders = keys.map(key => headersMap[key]);
      const csv = data.map(row => {
        return keys.map(key => `"${String(row[key]).replace(/"/g, '""')}"`).join(',');
      }).join('\n');
      
      return csvHeaders.join(',') + '\n' + csv;
    } catch (error) {
      console.error('Error converting data to CSV:', error);
      return '';
    }
  }, []);

  const downloadCSV = () => {
    const csvData = convertToCSV(videoData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "all-video-info.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button className="btn btn-danger w-100" onClick={downloadCSV} disabled={loading || error || videoData.length === 0}>
        {loading ? "Loading..." : "Download All Video Info"}
      </button>
      {error && <p className="text-danger">Error: {error}</p>}
    </div>
  );
}

export default AllVideoDownload;

