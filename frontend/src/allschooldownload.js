import React from "react";

function AllSchoolDownload() {
  const baseUrl = process.env.REACT_APP_URL;
  return (
    <div>
      <a className="btn btn-danger w-100" href={baseUrl + "/export/alltimes"} target="_blank">
        Download All Schools Info
      </a>
    </div>
  );
}

export default AllSchoolDownload;
