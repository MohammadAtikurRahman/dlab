import React, { useState, useEffect } from 'react';
import AllVideoDownload from './allvideodownload';

function Video() {
  const [videoData, setVideoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    if (isTableVisible) { // Fetch data only when table is to be shown
      fetchData();
    }
  }, [isTableVisible]);  // Adding dependency to re-fetch when table visibility changes

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/get-video`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setVideoData(data);
    } catch (error) {
      setError('Failed to fetch data: ' + error.message);
    }
    setIsLoading(false);
  };

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div>
      <div className='row'>
        <div className='col-6'>
          <button className='btn btn-primary w-100' onClick={toggleTableVisibility} disabled={isLoading}>
            {isLoading ? 'Loading...' : isTableVisible ? 'Hide Table' : 'Show all Video Data'}
          </button>
        </div>
        <div className='col-6'>
         <AllVideoDownload/>
        </div>
      </div>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {isTableVisible && videoData.length > 0 && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>PC Name</th>
              <th>School</th>
              <th>Lab </th>
              <th>PC </th>
              <th>Video Name</th>
              <th>Video Start </th>
              <th>Video End </th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {videoData.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.pcname}</td>
                <td>{item.schoolname}</td>
                <td>{item.labnum}</td>
                <td>{item.pcnum}</td>
                <td>{item.video_name}</td>
                <td>{new Date(item.video_start_date_time).toLocaleString()}</td>
                <td>{new Date(item.video_end_date_time).toLocaleString()}</td>
                <td>{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Video;
