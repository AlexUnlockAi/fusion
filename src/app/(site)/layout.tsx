import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MarketBanner } from "@/components/site/market-banner";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <MarketBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
