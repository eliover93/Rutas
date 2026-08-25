interface FieldProps {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  min?: number;
  max?: number;
}

export function Field({ label, name, defaultValue, type = 'text', min, max }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-slate-500">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        min={min}
        max={max}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />
    </div>
  );
}

interface TextAreaProps {
  label?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export function TextArea({ label, name, defaultValue, placeholder }: TextAreaProps) {
  return (
    <div>
      {label && <label className="mb-1 block text-xs text-slate-500">{label}</label>}
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />
    </div>
  );
}
