"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Search, ArrowDown, ArrowUp } from "lucide-react";
import { getAuth } from "firebase/auth";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SMA {
    symbol: string;
    close_price: string;
    sma_value: string;
    deviation_pct: string;
}

function Page() {
    const [sma, setSma] = useState<SMA[]>([]);
    const [filtered, setFiltered] = useState<SMA[]>([]);
    const [loading, setLoading] = useState(true);
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof SMA | "">("");
    const [sortAsc, setSortAsc] = useState(true);
    const { tp } = useParams();

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const token = await user?.getIdToken();
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/sma/dates`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const cleaned = res.data.map((d: string) => new Date(d).toISOString().split("T")[0]);
                setDates(cleaned);
                setSelectedDate(cleaned[0]);
            } catch (err) {
                console.error("Failed to fetch dates", err);
            }
        };
        fetchDates();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDate) return;
            setLoading(true);
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const token = await user?.getIdToken();

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/sma/by-date`,
                    { tp, date: selectedDate },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const withMockHistory = res.data.map((d: SMA) => ({
                    ...d,
                    history: Array.from({ length: 10 }, () => Number(d.sma_value) * (0.95 + Math.random() * 0.1))
                }));

                setSma(withMockHistory);
                setFiltered(withMockHistory);
            } catch (err) {
                console.error("Error fetching SMA", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedDate, tp]);

    useEffect(() => {
        let data = [...sma];
        if (search) {
            data = data.filter(d => d.symbol.toLowerCase().includes(search.toLowerCase()));
        }
        if (sortField) {
            data.sort((a, b) => {
                if (sortField === "symbol") {
                    return sortAsc
                        ? a.symbol.localeCompare(b.symbol)
                        : b.symbol.localeCompare(a.symbol);
                }
                const valA = Number(a[sortField]);
                const valB = Number(b[sortField]);
                return sortAsc ? valA - valB : valB - valA;
            });
        }
        setFiltered(data);
    }, [search, sortField, sortAsc, sma]);

    const toggleSort = (field: keyof SMA) => {
        if (sortField === field) setSortAsc(!sortAsc);
        else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const formatDate = (dateStr: string) => new Intl.DateTimeFormat("en-IN", {
        year: "numeric", month: "short", day: "2-digit"
    }).format(new Date(dateStr));

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
                    Stocks Near {tp}-Day SMA
                </h1>

                {dates.length > 0 && mounted && (
                    <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <div className="flex items-center gap-2">
                            <label htmlFor="sma-date" className="font-medium">Select Date:</label>
                            <Select value={selectedDate} onValueChange={setSelectedDate}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select a date" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dates.map((d) => (
                                        <SelectItem key={d} value={d}>{formatDate(d)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="relative w-[240px]">
                            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by symbol"
                                className="pl-8"
                            />
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableCaption className="text-sm text-gray-500 mt-2">
                                Stocks near their {tp}-day SMA for {formatDate(selectedDate)}
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px]">No.</TableHead>
                                    <TableHead onClick={() => toggleSort("symbol")} className="cursor-pointer">
                                        Symbol {sortField === "symbol" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                    </TableHead>
                                    <TableHead onClick={() => toggleSort("close_price")} className="cursor-pointer">
                                        Closing Price {sortField === "close_price" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                    </TableHead>
                                    <TableHead onClick={() => toggleSort("sma_value")} className="cursor-pointer">
                                        SMA {tp} {sortField === "sma_value" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                    </TableHead>
                                    <TableHead onClick={() => toggleSort("deviation_pct")} className="cursor-pointer text-right">
                                        Proximity % {sortField === "deviation_pct" && (sortAsc ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((d, i) => {
                                    const nearSMA = Math.abs(Number(d.deviation_pct)) <= 0.25;
                                    return (
                                        <TableRow key={i} className={nearSMA ? "bg-green-50 dark:bg-green-900/20" : ""}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{d.symbol}</TableCell>
                                            <TableCell>{d.close_price}</TableCell>
                                            <TableCell>{d.sma_value}</TableCell>
                                            <TableCell className="text-right">{d.deviation_pct}</TableCell>
                                        </TableRow>
                                    );
                                })}
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