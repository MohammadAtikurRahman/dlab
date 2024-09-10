import React from 'react';

function AllIntervalDownload() {
  const baseUrl = process.env.REACT_APP_URL;

  return (
    <div>
      <a className="btn btn-danger w-100" href={baseUrl + "/export/intervalinfos"}>
        Download All Interval Info
      </a>
    </div>
  );
}

export default AllIntervalDownload;
