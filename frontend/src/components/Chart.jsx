import React from 'react';
import './expensechart.css';
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

const DailyExpenseLineChart = ({ expenses }) => {
  const validExpenses = Array.isArray(expenses) ? expenses : [];

  const data = {
    labels: validExpenses.map((e) =>
      new Date(e.date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      })
    ),
    datasets: [
      {
        label: 'Daily Expenses',
        data: validExpenses.map((e) => e.amount),
        borderColor: '#e53e3e',  
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(229, 62, 62, 0.3)');
          gradient.addColorStop(1, 'rgba(229, 62, 62, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,  
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#e53e3e',
        pointHoverBackgroundColor: '#68a038',  
        pointHoverBorderColor: '#ffffff',
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



  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Daily Expense - ${monthYear}`,
        font: {
          size:22,
          weight: '',
          family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        },
        color: '#1a202c',
        padding: {
          top: 12,
          bottom: 18,
        },
      },
      legend: {
        display: false,  
      },
      tooltip: {
        backgroundColor: 'rgba(45, 55, 72, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 10,
        padding: 12,
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const expense = validExpenses[index];
            return `${expense.categoryName}: $${context.parsed.y.toFixed(2)}`;
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
          display:false,
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
          color: 'rgba(0, 0, 0, 0.03)',
          drawBorder: false,
          lineWidth: 1,
        },
      },
    },
    animation: {
      duration: 1500,
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
       
  className='chart-container-expense'  > 
      <Line data={data} options={options} />
      </div>
    
  );
};

export default DailyExpenseLineChart;
