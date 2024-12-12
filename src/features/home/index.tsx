"use client";

import { useHistoricalDataQuery } from "@/api/fetchHistoricalData";
import { ResultType } from "@/models";
import { SimpleBacktesting } from "@/script/backtesting";
import { LineChart } from "@novee/orderly-charts";
import { useMemo, useState } from "react";

export const Home = () => {
  const [results, setResults] = useState<ResultType>({} as ResultType);
  const [isLoading, setIsLoading] = useState(false);
  const { data: historicalData } = useHistoricalDataQuery(
    "?period=1h&asset=Bitcoin&from=1666562400000&to=1690000000000"
  );

  const runTest = async () => {
    setIsLoading(true);
    try {
      const tester = new SimpleBacktesting(10_000);

      const data = historicalData?.data;
      if (data?.price_history) {
        const priceHistory = data.price_history.map(
          ([date, price]: [number, number]) => ({
            date: date,
            price: Number(price),
          })
        );
        console.log("proce", priceHistory);
        const testResults = tester.runStrategy(priceHistory);
        setResults(testResults);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("results", results);

  const resultBox = useMemo(() => {
    return [
      {
        title: "Initial Capital",
        value: results.initialCapital,
        color: "text-white",
      },
      {
        title: "Final Capital",
        value: results.finalCapital,
        color: "text-white",
      },
      {
        title: "PnL %",
        value: results.performance,
        color:
          results.finalCapital - results.initialCapital > 0
            ? "text-green-500"
            : !results.initialCapital
            ? "text-white"
            : "text-red-500",
      },
      {
        title: "PnL $",
        value: results.finalCapital - results.initialCapital,
        color:
          results.finalCapital - results.initialCapital > 0
            ? "text-green-500"
            : !results.initialCapital
            ? "text-white"
            : "text-red-500",
      },
    ];
  }, [results]);

  return (
    <div className="h-screen w-screen bg-[#101015] pt-[100px]">
      <div className="max-w-5xl mx-auto w-[90%]">
        <h1 className="text-3xl text-white font-bold mb-7">Backtesting tool</h1>
        <div className="flex items-center justify-between gap-5 mb-5">
          {resultBox?.map(({ title, value, color }) => (
            <div key={title} className="bg-[#1B1D22] rounded-md p-5 w-1/4">
              <p className="text-xl font-medium text-slate-300 ">{title}</p>
              <p className={`text-4xl font-bold ${color} mt-5`}>
                {value ? value.toFixed(2) : 0} {title === "PnL %" ? "%" : "$"}
              </p>
            </div>
          ))}
        </div>
        <div className="relative bg-[#1B1D22] p-5 rounded-md">
          {isLoading ? (
            <div className="absolute left-0 top-0 h-[300px] blur-md w-full flex items-center justify-center">
              Loading...
            </div>
          ) : null}
          <LineChart
            data={results?.trades?.map((trade) => ({
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
        </div>

        <button
          className=" bg-[#836EF9] py-2 rounded-md mt-10 w-fit px-3 font-medium"
          onClick={runTest}
          disabled={isLoading}
        >
          {isLoading ? "Excution..." : "Start Backtesting"}
        </button>
      </div>
    </div>
  );
};
