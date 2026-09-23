import { Reveal } from "@/presentation/atoms/common/Reveal";
import { Container } from "@/presentation/atoms/layout/Container";
import { ProyectoCard } from "@/presentation/molecules/main/proyectos/ProyectoCard";
import type { ProyectoItem } from "@/presentation/helpers/types";

interface ProyectosGridProps {
  badge: string;
  title: string;
  ctaLabel: string;
  proyectos: readonly ProyectoItem[];
  onSelect: (id: string) => void;
}

/** Grilla del catálogo completo: encabezado + tarjetas de obras sobre fondo claro. */
export function ProyectosGrid({ badge, title, ctaLabel, proyectos, onSelect }: ProyectosGridProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-1">
          <span className="text-xs font-bold tracking-widest text-[#F04400] uppercase">{badge}</span>
          <h2 className="text-3xl font-black text-balance text-slate-900">{title}</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {proyectos.map((proyecto, index) => (
            <Reveal key={proyecto.id} delay={Math.min(index * 0.05, 0.2)}>
              <ProyectoCard proyecto={proyecto} ctaLabel={ctaLabel} onSelect={() => onSelect(proyecto.id)} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
