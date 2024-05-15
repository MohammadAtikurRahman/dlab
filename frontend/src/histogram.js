import React from 'react';
import { Bar, Line, Pie, Radar, PolarArea, Doughnut } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  RadarController,
  PolarAreaController,
  RadialLinearScale
} from 'chart.js';
import './histogram.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  RadarController,
  PolarAreaController,
  RadialLinearScale
);

const Histogram = () => {
  const barData = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'pc',
        data: [12, 19, 3, 5],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'video',
        data: [3, 10, 5, 2],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const radarData = {
    labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [20, 10, 4, 2],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75,192,192,1)'
      }
    ]
  };

  const polarData = {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          '#FF6384',
          '#4BC0C0',
          '#FFCE56',
          '#E7E9ED',
          '#36A2EB'
        ]
      }
    ]
  };

  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [200, 150, 50],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6 mb-3">
          <div className="box">
            <Bar data={barData} />
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="box">
            <Line data={lineData} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-4 mb-3">
          <div className="box">
            <Pie data={pieData} />
          </div>
        </div>
        <div className="col-4 mb-3">
          <div className="box">
            <Radar data={radarData} />
          </div>
        </div>
        <div className="col-4 mb-3">
          <div className="box">
            <PolarArea data={polarData} />
          </div>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-12 mb-3">
          <div className="box">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Histogram;
