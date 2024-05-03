import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function UploadPC() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const baseUrl = process.env.REACT_APP_URL;

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) {
            alert("Please select one or more CSV files to upload.");
            return;
        }

        Array.from(selectedFiles).forEach(file => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const formattedData = results.data.map(item => ({
                        pcname: item["PC Name"],
                        eiin: parseInt(item.EIIN),
                        schoolname: item["School Name"],
                        labnum: parseInt(item.Lab),
                        pcnum: parseInt(item.PC),
                        starttime: `${item["Start Date"]} ${item["Start Time"]}`,
                        totaltime: parseInt(item.Duration),
                        lasttime: `${item["End Date"]} ${item["End Time"]}`
                    }));
                    sendDataToServer(formattedData);
                }
            });
        });
    };

    const sendDataToServer = (data) => {
        axios.post(`${baseUrl}/pc-info`, data)
            .then(response => {
                alert('Data uploaded successfully!');
                console.log(response.data);
            })
            .catch(error => {
                alert('Failed to upload data: ' + error.message);
                console.error(error);
            });
    };

    return (
        // <div>
        //     <input type="file" onChange={handleFileChange} accept=".csv" multiple />
        //     <button onClick={handleUpload}>Upload CSV</button>
        // </div>
        <div className="container mt-5">
        <div className="input-group mb-3">
            <input type="file" className="form-control" id="inputGroupFile02" onChange={handleFileChange} accept=".csv" multiple />
            <button className="btn btn-primary" type="button" onClick={handleUpload}>Upload CSV</button>
        </div>
    </div>
    );
}

export default UploadPC;
