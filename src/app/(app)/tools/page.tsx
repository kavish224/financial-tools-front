"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Tool {
    title: string;
    description: string;
    path: string;
    image: string;
}

const tools: Tool[] = [
    {
        title: "SIP",
        description: "Systematic Investment Plan calculator.",
        path: "/tools/sip",
        image: "/images/tools/sip.jpg",
    },
    {
        title: "SWP",
        description: "Systematic Withdrawal Plan calculator.",
        path: "/tools/swp",
        image: "/images/tools/swp.jpg",
    },
    {
        title: "Goal Planning",
        description: "Plan your financial goals effectively.",
        path: "/tools/goal-planning",
        image: "/images/tools/goal.jpg",
    },
    {
        title: "FIRE",
        description: "Financial Independence, Retire Early calculator.",
        path: "/tools/fire",
        image: "/images/tools/fire.jpg",
    },
    {
        title: "Retirement Plan",
        description: "Plan for a secure retirement.",
        path: "/tools/retirement-plan",
        image: "/images/tools/retire.jpg",
    },
    {
        title: "Lumpsum Calculator",
        description: "Calculate returns for a lumpsum investment.",
        path: "/tools/lumpsum-calc",
        image: "/images/tools/lumpsum.jpg",
    },
    {
        title: "EMI",
        description: "Equated Monthly Installment calculator.",
        path: "/tools/emi",
        image: "/images/tools/emi.jpeg",
    },
    {
        title: "CAGR",
        description: "Compound Annual Growth Rate calculator.",
        path: "/tools/cagr",
        image: "/images/tools/cagr.jpg",
    },
    {
        title: "ELSS",
        description: "Equity Linked Savings Scheme calculator.",
        path: "/tools/elss",
        image: "/images/tools/elss.jpg",
    },
];

export default function ToolsPage() {
    return (
        <div>
            <Navbar />
            <main className="min-h-screen">
                <section className="mb-2 pl-8 pt-4">
                    <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        <Link href="/" className="hover:underline">Home </Link> &gt; Tools
                    </h2>
                </section>
                <div className="px-8 mb-8">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-6">
                            Financial Calculators & Tools
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Comprehensive suite of financial planning tools to help you make informed investment decisions and achieve your financial goals.
                        </p>
                    </div>
                </div>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {tools.map((tool, index) => (
                        <Card
                            key={index}
                            className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex dark:bg-[#1c1d1f]"
                        >
                            <div className="relative w-1/3 aspect-square rounded-l-md overflow-hidden">
                                <Image
                                    src={tool.image}
                                    alt={tool.title}
                                    fill
                                    className="object-cover rounded-l-md"
                                />
                            </div>
                            <div className="flex flex-col justify-between w-2/3 p-6">
                                <CardHeader className="p-0">
                                    <CardTitle className="font-semibold">{tool.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 mt-2">
                                    <CardDescription className="text-sm dark:text-slate-100">
                                        {tool.description}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className="p-0 mt-4">
                                    <Link href={tool.path}>
                                        <Button>Calculate</Button>
                                    </Link>
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </section>
            </main>
            <Footer />
        </div>
    );
}
