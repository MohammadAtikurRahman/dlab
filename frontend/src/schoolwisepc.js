import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import "./index.css"; // Make sure your CSS handles the layout correctly.

function SchoolwisePC() {
  const [schoolData, setSchoolData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSearchSchool, setSelectedSearchSchool] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/get-pc`);
        if (response.ok) {
          const data = await response.json();
          setSchoolData(data);
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const fuse = new Fuse(schoolData, {
    keys: ["schoolname", "eiin"],
    includeScore: true,
  });

  const handleSearch = (pattern) => {
    setQuery(pattern);
    if (pattern.trim() === "") {
      setSearchResults([]);
      setSelectedSearchSchool(null);
    } else {
      const results = fuse.search(pattern);
      const matches = results.map((result) => result.item);
      const uniqueSchools = Array.from(
        new Set(matches.map((item) => item.schoolname))
      ).map((schoolname) =>
        matches.find((item) => item.schoolname === schoolname)
      );
      setSearchResults(uniqueSchools);
    }
  };

  const handleSchoolClick = (schoolName, fromSearch = false) => {
    if (fromSearch) {
      if (
        selectedSearchSchool &&
        selectedSearchSchool[0].schoolname === schoolName
      ) {
        setSelectedSearchSchool(null);
      } else {
        const schoolInfo = schoolData.filter(
          (item) => item.schoolname === schoolName
        );
        setSelectedSearchSchool(schoolInfo);
      }
    } else {
      if (selectedSchool && selectedSchool[0].schoolname === schoolName) {
        setSelectedSchool(null);
      } else {
        const schoolInfo = schoolData.filter(
          (item) => item.schoolname === schoolName
        );
        setSelectedSchool(schoolInfo);
      }
    }
  };

  const downloadCSV = (schoolInfo) => {
    if (!schoolInfo.length) return;

    const headers = [
      "School Name",
      "PC Name",
      "Start Time",
      "Last Time",
      "Total Time (s)",
      "Lab",
      "PC",
      "EIIN",
    ];
    const csvContent = [
      headers.join(","),
      ...schoolInfo.map((item) =>
        [
          `"${item.schoolname.replace(/"/g, '""')}"`,
          `"${item.pcname.replace(/"/g, '""')}"`,
          `"${item.starttime}"`,
          `"${item.lasttime}"`,
          `"${item.totaltime}"`,
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
      .replace(/[/\\?%*:|"<>]/g, "");
    const filename = `${sanitizedSchoolName}-${sanitizedEIIN}-PCs.csv`;

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

      <h3 className="shadow-lg p-3 mb-5 bg-white rounded text-center">
        Search Results
      </h3>
      <ul className="list-group mb-4">
        {searchResults.length > 0 ? (
          searchResults.map((school, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action list-group-item-success"
              onClick={() => handleSchoolClick(school.schoolname, true)}
            >
              {school.schoolname} (EIIN: {school.eiin})
            </li>
          ))
        ) : (
          <li className="list-group-item">No search results</li>
        )}
      </ul>

      {selectedSearchSchool && selectedSearchSchool.length > 0 && (
        <div className="mt-4">
          <h3 className="shadow-lg p-3 mb-5 bg-white rounded text-center">
            Selected Search School Details
          </h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>School Name</th>
                <th>PC Name</th>
                <th>Start Time</th>
                <th>Last Time</th>
                <th>Total Time (s)</th>
                <th>Lab</th>
                <th>PC</th>
                <th>EIIN</th>
              </tr>
            </thead>
            <tbody>
              {selectedSearchSchool.map((item, index) => (
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

      <h3 className="shadow-lg p-3 mb-5 bg-white rounded text-center">
        All Schools
      </h3>
      <ul className="list-group">
        {Array.from(new Set(schoolData.map((item) => item.schoolname)))
          .reverse()
          .map((school, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center"
              onClick={() => handleSchoolClick(school)}
            >
              {school} (EIIN:{" "}
              {schoolData.find((item) => item.schoolname === school).eiin})
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent li onClick from firing
                  const schoolInfo = schoolData.filter(
                    (s) => s.schoolname === school
                  );
                  downloadCSV(schoolInfo);
                }}
              >
                Download Info
              </button>
            </li>
          ))}
      </ul>

      {selectedSchool && selectedSchool.length > 0 && (
        <div className="mt-4">
          <h3 className="shadow-lg p-3 mb-5 bg-white rounded text-center">
            Selected School Details
          </h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>School Name</th>
                <th>PC Name</th>
                <th>Start Time</th>
                <th>Last Time</th>
                <th>Total Time (s)</th>
                <th>Lab</th>
                <th>PC</th>
                <th>EIIN</th>
              </tr>
            </thead>
            <tbody>
              {selectedSchool.map((item, index) => (
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

export default SchoolwisePC;
