import React from 'react';

interface BarChartProps {
  data: { completed: number; ongoing: number };
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <div>
      <div className="bg-green-400 w-full" style={{ height: `${(data.completed / (data.completed + data.ongoing)) * 100}%` }} />
      <div className="bg-yellow-400 w-full" style={{ height: `${(data.ongoing / (data.completed + data.ongoing)) * 100}%` }} />
    </div>
  );
};

export default BarChart;
