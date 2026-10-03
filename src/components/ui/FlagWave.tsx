export function FlagWave({ className = '', position = 'bottom' }: { className?: string; position?: 'top' | 'bottom' }) {
  return (
    <div aria-hidden="true" className={`hero-flag ${position === 'top' ? 'hero-flag--top' : ''} ${className}`}>
      <div className="hero-flag-green" />
      <div className="hero-flag-red" />
      <div className="hero-flag-gold" />
    </div>
  );
}
