import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Text } from "@/presentation/atoms/common/Text";
import { Container } from "@/presentation/atoms/layout/Container";
import type { ActionLink } from "@/presentation/helpers/types";
import { PageHeader } from "@/presentation/molecules/common/PageHeader";

interface NotFoundSectionProps {
  code: string;
  title: string;
  description: string;
  action: ActionLink;
}

export function NotFoundSection({ code, title, description, action }: NotFoundSectionProps) {
  return (
    <section aria-labelledby="not-found-title" className="grid min-h-[60dvh] place-items-center py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Text size="sm" tone="muted" className="font-mono tracking-widest">
          {code}
        </Text>
        <PageHeader
          titleId="not-found-title"
          title={title}
          description={description}
          align="center"
        />
        <Button asChild>
          <Link href={action.href}>
            <ArrowLeft aria-hidden />
            {action.label}
          </Link>
        </Button>
      </Container>
    </section>
  );
}
