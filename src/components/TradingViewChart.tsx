import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

function TradingViewChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current!, {
      width: chartContainerRef.current!.clientWidth,
      height: 400,
    });
    const lineSeries = chart.addLineSeries();
    lineSeries.setData([
      { time: "2023-10-01", value: 120 },
      { time: "2023-10-02", value: 121 },
      { time: "2023-10-03", value: 122 },
      // Add more data points
    ]);

    return () => chart.remove();
  }, []);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />;
}

export default TradingViewChart;
