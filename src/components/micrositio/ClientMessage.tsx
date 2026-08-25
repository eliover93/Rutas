export function ClientMessage({ message }: { message: string }) {
  return (
    <div className="mx-8 mt-6 rounded-2xl p-5" style={{ background: 'var(--color-accent)' }}>
      <p className="text-sm italic leading-relaxed" style={{ color: 'var(--color-text)' }}>
        "{message}"
      </p>
    </div>
  );
}
