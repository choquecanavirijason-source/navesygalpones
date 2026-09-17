import type { ReactNode } from "react";

import { Reveal } from "@/presentation/atoms/common/Reveal";
import { Container } from "@/presentation/atoms/layout/Container";
import { PageHeader } from "@/presentation/molecules/common/PageHeader";

interface LegalDocumentProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

/** Estructura de documentos legales (privacidad, términos): encabezado + cuerpo. */
export function LegalDocument({ title, description, children }: LegalDocumentProps) {
  return (
    <section aria-labelledby="legal-title" className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Reveal trigger="mount">
          <PageHeader titleId="legal-title" title={title} description={description} />
        </Reveal>
        {children ? (
          <div className="mt-10 flex flex-col gap-6 border-t pt-10">{children}</div>
        ) : null}
      </Container>
    </section>
  );
}
