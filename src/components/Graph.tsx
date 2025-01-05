import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketGraph from "./MarketGraph";
import { useTheme } from "next-themes";

const marketData = {
  nifty: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], data: [100, 120, 110, 140, 130, 150, 160] },
  bnifty: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], data: [90, 110, 100, 130, 120, 140, 150] },
  sensex: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], data: [80, 100, 90, 120, 110, 130, 140] },
};

type MarketDataKey = keyof typeof marketData;

export const Graph: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className={`h-60 rounded-md ${isDarkMode ? "bg-[#1c1d1f]" : "bg-[#fff]"}`}>
      <Tabs defaultValue="bnifty" className="rounded-md p-2">
        <TabsList>
          <TabsTrigger value="nifty">Nifty</TabsTrigger>
          <TabsTrigger value="bnifty">Bank Nifty</TabsTrigger>
          <TabsTrigger value="sensex">Sensex</TabsTrigger>
        </TabsList>
        {Object.keys(marketData).map((key) => {
          const marketKey = key as MarketDataKey; // Explicitly cast key to a known type
          return (
            <TabsContent key={marketKey} value={marketKey} className="h-full p-2">
              <MarketGraph
                labels={marketData[marketKey].labels}
                data={marketData[marketKey].data}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
