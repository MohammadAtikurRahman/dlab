import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./histogram.css";
import axios from "axios";
import ChartPc from "./chartpc";
import ChartVideo from "./chartvideo";
import moment from 'moment';

const Histogram = () => {
  const [data, setData] = useState([]);
  const [activePCs, setActivePCs] = useState(0); //number of PCs
  const [activeLabs, setActiveLabs] = useState(0); //total labs
  const [totalPCUsages, setTotalPCUsages] = useState(0); //sum of pc usage
  const [activeSchools, setActiveSchools] = useState(0); //all schools
  const [totalDuration, setTotalDuration] = useState(0); //totalVideoWatchedTime
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`${baseUrl}/histogram`);
        response = await response.json();
        console.log(response.videoUsage);
        setActivePCs(response.distinctPcCount);
        setActiveLabs(response.distinctLabCount);
        setTotalPCUsages(formatTime(response.totalPcUsedTime));
        setTotalDuration(formatTime(response.videoUsage));
        setActiveSchools(response.distinctSchoolCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400); // 86400 seconds in a day
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days} Days ${hrs} Hours ${mins} Minutes ${secs} Seconds`;
};


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-4 mb-3">
          <div className="box small-box">
            <div className="box-header">
              <h5 className="box-title text-primary">
                <i className="fas fa-desktop"></i> Active PC
              </h5>
            </div>
            <div className="box-content">
              <p>{activePCs}</p>
            </div>
          </div>
        </div>
        <div className="col-4 mb-3">
          <div className="box small-box">
            <div className="box-header">
              <h5 className="box-title text-success">
                <i className="fas fa-school"></i> Active School
              </h5>
            </div>
            <div className="box-content">
              <p>{activeSchools}</p>
            </div>
          </div>
        </div>
        <div className="col-4 mb-3">
          <div className="box small-box">
            <div className="box-header">
              <h5 className="box-title text-secondary">
                <i className="fas fa-computer"></i> Active Lab
              </h5>
            </div>
            <div className="box-content">
              <p>{activeLabs}</p>
            </div>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="box small-box">
            <div className="box-header">
              <h5 className="box-title text-danger">
                <i className="fas fa-users"></i> Total PC Usages
              </h5>
            </div>
            <div className="box-content">
              <p>{totalPCUsages}</p>
            </div>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="box small-box">
            <div className="box-header">
              <h5 className="box-title text-danger">
                <i className="fas fa-video"></i> Total Video Time
              </h5>
            </div>
            <div className="box-content">
              {error ? (
                <p>{error}</p>
              ) : (
                <p>{totalDuration}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="box small-box">
            <ChartPc />
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="box small-box">
            <ChartVideo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Histogram;
