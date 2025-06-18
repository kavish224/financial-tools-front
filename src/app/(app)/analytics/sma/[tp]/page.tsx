"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Loader2, Search, ArrowDown, ArrowUp, AlertCircle, RefreshCw, ArrowUpDown } from "lucide-react";
import { getAuth } from "firebase/auth";

interface SMA {
    symbol: string;
    close_price: string;
    sma_value: string;
    deviation_pct: string;
}

interface ErrorState {
    message: string;
    type: 'network' | 'auth' | 'server' | 'unknown';
}

const PROXIMITY_THRESHOLD = 0.25;
const DEBOUNCE_DELAY = 300;

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

type SortKey = keyof SMA | "";
type SortOrder = "asc" | "desc";

interface SortConfig {
    key: SortKey | null;
    order: SortOrder;
}

const SortIcon = memo<{
    field: SortKey;
    currentSort: SortConfig;
}>(({ field, currentSort }) => {
    if (currentSort.key !== field) {
        return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    }
    return currentSort.order === "asc"
        ? <ArrowUp className="inline w-4 h-4 ml-1" />
        : <ArrowDown className="inline w-4 h-4 ml-1" />;
});

SortIcon.displayName = "SortIcon";
function Page() {
    const [sma, setSma] = useState<SMA[]>([]);
    const [filtered, setFiltered] = useState<SMA[]>([]);
    const [loading, setLoading] = useState(true);
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        order: "asc"
    });
    const [sortAsc, setSortAsc] = useState(true);
    const [error, setError] = useState<ErrorState | null>(null);
    const [, setRetryCount] = useState(0);

    const { tp } = useParams();
    const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

    const isValidTimeframe = useMemo(() => {
        if (!tp) return false;
        const timeframe = Array.isArray(tp) ? tp[0] : tp;
        const num = parseInt(timeframe, 10);
        return !isNaN(num) && num > 0 && num <= 500;
    }, [tp]);

    const timeframe = useMemo(() => {
        return Array.isArray(tp) ? tp[0] : tp;
    }, [tp]);

    const handleError = useCallback((err: unknown, context: string) => {
        console.error(`Error in ${context}:`, err);

        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError;
            if (axiosError.response?.status === 401) {
                setError({
                    message: "Authentication failed. Please log in again.",
                    type: 'auth'
                });
            } else if (axiosError.response && axiosError.response?.status >= 500) {
                setError({
                    message: "Server error. Please try again later.",
                    type: 'server'
                });
            } else if (axiosError.code === 'NETWORK_ERROR') {
                setError({
                    message: "Network error. Please check your connection.",
                    type: 'network'
                });
            } else {
                setError({
                    message: (typeof axiosError.response?.data === "object" && axiosError.response?.data && "message" in axiosError.response.data)
                        ? ((axiosError.response.data as { message?: string }).message ?? "An error occurred while fetching data.")
                        : "An error occurred while fetching data.",
                    type: 'unknown'
                });
            }
        } else {
            setError({
                message: "An unexpected error occurred.",
                type: 'unknown'
            });
        }
    }, []);

    const fetchDates = useCallback(async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User not authenticated");
            }

            const token = await user.getIdToken();
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/sma/dates`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );

            let dates: string[];

            if (response.data?.data) {
                dates = response.data.data;
            } else if (Array.isArray(response.data)) {
                dates = response.data;
            } else {
                throw new Error("Invalid dates response format");
            }

            const cleanedDates = dates
                .map((date: string) => {
                    const parsedDate = new Date(date);
                    return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString().split("T")[0];
                })
                .filter((date): date is string => date !== null)
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

            if (cleanedDates.length === 0) {
                throw new Error("No valid dates found");
            }

            console.log("Cleaned dates:", cleanedDates);

            setDates(cleanedDates);
            setSelectedDate(cleanedDates[0]);
            setError(null);
        } catch (err) {
            console.error("Error in fetchDates:", err);
            handleError(err, "fetchDates");
        }
    }, [handleError]);

    const fetchSMAData = useCallback(async (date: string, timeframe: string) => {
        if (!date || !timeframe) return;

        setLoading(true);
        setError(null);

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User not authenticated");
            }

            const token = await user.getIdToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/sma/by-date`,
                { tp: timeframe, date },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000
                }
            );

            let data: SMA[];
            
            if (response.data?.data) {
                data = response.data.data;
            } else if (Array.isArray(response.data)) {
                data = response.data;
            } else {
                throw new Error("Invalid response format");
            }

            console.log("Extracted data:", data);

            if (!Array.isArray(data)) {
                throw new Error("Data is not an array");
            }

            const validatedData = data.filter((item) => {
                const isValid = (
                    item &&
                    typeof item === 'object' &&
                    item.symbol &&
                    item.close_price !== undefined &&
                    item.sma_value !== undefined &&
                    item.deviation_pct !== undefined
                );

                if (!isValid) {
                    console.log("Invalid item:", item);
                }

                return isValid;
            });

            setSma(validatedData);
            setFiltered(validatedData);
            setRetryCount(0);
        } catch (err) {
            console.error("Error in fetchSMAData:", err);
            handleError(err, "fetchSMAData");
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && isValidTimeframe) {
            fetchDates();
        }
    }, [mounted, isValidTimeframe, fetchDates]);

    useEffect(() => {
        if (selectedDate && isValidTimeframe) {
            fetchSMAData(selectedDate, timeframe as string);
        }
    }, [selectedDate, timeframe, isValidTimeframe, fetchSMAData]);

    useEffect(() => {
        let data = [...sma];

        if (debouncedSearch.trim()) {
            const searchTerm = debouncedSearch.toLowerCase().trim();
            data = data.filter(item =>
                item.symbol.toLowerCase().includes(searchTerm)
            );
        }

        if (sortConfig.key) {
            data.sort((a, b) => {
                if (sortConfig.key === "symbol") {
                    const result = a.symbol.localeCompare(b.symbol, undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                    return sortConfig.order === "asc" ? result : -result;
                }
                const field = sortConfig.key as keyof SMA;
                const valA = Number(a[field]);
                const valB = Number(b[field]);

                if (isNaN(valA) && isNaN(valB)) return 0;
                if (isNaN(valA)) return sortConfig.order === "asc" ? 1 : -1;
                if (isNaN(valB)) return sortConfig.order === "asc" ? -1 : 1;

                return sortConfig.order === "asc" ? valA - valB : valB - valA;
            });
        }

        setFiltered(data);
    }, [debouncedSearch, sortConfig, sortAsc, sma]);

    const toggleSort = useCallback((field: keyof SMA) => {
        setSortConfig(prev => ({
            key: field,
            order: prev.key === field && prev.order === "asc" ? "desc" : "asc"
        }));
    }, []);

    const handleRetry = useCallback(() => {
        setRetryCount(prev => prev + 1);
        if (selectedDate && isValidTimeframe) {
            fetchSMAData(selectedDate, timeframe as string);
        } else {
            fetchDates();
        }
    }, [selectedDate, isValidTimeframe, timeframe, fetchSMAData, fetchDates]);

    const formatDate = useCallback((dateStr: string) => {
        try {
            return new Intl.DateTimeFormat("en-IN", {
                year: "numeric",
                month: "short",
                day: "2-digit"
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    }, []);

    const formatNumber = useCallback((value: string, decimals: number = 2) => {
        const num = Number(value);
        if (isNaN(num)) return value;
        return num.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }, []);

    if (!mounted) {
        return null;
    }

    if (!isValidTimeframe) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
                    <Alert className="max-w-md mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Invalid timeframe parameter. Please provide a valid number between 1 and 500.
                        </AlertDescription>
                    </Alert>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
                    Stocks Near {timeframe}-Day SMA
                </h1>

                {error && (
                    <Alert className="mb-6 max-w-2xl mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>{error.message}</span>
                            <button
                                onClick={handleRetry}
                                className="ml-4 flex items-center gap-1 text-sm underline hover:no-underline"
                                disabled={loading}
                            >
                                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                                Retry
                            </button>
                        </AlertDescription>
                    </Alert>
                )}

                {dates.length > 0 && (
                    <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="sma-date"
                                className="font-medium text-sm"
                            >
                                Select Date:
                            </label>
                            <Select
                                value={selectedDate}
                                onValueChange={setSelectedDate}
                                disabled={loading}
                            >
                                <SelectTrigger
                                    className="w-[200px]"
                                    id="sma-date"
                                    aria-label="Select date for SMA data"
                                >
                                    <SelectValue placeholder="Select a date" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dates.map((date) => (
                                        <SelectItem key={date} value={date}>
                                            {formatDate(date)}
                                        </SelectItem>
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
                                disabled={loading}
                                aria-label="Search stocks by symbol"
                            />
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
                        <p className="text-sm text-gray-500">Loading SMA data...</p>
                        <p className="text-xs text-gray-400">Data count: {sma.length}, Filtered: {filtered.length}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <Table className="min-w-full">
                            <TableCaption className="text-sm text-muted-foreground mt-4">
                                {filtered.length > 0 ? (
                                    <>
                                        Showing {filtered.length} stock{filtered.length !== 1 ? 's' : ''} near their {timeframe}-day SMA for {formatDate(selectedDate)}
                                        {debouncedSearch && ` (filtered by "${debouncedSearch}")`}
                                    </>
                                ) : (
                                    <>
                                        {debouncedSearch ?
                                            `No stocks found matching "${debouncedSearch}"` :
                                            `No data available for ${formatDate(selectedDate)}`
                                        }
                                    </>
                                )}
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px]">No.</TableHead>
                                    <TableHead
                                        onClick={() => toggleSort("symbol")}
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                toggleSort("symbol");
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            Symbol
                                            <SortIcon field="symbol" currentSort={sortConfig} />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick={() => toggleSort("close_price")}
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                toggleSort("close_price");
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            Close Price (₹)
                                            <SortIcon field="close_price" currentSort={sortConfig} />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick={() => toggleSort("sma_value")}
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                toggleSort("sma_value");
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            SMA {timeframe} (₹)
                                            <SortIcon field="sma_value" currentSort={sortConfig} />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        onClick={() => toggleSort("deviation_pct")}
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                toggleSort("deviation_pct");
                                            }
                                        }}
                                    >
                                        <div className="flex items-center justify-end gap-1">
                                            Proximity %
                                            <SortIcon field="deviation_pct" currentSort={sortConfig} />
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            {debouncedSearch ?
                                                "No stocks match your search criteria." :
                                                "No data available for the selected date."
                                            }
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((item, index) => {
                                        const deviation = Number(item.deviation_pct);
                                        const nearSMA = Math.abs(deviation) <= PROXIMITY_THRESHOLD;

                                        return (
                                            <TableRow
                                                key={`${item.symbol}-${index}`}
                                            >
                                                <TableCell className="font-medium">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.symbol}
                                                </TableCell>
                                                <TableCell>
                                                    ₹{formatNumber(item.close_price)}
                                                </TableCell>
                                                <TableCell>
                                                    ₹{formatNumber(item.sma_value)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span>
                                                        {formatNumber(item.deviation_pct)}%
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
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