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

export default function SIPCalculator() {
    // State variables
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
    const [timePeriod, setTimePeriod] = useState<number>(5); // in years
    const [annualStepUp, setAnnualStepUp] = useState<number>(10); // in percentage
    const [expectedReturnRate, setExpectedReturnRate] = useState<number>(15); // in percentage

    // Calculations
    const investedAmount: number = Array.from({ length: timePeriod }).reduce<number>(
        (total: number, _, year: number) => {
            const yearlyInvestment = monthlyInvestment * 12 * Math.pow(1 + annualStepUp / 100, year);
            return total + yearlyInvestment;
        },
        0 // Initial value as a number
    );

    const futureValue: number = Array.from({ length: timePeriod }).reduce<number>(
        (total: number, _, year: number) => {
            const yearlyInvestment = monthlyInvestment * 12 * Math.pow(1 + annualStepUp / 100, year);
            const compoundedAmount = yearlyInvestment * Math.pow(1 + expectedReturnRate / 100, timePeriod - year);
            return total + compoundedAmount;
        },
        0 // Initial value as a number
    );

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
                    <Link href="/tools" className="hover:underline">Tools </Link> &gt; SIP
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">SIP Calculator</h1>

                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* Monthly Investment */}
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

                            {/* Time Period */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Time Period</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{timePeriod} Years</p>
                                    <input
                                        type="number"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Annual Step Up */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Annual Step Up</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    step="1"
                                    value={annualStepUp}
                                    onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{annualStepUp} %</p>
                                    <input
                                        type="number"
                                        value={annualStepUp}
                                        onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Expected Return Rate */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Return Rate per Annum</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="0.1"
                                    value={expectedReturnRate}
                                    onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{expectedReturnRate} %</p>
                                    <input
                                        type="number"
                                        value={expectedReturnRate}
                                        onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="flex flex-col items-center">
                            <div className="w-full max-w-sm aspect-w-1 aspect-h-1">
                                <PieChart data={pieData} />
                            </div>
                            <div className="mt-6 space-y-4 text-center bg-green-100 dark:bg-green-900 p-4 rounded-md w-full flex flex-col items-start">
                                <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Results:</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Invested Amount: ₹ {investedAmount.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Returns: ₹ {returns.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Total Amount: ₹ {(investedAmount + returns).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
