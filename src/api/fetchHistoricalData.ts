import { useQuery } from "@tanstack/react-query";

const fetchHistoricalData = async (path: string) => {
  const response = await fetch(
    `https://api.mobula.io/api/1/market/history${path}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const useHistoricalDataQuery = (path: string) => {
  return useQuery({
    queryKey: ["historicalData", path],
    queryFn: () => fetchHistoricalData(path),
    // staleTime: 5000,
  });
};
