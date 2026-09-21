import { AboutSection } from "@/presentation/organisms/main/about/AboutSection";
import { ContactoBannerSection } from "@/presentation/organisms/main/contacto/ContactoBannerSection";
import { EquipoStatsSection } from "@/presentation/organisms/main/equipo/EquipoStatsSection";
import { HeroScrollytellingSection } from "@/presentation/organisms/main/hero/HeroScrollytellingSection";
import { HeroTrustBar } from "@/presentation/organisms/main/hero/HeroTrustBar";
import { ObrasSection } from "@/presentation/organisms/main/obras/ObrasSection";
import { ServicesSection } from "@/presentation/organisms/main/services/ServicesSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function HomePage() {
  return (
    <MainLayout>
      <HeroScrollytellingSection />
      <HeroTrustBar />
      <ServicesSection />
      <AboutSection />
      {/* TODO: SustentabilidadSection va acá, entre About y Equipo. */}
      <EquipoStatsSection />
      <ObrasSection />
      <ContactoBannerSection />
    </MainLayout>
  );
}
