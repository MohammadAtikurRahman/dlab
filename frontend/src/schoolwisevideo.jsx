import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './index.css';

function SchoolwiseVideo() {
    const [videoData, setVideoData] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSearchSchool, setSelectedSearchSchool] = useState(null);
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
        keys: ['schoolname', 'eiin', 'video_name'],
        includeScore: true
    });

    const handleSearch = (pattern) => {
        setQuery(pattern);
        if (pattern.trim() === '') {
            setSearchResults([]);
            setSelectedSearchSchool(null);
        } else {
            const results = fuse.search(pattern);
            const matches = results.map(result => result.item);
            const uniqueSchools = Array.from(new Set(matches.map(item => item.schoolname)))
                .map(schoolname => matches.find(item => item.schoolname === schoolname));
            setSearchResults(uniqueSchools);
        }
    };

    const handleSchoolClick = (schoolName, fromSearch = false) => {
        if (fromSearch) {
            if (selectedSearchSchool && selectedSearchSchool[0].schoolname === schoolName) {
                setSelectedSearchSchool(null);
            } else {
                const schoolInfo = videoData.filter(item => item.schoolname === schoolName);
                setSelectedSearchSchool(schoolInfo);
            }
        } else {
            if (selectedSchool && selectedSchool[0].schoolname === schoolName) {
                setSelectedSchool(null);
            } else {
                const schoolInfo = videoData.filter(item => item.schoolname === schoolName);
                setSelectedSchool(schoolInfo);
            }
        }
    };

    const downloadCSV = (schoolInfo) => {
        if (!schoolInfo.length) return;

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
            ...schoolInfo.map((item) =>
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

        const sanitizedSchoolName = schoolInfo[0].schoolname.replace(
            /[/\\?%*:|"<>]/g,
            ""
        );
        const sanitizedEIIN = schoolInfo[0].eiin
            .toString()
            .replace(/[/\\?%*:|"<>]/g, '');
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

    const formatDate = (dateStr) => {
        const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        if (isoDatePattern.test(dateStr)) {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                return dateStr;
            }

            let hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const amPm = hours < 12 ? "AM" : "PM";

            if (hours === 0) {
                hours = 12;
            } else if (hours > 12) {
                hours -= 12;
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
        } else {
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

            <h3 className='shadow-lg p-3 mb-5 bg-white rounded text-center'>Search Results</h3>
            <ul className="list-group mb-4">
                {searchResults.length > 0 ? (
                    searchResults.map((school, index) => (
                        <li key={index} className="list-group-item list-group-item-action list-group-item-success" onClick={() => handleSchoolClick(school.schoolname, true)}>
                            {school.schoolname} (EIIN: {school.eiin})
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No search results</li>
                )}
            </ul>

            {selectedSearchSchool && selectedSearchSchool.length > 0 && (
                <div className="mt-4">
                    <h3 className='shadow-lg p-3 mb-5 bg-white rounded text-center'>Selected Search School Details</h3>
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
                            {selectedSearchSchool.map((item, index) => (
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

            <h3 className='shadow-lg p-3 mb-5 bg-white rounded text-center'>All Schools</h3>
            <ul className="list-group">
                {Array.from(new Set(videoData.map(item => item.schoolname))).reverse().map((school, index) => (
                    <li
                        key={index}
                        className={`list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center 
                        ${selectedSchool && selectedSchool[0].schoolname === school ? "" : ""}`   }
                        onClick={() => handleSchoolClick(school)}
                    >
                        {school} (EIIN: {videoData.find(item => item.schoolname === school).eiin})
                        <button className="btn btn-secondary" onClick={(e) => {
                            e.stopPropagation();
                            const videoInfo = videoData.filter(v => v.schoolname === school);
                            downloadCSV(videoInfo);
                        }}>Download Info</button>
                    </li>
                ))}
            </ul>

            {selectedSchool && selectedSchool.length > 0 && (
                <div className="mt-4">
                    <h3 className='shadow-lg p-3 mb-5 bg-white rounded text-center'>Selected School Video Details</h3>
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
                            {selectedSchool.map((item, index) => (
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
