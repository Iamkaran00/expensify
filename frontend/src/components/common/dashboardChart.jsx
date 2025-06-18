import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './dashboardchart.css';


const formatFullDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

 
const processData = (incomeData, expenseData) => {
  const dateMap = new Map();

  incomeData.forEach(({ date, amount, categoryName }) => {
    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        income: 0,
        expense: 0,
        incomeCategories: [],
        expenseCategories: [],
      });
    }
    const entry = dateMap.get(date);
    entry.income += amount;
    entry.incomeCategories.push(categoryName);
  });

  expenseData.forEach(({ date, amount, categoryName }) => {
    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        income: 0,
        expense: 0,
        incomeCategories: [],
        expenseCategories: [],
      });
    }
    const entry = dateMap.get(date);
    entry.expense += amount;
    entry.expenseCategories.push(categoryName);
  });

  return Array.from(dateMap.values())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      ...item,
      dateLabel: formatFullDate(item.date),
    }));
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div className="tooltip-date">{data.dateLabel}</div>
        {data.income > 0 && (
          <div className="tooltip-item income">
            <div className="tooltip-dot income"></div>
            <div>
              <div className="tooltip-amount">Income: {`$${data.income.toLocaleString()}`}</div>
              <div className="tooltip-categories">{data.incomeCategories.join(', ')}</div>
            </div>
          </div>
        )}
        {data.expense > 0 && (
          <div className="tooltip-item expense">
            <div className="tooltip-dot expense"></div>
            <div>
              <div className="tooltip-amount">Expense: ${data.expense.toLocaleString()}</div>
              <div className="tooltip-categories">{data.expenseCategories.join(', ')}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Custom Legend Component
const CustomLegend = ({ payload }) => {
  return (
    <div className="custom-legend">
      {payload.map((entry, index) => (
        <div key={index} className={`legend-item ${entry.value}`}>
          <div className={`legend-dot ${entry.value}`}></div>
          <span className="legend-text">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const IncomeExpenseLineChart = ({ incomeData = [], expenseData = [] }) => {
  const chartData = processData(incomeData, expenseData);

  return (
    <div className="chart-container">
      <div className="chart-title">
     
      
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#e2e8f0"
            strokeOpacity={0.6}
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="dateLabel"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'rgb(9, 43, 91)', fontWeight: '500' }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'rgb(9, 43, 91)', fontWeight: '500' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(148, 163, 184, 0.1)', strokeWidth: 4 }}
          />

          <Legend content={<CustomLegend />} />

          <Line
            type="monotone"
            dataKey="income"
            stroke="url(#incomeGradient)"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            animationDuration={1500}
            animationEasing="ease-out"
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="url(#expenseGradient)"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            animationDuration={1500}
            animationEasing="ease-out"
            animationDelay={200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseLineChart;