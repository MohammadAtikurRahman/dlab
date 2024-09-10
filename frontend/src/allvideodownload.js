import React from "react";

function AllVideoDownload() {
  const baseUrl = process.env.REACT_APP_URL;
  return (
    <div>
      <a className="btn btn-danger w-100" href={baseUrl + "/export/videoinfos"}>
        Download All Video Info
      </a>
    </div>
  );
}

export default AllVideoDownload;
