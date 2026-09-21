import { Check, Download, MessageCircle, RotateCcw } from "lucide-react";

interface QuoteSuccessCardProps {
  /** Textos ya traducidos. */
  title: string;
  idLabel: string;
  description: string;
  whatsappLabel: string;
  whatsappNote: string;
  restartLabel: string;
  pdfLabel: string;
  /** Enlace de WhatsApp con el mensaje precargado. */
  whatsappUrl: string;
  onRestart: () => void;
  onDownloadPdf: () => void;
  /** El PDF se arma con una librería que se carga al pulsar: mientras tanto, espera. */
  pdfBusy?: boolean;
}

/** Confirmación de envío: ID de solicitud y traspaso a WhatsApp. */
export function QuoteSuccessCard({
  title,
  idLabel,
  description,
  whatsappLabel,
  whatsappNote,
  restartLabel,
  pdfLabel,
  whatsappUrl,
  onRestart,
  onDownloadPdf,
  pdfBusy = false,
}: QuoteSuccessCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-center md:p-8">
      <span className="flex size-14 items-center justify-center rounded-full border-2 border-green-500 text-green-600">
        <Check aria-hidden className="size-7" />
      </span>

      <h2 className="text-2xl font-extrabold tracking-tight text-graphite uppercase">{title}</h2>
      <p className="text-sm font-bold text-brand-orange">{idLabel}</p>
      <p className="max-w-md text-sm leading-relaxed text-gray-600">{description}</p>

      <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-whatsapp px-6 py-3 text-sm font-bold tracking-wider text-whatsapp uppercase transition-colors hover:bg-whatsapp hover:text-white focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
        >
          <MessageCircle aria-hidden className="size-5" />
          {whatsappLabel}
        </a>

        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={pdfBusy}
          aria-busy={pdfBusy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-graphite px-6 py-3 text-sm font-bold tracking-wider text-graphite uppercase transition-colors hover:bg-graphite hover:text-white focus-visible:ring-2 focus-visible:ring-graphite focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <Download aria-hidden className="size-5" />
          {pdfLabel}
        </button>
      </div>
      <p className="max-w-sm text-xs text-gray-500">{whatsappNote}</p>

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-gray-medium uppercase underline underline-offset-4 transition-colors hover:text-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:outline-none"
      >
        <RotateCcw aria-hidden className="size-3.5" />
        {restartLabel}
      </button>
    </div>
  );
}
