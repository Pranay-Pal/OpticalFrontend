import React, { useEffect, useState } from 'react';
import { StaffAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Printer, RefreshCcw, Copy } from 'lucide-react';

interface InvoiceThermalPrintProps {
  invoiceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Displays thermal HTML returned by backend inside a scrollable container.
export const InvoiceThermalPrint: React.FC<InvoiceThermalPrintProps> = ({ invoiceId, open, onOpenChange }) => {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThermal = async () => {
    if (!invoiceId) return;
    try {
      setLoading(true); setError(null);
      const content = await StaffAPI.invoices.getThermal(invoiceId);
      setHtml(content || '');
    } catch (e: any) {
      setError(e?.message || 'Failed to load thermal receipt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (open) fetchThermal(); }, [open, invoiceId]);

  const print = () => {
    const w = window.open('', '_blank', 'width=400');
    if (!w) return;
    w.document.write(html || '<p>No content</p>');
    w.document.close();
    w.focus();
    w.print();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      // eslint-disable-next-line no-alert
      alert('Thermal HTML copied to clipboard');
    } catch {
      // eslint-disable-next-line no-alert
      alert('Failed to copy');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-[95vw] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between w-full">
            <span>Thermal Receipt Preview</span>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" disabled={loading} onClick={fetchThermal} title="Reload">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" disabled={loading || !html} onClick={copy} title="Copy HTML">
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" disabled={loading || !html} onClick={print} title="Print">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 border rounded bg-muted/40 overflow-auto p-4 font-mono text-xs whitespace-pre-wrap">
          {loading && <div className="text-muted-foreground">Loading thermal receipt…</div>}
          {error && !loading && <div className="text-red-600 space-y-2">
            <div>{error}</div>
            <Button size="sm" variant="outline" onClick={fetchThermal}>Retry</Button>
          </div>}
          {!loading && !error && !html && <div className="text-muted-foreground">No content</div>}
          {!loading && !error && html && (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceThermalPrint;
