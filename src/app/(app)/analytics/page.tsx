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

function Page() {
    const cards = [
        {
            title: "Nifty 50 stocks",
            btn: "All Nifty 50 stocks",
            path: "/analytics/n-50"
        },
        {
            title: "Simple Moving Average 50",
            btn: "All stocks near Simple Moving Average 50",
            path: "/analytics/sma/50"
        },
        {
            title: "Simple Moving Average 200",
            btn: "All stocks near Simple Moving Average 200",
            path: "/analytics/sma/200"
        }
    ]
    return (
        <div>
            <Navbar />
            <div className="min-h-screen">
                <div className="flex flex-col ">
                    {
                        cards.map((k, index)=>(
                            <Card className="w-full max-w-sm m-4" key={index}>
                                <CardHeader>
                                    <CardTitle>{k.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                </CardContent>
                                <CardFooter className="flex-col gap-2">
                                    <Link href={k.path}>
                                        <Button type="submit" className="w-full">
                                        <p>{k.btn}</p>
                                    </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Page;

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
