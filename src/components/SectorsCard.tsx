// components/SectorCard.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
export interface SectorData {
  name: string;
  value: number;
  change: number;
  isPositive: boolean;
  chartData: number[];  // Array of numbers for sparkline chart data
}

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip);

interface SectorCardProps {
  data: SectorData;
}

const SectorCard: React.FC<SectorCardProps> = ({ data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderColor: data.isPositive ? '#22c55e' : '#ef4444', // Green for positive, red for negative
        borderWidth: 2,
      },
      point: {
        radius: 0,
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      tooltip: { enabled: false },
    },
  };

  const chartData = {
    labels: data.chartData.map((_, i) => i.toString()), // Labels are just indexes
    datasets: [
      {
        data: data.chartData,
      },
    ],
  };

  return (
    <div className="flex flex-col items-start p-4 border border-gray-200 rounded-md shadow-sm">
      <h3 className="text-sm font-semibold text-[#000]">{data.name}</h3>
      {/* Sparkline chart */}
      <div className="my-2 h-8 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-bold">{data.value.toFixed(2)}</span>
        <span className={`text-sm ${data.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {data.isPositive ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default SectorCard;
