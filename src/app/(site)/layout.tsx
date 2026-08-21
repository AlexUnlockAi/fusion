import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MarketBanner } from "@/components/site/market-banner";
import { TrustBadges } from "@/components/site/trust-badges";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <MarketBanner />
      <Header />
      <TrustBadges />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
