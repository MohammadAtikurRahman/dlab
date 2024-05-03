import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function UploadInterval() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const baseUrl = process.env.REACT_APP_URL;

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);  // Capture all selected files
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) {
            alert("Please select one or more CSV files to upload.");
            return;
        }

        // Process each file
        Array.from(selectedFiles).forEach(file => {
            Papa.parse(file, {
                header: true, // Treats the first row of the CSV as headers
                skipEmptyLines: true,
                complete: function(results) {
                    const transformedData = results.data.map(item => ({
                        schoolname: item["School Name"],
                        eiin: parseInt(item["EIIN"]),
                        labnum: parseInt(item["Lab Number"]),
                        pcnum: parseInt(item["PC Number"]),
                        starttime: item["Session Start Time"],
                        lasttime: item["Last Checked Time"],
                        totaltime: parseInt(item["Duration"])  // Ensure you use this correctly if needed
                    }));
                    sendDataToServer(transformedData);
                }
            });
        });
    };

    // const parseDuration = (duration) => {
    //     // Converts duration from 'HH Oh MMm SSs' to total seconds
    //     const parts = duration.match(/(\d+)\sOh\s(\d+)m\s(\d+)s/);
    //     if (parts) {
    //         return parseInt(parts[1]) * 3600 + parseInt(parts[2]) * 60 + parseInt(parts[3]);
    //     }
    //     return 0;
    // };

    const sendDataToServer = (data) => {
        axios.post(`${baseUrl}/inter-info`, data)
            .then(response => {
                alert('Interval data uploaded successfully!');
                console.log(response.data);
            })
            .catch(error => {
                alert('Failed to upload interval data: ' + error.message);
                console.error(error);
            });
    };

    return (
        <div className="container mt-5">
            <div className="input-group mb-3">
                <input type="file" className="form-control" multiple onChange={handleFileChange} accept=".csv" />
                <button className="btn btn-primary" onClick={handleUpload}>Upload Interval Data</button>
            </div>
        </div>
    );
}

export default UploadInterval;
