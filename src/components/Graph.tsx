import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MarketGraph from "./MarketGraph"

interface MarketData {
    labels: string[];
    data: number[];
}

const marketData: Record<string, MarketData> = {
    nifty: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], data: [100, 120, 110, 140, 130, 150, 160] },
    bnifty: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], data: [90, 110, 100, 130, 120, 140, 150] },
    sensex: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], data: [80, 100, 90, 120, 110, 130, 140] },
};

export const Graph = () => {
    return (
        <div className="dark:bg-[#1c1d1f] h-60 rounded-md">
            <Tabs defaultValue="bnifty" className="bg-[#fff] dark:bg-[#1c1d1f] rounded-md p-2">
                <TabsList>
                    <TabsTrigger value="nifty">Nifty</TabsTrigger>
                    <TabsTrigger value="bnifty">Bank Nifty</TabsTrigger>
                    <TabsTrigger value="sensex">Sensex</TabsTrigger>
                </TabsList>
                {Object.keys(marketData).map((key) => (
                    <TabsContent key={key} value={key} className="h-full p-2">
                        <MarketGraph labels={marketData[key].labels} data={marketData[key].data} isDarkMode={false}/>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
