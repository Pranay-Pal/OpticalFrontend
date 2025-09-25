import * as React from 'react';

// Minimal lightweight Select components (placeholder). Replace with real library/shadcn implementation if available.
// API surface matches the usage in InventoryReport.

interface SelectContextValue {
  value: string | undefined;
  onChange: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}
const SelectCtx = React.createContext<SelectContextValue | null>(null);

export function Select(props: { value?: string; onValueChange?: (v: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const onChange = (v: string) => {
    props.onValueChange?.(v);
    setOpen(false);
  };
  return (
    <SelectCtx.Provider value={{ value: props.value, onChange, open, setOpen }}>
      <div className="relative inline-block w-full">{props.children}</div>
    </SelectCtx.Provider>
  );
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(SelectCtx)!;
  return (
    <button type="button" onClick={() => ctx.setOpen(!ctx.open)} className={`w-full border rounded px-2 h-9 text-left bg-background ${className || ''}`}>
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectCtx)!;
  return <span className="truncate text-sm">{ctx.value || placeholder || 'Select'}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SelectCtx)!;
  if (!ctx.open) return null;
  return (
    <div className="absolute z-50 mt-1 w-full border rounded bg-popover shadow-md p-1 animate-in fade-in-0 zoom-in-95">
      {children}
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(SelectCtx)!;
  const active = ctx.value === value;
  return (
    <div
      onClick={() => ctx.onChange(value)}
      className={`cursor-pointer px-2 py-1.5 rounded text-sm hover:bg-accent hover:text-accent-foreground ${active ? 'bg-accent' : ''}`}
    >
      {children}
    </div>
  );
}
