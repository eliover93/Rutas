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
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        min={min}
        max={max}
        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15"
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
      {label && <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>}
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </div>
  );
}
