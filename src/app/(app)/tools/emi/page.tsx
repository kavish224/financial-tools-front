"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChartData, Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Dynamic import for PieChart from react-chartjs-2
const PieChart = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), { ssr: false });

export default function EMICalculator() {
    // State variables
    const [loanAmount, setLoanAmount] = useState<number>(1000000);
    const [interestRate, setInterestRate] = useState<number>(6.5); // in percentage
    const [loanTenure, setLoanTenure] = useState<number>(5); // in years

    // EMI Calculation using the formula EMI = [P x R x (1+R)^N] / [(1+R)^(N-1)]
    const monthlyRate = interestRate / (12 * 100); // Monthly interest rate
    const numberOfMonths = loanTenure * 12; // Total months
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    const totalAmount = emi * numberOfMonths;
    const totalInterest = totalAmount - loanAmount;

    // Pie chart data
    const pieData: ChartData<"pie", number[], string> = {
        labels: ["Principal Amount", "Total Interest"],
        datasets: [
            {
                data: [loanAmount, totalInterest],
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
                    <Link href="/tools" className="hover:underline">Tools </Link> &gt; EMI
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">EMI Calculator</h1>

                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* Loan Amount */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Loan Amount</label>
                                <input
                                    type="range"
                                    min="50000"
                                    max="5000000"
                                    step="5000"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">₹ {loanAmount}</p>
                                    <input
                                        type="number"
                                        value={loanAmount}
                                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Interest Rate */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Rate of Interest (p.a)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="0.1"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{interestRate} %</p>
                                    <input
                                        type="number"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(Number(e.target.value))}
                                        className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Loan Tenure */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Loan Tenure</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={loanTenure}
                                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{loanTenure} Years</p>
                                    <input
                                        type="number"
                                        value={loanTenure}
                                        onChange={(e) => setLoanTenure(Number(e.target.value))}
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
                                <p className="font-medium text-gray-800 dark:text-gray-200">Monthly EMI: ₹ {emi.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Principal Amount: ₹ {loanAmount}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Total Interest: ₹ {totalInterest.toFixed(2)}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">Total Amount: ₹ {totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
