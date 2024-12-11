export type TradesType = {
  date: string;
  side: "BUY" | "SELL";
  price: number;
  amount: number;
  capital: number;
};

export type ResultType =
  | {
      trades: TradesType[];
      finalCapital: number;
      performance: number;
      initialCapital: number;
      error: string;
    }
  | {
      trades: TradesType[];
      finalCapital: number;
      performance: number;
      initialCapital: number;
      error?: undefined;
    };
