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
import { useTheme } from "next-themes";

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
}

const MarketGraph: React.FC<MarketGraphProps> = ({ labels, data }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const chartData = {
    labels,
    datasets: [
      {
        label: "Market Data",
        data,
        borderColor: isDarkMode ? "#ffffff" : "#000000",
        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
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
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      tooltip: {
        titleColor: isDarkMode ? "#ffffff" : "#000000",
        bodyColor: isDarkMode ? "#ffffff" : "#000000",
        backgroundColor: isDarkMode ? "#374151" : "#ffffff",
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? "#374151" : "#e0e0e0",
        },
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      y: {
        grid: {
          color: isDarkMode ? "#374151" : "#e0e0e0",
        },
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default MarketGraph;
