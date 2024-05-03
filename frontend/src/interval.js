import React, { useState, useEffect } from "react";

import AllIntervalDownload from "./allintervaldownload";


function Interval() {
  const [intervalData, setIntervalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);




  const baseUrl = process.env.REACT_APP_URL; // Ensure your environment variable is set

  useEffect(() => {
    if (isTableVisible && intervalData.length === 0) {
      // Fetch data only when table is visible and data is not already loaded
      fetchData();
    }
  }, [isTableVisible]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/get-interval`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setIntervalData(data);
    } catch (error) {
      setError("Failed to fetch data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div>
      <div className="row">
        <div className="col-6">
          <button
            className="btn btn-primary w-100"
            onClick={toggleTableVisibility}
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : isTableVisible
              ? "Hide Interval Data"
              : "Show Interval Data"}
          </button>
        </div>
        <div className="col-6">
          <AllIntervalDownload/>
        </div>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {isTableVisible && intervalData.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>PC Name</th>
              <th>Start Time</th>
              <th>Last Time</th>
              <th>Total Time (s)</th>
              <th>School Name</th>
              <th>Lab Number</th>
              <th>PC Number</th>
            </tr>
          </thead>
          <tbody>
            {intervalData.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.pcname}</td>
                <td>{item.starttime}</td>
                <td>{item.lasttime}</td>
                <td>{item.totaltime}</td>
                <td>{item.schoolname}</td>
                <td>{item.labnum}</td>
                <td>{item.pcnum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Interval;
