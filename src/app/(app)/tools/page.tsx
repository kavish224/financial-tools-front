"use client"
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function ToolsPage() {
    const router = useRouter();
    const tools = [
        { title: "SIP", description: "Systematic Investment Plan calculator.", path: "/tools/sip" },
        { title: "SWP", description: "Systematic Withdrawal Plan calculator.", path: "/tools/swp" },
        { title: "Goal Planning", description: "Plan your financial goals effectively.", path: "/tools/goal-planning" },
        { title: "FIRE", description: "Financial Independence, Retire Early calculator.", path: "/tools/fire" },
        { title: "Retirement Plan", description: "Plan for a secure retirement.", path: "/tools/retirement-plan" },
        { title: "Lumpsum Calculator", description: "Calculate returns for a lumpsum investment.", path: "/tools/lumpsum-calc" },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mb-4 pl-8 pt-8">
                <h2 className="text-lg font-semibold"><a href="/">Home</a> &gt; Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {tools.map((tool, index) => (
                    <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex dark:bg-[#1c1d1f]">
                        {/* Image Section */}
                        <img
                            src="https://cdnlearnblog.etmoney.com/wp-content/uploads/2023/04/benefits-of-sip-Featured.jpg" // Replace with the actual image URL
                            alt={tool.title}
                            className="w-1/3 h-auto object-cover rounded-l-md pb-4 pt-4 pl-4"
                        />

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
                                    <Button>
                                        Calculate
                                    </Button>
                                </Link>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>
            <Footer />
        </div>
    );
}
