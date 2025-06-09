"use client"
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

interface Stock {
    symbol: string;
    companyName: string;
    industry: string;
}

function Page() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const auth = getAuth();
    const user = auth.currentUser;
    useEffect(() => {
        async function fetchData() {
            try {
                const token = await user?.getIdToken();
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/data/n-50`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStocks(res.data);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
                    Nifty 50 Stocks
                </h1>
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableCaption className="text-sm text-gray-500 mt-2">
                            A list of all the Nifty 50 stocks.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">S.No.</TableHead>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Industry</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stocks.map((s, index) => (
                                <TableRow key={s.symbol || index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{s.symbol}</TableCell>
                                    <TableCell>{s.companyName}</TableCell>
                                    <TableCell>{s.industry}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Page;
