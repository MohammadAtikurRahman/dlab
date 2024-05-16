import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ChartVideo = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get('http://172.104.191.159:4300/get-video');
        const data = response.data;

        // Filter duplicates and process the data for the bar chart
        const uniqueEntries = new Set();
        const dayWiseData = {};

        data.forEach(entry => {
          const key = JSON.stringify({
            video_start_date_time: entry.video_start_date_time,
            video_end_date_time: entry.video_end_date_time,
            duration: entry.duration,
          });

          if (!uniqueEntries.has(key)) {
            uniqueEntries.add(key);

            if (entry.dayid && !dayWiseData[entry.dayid]) {
              dayWiseData[entry.dayid] = {
                totaltime: 0,
                latestEndTime: entry.video_end_date_time,
              };
            }
            if (entry.dayid) {
              dayWiseData[entry.dayid].totaltime += entry.duration;

              if (new Date(entry.video_end_date_time) > new Date(dayWiseData[entry.dayid].latestEndTime)) {
                dayWiseData[entry.dayid].latestEndTime = entry.video_end_date_time;
              }
            }
          }
        });

        const labels = Object.keys(dayWiseData);
        const totalTimes = labels.map(label => dayWiseData[label].totaltime);
        const latestEndTimes = labels.map(label => new Date(dayWiseData[label].latestEndTime).toLocaleTimeString());

        // Generate different colors for each bar
        const generateRandomColor = () => {
          const letters = '0123456789ABCDEF';
          let color = '#';
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        };

        const backgroundColors = labels.map(() => generateRandomColor());

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Time (seconds)',
              data: totalTimes,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors,
              borderWidth: 1,
              barThickness: 20, // Set the bar width here

            },
          ],
        });
      } catch (error) {
        setError('Failed to fetch video data');
      }
    };

    fetchVideoData();
  }, []);

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
                    text: 'Video Usage Time by Day',
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
                      beginAtZero: true,
                      stepSize: 100,
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
