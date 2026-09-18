import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ServicesCarousel } from "@/presentation/molecules/main/services/ServicesCarousel";

/**
 * ServicesSection Organism
 * Representa la sección completa de "Nuestros Servicios".
 * Incluye la cabecera (título, texto, botón) y un carrusel
 * con las tarjetas de servicios que avanza automáticamente.
 */
export function ServicesSection() {
  const t = useTranslations("Home.servicesSection");

  // Recreamos los mockServices traduciéndolos a través del hook
  const mockServices = [
    { id: 1, title: t("services.s1"), imageSrc: "/images/placeholders/galpon.jpg" },
    { id: 2, title: t("services.s2"), imageSrc: "/images/placeholders/tinglado.jpg" },
    { id: 3, title: t("services.s3"), imageSrc: "/images/placeholders/estructura.jpg" },
    { id: 4, title: t("services.s4"), imageSrc: "/images/placeholders/pisos.jpg" },
    { id: 5, title: t("services.s5"), imageSrc: "/images/placeholders/obracivil.jpg" },
    { id: 6, title: t("services.s6"), imageSrc: "/images/placeholders/llaveenmano.jpg" },
    { id: 7, title: t("services.s7"), imageSrc: "/images/placeholders/movimiento.jpg" },
  ];

  return (
    <section className="w-full py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Cabecera de la sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-4">
            {/* Título en naranja */}
            <div className="flex items-center gap-4">
              <h2 className="text-sm md:text-base font-bold text-brand-orange uppercase tracking-wider">
                {t("eyebrow")}
              </h2>
              <div className="h-[2px] w-12 bg-brand-orange" />
            </div>
            
            {/* Título principal */}
            <h3 className="text-3xl md:text-4xl font-extrabold text-graphite uppercase leading-tight">
              {t("title.line1")}<br className="hidden md:block" /> {t("title.line2")}
            </h3>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 max-w-sm">
            <p className="text-gray-medium text-sm md:text-base">
              {t("description")}
            </p>
            <Button
              variant="outline"
              className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
            >
              {t("cta")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Carrusel de servicios */}
        <ServicesCarousel services={mockServices} />
      </div>
    </section>
  );
}
