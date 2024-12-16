"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function GoalPlannerCalculator() {
    // State variables
    const [financialGoal, setFinancialGoal] = useState<number>(1000000); // Present value of the goal
    const [existingInvestment, setExistingInvestment] = useState<number>(0);
    const [yearsToGoal, setYearsToGoal] = useState<number>(8);
    const [inflationRate, setInflationRate] = useState<number>(7);
    const [expectedReturn, setExpectedReturn] = useState<number>(8);

    // Calculations
    const futureValueOfGoal = financialGoal * Math.pow(1 + inflationRate / 100, yearsToGoal);
    const futureValueOfInvestment = existingInvestment * Math.pow(1 + expectedReturn / 100, yearsToGoal);

    const requiredMonthlyInvestment = (() => {
        const rate = expectedReturn / 100 / 12; // Monthly rate
        const periods = yearsToGoal * 12; // Total months
        const presentValue = 0;
        const futureValue = futureValueOfGoal - futureValueOfInvestment;

        // Using PMT formula: PMT = [FV * r] / [(1 + r)^n - 1]
        if (futureValue <= 0 || rate === 0) return 0;
        return (futureValue * rate) / (Math.pow(1 + rate, periods) - 1);
    })();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#121212]">
            <Navbar />
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    <a href="/">Home</a> &gt; <a href="/tools">Tools</a> &gt; Goal Planner
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">Goal Planning Calculator</h1>

                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* Financial Goal */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Financial Goal in Today's Value
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={financialGoal}
                                    onChange={(e) => setFinancialGoal(Number(e.target.value))}
                                    className="w-full p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                />
                            </div>

                            {/* Existing Investment */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Existing Investment for the Financial Goal
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={existingInvestment}
                                    onChange={(e) => setExistingInvestment(Number(e.target.value))}
                                    className="w-full p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                />
                            </div>

                            {/* Number of Years */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Number of Years to Achieve Financial Goal
                                </label>
                                <div className="flex gap-4 items-center ">
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={yearsToGoal}
                                        onChange={(e) => setYearsToGoal(Number(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{yearsToGoal} Years</p>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={yearsToGoal}
                                        onChange={(e) => setYearsToGoal(Number(e.target.value))}
                                        className="w-16 p-2 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Inflation Rate */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Expected Inflation
                                </label>
                                <div className="flex gap-4 items-center pb-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="15"
                                        step="0.1"
                                        value={inflationRate}
                                        onChange={(e) => setInflationRate(Number(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{inflationRate}%</p>
                                    <input
                                        type="number"
                                        min="0"
                                        max="15"
                                        step="0.1"
                                        value={inflationRate}
                                        onChange={(e) => setInflationRate(Number(e.target.value))}
                                        className="w-16 p-2 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>

                            {/* Expected Return */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Expected Return from Investments
                                </label>
                                <div className="flex gap-4 items-center pb-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        step="0.1"
                                        value={expectedReturn}
                                        onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{expectedReturn}%</p>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        step="0.1"
                                        value={expectedReturn}
                                        onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                        className="w-16 p-2 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="mt-6 space-y-4 text-center bg-green-100 dark:bg-green-900 p-4 rounded-md w-full flex flex-col items-start">
                            <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Results:</p>

                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                Future Value of Your Financial Goal: ₹ {futureValueOfGoal.toFixed(2)}
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                Future Value of Existing Investment: ₹ {futureValueOfInvestment.toFixed(2)}
                            </p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                Monthly Investment Needed: ₹ {requiredMonthlyInvestment.toFixed(2)}
                            </p>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
