// components/MarketDashboard.tsx
import React from 'react';
import SectorCard from './SectorsCard';
// types.ts
interface SectorData {
    name: string;
    value: number;
    change: number;
    isPositive: boolean;
    chartData: number[]; 
}


const mockData: SectorData[] = [
    { name: 'NIFTY 50', value: 24996.20, change: -0.06, isPositive: false, chartData: [25000, 24980, 24990, 24970, 24960] },
    { name: 'USD/INR', value: 84.00, change: 0.03, isPositive: true, chartData: [83.90, 83.95, 84.00, 83.98, 84.05] },
    { name: 'Gold', value: 7397.13, change: 0.79, isPositive: true, chartData: [7300, 7320, 7350, 7380, 7397] },
    { name: 'Gold', value: 7397.13, change: 0.79, isPositive: true, chartData: [7300, 7320, 7350, 7380, 7397] },
    { name: 'Gold', value: 7397.13, change: 0.79, isPositive: true, chartData: [7300, 7320, 7350, 7380, 7397] },
    { name: 'Gold', value: 7397.13, change: 0.79, isPositive: true, chartData: [7300, 7320, 7350, 7380, 7397] },
    // Add other sectors
  ];

const MarketDashboard: React.FC = () => {
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Market and Sectors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockData.map((data, i) => (
                    <SectorCard key={i} data={data} />
                ))}
            </div>
        </div>
    );
};

export default MarketDashboard;
