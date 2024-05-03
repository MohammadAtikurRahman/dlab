// import React, { useState, useEffect } from 'react';
// import Fuse from 'fuse.js';
// import './index.css';

// function SchoolwiseVideo() {
//     const [videoData, setVideoData] = useState([]);
//     const [selectedVideo, setSelectedVideo] = useState(null);
//     const [query, setQuery] = useState('');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('http://localhost:4300/get-video');
//                 if (response.ok) {
//                     const data = await response.json();
//                     setVideoData(data);
//                 } else {
//                     throw new Error('Network response was not ok.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data: ', error);
//             }
//         };

//         fetchData();
//     }, []);

//     const fuse = new Fuse(videoData, {
//         keys: ['schoolname', 'eiin', 'video_name'], // Adjust search keys based on video data fields
//         includeScore: true
//     });

//     const handleSearch = (pattern) => {
//         setQuery(pattern);
//         const results = fuse.search(pattern);
//         const matches = results.map(result => result.item);
//         setSelectedVideo(matches);
//     };

//     return (
//         <div className="container mt-5">
//             <input
//                 type="text"
//                 className="form-control mb-3"
//                 placeholder="Search by video name, school name, or EIIN..."
//                 value={query}
//                 onChange={(e) => handleSearch(e.target.value)}
//             />

//             <ul className="list-group">
//                 {Array.from(new Set(videoData.map(item => `${item.schoolname} EIIN: ${item.eiin}`))).map((video, index) => (
//                     <li key={index} className="list-group-item list-group-item-action list-group-item-primary" onClick={() => handleSearch(video)}>
//                         {video}
//                     </li>
//                 ))}
//             </ul>

//             {selectedVideo && selectedVideo.length > 0 && (
//                 <div className="mt-4">
//                     <table className="table table-striped">
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>School Name</th>
//                                 <th>PC Name</th>
//                                 <th>Video Name</th>
//                                 <th>Video Start</th>
//                                 <th>Video End</th>
//                                 <th>Duration (s)</th>
//                                 <th>Lab Number</th>
//                                 <th>PC Number</th>
//                                 <th>EIIN</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedVideo.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{index + 1}</td>
//                                     <td>{item.schoolname}</td>
//                                     <td>{item.pcname}</td>
//                                     <td>{item.video_name}</td>
//                                     <td>{item.video_start_date_time}</td>
//                                     <td>{item.video_end_date_time}</td>
//                                     <td>{item.duration}</td>
//                                     <td>{item.labnum}</td>
//                                     <td>{item.pcnum}</td>
//                                     <td>{item.eiin}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default SchoolwiseVideo;
import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './index.css';

function SchoolwiseVideo() {
    const [videoData, setVideoData] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [query, setQuery] = useState('');
    const baseUrl = process.env.REACT_APP_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/get-video`);
                if (response.ok) {
                    const data = await response.json();
                    setVideoData(data);
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const fuse = new Fuse(videoData, {
        keys: ['schoolname', 'eiin', 'video_name'], // Adjust search keys based on video data fields
        includeScore: true
    });

    const handleSearch = (pattern) => {
        setQuery(pattern);
        const results = fuse.search(pattern);
        const matches = results.map(result => result.item);
        setSelectedVideo(matches);
    };

    const downloadCSV = (videoInfo) => {
        if (!videoInfo.length) return; // Early return if no video info
    
        const headers = ["School Name", "PC Name", "Video Name", "Video Start", "Video End", "Duration (s)", "Lab Number", "PC Number", "EIIN"];
        const csvContent = [
            headers.join(","),
            ...videoInfo.map(item => [
                `"${item.schoolname.replace(/"/g, '""')}"`,
                `"${item.pcname.replace(/"/g, '""')}"`,
                `"${item.video_name.replace(/"/g, '""')}"`,
                `"${item.video_start_date_time}"`,
                `"${item.video_end_date_time}"`,
                `"${item.duration}"`,
                `"${item.labnum}"`,
                `"${item.pcnum}"`,
                `"${item.eiin}"`
            ].join(","))
        ].join("\n");
    
        const sanitizedSchoolName = videoInfo[0].schoolname.replace(/[/\\?%*:|"<>]/g, '');
        const sanitizedEIIN = videoInfo[0].eiin.toString().replace(/[/\\?%*:|"<>]/g, '');
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

    return (
        <div className="container mt-5">
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by video name, school name, or EIIN..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <ul className="list-group">
                {Array.from(new Set(videoData.map(item => `${item.schoolname} (EIIN: ${item.eiin})`))).map((video, index) => (
                    <li key={index} className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center" onClick={() => handleSearch(video)}>
                        {video}
                        <button className="btn btn-secondary" onClick={(e) => {
                            e.stopPropagation(); // Prevent li onClick from firing
                            const videoInfo = videoData.filter(v => `${v.schoolname} (EIIN: ${v.eiin})` === video);
                            downloadCSV(videoInfo);
                        }}>Download Info</button>
                    </li>
                ))}
            </ul>

            {selectedVideo && selectedVideo.length > 0 && (
                <div className="mt-4">
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
                                    <td>{item.video_start_date_time}</td>
                                    <td>{item.video_end_date_time}</td>
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
