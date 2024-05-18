
import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import "./index.css";

function SchoolwiseVideo() {
  const [videoData, setVideoData] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSearchVideo, setSelectedSearchVideo] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/get-video`);
        if (response.ok) {
          const data = await response.json();
          setVideoData(data);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const fuse = new Fuse(videoData, {
    keys: ["schoolname", "eiin", "video_name"], // Adjust search keys based on video data fields
    includeScore: true,
  });

  const handleSearch = (pattern) => {
    setQuery(pattern);
    if (pattern.trim() === '') {
      setSearchResults([]);
      setSelectedSearchVideo(null);
    } else {
      const results = fuse.search(pattern);
      const matches = results.map((result) => result.item);
      const uniqueVideos = Array.from(new Set(matches.map(item => item.video_name)))
        .map(video_name => matches.find(item => item.video_name === video_name));
      setSearchResults(uniqueVideos);
    }
  };

  const handleVideoClick = (video, fromSearch = false) => {
    if (fromSearch) {
      if (selectedSearchVideo && selectedSearchVideo[0].video_name === video.video_name) {
        setSelectedSearchVideo(null);
      } else {
        const videoInfo = videoData.filter(item => item.video_name === video.video_name);
        setSelectedSearchVideo(videoInfo);
      }
    } else {
      if (selectedVideo && selectedVideo[0].video_name === video.video_name) {
        setSelectedVideo(null);
      } else {
        const videoInfo = videoData.filter(item => item.video_name === video.video_name);
        setSelectedVideo(videoInfo);
      }
    }
  };

  const downloadCSV = (videoInfo) => {
    if (!videoInfo.length) return; // Early return if no video info

    const headers = [
      "School Name",
      "PC Name",
      "Video Name",
      "Video Start",
      "Video End",
      "Duration (s)",
      "Lab Number",
      "PC Number",
      "EIIN",
    ];
    const csvContent = [
      headers.join(","),
      ...videoInfo.map((item) =>
        [
          `"${item.schoolname.replace(/"/g, '""')}"`,
          `"${item.pcname.replace(/"/g, '""')}"`,
          `"${item.video_name.replace(/"/g, '""')}"`,
          `"${formatDate(item.video_start_date_time)}"`,
          `"${formatDate(item.video_end_date_time)}"`,
          `"${item.duration}"`,
          `"${item.labnum}"`,
          `"${item.pcnum}"`,
          `"${item.eiin}"`,
        ].join(",")
      ),
    ].join("\n");

    const sanitizedSchoolName = videoInfo[0].schoolname.replace(
      /[/\\?%*:|"<>]/g,
      ""
    );
    const sanitizedEIIN = videoInfo[0].eiin
      .toString()
      .replace(/[/\\?%*:|"<>]/g, "");
    const filename = `${sanitizedSchoolName}-${sanitizedEIIN}-Videos.csv`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const formatDate = (dateStr) => {
  //   const date = new Date(dateStr);
  //   let hours = date.getHours(); // You need to get the hours from the date object
  //   const minutes = date.getMinutes();
  //   const seconds = date.getSeconds();
  //   const amPm = hours < 12 ? "AM" : "PM";

  //   // Adjust 24-hour time format to 12-hour format
  //   if (hours === 0) {
  //     hours = 12; // Midnight case
  //   } else if (hours > 12) {
  //     hours -= 12; // Convert to PM time if needed
  //   }

  //   // Pad hours, minutes, and seconds with leading zeros if necessary
  //   const paddedHours = hours.toString().padStart(2, "0");
  //   const paddedMinutes = minutes.toString().padStart(2, "0");
  //   const paddedSeconds = seconds.toString().padStart(2, "0");

  //   // Format date with 'en-GB' locale to get "dd/mm/yyyy" format
  //   const formattedDate = date.toLocaleDateString("en-GB", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   });

  //   return `${formattedDate}, ${paddedHours}:${paddedMinutes}:${paddedSeconds} ${amPm}`;
  // };



  const formatDate = (dateStr) => {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (isoDatePattern.test(dateStr)) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // If the date is invalid, return the original string
        return dateStr;
      }
  
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const amPm = hours < 12 ? "AM" : "PM";
  
      // Adjust 24-hour time format to 12-hour format
      if (hours === 0) {
        hours = 12; // Midnight case
      } else if (hours > 12) {
        hours -= 12; // Convert to PM time if needed
      }
  
      // Pad hours, minutes, and seconds with leading zeros if necessary
      const paddedHours = hours.toString().padStart(2, "0");
      const paddedMinutes = minutes.toString().padStart(2, "0");
      const paddedSeconds = seconds.toString().padStart(2, "0");
  
      // Format date with 'en-GB' locale to get "dd/mm/yyyy" format
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
  
      return `${formattedDate}, ${paddedHours}:${paddedMinutes}:${paddedSeconds} ${amPm}`;
    } else {
      // Extract the date part if the format is like "0.580499 16/05/2024, 10:22:09 AM"
      const datePattern = /\b(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M)\b/;
      const match = dateStr.match(datePattern);
      if (match) {
        return match[1];
      }
      return dateStr;
    }
  };
  
 
  

  
  return (
    <div className="container mt-5">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by video name, school name, or EIIN..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <h3>Search Results</h3>
      <ul className="list-group mb-4">
        {searchResults.length > 0 ? (
          searchResults.map((video, index) => (
            <li key={index} className="list-group-item list-group-item-action list-group-item-success" onClick={() => handleVideoClick(video, true)}>
              {video.schoolname} (EIIN: {video.eiin})
            </li>
          ))
        ) : (
          <li className="list-group-item">No search results</li>
        )}
      </ul>

      {selectedSearchVideo && selectedSearchVideo.length > 0 && (
        <div className="mt-4">
          <h3>Selected Search Video Details</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>School Name</th>
                <th>PC Name</th>
                <th>Video Name</th>
                <th>Video Start</th>
                <th>Video End</th>
                <th>Duration (s)</th>
                <th>Lab Number</th>
                <th>PC Number</th>
                <th>EIIN</th>
              </tr>
            </thead>
            <tbody>
              {selectedSearchVideo.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.schoolname}</td>
                  <td>{item.pcname}</td>
                  <td>{item.video_name}</td>
                  <td>{formatDate(item.video_start_date_time)}</td>
                  <td>{formatDate(item.video_end_date_time)}</td>
                  <td>{item.duration}</td>
                  <td>{item.labnum}</td>
                  <td>{item.pcnum}</td>
                  <td>{item.eiin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>All Schools</h3>
      <ul className="list-group">
        {Array.from(new Set(videoData.map(item => item.schoolname))).reverse().map((school, index) => (
          <li key={index} className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center" onClick={() => handleVideoClick(videoData.find(item => item.schoolname === school))}>
            {school} (EIIN: {videoData.find(item => item.schoolname === school).eiin})
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation(); // Prevent li onClick from firing
                const videoInfo = videoData.filter(v => v.schoolname === school);
                downloadCSV(videoInfo);
              }}
            >
              Download Info
            </button>
          </li>
        ))}
      </ul>

      {selectedVideo && selectedVideo.length > 0 && (
        <div className="mt-4">
          <h3>Selected Video Details</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>School Name</th>
                <th>PC Name</th>
                <th>Video Name</th>
                <th>Video Start</th>
                <th>Video End</th>
                <th>Duration (s)</th>
                <th>Lab Number</th>
                <th>PC Number</th>
                <th>EIIN</th>
              </tr>
            </thead>
            <tbody>
              {selectedVideo.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.schoolname}</td>
                  <td>{item.pcname}</td>
                  <td>{item.video_name}</td>
                  <td>{formatDate(item.video_start_date_time)}</td>
                  <td>{formatDate(item.video_end_date_time)}</td>
                  <td>{item.duration}</td>
                  <td>{item.labnum}</td>
                  <td>{item.pcnum}</td>
                  <td>{item.eiin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SchoolwiseVideo;