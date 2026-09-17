"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "@/presentation/atoms/layout/NavLink";
import type { NavLinkItem } from "@/presentation/helpers/types";

interface MobileNavProps {
  items: NavLinkItem[];
  title: string;
  ariaLabel: string;
  openLabel: string;
  closeLabel: string;
  className?: string;
  /** Contenido adicional al pie del panel (p. ej. selector de idioma). */
  footer?: ReactNode;
}

export function MobileNav({
  items,
  title,
  ariaLabel,
  openLabel,
  closeLabel,
  className,
  footer,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Menu aria-hidden />
          <span className="sr-only">{openLabel}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} aria-describedby={undefined} className="w-72">
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle>{title}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon-sm">
              <X aria-hidden />
              <span className="sr-only">{closeLabel}</span>
            </Button>
          </SheetClose>
        </SheetHeader>
        <nav aria-label={ariaLabel} className="px-2">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-base hover:bg-accent"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {footer ? <div className="mt-auto border-t p-4">{footer}</div> : null}
      </SheetContent>
    </Sheet>
  );
}
