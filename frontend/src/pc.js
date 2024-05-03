
import React, { useState } from 'react';

import AllSchoolDownload from './allschooldownload'

function Pc() {
  const [pcData, setPcData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);



  const baseUrl = process.env.REACT_APP_URL;

  console.log(process.env.REACT_APP_URL);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/get-pc`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPcData(data);
    } catch (error) {
      setError('Failed to fetch data: ' + error.message);
    }
    setIsLoading(false);
  };

  const toggleTableVisibility = () => {
    if (!isTableVisible) {
      fetchData(); // Fetch data only when table is becoming visible
    }
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div>
      <div className='row'>
        <div className='col-6'>
        <button className='btn btn-primary w-100' onClick={toggleTableVisibility} disabled={isLoading}>
        {isLoading ? 'Loading...' : isTableVisible ? 'Hide Table' : 'Show all PC Data'}
      </button>
        </div>
         <div className='col-6' >
         {/* <button className='btn btn-danger w-100'>ALL PC Download</button> */}
           <AllSchoolDownload/>
         </div>

      </div>
    


      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {isTableVisible && pcData.length > 0 && ( // Render table only if isTableVisible is true and data is available
        <table className="table table-striped">
          <thead>
            <tr>
              <th>PC Name</th>
              <th>Start Time</th>
              <th>Last Time</th>
              <th>Total Time (s)</th>
              <th>School</th>
              <th>Lab Number</th>
              <th>PC Number</th>
            </tr>
          </thead>
          <tbody>
            {pcData.map(item => (
              <tr key={item._id}>
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

export default Pc;
