import { HeroSection } from "@/presentation/organisms/main/hero/HeroSection";
import { HeroTrustBar } from "@/presentation/organisms/main/hero/HeroTrustBar";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <HeroTrustBar />
    </MainLayout>
  );
}
