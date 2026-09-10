// Wrapper chico para no repetir "label arriba del input" en cada formulario.
export default function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 text-slate-700">{label}</label>
      {children}
    </div>
  );
}
