import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

import Pc from "./pc";
import Schoolwisepc from "./schoolwisepc";
import Video from "./video";
import SchoolwiseVideo from "./schoolwisevideo";
import Interval from "./interval";

import SchoolwiseInterval from "./schoolwiseinterval";

import UploadPC from "./uploadpc";
import UploadVideo from "./uploadvideo";
import UploadInterval from "./uploadinterval";

function Home() {
  const navigate = useNavigate();
  const [view, setView] = useState("pc"); // Default view is 'pc'

  const handleLogout = () => {
    navigate("/login");
  };

  const handlePCClick = () => setView("pc");
  const handleVideoClick = () => setView("video");
  const handleIntervalClick = () => setView("interval"); // New handler for Interval view
  const handleSchoolMapClick = () => setView("schoolmap"); // New handler for School Map view

  return (
    <div className="d-flex">
      <div className="sidebar bg-dark">
        <div
          className="sidebar-header"
          style={{ padding: "11.5px", borderBottom: "none" }}
        >
          <h5 style={{ color: "white" }}>DLAB</h5>
        </div>
        <div className="list-group text-center p-3">
          <hr></hr>
          <button
            className="btn list-group-item list-group-item-action"
            onClick={handlePCClick}
          >
            PC
          </button>
          <hr></hr>

          <button
            className="btn list-group-item list-group-item-action"
            onClick={handleVideoClick}
          >
            Video
          </button>
          <hr></hr>

          <button
            className="btn list-group-item list-group-item-action"
            onClick={handleIntervalClick}
          >
            Interval
          </button>
          <hr></hr>

          {/* <button className="btn list-group-item list-group-item-action" onClick={handleSchoolMapClick}>School Map</button> */}
        </div>
      </div>
      <div className="main-content flex-grow-1">
        <nav className="navbar navbar-expand-lg navbar-light bg-danger">
          <div className="container-fluid">
            <Link className="navbar-brand text-white" to="/home">
              ADMIN PANEL
            </Link>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container mt-3">
          {view === "pc" ? (
            <div role="alert">
              <UploadPC />

              <br></br>

              <Pc />
              <Schoolwisepc />
            </div>
          ) : view === "video" ? (
            <div role="alert">

              <UploadVideo/>
              <Video />
              <SchoolwiseVideo />
            </div>
          ) : view === "interval" ? (
            <div role="alert">
              <UploadInterval/>
              <Interval />
              <SchoolwiseInterval />
            </div>
          ) : view === "schoolmap" ? (
            <div role="alert"></div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Home;
