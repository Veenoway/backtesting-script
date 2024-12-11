import { TradesType } from "@/models";

type HistoricalDataType = { date: string; price: number };

export class SimpleBacktesting {
  private initialCapital: number;
  private capital: number;
  private position: number;
  private trades: TradesType[];

  constructor(initialCapital = 1000) {
    this.initialCapital = initialCapital;
    this.capital = initialCapital;
    this.position = 0;
    this.trades = [];
  }

  calculatePriceChange = (currentPrice: number, prevPrice: number): number => {
    const sum = ((currentPrice - prevPrice) / prevPrice) * 100;
    return sum;
  };

  runStrategy = (historicalData: HistoricalDataType[]) => {
    for (let i = 1; i < historicalData.length; i++) {
      const today = historicalData[i];
      const yesterday = historicalData[i - 1];

      const priceChange = this.calculatePriceChange(
        today.price,
        yesterday.price
      );

      if (this.position === 0 && priceChange < -0.2) {
        this.position = this.capital / today.price;
        this.capital = 0;

        this.trades.push({
          date: today.date,
          side: "BUY",
          price: today.price,
          amount: this.position,
          capital: this.capital + this.position * today.price,
        });
      } else if (this.position > 0 && priceChange >= 1) {
        this.capital = this.position * today.price;
        this.position = 0;

        this.trades.push({
          date: today.date,
          side: "SELL",
          price: today.price,
          amount: this.position,
          capital: this.capital,
        });
      }
    }

    const lastPrice = historicalData[historicalData.length - 1].price;
    const finalValue = this.capital + this.position * lastPrice;

    if (!this.initialCapital || this.initialCapital === 0) {
      console.error("Capital initial invalide:", this.initialCapital);
      return {
        trades: this.trades,
        finalCapital: finalValue,
        performance: 0,
        initialCapital: this.initialCapital,
        error: "Capital initial invalide",
      };
    }

    const performance =
      ((finalValue - this.initialCapital) / this.initialCapital) * 100;

    return {
      trades: this.trades,
      finalCapital: finalValue,
      performance: performance,
      initialCapital: this.initialCapital,
    };
  };
}
