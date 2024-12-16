"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import dynamic from "next/dynamic";
import { ChartData, Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Dynamic import for PieChart from react-chartjs-2
const PieChart = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), { ssr: false });

export default function FIRECalculator() {
    // State variables
    const [monthlyExpense, setMonthlyExpense] = useState<number>(50000);
    const [currentAge, setCurrentAge] = useState<number>(25);
    const [retirementAge, setRetirementAge] = useState<number>(40);
    const [inflationRate, setInflationRate] = useState<number>(6); // in percentage
    const [desiredCoastFIREAge, setDesiredCoastFIREAge] = useState<number>(30);

    // Helper calculations
    const yearsToRetirement = retirementAge - currentAge;
    const yearsToCoastFIRE = desiredCoastFIREAge - currentAge;

    const expenseAtRetirement = monthlyExpense * 12 * Math.pow(1 + inflationRate / 100, yearsToRetirement);

    const leanFIRE = expenseAtRetirement * 15; // Lean FIRE (15x annual expense)
    const fatFIRE = expenseAtRetirement * 25; // Fat FIRE (25x annual expense)
    const coastFIRE = (expenseAtRetirement / Math.pow(1 + 8 / 100, yearsToCoastFIRE)) * 15; // Assume 8% return for Coast FIRE

    const totalFIRE = expenseAtRetirement * 20; // Standard FIRE (20x annual expense)

    // Pie chart data
    const pieData: ChartData<"pie", number[], string> = {
        labels: ["Lean FIRE", "FIRE", "Fat FIRE", "Coast FIRE"],
        datasets: [
            {
                data: [leanFIRE, totalFIRE, fatFIRE, coastFIRE],
                backgroundColor: ["#4F46E5", "#F87171", "#34D399", "#FACC15"],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#121212]">
            <Navbar />
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    <a href="/">Home</a> &gt; <a href="/tools">Tools</a> &gt; FIRE
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">FIRE Calculator</h1>

                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* Monthly Expense */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Expense</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="200000"
                                    step="1000"
                                    value={monthlyExpense}
                                    onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">₹ {monthlyExpense}</p>
                                    <input
                                        type="number"
                                        value={monthlyExpense}
                                        onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Current Age */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Current Age</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={currentAge}
                                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{currentAge} Years</p>
                                    <input
                                        type="number"
                                        value={currentAge}
                                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Retirement Age */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Retirement Age</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={retirementAge}
                                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{retirementAge} Years</p>
                                    <input
                                        type="number"
                                        value={retirementAge}
                                        onChange={(e) => setRetirementAge(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Inflation Rate */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Assumed Inflation Rate</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    step="0.1"
                                    value={inflationRate}
                                    onChange={(e) => setInflationRate(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{inflationRate} %</p>
                                    <input
                                        type="number"
                                        value={inflationRate}
                                        onChange={(e) => setInflationRate(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Desired Coast FIRE Age */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Desired Coast FIRE Age</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={desiredCoastFIREAge}
                                    onChange={(e) => setDesiredCoastFIREAge(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{desiredCoastFIREAge} Years</p>
                                    <input
                                        type="number"
                                        value={desiredCoastFIREAge}
                                        onChange={(e) => setDesiredCoastFIREAge(Number(e.target.value))}
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
                            <div className="mt-6 space-y-4 text-center">
                                <p className="font-medium text-gray-800 dark:text-gray-200">Expense at Retirement: ₹ {expenseAtRetirement.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Lean FIRE: ₹ {leanFIRE.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">FIRE: ₹ {totalFIRE.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Fat FIRE: ₹ {fatFIRE.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Coast FIRE: ₹ {coastFIRE.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}