import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./histogram.css";
import axios from "axios";
import ChartPc from "./chartpc";
import ChartVideo from "./chartvideo";
import moment from 'moment';

const Histogram = () => {
  const [data, setData] = useState([]);
  const [activePCs, setActivePCs] = useState(0);
  const [activeLabs, setActiveLabs] = useState(0);
  const [totalPCUsages, setTotalPCUsages] = useState(0);
  const [activeSchools, setActiveSchools] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://172.104.191.159:4300/get-pc");
        const result = await response.json();
        setData(result);
        processData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(
          "http://172.104.191.159:4300/get-video"
        );
        const data = response.data;

        // Filter duplicates
        const uniqueEntries = new Set(
          data.map((entry) =>
            JSON.stringify({
              video_start_date_time: entry.video_start_date_time,
              video_end_date_time: entry.video_end_date_time,
              duration: entry.duration,
            })
          )
        );

        // Calculate total duration
        const total = Array.from(uniqueEntries).reduce((sum, item) => {
          const entry = JSON.parse(item);
          return sum + entry.duration;
        }, 0);

        setTotalDuration(total);
      } catch (error) {
        setError("Failed to fetch video data");
      }
    };

    fetchVideoData();
  }, []);

  const processData = (data) => {
    const schoolData = {};
    const uniquePCs = new Set();
    const uniqueLabs = new Set();
    const uniqueSchools = new Set();
    let totalUsages = 0;

    data.forEach((item) => {
      const schoolName = item.schoolname;
      const day = moment(item.starttime, 'DD/MM/YYYY, hh:mm:ss a').format('YYYY-MM-DD');

      if (!schoolData[schoolName]) {
        schoolData[schoolName] = {};
      }

      if (!schoolData[schoolName][day]) {
        schoolData[schoolName][day] = item;
      } else {
        if (moment(item.lasttime, 'DD/MM/YYYY, hh:mm:ss a').isAfter(moment(schoolData[schoolName][day].lasttime, 'DD/MM/YYYY, hh:mm:ss a'))) {
          schoolData[schoolName][day] = item;
        }
      }

      uniquePCs.add(`${item.schoolname}-${item.pcname}`);
      uniqueLabs.add(`${item.schoolname}-${item.labnum}`);
      uniqueSchools.add(item.schoolname);
    });

    Object.keys(schoolData).forEach((school) => {
      Object.keys(schoolData[school]).forEach((day) => {
        totalUsages += schoolData[school][day].totaltime;
      });
    });

    setActivePCs(uniquePCs.size);
    setActiveLabs(uniqueLabs.size);
    setTotalPCUsages(formatTime(totalUsages));
    setActiveSchools(uniqueSchools.size);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs} Hours ${mins} Minutes ${secs} Seconds`;
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
                <p>{formatTime(totalDuration)}</p>
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
