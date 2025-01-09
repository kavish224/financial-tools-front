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

export default function CAGRCalculator() {
    // State variables
    const [initialInvestment, setInitialInvestment] = useState<number>(1000);
    const [maturityValue, setMaturityValue] = useState<number>(10000);
    const [duration, setDuration] = useState<number>(5); // in years

    // Corrected CAGR Calculation
    const calculateCAGR = (initial: number, maturity: number, years: number) => {
        return ((Math.pow(maturity / initial, 1 / years) - 1) * 100).toFixed(2);
    };

    // Calculate CAGR based on inputs
    const CAGR = calculateCAGR(initialInvestment, maturityValue, duration);

    // Pie chart data
    const pieData: ChartData<"pie", number[], string> = {
        labels: ["Initial Investment", "Final Value"],
        datasets: [
            {
                data: [initialInvestment, maturityValue],
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
                    <Link href="/tools" className="hover:underline">Tools </Link> &gt; CAGR
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">CAGR Calculator</h1>

                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* Initial Investment */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Initial Investment</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000000"
                                    step="5000"
                                    value={initialInvestment}
                                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">₹ {initialInvestment}</p>
                                    <input
                                        type="number"
                                        value={initialInvestment}
                                        onChange={(e) => setInitialInvestment(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Maturity Value */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Maturity Value</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000000"
                                    step="5000"
                                    value={maturityValue}
                                    onChange={(e) => setMaturityValue(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">₹ {maturityValue}</p>
                                    <input
                                        type="number"
                                        value={maturityValue}
                                        onChange={(e) => setMaturityValue(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Duration of Investment</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{duration} Years</p>
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
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
                                <p className="font-medium text-gray-800 dark:text-gray-200">CAGR: {CAGR}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
