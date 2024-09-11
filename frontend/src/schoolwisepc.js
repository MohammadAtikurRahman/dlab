import React, { useState, useEffect } from "react";
import "./index.css";

function SchoolwisePC() {
  const [schools, setSchools] = useState([]);
  const [searchedSchools, setSearchedSchools] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);

  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`${baseUrl}/schools`);
        response = await response.json();
        setSchools(response.schools);
      } catch (error) {
        console.error("Network response was not ok.", error);
      }
    };
    fetchData();
  }, [baseUrl]);

  const handleSearch = (pattern) => {
    setQuery(pattern);
    const filteredSchools = schools.filter(school =>
      school.schoolNames.some(name => name.toLowerCase().includes(pattern.toLowerCase()))
    );
    setSearchedSchools(filteredSchools);
    setSelectedSchool(null); // Clear selected school when search results change
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
      {searchedSchools.length > 0 ?
        <h3 className="shadow-lg p-3 mb-5 bg-white rounded text-center">
          Search Results
        </h3> : <div />
      }

      <ul className="list-group mb-4">
        {searchedSchools.length > 0 ? (
          searchedSchools.map((school, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center"
            >
              <span>
                {school.schoolNames.join(", ")} (EIIN: {school.eiin})
              </span>
              <a
                href={`${baseUrl}/export/csv/alltimes/${school.eiin}`}
                className="btn btn-secondary"
              >
                Download Info
              </a>
            </li>
          ))
        ) : (
          <div />
        )}
      </ul>

      {searchedSchools.length > 0 && selectedSchool && (
        <div className="mt-4">
          <h3 className="shadow-lg p-3 mb-5 bg-white rounded text-center">
            Selected School Details
          </h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>School Name</th>
                <th>EIIN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{selectedSchool.schoolNames.join(", ")}</td>
                <td>{selectedSchool.eiin}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <h3 className="shadow-lg p-3 mb-5 bg-white rounded text-center">
        All Schools
      </h3>
      <ul className="list-group">
        {schools.map((school, index) => (
          <li
            key={index}
            className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center"
          >
            {school.schoolNames.join(", ")} (EIIN: {school.eiin})
            <a
              href={`${baseUrl}/export/csv/alltimes/${school.eiin}`}
              className="btn btn-secondary"
            >
              Download Info
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SchoolwisePC;
