

// import React, { useState, useEffect } from 'react';
// import Fuse from 'fuse.js';
// import './index.css';  // Make sure your CSS handles the layout correctly.

// function SchoolwiseInterval() {
//     const [intervalData, setIntervalData] = useState([]);
//     const [selectedIntervals, setSelectedIntervals] = useState(null);
//     const [query, setQuery] = useState('');
//     const baseUrl = process.env.REACT_APP_URL;

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`${baseUrl}/get-interval`);
//                 if (response.ok) {
//                     const data = await response.json();
//                     setIntervalData(data);
//                 } else {
//                     throw new Error('Network response was not ok.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data: ', error);
//             }
//         };

//         fetchData();
//     }, []);

//     const fuse = new Fuse(intervalData, {
//         keys: ['schoolname', 'eiin'],
//         includeScore: true
//     });

//     const handleSearch = (pattern) => {
//         setQuery(pattern);
//         const results = fuse.search(pattern);
//         const matches = results.map(result => result.item);
//         setSelectedIntervals(matches);
//     };

//     const downloadCSV = (schoolInfo) => {
//         if (!schoolInfo.length) return; // Early return if no school info
        
//         const headers = ["School Name", "PC Name", "Start Time", "Last Time", "Total Time (s)", "Lab", "PC", "EIIN"];
//         const csvContent = [
//             headers.join(","),
//             ...schoolInfo.map(item => [
//                 `"${item.schoolname ? item.schoolname.replace(/"/g, '""') : ''}"`,
//                 `"${item.pcname ? item.pcname.replace(/"/g, '""') : ''}"`,
//                 `"${item.starttime ? item.starttime : ''}"`,
//                 `"${item.lasttime ? item.lasttime : ''}"`,
//                 `"${item.totaltime ? item.totaltime : ''}"`,
//                 `"${item.labnum ? item.labnum : ''}"`,
//                 `"${item.pcnum ? item.pcnum : ''}"`,
//                 `"${item.eiin ? item.eiin : ''}"`
//             ].join(","))
//         ].join("\n");
    
//         const sanitizedSchoolName = schoolInfo[0].schoolname ? schoolInfo[0].schoolname.replace(/[/\\?%*:|"<>]/g, '') : 'unknown';
//         const sanitizedEIIN = schoolInfo[0].eiin ? schoolInfo[0].eiin.toString().replace(/[/\\?%*:|"<>]/g, '') : 'unknown';
//         const filename = `${sanitizedSchoolName}-${sanitizedEIIN}-Intervals.csv`;
    
//         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.setAttribute("href", url);
//         link.setAttribute("download", filename);
//         link.style.visibility = "hidden";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
    

//     return (
//         <div className="container mt-5">
//             <input
//                 type="text"
//                 className="form-control mb-3"
//                 placeholder="Search by school name or EIIN..."
//                 value={query}
//                 onChange={(e) => handleSearch(e.target.value)}
//             />

//             <ul className="list-group">
//                 {Array.from(new Set(intervalData.map(item => `${item.schoolname} (EIIN: ${item.eiin})`))).reverse().map((school, index) => (
//                     <li key={index} className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center" onClick={() => handleSearch(school)}>
//                         {school}
//                         <button className="btn btn-secondary" onClick={(e) => {
//                             e.stopPropagation(); // Prevent li onClick from firing
//                             const schoolInfo = intervalData.filter(s => `${s.schoolname} (EIIN: ${s.eiin})` === school);
//                             downloadCSV(schoolInfo);
//                         }}>Download Info</button>
//                     </li>
//                 ))}
//             </ul>

//             {selectedIntervals && selectedIntervals.length > 0 && (
//                 <div className="mt-4">
//                     <table className="table table-striped">
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>School Name</th>
//                                 <th>PC Name</th>
//                                 <th>Start Time</th>
//                                 <th>Last Time</th>
//                                 <th>Total Time (s)</th>
//                                 <th>Lab Number</th>
//                                 <th>PC Number</th>
//                                 <th>EIIN</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedIntervals.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{index + 1}</td>
//                                     <td>{item.schoolname}</td>
//                                     <td>{item.pcname}</td>
//                                     <td>{item.starttime}</td>
//                                     <td>{item.lasttime}</td>
//                                     <td>{item.totaltime}</td>
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

// export default SchoolwiseInterval;


import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './index.css';  // Make sure your CSS handles the layout correctly.

function SchoolwiseInterval() {
    const [intervalData, setIntervalData] = useState([]);
    const [selectedIntervals, setSelectedIntervals] = useState(null);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSearchIntervals, setSelectedSearchIntervals] = useState(null);
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
        if (pattern.trim() === '') {
            setSearchResults([]);
            setSelectedSearchIntervals(null);
        } else {
            const results = fuse.search(pattern);
            const matches = results.map(result => result.item);
            const uniqueIntervals = Array.from(new Set(matches.map(item => item.schoolname)))
                .map(schoolname => matches.find(item => item.schoolname === schoolname));
            setSearchResults(uniqueIntervals);
        }
    };

    const handleIntervalClick = (schoolName, fromSearch = false) => {
        if (fromSearch) {
            if (selectedSearchIntervals && selectedSearchIntervals[0].schoolname === schoolName) {
                setSelectedSearchIntervals(null);
            } else {
                const intervalInfo = intervalData.filter(item => item.schoolname === schoolName);
                setSelectedSearchIntervals(intervalInfo);
            }
        } else {
            if (selectedIntervals && selectedIntervals[0].schoolname === schoolName) {
                setSelectedIntervals(null);
            } else {
                const intervalInfo = intervalData.filter(item => item.schoolname === schoolName);
                setSelectedIntervals(intervalInfo);
            }
        }
    };

    const downloadCSV = (intervalInfo) => {
        if (!intervalInfo.length) return; // Early return if no interval info

        const headers = ["School Name", "PC Name", "Start Time", "Last Time", "Total Time (s)", "Lab", "PC", "EIIN"];
        const csvContent = [
            headers.join(","),
            ...intervalInfo.map(item => [
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

        const sanitizedSchoolName = intervalInfo[0].schoolname ? intervalInfo[0].schoolname.replace(/[/\\?%*:|"<>]/g, '') : 'unknown';
        const sanitizedEIIN = intervalInfo[0].eiin ? intervalInfo[0].eiin.toString().replace(/[/\\?%*:|"<>]/g, '') : 'unknown';
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

            <h3>Search Results</h3>
            <ul className="list-group mb-4">
                {searchResults.length > 0 ? (
                    searchResults.map((school, index) => (
                        <li key={index} className="list-group-item list-group-item-action list-group-item-success" onClick={() => handleIntervalClick(school.schoolname, true)}>
                            {school.schoolname} (EIIN: {school.eiin})
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No search results</li>
                )}
            </ul>

            {selectedSearchIntervals && selectedSearchIntervals.length > 0 && (
                <div className="mt-4">
                    <h3>Selected Search Interval Details</h3>
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
                            {selectedSearchIntervals.map((item, index) => (
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

            <h3>All Schools</h3>
            <ul className="list-group">
                {Array.from(new Set(intervalData.map(item => item.schoolname))).reverse().map((school, index) => (
                    <li key={index} className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center" onClick={() => handleIntervalClick(school)}>
                        {school} (EIIN: {intervalData.find(item => item.schoolname === school).eiin})
                        <button className="btn btn-secondary" onClick={(e) => {
                            e.stopPropagation(); // Prevent li onClick from firing
                            const intervalInfo = intervalData.filter(i => i.schoolname === school);
                            downloadCSV(intervalInfo);
                        }}>Download Info</button>
                    </li>
                ))}
            </ul>

            {selectedIntervals && selectedIntervals.length > 0 && (
                <div className="mt-4">
                    <h3>Selected Interval Details</h3>
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
