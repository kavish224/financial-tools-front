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
} from "@/components/ui/table"
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getAuth } from "firebase/auth";

interface sma {
    symbol: string,
    close: string,
    sma: string,
    proximity_pct: string
}
function Page() {
    const [sma, setSma] = useState<sma[]>([]);
    const [loading, setLoading] = useState(true);
    const {tp} = useParams();
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const token = await user?.getIdToken();
                const data = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/data/sma`,{tp},{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                setSma(data.data);
            } catch (error) {
                console.error("error", error);
            } finally {
                setLoading(false);
            }
        }
        fetchdata();
    }, []);

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
                    Stocks Near {tp}-Day SMA
                </h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                ) :(
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableCaption className="text-sm text-gray-500 mt-2">
                            Stocks near their {tp}-day Simple Moving Average.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">No.</TableHead>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Closing Price</TableHead>
                                <TableHead>SMA {tp}</TableHead>
                                <TableHead className="text-right">Proximity %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sma.map((d, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{d.symbol}</TableCell>
                                    <TableCell>{d.close}</TableCell>
                                    <TableCell>{d.sma}</TableCell>
                                    <TableCell className="text-right">{d.proximity_pct}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Page;
