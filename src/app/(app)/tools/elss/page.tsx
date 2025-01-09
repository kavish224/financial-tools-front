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

export default function InvestmentCalculator() {
    // State variables
    const [selectedTab, setSelectedTab] = useState<"oneTime" | "monthly">("oneTime");
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
    const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(10000); // One-time investment
    const [timePeriod, setTimePeriod] = useState<number>(5); // in years
    const [annualStepUp, setAnnualStepUp] = useState<number>(10); // in percentage
    const [expectedReturnRate, setExpectedReturnRate] = useState<number>(15); // in percentage

    // Calculations for One-Time and Monthly Investment
    const investedAmount: number = selectedTab === "monthly"
        ? Array.from({ length: timePeriod }).reduce<number>(
            (total: number, _, year: number) => {
                const yearlyInvestment = monthlyInvestment * 12 * Math.pow(1 + annualStepUp / 100, year);
                return total + yearlyInvestment;
            },
            0
        )
        : oneTimeInvestment;

    const futureValue: number = selectedTab === "monthly"
        ? Array.from({ length: timePeriod }).reduce<number>(
            (total: number, _, year: number) => {
                const yearlyInvestment = monthlyInvestment * 12 * Math.pow(1 + annualStepUp / 100, year);
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
                    <Link href="/tools" className="hover:underline">Tools </Link> &gt; Investment Calculator
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">Investment Calculator</h1>

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
                    {selectedTab === "oneTime" && (
                        <div className="space-y-6">
                            {/* One-Time Investment Section */}
                            <div className="bg-white p-6 shadow-md rounded-lg dark:bg-[#1c1d1f]">
                                <h3 className="text-xl font-semibold mb-4">One-Time Investment</h3>
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">One-Time Investment</label>
                                    <input
                                        type="number"
                                        value={oneTimeInvestment}
                                        onChange={(e) => setOneTimeInvestment(Number(e.target.value))}
                                        className="w-full p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Output for One-Time Investment */}
                            <div className="mt-6 space-y-4 text-center bg-green-100 dark:bg-green-900 p-4 rounded-md w-full flex flex-col items-start">
                                <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Results:</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Invested Amount: ₹ {investedAmount.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Returns: ₹ {returns.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Total Amount: ₹ {(investedAmount + returns).toFixed(2)}</p>
                            </div>
                        </div>
                    )}

                    {selectedTab === "monthly" && (
                        <div className="space-y-6">
                            {/* Monthly Investment Section */}
                            <div className="bg-white p-6 shadow-md rounded-lg dark:bg-[#1c1d1f]">
                                <h3 className="text-xl font-semibold mb-4">Monthly Investment</h3>
                                <div>
                                    <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Investment</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000"
                                        step="500"
                                        value={monthlyInvestment}
                                        onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">₹ {monthlyInvestment}</p>
                                        <input
                                            type="number"
                                            value={monthlyInvestment}
                                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                            className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Output for Monthly Investment */}
                            <div className="mt-6 space-y-4 text-center bg-green-100 dark:bg-green-900 p-4 rounded-md w-full flex flex-col items-start">
                                <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Results:</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Invested Amount: ₹ {investedAmount.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Returns: ₹ {returns.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Total Amount: ₹ {(investedAmount + returns).toFixed(2)}</p>
                            </div>
                        </div>
                    )}
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
