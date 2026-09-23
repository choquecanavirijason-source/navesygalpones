interface ProyectoSpecProps {
  label: string;
  value: string;
}

/** Bloque de una especificación técnica (etiqueta + valor) en la ficha del modal. */
export function ProyectoSpec({ label, value }: ProyectoSpecProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <dt className="mb-0.5 block text-xs text-slate-400">{label}</dt>
      <dd className="text-sm font-bold text-slate-800">{value}</dd>
    </div>
  );
}
