

import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './index.css';  // Make sure your CSS handles the layout correctly.

function SchoolwiseInterval() {
    const [intervalData, setIntervalData] = useState([]);
    const [selectedIntervals, setSelectedIntervals] = useState(null);
    const [query, setQuery] = useState('');
    const baseUrl = process.env.REACT_APP_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/get-interval`);
                if (response.ok) {
                    const data = await response.json();
                    setIntervalData(data);
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const fuse = new Fuse(intervalData, {
        keys: ['schoolname', 'eiin'],
        includeScore: true
    });

    const handleSearch = (pattern) => {
        setQuery(pattern);
        const results = fuse.search(pattern);
        const matches = results.map(result => result.item);
        setSelectedIntervals(matches);
    };

    const downloadCSV = (schoolInfo) => {
        if (!schoolInfo.length) return; // Early return if no school info
        
        const headers = ["School Name", "PC Name", "Start Time", "Last Time", "Total Time (s)", "Lab", "PC", "EIIN"];
        const csvContent = [
            headers.join(","),
            ...schoolInfo.map(item => [
                `"${item.schoolname ? item.schoolname.replace(/"/g, '""') : ''}"`,
                `"${item.pcname ? item.pcname.replace(/"/g, '""') : ''}"`,
                `"${item.starttime ? item.starttime : ''}"`,
                `"${item.lasttime ? item.lasttime : ''}"`,
                `"${item.totaltime ? item.totaltime : ''}"`,
                `"${item.labnum ? item.labnum : ''}"`,
                `"${item.pcnum ? item.pcnum : ''}"`,
                `"${item.eiin ? item.eiin : ''}"`
            ].join(","))
        ].join("\n");
    
        const sanitizedSchoolName = schoolInfo[0].schoolname ? schoolInfo[0].schoolname.replace(/[/\\?%*:|"<>]/g, '') : 'unknown';
        const sanitizedEIIN = schoolInfo[0].eiin ? schoolInfo[0].eiin.toString().replace(/[/\\?%*:|"<>]/g, '') : 'unknown';
        const filename = `${sanitizedSchoolName}-${sanitizedEIIN}-Intervals.csv`;
    
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
                placeholder="Search by school name or EIIN..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <ul className="list-group">
                {Array.from(new Set(intervalData.map(item => `${item.schoolname} (EIIN: ${item.eiin})`))).map((school, index) => (
                    <li key={index} className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center" onClick={() => handleSearch(school)}>
                        {school}
                        <button className="btn btn-secondary" onClick={(e) => {
                            e.stopPropagation(); // Prevent li onClick from firing
                            const schoolInfo = intervalData.filter(s => `${s.schoolname} (EIIN: ${s.eiin})` === school);
                            downloadCSV(schoolInfo);
                        }}>Download Info</button>
                    </li>
                ))}
            </ul>

            {selectedIntervals && selectedIntervals.length > 0 && (
                <div className="mt-4">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>School Name</th>
                                <th>PC Name</th>
                                <th>Start Time</th>
                                <th>Last Time</th>
                                <th>Total Time (s)</th>
                                <th>Lab Number</th>
                                <th>PC Number</th>
                                <th>EIIN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedIntervals.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.schoolname}</td>
                                    <td>{item.pcname}</td>
                                    <td>{item.starttime}</td>
                                    <td>{item.lasttime}</td>
                                    <td>{item.totaltime}</td>
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

export default SchoolwiseInterval;
