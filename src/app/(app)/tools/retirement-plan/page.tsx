"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function RetirementCalculator() {
    const [age, setAge] = useState<number>(25);
    const [monthlyExpense, setMonthlyExpense] = useState<number>(25000);
    const [retirementType, setRetirementType] = useState<string>("LIKE A KING");
    const [savingsType, setSavingsType] = useState<string>("SAFE");

    const lifeExpectancy = 80; // Default assumption
    const retirementAge = 60; // Retirement starts at 60
    const yearsToSave = retirementAge - age;
    const yearsPostRetirement = lifeExpectancy - retirementAge;

    const inflationRate = 6 / 100; // Default inflation rate
    const safeReturnRate = 6 / 100; // Return rate for safe savings
    const aggressiveReturnRate = 10 / 100;

    const monthlyExpensesAtRetirement = monthlyExpense * Math.pow(1 + inflationRate, yearsToSave);
    const annualExpensesAtRetirement = monthlyExpensesAtRetirement * 12;

    // Corpus calculation (Present Value of future expenses for post-retirement life)
    const retirementCorpus = annualExpensesAtRetirement * ((1 - Math.pow(1 + safeReturnRate, -yearsPostRetirement)) / safeReturnRate);

    // Monthly savings required
    const returnRate = savingsType === "SAFE" ? safeReturnRate : aggressiveReturnRate;

    const monthlyReturnRate = returnRate / 12; // Monthly return rate
    const totalMonths = yearsToSave * 12; // Total saving months

    const monthlySavingsRequired =
        (retirementCorpus * monthlyReturnRate) /
        (Math.pow(1 + monthlyReturnRate, totalMonths) - 1);


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#121212]">
            <Navbar />
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    <Link href="/" className="hover:underline">Home </Link> &gt;
                    <Link href="/tools" className="hover:underline">Tools </Link> &gt; Retirement
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold mt-4">Retirement Calculator</h1>

                <div className="mt-6 bg-white shadow-md rounded-lg p-6 dark:bg-[#1c1d1f]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            {/* Current Age */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">How old are you?</label>
                                <input
                                    type="range"
                                    min="20"
                                    max="50"
                                    step="1"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{age} Years</p>
                            </div>

                            {/* Monthly Expense */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">How much do you spend per month?</label>
                                <input
                                    type="range"
                                    min="10000"
                                    max="100000"
                                    step="1000"
                                    value={monthlyExpense}
                                    onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">₹ {monthlyExpense}</p>
                            </div>

                            {/* Retirement Lifestyle */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">What kind of retirement do you want?</label>
                                <select
                                    value={retirementType}
                                    onChange={(e) => setRetirementType(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                >
                                    <option value="LIKE A KING">LIKE A KING</option>
                                    <option value="I AM HAPPY THE WAY I AM">I AM HAPPY THE WAY I AM</option>
                                    <option value="LIKE A MONK">LIKE A MONK</option>
                                </select>
                            </div>

                            {/* Savings Style */}
                            <div>
                                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Where are you saving for your retirement?</label>
                                <select
                                    value={savingsType}
                                    onChange={(e) => setSavingsType(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                >
                                    <option value="SAFE">SAFE (PF, FD, ETC)</option>
                                    <option value="AGGRESSIVE">AGGRESSIVE (MUTUAL FUNDS, EQUITY, ETC)</option>
                                </select>
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
                            <p className="font-medium text-gray-800 dark:text-gray-200 mb-4">Results:</p>
                            <div className="space-y-4">
                                <p className="text-lg text-gray-800 dark:text-gray-200">
                                    <span className="font-medium">Amount required for retirement:</span> <br />
                                    ₹ {retirementCorpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                                <p className="text-lg text-gray-800 dark:text-gray-200">
                                    <span className="font-medium">How much do you need to save per month to retire?</span> <br />
                                    ₹ {monthlySavingsRequired.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
