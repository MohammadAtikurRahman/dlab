

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';

const formatDate = (dateStr) => {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (isoDatePattern.test(dateStr)) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const amPm = hours < 12 ? 'AM' : 'PM';

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');

    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return `${formattedDate}, ${paddedHours}:${paddedMinutes}:${paddedSeconds} ${amPm}`;
  } else {
    const datePattern = /\b(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} [AP]M)\b/;
    const match = dateStr.match(datePattern);
    if (match) {
      return match[1];
    }
    return dateStr;
  }
};

const ChartVideo = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-video`);
        const data = response.data;

        // Filter duplicates based on start and end times and process the data for the bar chart
        const uniqueEntries = new Set();
        const dayWiseData = {};

        data.forEach((entry) => {
          const formattedStartTime = formatDate(entry.video_start_date_time);
          const formattedEndTime = formatDate(entry.video_end_date_time);
          const key = JSON.stringify({
            video_start_date_time: formattedStartTime,
            video_end_date_time: formattedEndTime,
            duration: entry.duration,
          });

          if (!uniqueEntries.has(key)) {
            uniqueEntries.add(key);

            const day = moment(formattedStartTime, 'DD/MM/YYYY, hh:mm:ss A').format('YYYY-MM-DD');
            if (!dayWiseData[day]) {
              dayWiseData[day] = {
                totaltime: 0,
                latestEndTime: formattedEndTime,
              };
            }
            dayWiseData[day].totaltime += entry.duration;

            if (new Date(formattedEndTime) > new Date(dayWiseData[day].latestEndTime)) {
              dayWiseData[day].latestEndTime = formattedEndTime;
            }
          }
        });

        const sortedDays = Object.keys(dayWiseData).sort((a, b) => new Date(a) - new Date(b));
        const last7Days = sortedDays.slice(-7);
        const totalTimes = last7Days.map((day) => dayWiseData[day].totaltime);

        const dayLabels = last7Days.map((day) => moment(day).format('dddd'));
        console.log('Labels:', dayLabels);

        // Generate different colors for each bar
        const generateRandomColor = () => {
          const letters = '0123456789ABCDEF';
          let color = '#';
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        };

        const backgroundColors = dayLabels.map(() => generateRandomColor());

        setChartData({
          labels: dayLabels,
          datasets: [
            {
              label: 'Total Time (seconds)',
              data: totalTimes,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors,
              borderWidth: 1,
              barThickness: 67.5, // Set the bar width here
            },
          ],
        });
      } catch (error) {
        setError('Failed to fetch video data');
      }
    };

    fetchVideoData();
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
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Video Usage Time by Day (Last 7 Days)',
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
                    ticks: {
                      maxRotation: 0, // Rotate labels to 90 degrees
                      minRotation: 0, // Rotate labels to 90 degrees
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

export default ChartVideo;
