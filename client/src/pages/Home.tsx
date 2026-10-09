import ApplicationsSection from "@/components/site/ApplicationsSection";
import ContactFooter from "@/components/site/ContactFooter";
import Hero from "@/components/site/Hero";
import LandscapeSection from "@/components/site/LandscapeSection";
import MarketSection from "@/components/site/MarketSection";
import PipelineSection from "@/components/site/PipelineSection";
import ProductSection from "@/components/site/ProductSection";
import RoadmapSection from "@/components/site/RoadmapSection";
import SignalSection from "@/components/site/SignalSection";
import SiteNav from "@/components/site/SiteNav";
import StatementSection from "@/components/site/StatementSection";
import TeamSection from "@/components/site/TeamSection";
import VisionSection from "@/components/site/VisionSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteNav />
      <main>
        <Hero />
        <StatementSection />
        <SignalSection />
        <LandscapeSection />
        <VisionSection />
        <ProductSection />
        <PipelineSection />
        <MarketSection />
        <ApplicationsSection />
        <RoadmapSection />
        <TeamSection />
      </main>
      <ContactFooter />
    </div>
  );
}
