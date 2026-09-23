"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Factory,
  Frame,
  Hammer,
  KeyRound,
  Layers,
  Maximize,
  MoreHorizontal,
  Mountain,
  Send,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { buildWhatsAppUrl } from "@/constants/contact";
import {
  AR_PROVINCES,
  QUOTE_CATEGORIES,
  QUOTE_CATEGORY_FIELDS,
  QUOTE_CONTACT_FIELDS,
  QUOTE_CONTEXT_FIELDS,
  QUOTE_OPTION_SETS,
  type QuoteFieldConfig,
  type QuoteOptionSet,
} from "@/content/quotes";
import type {
  QuoteAnswer,
  QuoteAnswers,
  QuoteCategory,
  QuoteDraft,
} from "@/core/types/modules/quotes/quotes.types";
import {
  validateQuoteFields,
  type QuoteFieldErrors,
} from "@/infrastructure/validators/quotes/quote.schema";
import { toast } from "@/lib/toast/toast.store";
import { cn } from "@/lib/utils";
import { QuoteStepBar } from "@/presentation/atoms/main/quotes/QuoteStepBar";
import { downloadQuotePdf } from "@/presentation/helpers/quotes/pdf";
import {
  buildQuoteMessage,
  buildRequestId,
  computeArea,
  UNIT_LABEL,
  type QuoteSummaryLine,
} from "@/presentation/helpers/quotes/request";
import { QuoteCategoryCard } from "@/presentation/molecules/main/quotes/QuoteCategoryCard";
import { QuoteConfirmCard } from "@/presentation/molecules/main/quotes/QuoteConfirmCard";
import { QuoteField, type QuoteFieldOption } from "@/presentation/molecules/main/quotes/QuoteField";
import { QuoteSuccessCard } from "@/presentation/molecules/main/quotes/QuoteSuccessCard";
import { QuoteSummaryGroup } from "@/presentation/molecules/main/quotes/QuoteSummaryGroup";

const STEPS = ["type", "details", "context", "contact", "summary"] as const;
type Step = (typeof STEPS)[number];

const CATEGORY_ICONS: Record<QuoteCategory, LucideIcon> = {
  tinglado: Warehouse,
  galpon: Building2,
  nave: Factory,
  estructura: Frame,
  ampliacion: Maximize,
  piso: Layers,
  movimiento: Mountain,
  obraCivil: Hammer,
  llaveEnMano: KeyRound,
  otro: MoreHorizontal,
};

/** Clave del borrador en `localStorage`: evita perder el avance al recargar. */
const DRAFT_KEY = "nyg.quote.draft";

const EMPTY_DRAFT: QuoteDraft = {
  category: null,
  answers: {},
  province: "",
  city: "",
  landAvailable: "",
  stage: "",
  startDate: "",
  deadline: "",
  name: "",
  company: "",
  whatsapp: "",
  email: "",
  preferredTime: "",
};

/** Campos planos del borrador (todo lo que no son respuestas de la categoría). */
type FlatField = Exclude<keyof QuoteDraft, "category" | "answers">;

const isFlatField = (name: string): name is FlatField =>
  name !== "category" && name !== "answers" && name in EMPTY_DRAFT;

/**
 * Formulario inteligente de cotización (documento funcional de NyG).
 *
 * Flujo: tipo de obra → confirmación → preguntas específicas → ubicación y plazos →
 * contacto → resumen editable → envío por WhatsApp. El avance se guarda en `localStorage`.
 *
 * Todavía no hay backend: el envío arma el mensaje de WhatsApp y el ID se genera en el
 * navegador. `quoteRequestSchema` ya deja lista la validación de servidor para cuando exista
 * la route handler.
 */
export function QuoteWizard() {
  const t = useTranslations("Quotes");
  const locale = useLocale();
  const [step, setStep] = useState<Step>("type");
  const [draft, setDraft] = useState<QuoteDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [expanded, setExpanded] = useState<QuoteCategory | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  /** Estado, no ref: hasta que el borrador no está leído no se puede escribir encima. */
  const [restored, setRestored] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // ─── Textos ──────────────────────────────────────────────────────────────
  // next-intl tipa las claves desde es.json; los nombres de campo salen de la
  // configuración, así que se afirma el tipo como ya hace el resto del proyecto.
  const fieldLabel = (name: string) => t(`fields.${name}` as "fields.width");
  const optionLabel = (set: QuoteOptionSet, value: string) =>
    t(`options.${set}.${value}` as "options.yesNoTbd.yes");

  const fieldOptions = (field: QuoteFieldConfig): readonly QuoteFieldOption[] => {
    if (field.name === "province") return AR_PROVINCES.map((name) => ({ value: name, label: name }));
    if (!field.options) return [];
    const set = field.options;
    return QUOTE_OPTION_SETS[set].map((value) => ({ value, label: optionLabel(set, value) }));
  };

  // ─── Borrador ────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) setDraft({ ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<QuoteDraft>) });
    } catch {
      // Sin almacenamiento (modo privado, permisos): el formulario funciona igual.
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Ídem: guardar es una mejora, no un requisito.
    }
  }, [draft, restored]);

  // ─── Estado derivado ─────────────────────────────────────────────────────
  const category = draft.category;
  const categoryFields: readonly QuoteFieldConfig[] = category ? QUOTE_CATEGORY_FIELDS[category] : [];
  const hasDimensions =
    categoryFields.some((field) => field.name === "width") &&
    categoryFields.some((field) => field.name === "length");

  /** La superficie se calcula sola cuando la categoría pide ancho y largo. */
  const resolveAnswers = (answers: QuoteAnswers): QuoteAnswers => {
    if (!hasDimensions) return answers;
    const width = typeof answers.width === "string" ? answers.width : "";
    const length = typeof answers.length === "string" ? answers.length : "";
    const area = computeArea(width, length);
    return area === "" ? answers : { ...answers, area };
  };

  const answers = resolveAnswers(draft.answers);
  const stepIndex = STEPS.indexOf(step);

  const stepFields = (target: Step): readonly QuoteFieldConfig[] => {
    if (target === "details") return categoryFields;
    if (target === "context") return QUOTE_CONTEXT_FIELDS;
    if (target === "contact") return QUOTE_CONTACT_FIELDS;
    return [];
  };

  const valuesFor = (target: Step): Record<string, QuoteAnswer | undefined> =>
    target === "details" ? answers : (draft as unknown as Record<string, QuoteAnswer>);

  // ─── Navegación ──────────────────────────────────────────────────────────
  const goTo = useCallback((target: Step) => {
    setErrors({});
    setStep(target);
    // El foco vuelve al encabezado del paso para que el lector de pantalla lo anuncie.
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  /** Paso en esa posición, acotado a los extremos. */
  const stepAt = (index: number): Step =>
    STEPS[Math.min(Math.max(index, 0), STEPS.length - 1)] ?? "type";

  const goNext = () => {
    const found = validateQuoteFields(stepFields(step), valuesFor(step));
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`quote-${firstInvalid}`)?.focus();
      return;
    }

    goTo(stepAt(stepIndex + 1));
  };

  const goBack = () => goTo(stepAt(stepIndex - 1));

  // ─── Cambios de valor ────────────────────────────────────────────────────
  const setAnswer = (name: string, value: QuoteAnswer) => {
    setDraft((current) => ({ ...current, answers: { ...current.answers, [name]: value } }));
    setErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const setFlat = (name: string, value: QuoteAnswer) => {
    if (!isFlatField(name)) return;
    const text = Array.isArray(value) ? value.join(", ") : value;
    setDraft((current) => ({ ...current, [name]: text }));
    setErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const selectCategory = (next: QuoteCategory) => {
    setDraft((current) =>
      current.category === next ? current : { ...current, category: next, answers: {} },
    );
    setExpanded(null);
  };

  const restart = () => {
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setRequestId(null);
    goTo("type");
  };

  // ─── Resumen y envío ─────────────────────────────────────────────────────
  const displayValue = (field: QuoteFieldConfig, value: QuoteAnswer | undefined): string => {
    if (value === undefined) return "";
    if (Array.isArray(value)) {
      return field.options ? value.map((item) => optionLabel(field.options!, item)).join(", ") : value.join(", ");
    }
    if (value.trim() === "") return "";
    if (field.options) return optionLabel(field.options, value);
    return field.unit ? `${value} ${UNIT_LABEL[field.unit]}` : value;
  };

  const linesFor = (target: Step): QuoteSummaryLine[] =>
    stepFields(target).map((field) => ({
      label: fieldLabel(field.name),
      value: displayValue(field, valuesFor(target)[field.name]),
    }));

  const categoryLine: QuoteSummaryLine | null = category
    ? { label: t("summary.category"), value: t(`categories.${category}.name`) }
    : null;

  const submit = () => {
    // Última red: si faltara algo obligatorio de pasos anteriores, vuelve a ese paso.
    for (const target of ["details", "context", "contact"] as const) {
      const found = validateQuoteFields(stepFields(target), valuesFor(target));
      if (Object.keys(found).length > 0) {
        setErrors(found);
        goTo(target);
        return;
      }
    }
    setRequestId(buildRequestId());
  };

  const whatsappUrl = buildWhatsAppUrl(
    buildQuoteMessage({
      intro: t("whatsapp.intro"),
      outro: t("whatsapp.outro"),
      idLine: t("success.id", { id: requestId ?? "" }),
      lines: [
        ...(categoryLine ? [categoryLine] : []),
        ...linesFor("details"),
        ...linesFor("context"),
        ...linesFor("contact"),
      ],
    }),
  );

  /** Secciones del resumen: las pinta el paso final y también van al PDF. */
  const summarySections: readonly { title: string; lines: QuoteSummaryLine[]; step: Step }[] = [
    ...(categoryLine ? [{ title: t("steps.type"), lines: [categoryLine], step: "type" as Step }] : []),
    { title: t("steps.details"), lines: linesFor("details"), step: "details" },
    { title: t("steps.context"), lines: linesFor("context"), step: "context" },
    { title: t("steps.contact"), lines: linesFor("contact"), step: "contact" },
  ];

  const downloadPdf = async () => {
    if (!requestId) return;
    setPdfBusy(true);
    try {
      await downloadQuotePdf(
        {
          brand: t("pdf.brand"),
          documentTitle: t("pdf.title"),
          requestId: t("success.id", { id: requestId }),
          date: t("pdf.date", {
            date: new Date().toLocaleDateString(locale, {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
          }),
          sections: summarySections,
          emptyLabel: t("summary.empty"),
          footer: t("pdf.footer"),
          pageLabel: (page, total) => t("pdf.page", { current: page, total }),
        },
        `${t("pdf.filename")}-${requestId}.pdf`,
      );
    } catch {
      toast.error(t("success.pdfError"));
    } finally {
      setPdfBusy(false);
    }
  };

  if (requestId) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto">
        <QuoteSuccessCard
        title={t("success.title")}
        idLabel={t("success.id", { id: requestId })}
        description={t("success.description")}
        whatsappLabel={t("success.whatsapp")}
        whatsappNote={t("success.whatsappNote")}
        restartLabel={t("success.restart")}
        pdfLabel={t("success.pdf")}
        whatsappUrl={whatsappUrl}
        onRestart={restart}
          onDownloadPdf={downloadPdf}
          pdfBusy={pdfBusy}
        />
      </div>
    );
  }

  const heading = {
    type: t("selector.title"),
    details: t("details.title"),
    context: t("context.title"),
    contact: t("contact.title"),
    summary: t("summary.title"),
  }[step];

  const description = {
    type: t("selector.description"),
    details: t("details.description"),
    context: t("context.description"),
    contact: t("contact.description"),
    summary: t("summary.description"),
  }[step];

  const renderFields = (target: Exclude<Step, "type" | "summary">) => (
    // Tres columnas en pantallas anchas: los pasos con muchos campos entran sin estirarse.
    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
      {stepFields(target).map((field) => {
        const computed = target === "details" && field.name === "area" && hasDimensions;
        const errorCode = errors[field.name];
        return (
          <QuoteField
            key={field.name}
            field={field}
            label={fieldLabel(field.name)}
            value={valuesFor(target)[field.name] ?? (field.type === "checkboxes" ? [] : "")}
            onChange={(value) => (target === "details" ? setAnswer(field.name, value) : setFlat(field.name, value))}
            options={fieldOptions(field)}
            selectPlaceholder={t("placeholder.select")}
            error={errorCode ? t(`validation.${errorCode}`) : undefined}
            hint={computed ? t("details.areaHint") : undefined}
            readOnly={computed}
          />
        );
      })}
    </div>
  );

  return (
    /*
     * El progreso, el encabezado y los botones quedan siempre a la vista; lo único que
     * scrollea es el contenido del paso, y solo si no entra. Para eso hace falta `min-h-0`
     * en cada nivel: un hijo flex no se encoge por debajo de su contenido sin eso.
     */
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <QuoteStepBar
        className="shrink-0"
        current={stepIndex + 1}
        total={STEPS.length}
        label={t("progress", {
          current: stepIndex + 1,
          total: STEPS.length,
          step: t(`steps.${step}`),
        })}
      />

      <div className="flex shrink-0 flex-col gap-1">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-extrabold tracking-tight text-graphite uppercase focus:outline-none md:text-2xl"
        >
          {heading}
        </h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Sin recorte ni scroll propio: el contenido del paso se ve entero y, si necesita más
          alto del que hay, la sección crece. `flex-1` solo reparte el espacio que sobra. */}
      <div className="flex-1">
        {/* En pantallas anchas el selector va a cinco columnas: las diez opciones quedan en dos
            filas exactas y entran sin scroll en un portátil de 900px de alto. */}
        {step === "type" ? (
          category === null ? (
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {QUOTE_CATEGORIES.map((item, index) => (
                <QuoteCategoryCard
                  key={item}
                  index={index + 1}
                  icon={CATEGORY_ICONS[item]}
                  name={t(`categories.${item}.name`)}
                  short={t(`categories.${item}.short`)}
                  full={t(`categories.${item}.full`)}
                  ideal={t(`categories.${item}.ideal`)}
                  idealLabel={t("selector.ideal")}
                  detailLabel={expanded === item ? t("selector.hideDetail") : t("selector.detail")}
                  selected={false}
                  expanded={expanded === item}
                  onSelect={() => selectCategory(item)}
                  onToggleDetail={() => setExpanded((current) => (current === item ? null : item))}
                />
              ))}
            </ul>
          ) : (
            <QuoteConfirmCard
              selectedLabel={t("confirm.selected", { category: t(`categories.${category}.name`) })}
              description={t(`categories.${category}.full`)}
              question={t("confirm.question")}
              confirmLabel={t("confirm.yes")}
              changeLabel={t("confirm.change")}
              onConfirm={() => goTo("details")}
              onChange={() => setDraft((current) => ({ ...current, category: null }))}
            />
          )
        ) : null}

        {step === "details" ? renderFields("details") : null}
        {step === "context" ? renderFields("context") : null}

        {step === "contact" ? (
          <div className="flex flex-col gap-4">
            {renderFields("contact")}
            <p className="text-xs text-gray-500">{t("contact.privacy")}</p>
          </div>
        ) : null}

        {/* El resumen va a dos columnas en pantallas anchas: entra de una sola vista. */}
        {step === "summary" ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
            {summarySections.map((section) => (
              <QuoteSummaryGroup
                key={section.step}
                title={section.title}
                editLabel={t("summary.edit")}
                lines={section.lines}
                emptyLabel={t("summary.empty")}
                onEdit={() => goTo(section.step)}
              />
            ))}
            <p className="text-xs text-gray-500 xl:col-span-2">{t("summary.attachments")}</p>
          </div>
        ) : null}
      </div>

      {Object.keys(errors).length > 0 ? (
        <p role="alert" className="shrink-0 text-sm font-semibold text-red-600">
          {t("validation.summary")}
        </p>
      ) : null}

      {step !== "type" ? (
        <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-xs font-bold tracking-wider text-gray-medium uppercase transition-colors hover:border-graphite hover:text-graphite focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:outline-none"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {t("nav.back")}
          </button>

          <button
            type="button"
            onClick={step === "summary" ? submit : goNext}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-brand-orange/90 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:outline-none",
            )}
          >
            {step === "summary" ? t("summary.submit") : t("nav.next")}
            {step === "summary" ? (
              <Send aria-hidden className="size-4" />
            ) : (
              <ArrowRight aria-hidden className="size-4" />
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
