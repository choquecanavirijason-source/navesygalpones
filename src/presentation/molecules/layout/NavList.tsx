import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { NavLink } from "@/presentation/atoms/layout/NavLink";
import type { NavLinkItem } from "@/presentation/helpers/types";

interface NavListProps {
  items: NavLinkItem[];
  ariaLabel: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function NavList({ items, ariaLabel, orientation = "horizontal", className }: NavListProps) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-wrap items-center gap-x-6 gap-y-2" : "flex-col gap-2",
        )}
      >
        {items.map((item) => (
          <li key={item.href}>
            <NavLink
              href={item.href}
              active={item.active}
              trailingIcon={item.hasDropdown ? <ChevronDown aria-hidden className="size-4" /> : undefined}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
