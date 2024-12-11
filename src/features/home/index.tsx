"use client";

import { useHistoricalDataQuery } from "@/api/fetchHistoricalData";
import { ResultType } from "@/models";
import { SimpleBacktesting } from "@/script/backtesting";
import { LineChart } from "@novee/orderly-charts";
import { useState } from "react";

export const Home = () => {
  const [results, setResults] = useState<ResultType>({} as ResultType);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useHistoricalDataQuery(
    "?period=1h&asset=Bitcoin&from=1666562400000&to=1690000000000"
  );

  const runTest = async () => {
    setIsLoading(true);
    const tester = new SimpleBacktesting(10_000);
    if (data?.price_history) {
      const priceHistory = data.price_history.map(
        ([date, price]: [number, number]) => ({
          date: new Date(date).toISOString(),
          price: Number(price),
        })
      );
      const testResults = tester.runStrategy(priceHistory);
      setResults(testResults);
      setIsLoading(false);
    } else setIsLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-slate-900">
      {results?.trades?.length > 0 ? (
        <LineChart
          data={results?.trades.map((trade) => ({
            date: new Date(trade.date).toLocaleDateString(),
            capital: trade.capital,
          }))}
          type="Capital"
          linePositiveColor="rgb(255, 140, 0)"
          lineNegativeColor="rgb(0, 122, 255)"
          fillPositiveColor="rgba(255, 140, 0, 0.2)"
          fillNegativeColor="rgba(0, 122, 255, 0.2)"
          height="300px"
          lineWidth={3}
          lineTension={0.4}
          pointHoverRadius={6}
          pointBorderColor="#FFFFFF"
          pointBorderWidth={2}
          tooltipBackground="rgba(40, 44, 52, 0.95)"
          tooltipBorderColor="#FF8C00"
          tooltipBorderWidth={2}
          tooltipCornerRadius={6}
          tooltipPadding={12}
          gridColor="rgba(255, 140, 0, 0.1)"
          axisColor="#FFF"
          axisFontSize={12}
          enableAnimation={true}
          animationDuration={1000}
          enableNowLabel={true}
          nowLabelText="Now"
        />
      ) : null}
      <button className="w-full mt-4" onClick={runTest} disabled={isLoading}>
        {isLoading ? "Excution..." : "Start Backtesting"}
      </button>
    </div>
  );
};
