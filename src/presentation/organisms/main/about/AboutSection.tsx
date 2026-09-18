import { ArrowRight, Target, Leaf, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AboutFeature } from "@/presentation/molecules/features/AboutFeature";
import { SustainabilityCard } from "@/presentation/molecules/cards/SustainabilityCard";

/**
 * AboutSection Organism
 * Contenedor de la sección "Sobre NyG Estructuras".
 * Está diseñada con un layout Grid que en escritorio tiene 3 columnas:
 * 1. Texto introductorio y botón de "Conocé nuestra empresa".
 * 2. Valores fundamentales (Misión, Visión, Valores) usando AboutFeature.
 * 3. Tarjeta de Construcción Sustentable.
 */
export function AboutSection() {
  const t = useTranslations("Home.aboutSection");

  return (
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Columna Izquierda: Información de la empresa */}
          <div className="flex flex-col items-start gap-4 justify-center">
            {/* Subtítulo naranja */}
            <h2 className="text-sm md:text-base font-bold text-brand-orange uppercase tracking-wider">
              {t("eyebrow")}
            </h2>
            
            {/* Título Principal */}
            <h3 className="text-3xl md:text-4xl font-extrabold text-graphite uppercase leading-tight">
              {t("title")}
            </h3>
            
            {/* Descripción */}
            <p className="text-gray-medium text-sm md:text-base leading-relaxed max-w-md">
              {t("description")}
            </p>
            
            {/* Botón CTA */}
            <Button
              variant="outline"
              className="mt-4 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
            >
              {t("cta")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Columna Central: Misión, Visión y Valores */}
          <div className="flex flex-col justify-center gap-8 rounded-lg border border-gray-light p-8 lg:p-10 bg-white">
            <AboutFeature
              icon={<Target className="h-8 w-8" />}
              title={t("mission.title")}
              description={t("mission.description")}
            />
            <AboutFeature
              icon={<Leaf className="h-8 w-8" />}
              title={t("vision.title")}
              description={t("vision.description")}
            />
            <AboutFeature
              icon={<Shield className="h-8 w-8" />}
              title={t("values.title")}
              description={t("values.description")}
            />
          </div>

          {/* Columna Derecha: Tarjeta Sustentabilidad */}
          <div className="h-full">
            <SustainabilityCard 
              imageSrc="/images/placeholders/sustentabilidad.jpg" 
              title={t("sustainability.title")}
              description={t("sustainability.description")}
              ctaText={t("sustainability.cta")}
              features={{
                materials: t("sustainability.features.materials"),
                waste: t("sustainability.features.waste"),
                energy: t("sustainability.features.energy")
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
