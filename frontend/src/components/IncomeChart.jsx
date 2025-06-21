import React from 'react';
import './incomechart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DailyIncomeLineChart = ({ income }) => {
  const validIncome = Array.isArray(income) ? income : [];

  const data = {
    labels: validIncome.map((i) =>
      new Date(i.date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      })
    ),
    datasets: [
      {
        label: 'Daily Income',
        data: validIncome.map((i) => i.amount),
        borderColor: 'rgb(255, 17, 207)', 
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgb(152, 0, 104)');
          gradient.addColorStop(1, 'rgb(120, 2, 2)');
          return gradient;
        },
        fill: true,
        tension: 0.4, // Smooth curve
        pointBackgroundColor: '#ffffff',
        pointBorderColor: 'black',
        pointHoverBackgroundColor: 'rgb(170, 5, 123)', // Green accent from original
        pointHoverBorderColor: 'pink',
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
        borderWidth: 3,
      },
    ],
  };
const now = new Date();
const monthYear = now.toLocaleDateString('en-US', {
  month: 'long',  
  year: 'numeric',
});

console.log(monthYear);  

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Daily Income Trend – ${monthYear}`,
        font: {
          size: 22,
          weight: '',
          family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        },
        color: 'rgb(70, 0, 57)',
        padding: {
          top: 12,
          bottom: 18,
        },
      },
      legend: {
        display: false, // Hidden for clean look
      },
      tooltip: {
        backgroundColor: 'rgba(88, 61, 87, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 10,
        padding: 12,
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const income = validIncome[index];
            return `${income.categoryName}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          },
          color: '#1a202c',
        },
        ticks: {
          font: { size: 12 },
          color: '#4a5568',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display:true,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          },
          color: '#1a202c',
        },
        ticks: {
          font: { size: 12 },
          color: '#4a5568',
          callback: (value) => `$${value}`,
        },
        grid: {
          color: 'rgba(255, 7, 106, 0.49)',
          drawBorder: false,
          lineWidth: 1,
        },
      },
    },
    animation: {
      duration: 500,
      easing: 'easeOutCubic',
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      animationDuration: 400,
    },
  };

  return (
    <div
    className='chart-container-income'
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default DailyIncomeLineChart;