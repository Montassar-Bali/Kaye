import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { CampaignReveal } from "@/components/campaign-reveal";
import { ProductGrid } from "@/components/product-grid";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <CampaignReveal />
      <ProductGrid />
      <Footer />
    </main>
  );
}
