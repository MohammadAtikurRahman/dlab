import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';

const ChartVideo = () => {
  const [chartData, setChartData] = useState({labels: [], datasets: []});
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/chart-video`);
        const data = response.data.aggregatedData;
        console.log("response", response)

        // Group data by day and accumulate total duration
        const dayWiseData = {};

        data.forEach((entry) => {
          const day = moment(entry.video_start_date_time).format('YYYY-MM-DD');
          if (!dayWiseData[day]) {
            dayWiseData[day] = entry.duration;
          } else {
            dayWiseData[day] += entry.duration;
          }
        });

        const sortedDays = Object.keys(dayWiseData).sort((a, b) => new Date(a) - new Date(b));
        const totalTimes = sortedDays.map((day) => dayWiseData[day]);

        const dayLabels = sortedDays.map((day) => moment(day).format('dddd'));

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
    <div style={{padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
      {error ? (
        <p style={{color: 'red', textAlign: 'center'}}>{error}</p>
      ) : (
        <div style={{width: '100%', height: '500px'}}>
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
                      maxRotation: 0,
                      minRotation: 0,
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
            <p style={{textAlign: 'center', color: '#666'}}>Loading data...</p>
          )}
        </div>
      )}
    </div>
  );
};
export default ChartVideo;

