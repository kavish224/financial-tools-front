"use client";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { 
    ArrowUpDown, 
    ArrowUp, 
    ArrowDown, 
    Search, 
    Loader2, 
    AlertCircle,
    RefreshCw 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Stock {
    readonly symbol: string;
    readonly companyName: string;
    readonly industry: string;
}

type SortKey = keyof Stock;
type SortOrder = "asc" | "desc";

interface SortConfig {
    key: SortKey | null;
    order: SortOrder;
}

interface ApiResponse {
    data: Stock[];
    success: boolean;
    message?: string;
}

interface ErrorState {
    hasError: boolean;
    message: string;
    type: 'network' | 'auth' | 'server' | 'unknown';
}

const ITEMS_PER_PAGE = 50;

const LoadingSpinner = memo(() => (
    <div 
        className="flex justify-center items-center h-64"
        role="status"
        aria-label="Loading stocks data"
    >
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
        <span className="ml-2 text-muted-foreground">Loading stocks...</span>
    </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const ErrorDisplay = memo<{ 
    error: ErrorState; 
    onRetry: () => void; 
}>(({ error, onRetry }) => (
    <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
            <span>{error.message}</span>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="ml-2"
            >
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
            </Button>
        </AlertDescription>
    </Alert>
));

ErrorDisplay.displayName = "ErrorDisplay";

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

function NiftyStocksPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ErrorState>({
        hasError: false,
        message: '',
        type: 'unknown'
    });
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        order: "asc"
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleError = useCallback((err: unknown): ErrorState => {
        console.error("Stock data fetch error:", err);
        
        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError;
            
            if (axiosError.response?.status === 401) {
                return {
                    hasError: true,
                    message: "Authentication failed. Please log in again.",
                    type: 'auth'
                };
            }

            if (axiosError.response && axiosError.response.status >= 500) {
                return {
                    hasError: true,
                    message: "Server error occurred. Please try again later.",
                    type: 'server'
                };
            }
            
            if (axiosError.code === 'NETWORK_ERROR') {
                return {
                    hasError: true,
                    message: "Network connection failed. Please check your internet connection.",
                    type: 'network'
                };
            }
        }
        
        return {
            hasError: true,
            message: "Failed to load stock data. Please try again.",
            type: 'unknown'
        };
    }, []);

    const fetchStocks = useCallback(async () => {
        setIsLoading(true);
        setError({ hasError: false, message: '', type: 'unknown' });
        
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) {
                throw new Error("User not authenticated");
            }
            
            const token = await user.getIdToken();
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            
            if (!apiUrl) {
                throw new Error("Backend URL not configured");
            }
            
            const response = await axios.get<ApiResponse>(
                `${apiUrl}/data/n-50`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );
            
            if (response.data?.data && Array.isArray(response.data.data)) {
                setStocks(response.data.data);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (err) {
            setError(handleError(err));
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    useEffect(() => {
        fetchStocks();
    }, [fetchStocks]);

    const handleSort = useCallback((key: SortKey) => {
        setSortConfig(prevConfig => ({
            key,
            order: prevConfig.key === key && prevConfig.order === "asc" ? "desc" : "asc"
        }));
        setCurrentPage(1);
    }, []);

    const filteredAndSortedStocks = useMemo(() => {
        let filtered = stocks;
        
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = stocks.filter(stock =>
                stock.symbol.toLowerCase().includes(searchLower) ||
                stock.companyName.toLowerCase().includes(searchLower) ||
                stock.industry.toLowerCase().includes(searchLower)
            );
        }
        
        if (sortConfig.key) {
            filtered = [...filtered].sort((a, b) => {
                const valueA = a[sortConfig.key!].toUpperCase();
                const valueB = b[sortConfig.key!].toUpperCase();
                
                const comparison = valueA.localeCompare(valueB);
                return sortConfig.order === "asc" ? comparison : -comparison;
            });
        }
        
        return filtered;
    }, [stocks, searchTerm, sortConfig]);

    const paginatedStocks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedStocks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedStocks, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedStocks.length / ITEMS_PER_PAGE);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen">
                    <LoadingSpinner />
                </div>
                <Footer />
            </>
        );
    }

    if (error.hasError) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center p-4">
                    <ErrorDisplay error={error} onRetry={fetchStocks} />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
                <header className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
                        Nifty 200 Stocks
                    </h1>
                    <p className="text-muted-foreground">
                        Complete list of Nifty 200 stocks with company details
                    </p>
                </header>

                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search stocks, companies, or industries..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10"
                            aria-label="Search stocks"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Showing {paginatedStocks.length} of {filteredAndSortedStocks.length} stocks
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <Table className="min-w-full">
                        <TableCaption className="text-sm text-muted-foreground mt-4">
                            {searchTerm 
                                ? `Search results for "${searchTerm}" in Nifty 200 stocks`
                                : "Complete list of Nifty 200 stocks with company information"
                            }
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">S.No.</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("symbol")}
                                        className="p-0 h-auto font-semibold hover:bg-transparent"
                                        aria-label="Sort by symbol"
                                    >
                                        Symbol
                                        <SortIcon field="symbol" currentSort={sortConfig} />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("companyName")}
                                        className="p-0 h-auto font-semibold hover:bg-transparent"
                                        aria-label="Sort by company name"
                                    >
                                        Company Name
                                        <SortIcon field="companyName" currentSort={sortConfig} />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort("industry")}
                                        className="p-0 h-auto font-semibold hover:bg-transparent"
                                        aria-label="Sort by industry"
                                    >
                                        Industry
                                        <SortIcon field="industry" currentSort={sortConfig} />
                                    </Button>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStocks.map((stock, index) => {
                                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                                return (
                                    <TableRow key={stock.symbol} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            {globalIndex}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {stock.symbol}
                                        </TableCell>
                                        <TableCell>{stock.companyName}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                                                {stock.industry}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum)}
                                        aria-label={`Page ${pageNum}`}
                                        aria-current={currentPage === pageNum ? "page" : undefined}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default memo(NiftyStocksPage);