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

export default function SWPCalculator() {
    // State variables
    const [lumpSumInvestment, setLumpSumInvestment] = useState<number>(100000);
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(1000);
    const [timePeriod, setTimePeriod] = useState<number>(12); // in months
    const [expectedReturnRate, setExpectedReturnRate] = useState<number>(10); // Annual return %

    // Calculations
    const monthlyReturnRate = expectedReturnRate / 100 / 12; // Convert annual to monthly
    let remainingBalance = lumpSumInvestment;
    let totalWithdrawn = 0;

    const monthlyData: { balance: number; interest: number; withdrawal: number }[] = [];

    for (let month = 1; month <= timePeriod && remainingBalance > 0; month++) {
        const interest = remainingBalance * monthlyReturnRate;
        const balanceAfterInterest = remainingBalance + interest;
        const withdrawal = Math.min(monthlyWithdrawal, balanceAfterInterest);
        remainingBalance = balanceAfterInterest - withdrawal;

        totalWithdrawn += withdrawal;
        monthlyData.push({
            balance: remainingBalance,
            interest: interest,
            withdrawal: withdrawal,
        });
    }

    const pieData: ChartData<"pie", number[], string> = {
        labels: ["Total Withdrawn", "Remaining Balance"],
        datasets: [
            {
                data: [totalWithdrawn, remainingBalance],
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
                    <Link href="/tools" className="hover:underline">Tools </Link> &gt;SWP
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">SWP Calculator</h1>

                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* Lump Sum Investment */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Lump Sum Investment</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000000"
                                    step="1000"
                                    value={lumpSumInvestment}
                                    onChange={(e) => setLumpSumInvestment(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">₹ {lumpSumInvestment}</p>
                                    <input
                                        type="number"
                                        value={lumpSumInvestment}
                                        onChange={(e) => setLumpSumInvestment(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Monthly Withdrawal */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Withdrawal</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50000"
                                    step="500"
                                    value={monthlyWithdrawal}
                                    onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">₹ {monthlyWithdrawal}</p>
                                    <input
                                        type="number"
                                        value={monthlyWithdrawal}
                                        onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Time Period */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Time Period</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="360"
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{timePeriod} Months</p>
                                    <input
                                        type="number"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Expected Return Rate */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Return Rate (Annual)</label>
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
                                <p className="font-medium text-gray-800 dark:text-gray-200">Total Withdrawn: ₹ {totalWithdrawn.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Remaining Balance: ₹ {remainingBalance.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Total Investment: ₹ {lumpSumInvestment}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
