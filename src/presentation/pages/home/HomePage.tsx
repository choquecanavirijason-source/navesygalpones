import { ContactoBannerSection } from "@/presentation/organisms/main/contacto/ContactoBannerSection";
import { EquipoStatsSection } from "@/presentation/organisms/main/equipo/EquipoStatsSection";
import { HeroSection } from "@/presentation/organisms/main/hero/HeroSection";
import { HeroTrustBar } from "@/presentation/organisms/main/hero/HeroTrustBar";
import { ObrasSection } from "@/presentation/organisms/main/obras/ObrasSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <HeroTrustBar />
      {/* TODO: Servicios, SobreNyGSection y SustentabilidadSection van montadas ACÁ arriba (las agrega otro dev) — Equipo y Obras quedan reservadas para después de esas. */}
      <EquipoStatsSection />
      <ObrasSection />
      <ContactoBannerSection />
    </MainLayout>
  );
}
