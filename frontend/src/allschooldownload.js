import React, { useState, useEffect, useCallback } from "react";

function AllSchoolDownload() {
  const [schoolData, setSchoolData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/get-pc`);
        if (response.ok) {
          const data = await response.json();
          setSchoolData(data);
        } else {
          throw new Error("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const convertToCSV = useCallback((data) => {
    const headersMap = {
      dayid: "Day ID",
      starttime: "Start Time",
      totaltime: "Total Time",
      lasttime: "Last Time",
      pcname: "PC Name",
      eiin: "EIIN",
      schoolname: "School Name",
      labnum: "Lab Number",
      pcnum: "PC Number"
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
    const csvData = convertToCSV(schoolData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "all-school-info.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button className="btn btn-danger w-100" onClick={downloadCSV} disabled={loading || error || schoolData.length === 0}>
        {loading ? "Loading..." : "Download All Schools Info"}
      </button>
      {error && <p className="text-danger">Error: {error}</p>}
    </div>
  );
}

export default AllSchoolDownload;
