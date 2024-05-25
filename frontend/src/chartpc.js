import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';

const ChartPc = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchPCData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-pc`);
        const data = response.data;
        console.log("Fetched Data:", data);

        // Group data by school and then by day
        const schoolDayWiseData = {};

        data.forEach(entry => {
          const schoolName = entry.schoolname;
          const day = moment(entry.starttime, 'DD/MM/YYYY, hh:mm:ss a').format('YYYY-MM-DD');

          if (!schoolDayWiseData[schoolName]) {
            schoolDayWiseData[schoolName] = {};
          }

          if (!schoolDayWiseData[schoolName][day]) {
            schoolDayWiseData[schoolName][day] = entry;
          } else {
            // Update the entry for the day if the current entry has a later lasttime
            if (moment(entry.lasttime, 'DD/MM/YYYY, hh:mm:ss a').isAfter(moment(schoolDayWiseData[schoolName][day].lasttime, 'DD/MM/YYYY, hh:mm:ss a'))) {
              schoolDayWiseData[schoolName][day] = entry;
            }
          }
        });

        console.log("Grouped Data by School and Day with most recent lasttime:", schoolDayWiseData);

        // Calculate the total time for each day across all schools
        const finalData = Object.keys(schoolDayWiseData).reduce((acc, school) => {
          Object.keys(schoolDayWiseData[school]).forEach(day => {
            if (!acc[day]) {
              acc[day] = 0;
            }
            acc[day] += schoolDayWiseData[school][day].totaltime;
          });
          return acc;
        }, {});

        console.log("Final Aggregated Data:", finalData);

        const sortedDays = Object.keys(finalData).sort((a, b) => new Date(a) - new Date(b));
        const last7Days = sortedDays.slice(-7);
        const totalTimes = last7Days.map(day => finalData[day]);

        console.log("Last 7 Days:", last7Days);
        console.log("Total Times for Last 7 Days:", totalTimes);

        const dayLabels = last7Days.map(day => moment(day).format('dddd')); // Get day names

        setChartData({
          labels: dayLabels,
          datasets: [
            {
              label: 'Total Time (seconds)',
              data: totalTimes,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              fill: true,
              lineTension: 0.3,
            },
          ],
        });
      } catch (error) {
        setError('Failed to fetch PC data');
      }
    };

    fetchPCData();
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      {error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : (
        <div style={{ width: '100%', height: '500px' }}>
          {chartData.labels.length > 0 ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'PC Usage Time by Day (Last 7 Days)',
                    font: {
                      size: 20,
                      weight: 'bold',
                      family: 'Arial',
                    },
                    padding: {
                      top: 10,
                      bottom: 30,
                    },
                    color: '#333',
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => formatTime(tooltipItem.raw),
                    },
                    enabled: true,
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    footerColor: '#fff',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      color: 'rgba(200, 200, 200, 0.3)',
                    },
                    ticks: {
                      callback: (value) => formatTime(value),
                      beginAtZero: true,
                      stepSize: 3600, // Step size of 1 hour
                      maxTicksLimit: 10,
                    },
                  },
                },
                animation: {
                  duration: 1000,
                  easing: 'easeInOutQuad',
                },
              }}
            />
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading data...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartPc;
