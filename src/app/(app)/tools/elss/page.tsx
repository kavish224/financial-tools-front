"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import dynamic from "next/dynamic";
import { ChartData, Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Link from "next/link";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Dynamic import for PieChart from react-chartjs-2
const PieChart = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), { ssr: false });

export default function ELSSCalculator() {
    // State variables
    const [selectedTab, setSelectedTab] = useState<"oneTime" | "monthly">("oneTime");
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
    const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(25000); // One-time investment
    const [timePeriod, setTimePeriod] = useState<number>(10); // in years
    const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12); // in percentage

    // Calculations for One-Time and Monthly Investment
    const investedAmount: number = selectedTab === "monthly"
        ? Array.from({ length: timePeriod }).reduce<number>(
            (total: number, _, year: number) => {
                const yearlyInvestment = monthlyInvestment * 12;
                return total + yearlyInvestment;
            },
            0
        )
        : oneTimeInvestment;

    const futureValue: number = selectedTab === "monthly"
        ? Array.from({ length: timePeriod }).reduce<number>(
            (total: number, _, year: number) => {
                const yearlyInvestment = monthlyInvestment * 12;
                const compoundedAmount = yearlyInvestment * Math.pow(1 + expectedReturnRate / 100, timePeriod - year);
                return total + compoundedAmount;
            },
            0
        )
        : oneTimeInvestment * Math.pow(1 + expectedReturnRate / 100, timePeriod);

    const returns: number = futureValue - investedAmount;

    // Pie chart data
    const pieData: ChartData<"pie", number[], string> = {
        labels: ["Invested Amount", "Returns"],
        datasets: [
            {
                data: [investedAmount, returns],
                backgroundColor: ["#4F46E5", "#F87171"], // Blue and Pink
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#121212]">
            <Navbar />
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    <Link href="/" className="hover:underline">Home </Link> &gt;
                    <Link href="/tools" className="hover:underline">Tools </Link> &gt; ELSS Calculator
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">ELSS Calculator</h1>

                {/* Tab Navigation */}
                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={() => setSelectedTab("oneTime")}
                        className={`px-4 py-2 rounded-md ${selectedTab === "oneTime" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-700"}`}
                    >
                        One-Time Investment
                    </button>
                    <button
                        onClick={() => setSelectedTab("monthly")}
                        className={`px-4 py-2 rounded-md ${selectedTab === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-700"}`}
                    >
                        Monthly Investment
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="space-y-6">
                        <div>
                            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {selectedTab === "oneTime" ? "One-Time Investment" : "Monthly Investment"}
                            </label>
                            <input
                                type="range"
                                min="1000"
                                max="100000"
                                step="1000"
                                value={selectedTab === "oneTime" ? oneTimeInvestment : monthlyInvestment}
                                onChange={(e) => selectedTab === "oneTime" ? setOneTimeInvestment(Number(e.target.value)) : setMonthlyInvestment(Number(e.target.value))}
                                className="w-full"
                            />
                            <p className="text-gray-700 dark:text-gray-300 mt-2">₹ {selectedTab === "oneTime" ? oneTimeInvestment : monthlyInvestment}</p>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Time Period (Years)</label>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(Number(e.target.value))}
                                className="w-full"
                            />
                            <p className="text-gray-700 dark:text-gray-300 mt-2">{timePeriod} Years</p>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Return Rate (%)</label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.1"
                                value={expectedReturnRate}
                                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                                className="w-full"
                            />
                            <p className="text-gray-700 dark:text-gray-300 mt-2">{expectedReturnRate}%</p>
                        </div>

                        <div className="mt-6 space-y-4 text-center bg-green-100 dark:bg-green-900 p-4 rounded-md w-full flex flex-col items-start">
                            <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Results:</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Invested Amount: ₹ {investedAmount.toFixed(2)}</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Returns: ₹ {returns.toFixed(2)}</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Total Amount: ₹ {(investedAmount + returns).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-sm aspect-w-1 aspect-h-1">
                        <PieChart data={pieData} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
