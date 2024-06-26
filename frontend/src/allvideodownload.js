// import React, { useState, useEffect, useCallback } from "react";

// function AllVideoDownload() {
//   const [videoData, setVideoData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const baseUrl = process.env.REACT_APP_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`${baseUrl}/get-video`);
//         if (response.ok) {
//           const data = await response.json();
//           setVideoData(data);
//         } else {
//           throw new Error("Failed to fetch data.");
//         }
//       } catch (error) {
//         console.error("Error fetching video data:", error);
//         setError(error.message);
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, []);


//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     let hours = date.getHours(); // You need to get the hours from the date object
//     const minutes = date.getMinutes();
//     const seconds = date.getSeconds();
//     const amPm = hours < 12 ? "AM" : "PM";

//     // Adjust 24-hour time format to 12-hour format
//     if (hours === 0) {
//       hours = 12; // Midnight case
//     } else if (hours > 12) {
//       hours -= 12; // Convert to PM time if needed
//     }

//     // Pad hours, minutes, and seconds with leading zeros if necessary
//     const paddedHours = hours.toString().padStart(2, "0");
//     const paddedMinutes = minutes.toString().padStart(2, "0");
//     const paddedSeconds = seconds.toString().padStart(2, "0");

//     // Format date with 'en-GB' locale to get "dd/mm/yyyy" format
//     const formattedDate = date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });

//     return `${formattedDate}, ${paddedHours}:${paddedMinutes}:${paddedSeconds} ${amPm}`;
//   };

//   const convertToCSV = useCallback((data) => {
//     const headersMap = {
//       video_name: "Video Name",
//       video_start_date_time: "Start Date Time",
//       video_end_date_time: "End Date Time",
//       duration: "Duration (s)",
//       pcname: "PC Name",
//       schoolname: "School Name",
//       labnum: "Lab Number",
//       pcnum: "PC Number",
//       eiin: "EIIN"
//     };

//     if (!Array.isArray(data) || data.length === 0) {
//       console.error('Invalid or empty data provided to convertToCSV');
//       return '';
//     }
    
//     try {
//       const keys = Object.keys(data[0]).filter(key => key in headersMap);
//       const csvHeaders = keys.map(key => headersMap[key]);
//       const csv = data.map(row => {
//         return keys.map(key => `"${String(row[key]).replace(/"/g, '""')}"`).join(',');
//       }).join('\n');
      
//       return csvHeaders.join(',') + '\n' + csv;
//     } catch (error) {
//       console.error('Error converting data to CSV:', error);
//       return '';
//     }
//   }, []);

//   const downloadCSV = () => {
//     const csvData = convertToCSV(videoData);
//     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", "all-video-info.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div>
//       <button className="btn btn-danger w-100" onClick={downloadCSV} disabled={loading || error || videoData.length === 0}>
//         {loading ? "Loading..." : "Download All Video Info"}
//       </button>
//       {error && <p className="text-danger">Error: {error}</p>}
//     </div>
//   );
// }

// export default AllVideoDownload;

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
  }, [baseUrl]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const amPm = hours < 12 ? "AM" : "PM";

    if (hours === 0) {
      hours = 12; // Midnight case
    } else if (hours > 12) {
      hours -= 12; // Convert to PM time if needed
    }

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = seconds.toString().padStart(2, "0");

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return `${formattedDate}, ${paddedHours}:${paddedMinutes}:${paddedSeconds} ${amPm}`;
  };

  const formatVideoData = (data) => {
    return data.map(video => ({
      ...video,
      video_start_date_time: formatDate(video.video_start_date_time),
      video_end_date_time: formatDate(video.video_end_date_time)
    }));
  };

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
    const formattedData = formatVideoData(videoData);
    const csvData = convertToCSV(formattedData);
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
