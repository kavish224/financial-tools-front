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

export default function ToolsPage() {
    const tools = [
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
            title: "Lumpsum Calculator",
            description: "Calculate returns for a lumpsum investment.",
            path: "/tools/lumpsum-calc",
            image: "/images/tools/lumpsum.jpg",
        },
        {
            title: "Lumpsum Calculator",
            description: "Calculate returns for a lumpsum investment.",
            path: "/tools/lumpsum-calc",
            image: "/images/tools/lumpsum.jpg",
        },
        {
            title: "Lumpsum Calculator",
            description: "Calculate returns for a lumpsum investment.",
            path: "/tools/lumpsum-calc",
            image: "/images/tools/lumpsum.jpg",
        },
    ];

    return (
        <div >
            <Navbar />
            <div className="min-h-screen">
            <div className="mb-4 pl-8 pt-8">
                <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    <Link href="/" className="hover:underline">Home </Link> &gt; Tools
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {tools.map((tool, index) => (
                    <Card
                        key={index}
                        className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex dark:bg-[#1c1d1f]"
                    >
                        {/* Image Section */}
                        <div className="relative w-1/3 h-auto rounded-l-md pb-4 pt-4 pl-4">
                            <Image
                                src={tool.image}
                                alt={tool.title}
                                fill
                                className="object-cover rounded-l-md"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col justify-between w-2/3 p-8">
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
            </div>
            </div>
            <Footer />
        </div>
    );
}
