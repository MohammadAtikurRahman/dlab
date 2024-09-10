import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import 'moment-timezone';

const ChartPc = () => {
  const [chartData, setChartData] = useState({labels: [], datasets: []});
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchPCData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/chart-pc`);
        const data = response.data.result;
        console.log("response", response)

        // Aggregate total time for each day across all schools, considering BDT timezone
        const finalData = data.reduce((acc, entry) => {
          const day = moment(entry.starttime).tz('Asia/Dhaka').format('YYYY-MM-DD');
          acc[day] = (acc[day] || 0) + entry.totaltime;
          return acc;
        }, {});

        console.log("Aggregated Data:", finalData);

        // Prepare data for the chart
        const sortedDays = Object.keys(finalData).sort((a, b) => new Date(a) - new Date(b));
        const totalTimes = sortedDays.map(day => finalData[day]);
        const dayLabels = sortedDays.map(day => moment(day).tz('Asia/Dhaka').format('dddd')); // Get day names

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
        setError(error.message);
      }
    };

    fetchPCData();
  }, [baseUrl]);

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
            <p style={{textAlign: 'center', color: '#666'}}>Loading data...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartPc;
