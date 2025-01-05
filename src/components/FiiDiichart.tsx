import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartOptions,
} from "chart.js";
import React from "react";
import { useTheme } from "next-themes";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

type FIIDIIActivityChartProps = {
  fiiData: number;
  diiData: number;
};

const FIIDIIActivityChart: React.FC<FIIDIIActivityChartProps> = ({ fiiData, diiData }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const data = {
    labels: ["FII CM", "DII CM"],
    datasets: [
      {
        data: [fiiData, diiData],
        backgroundColor: [
          fiiData >= 0 ? "rgba(60, 176, 164, 1)" : "rgba(250, 100, 100, 1)",
          diiData >= 0 ? "rgba(60, 176, 164, 1)" : "rgba(250, 100, 100, 1)",
        ],
        borderColor: isDarkMode ? "#ffffff" : "#000000",
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${value >= 0 ? "+" : ""}${value.toFixed(2)} crore`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      y: {
        ticks: {
          font: { weight: "bold" },
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
    },
  };

  return (
    <div className={`p-4 rounded shadow-md w-64 ${isDarkMode ? "bg-[#1c1d1f]" : "bg-[#fff]"}`}>
      <h3 className="font-bold text-lg">FII/DII Activity</h3>
      <p className="text-sm mb-4">Wed, 28 August 2024</p>
      <div className="flex items-center justify-between mb-2">
        <span>Net Buy/Sell</span>
        <span className="text-sm">(₹ in crores)</span>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default FIIDIIActivityChart;
