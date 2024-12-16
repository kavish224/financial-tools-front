"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LumpsumCalculator() {
    const [principal, setPrincipal] = useState<number>(100000); // Default principal amount
    const [rateOfReturn, setRateOfReturn] = useState<number>(12); // Annual return in %
    const [duration, setDuration] = useState<number>(5); // Investment duration in years
    const [compoundingFrequency, setCompoundingFrequency] = useState<number>(2); // Compounds per year

    // Compound Interest Formula: A = P (1 + r/n) ^ nt
    const calculateLumpsumReturns = () => {
        const r = rateOfReturn / 100; // Convert rate to decimal
        const n = compoundingFrequency; // Compounds per year
        const t = duration; // Duration in years

        const A = principal * Math.pow(1 + r / n, n * t); // Final corpus
        return A;
    };

    const futureValue = calculateLumpsumReturns();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#121212]">
            <Navbar />
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    <a href="/">Home</a> &gt; <a href="/tools">Tools</a> &gt; Lumpsum Calculator
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">Lumpsum Investment Calculator</h1>

                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* Principal Amount */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Principal Amount (₹)</label>
                                <input
                                    type="number"
                                    value={principal}
                                    onChange={(e) => setPrincipal(Number(e.target.value))}
                                    className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                />
                            </div>

                            {/* Rate of Return */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Annual Rate of Return (%)</label>
                                <input
                                    type="range"
                                    min={1}
                                    max={20}
                                    step={0.5}
                                    value={rateOfReturn}
                                    onChange={(e) => setRateOfReturn(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{rateOfReturn}%</p>
                                    <input
                                    type="number"
                                    value={rateOfReturn}
                                    onChange={(e) => setRateOfReturn(Number(e.target.value))}
                                    className="w-24 p-2 mt-1 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded"
                                />
                                </div>
                            </div>

                            {/* Investment Duration */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Duration (Years)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                />
                            </div>

                            {/* Compounding Frequency */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Compounding Frequency (per Year)</label>
                                <select
                                    value={compoundingFrequency}
                                    onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                                    className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                >
                                    <option value={1}>Annually</option>
                                    <option value={2}>Semi-Annually</option>
                                    <option value={4}>Quarterly</option>
                                    <option value={12}>Monthly</option>
                                </select>
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
                            <p className="font-medium text-gray-800 dark:text-gray-200 mb-4">Results:</p>
                            <div className="space-y-4">
                                <p className="text-lg text-gray-800 dark:text-gray-200">
                                    <span className="font-medium">Future Value of Investment:</span> <br />
                                    ₹ {futureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-lg text-gray-800 dark:text-gray-200">
                                    <span className="font-medium">Total Gain:</span> <br />
                                    ₹ {(futureValue - principal).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
