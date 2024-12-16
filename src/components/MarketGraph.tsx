// components/MarketGraph.tsx

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MarketGraphProps {
  labels: string[];
  data: number[];
  isDarkMode: boolean;
}

const MarketGraph: React.FC<MarketGraphProps> = ({ labels, data, isDarkMode }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Market Data",
        data: data,
        borderColor: isDarkMode ? "#ffffff" : "#000000", // Line color
        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)", // Translucent fill color
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: isDarkMode ? "#ffffff" : "#000000", // Legend text color
        },
      },
      tooltip: {
        titleColor: isDarkMode ? "#ffffff" : "#000000",
        bodyColor: isDarkMode ? "#ffffff" : "#000000",
        backgroundColor: isDarkMode ? "#374151" : "#ffffff", // Tooltip background color
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? "#374151" : "#e0e0e0", // Gridline color
        },
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000", // Tick color
        },
        title: {
          display: false,
          text: "Time",
          color: isDarkMode ? "#ffffff" : "#000000", // Axis label color
        },
      },
      y: {
        grid: {
          color: isDarkMode ? "#374151" : "#e0e0e0", // Gridline color
        },
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000", // Tick color
        },
        title: {
          display: false,
          text: "Value",
          color: isDarkMode ? "#ffffff" : "#000000", // Axis label color
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default MarketGraph;
