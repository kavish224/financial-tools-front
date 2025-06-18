"use client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { memo, useMemo } from "react";
import { TrendingUp, BarChart3, Activity } from "lucide-react";


interface DashboardCard {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly buttonText: string;
    readonly path: string;
    readonly icon: React.ComponentType<{ className?: string }>;
}

const DASHBOARD_CARDS: readonly DashboardCard[] = [
    {
        id: "nifty-200",
        title: "Nifty 200 Stocks",
        description: "Browse and analyze all Nifty 200 listed stocks with detailed information.",
        buttonText: "View All Nifty 200 Stocks",
        path: "/analytics/n-50",
        icon: TrendingUp,
    },
    {
        id: "sma-50",
        title: "Simple Moving Average 50",
        description: "Track stocks near their 50-day Simple Moving Average for potential trading opportunities.",
        buttonText: "Analyze SMA 50 Crossings",
        path: "/analytics/sma/50",
        icon: BarChart3,
    },
    {
        id: "sma-200",
        title: "Simple Moving Average 200",
        description: "Monitor stocks near their 200-day Simple Moving Average for long-term trend analysis.",
        buttonText: "Analyze SMA 200 Crossings",
        path: "/analytics/sma/200",
        icon: Activity,
    },
] as const;

const DashboardCard = memo<{ card: DashboardCard }>(({ card }) => {
    const Icon = card.icon;

    return (
        <Card
            className="w-full max-w-sm m-4 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl"
            role="article"
            aria-labelledby={`card-title-${card.id}`}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                    {/* <Icon className="h-6 w-6 text-primary" aria-hidden="true" /> */}
                    <CardTitle
                        id={`card-title-${card.id}`}
                        className="text-lg font-semibold"
                    >
                        {card.title}
                    </CardTitle>
                </div>
            </CardHeader>
            {/* <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
                </p>
            </CardContent> */}
            <CardFooter>
                <Link
                    href={card.path}
                    className="w-full"
                    aria-label={`Navigate to ${card.title} analysis`}
                >
                    <Button
                        type="button"
                        className="w-full"
                        variant="default"
                    >
                        {card.buttonText}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
});

DashboardCard.displayName = "DashboardCard";

function Page() {
    const renderedCards = useMemo(
        () => DASHBOARD_CARDS.map((card) => (
            <DashboardCard key={card.id} card={card} />
        )),
        []);
    return (
        <div>
            <Navbar />
            <main className="flex flex-col min-h-screen">
                <section aria-label="Analytics tools" className="flex-1 flex py-4 px-4">
                    <div>
                        {renderedCards}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
export default Page;

// Define the stock data type
// interface Stockgolden {
//     stock_name: string;
//     price: number;
//     sma50: number;
//     sma200: number;
//     symbol: string; // Ensure there is a unique identifier
// }
// interface Stock50sma {
//     stock_name: string;
//     price: number;
//     sma50: number;
//     crossing: string;
//     symbol: string; // Ensure there is a unique identifier
// }
// const [stocksgolden] = useState<Stockgolden[]>([]);
// const [stocks50sma] = useState<Stock50sma[]>([]);

// useEffect(() => {
//     const fetchGoldenCross = async () => {
//         try {
//             const response = await axios.get("http://127.0.0.1:5001/v1/golden-cross");
//             setStocksgolden(response.data);
//         } catch (error) {
//             console.error("Error fetching stock data:", error);
//         }
//     };
//     const fetch50sma = async () => {
//         try {
//             const response = await axios.get("http://127.0.0.1:5001/v1/sma_crossings");
//             setStocks50sma(response.data);
//         } catch (error) {
//             console.error("Error fetching stock data:", error);
//         }
//     };
//     fetchGoldenCross();
//     fetch50sma();
// }, []);

// return (
//     <div>
//         <Navbar />
//         <div className="flex-grow flex justify-center min-h-screen">
//             <div>
//                 <div>Golden Cross</div>
//                 <Table>
//                     <TableCaption>Stocks with SMA Crossings</TableCaption>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Stock Name</TableHead>
//                             <TableHead>Closing Price</TableHead>
//                             <TableHead>SMA 50</TableHead>
//                             <TableHead>SMA 200</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {stocksgolden.map((stock) => (
//                             <TableRow key={stock.symbol}> {/* Use `symbol` as the key */}
//                                 <TableCell className="font-medium">{stock.stock_name}</TableCell>
//                                 <TableCell>{stock.price}</TableCell>
//                                 <TableCell>{stock.sma50}</TableCell>
//                                 <TableCell>{stock.sma200}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>
//             <div>
//                 <div>50 SMA</div>
//                 <Table>
//                     <TableCaption>Stocks with SMA Crossings</TableCaption>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Stock Name</TableHead>
//                             <TableHead>Closing Price</TableHead>
//                             <TableHead>SMA 50</TableHead>
//                             <TableHead>Crossing</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {stocks50sma.map((stock) => (
//                             <TableRow key={stock.symbol}> {/* Use `symbol` as the key */}
//                                 <TableCell className="font-medium">{stock.stock_name}</TableCell>
//                                 <TableCell>{stock.price}</TableCell>
//                                 <TableCell>{stock.sma50}</TableCell>
//                                 <TableCell>{stock.crossing}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>
//         </div>
//         <Footer />
//     </div>
// );
