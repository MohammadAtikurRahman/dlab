import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function UploadVideoData() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const baseUrl = process.env.REACT_APP_URL;

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) {
            alert("Please select a CSV file to upload.");
            return;
        }

        Array.from(selectedFiles).forEach(file => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    const formattedData = results.data.map(item => ({
                        pcname: item["PC Name"],
                        eiin: parseInt(item["EIIN"]),
                        schoolname: item["School Name"],
                        labnum: parseInt(item["Lab"]),
                        pcnum: parseInt(item["PC"]),
                        video_name: item["Video Name"],
                        video_start: item["Video Start"],
                        video_start_date_time: `${item["Video Start"]} ${item["Video Start Date Time"]}`,
                        video_end: item["Video End"],
                        video_end_date_time: `${item["Video End"]} ${item["Video End Date Time"]}`,
                        duration: parseInt(item["Duration"]),
                        total_time: item["Total Time"]
                    }));
                    sendDataToServer(formattedData);
                }
            });
        });
    };

    const sendDataToServer = (data) => {
        axios.post(`${baseUrl}/video-info`, data)
            .then(response => {
                alert('Video data uploaded successfully!');
                console.log(response.data);
            })
            .catch(error => {
                alert('Failed to upload video data: ' + (error.response ? error.response.data : error.message));
                console.error(error);
            });
    };

    return (
        <div className="container mt-5">
            <div className="input-group mb-3">
                <input type="file" className="form-control" onChange={handleFileChange} accept=".csv" multiple />
                <button className="btn btn-primary" onClick={handleUpload}>Upload Video Data</button>
            </div>
        </div>
    );
}

export default UploadVideoData;
