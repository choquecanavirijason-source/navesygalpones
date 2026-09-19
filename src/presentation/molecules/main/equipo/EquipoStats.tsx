import type { LucideIcon } from "lucide-react";

import { StatItem } from "@/presentation/atoms/main/equipo/StatItem";

export interface EquipoStatsProps {
  stats: readonly { icon: LucideIcon; value: string; label: string }[];
}

/**
 * Estadísticas del equipo: 2×2 en mobile/tablet, una sola fila de 4 desde `lg`,
 * con divisores verticales entre columnas. Tipografía fluida por container query.
 */
export function EquipoStats({ stats }: EquipoStatsProps) {
  return (
    <dl className="grid w-full grid-cols-2 gap-y-8 lg:grid-cols-4 [&>div]:px-2 [&>div:nth-child(even)]:border-l [&>div:nth-child(even)]:border-gray-200 lg:[&>div:nth-child(3)]:border-l lg:[&>div:nth-child(3)]:border-gray-200">
      {stats.map((stat) => (
        <StatItem key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
      ))}
    </dl>
  );
}
