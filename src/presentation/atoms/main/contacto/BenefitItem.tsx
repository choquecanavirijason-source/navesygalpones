import type { LucideIcon } from "lucide-react";

interface BenefitItemProps {
  icon: LucideIcon;
  label: string;
}

/** Beneficio compacto: ícono naranja + texto corto. */
export function BenefitItem({ icon: Icon, label }: BenefitItemProps) {
  return (
    <li className="flex min-w-0 flex-col items-center text-center">
      <Icon aria-hidden className="mx-auto mb-1.5 h-5 w-5 shrink-0 text-[#F04400]" />
      <span className="text-[10px] leading-tight font-semibold break-words text-center text-gray-100 md:text-[11px]">{label}</span>
    </li>
  );
}
