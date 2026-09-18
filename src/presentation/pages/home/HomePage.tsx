import { HeroSection } from "@/presentation/organisms/main/hero/HeroSection";
import { HeroTrustBar } from "@/presentation/organisms/main/hero/HeroTrustBar";
import { ServicesSection } from "@/presentation/organisms/main/services/ServicesSection";
import { AboutSection } from "@/presentation/organisms/main/about/AboutSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <HeroTrustBar />
      
      {/* 
        Añadimos las nuevas secciones justo debajo del HeroTrustBar.
        Están completamente aisladas en sus propios componentes (Organismos).
        Si tu colega está trabajando en otra sección "debajo" (ej. un Footer o sección de Contacto),
        solo tendrá que agregar su componente aquí abajo.
      */}
      <ServicesSection />
      <AboutSection />
    </MainLayout>
  );
}
