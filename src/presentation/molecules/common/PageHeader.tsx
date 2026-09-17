import { cn } from "@/lib/utils";
import { Heading } from "@/presentation/atoms/common/Heading";
import { Text } from "@/presentation/atoms/common/Text";

interface PageHeaderProps {
  titleId?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
  className?: string;
}

/** Encabezado de páginas internas (sin hero): `<h1>` + descripción. */
export function PageHeader({ titleId, title, description, align = "start", className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <Heading as="h1" id={titleId} size="xl">
        {title}
      </Heading>
      {description ? (
        <Text size="lg" tone="muted" className="max-w-2xl text-pretty">
          {description}
        </Text>
      ) : null}
    </header>
  );
}
