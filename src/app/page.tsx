import { Home } from "@/features/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function HomePage() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
