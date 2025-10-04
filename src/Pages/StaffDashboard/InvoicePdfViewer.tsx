import React, { useEffect, useState } from 'react';
import { StaffAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Download, Printer, Mail, RefreshCcw } from 'lucide-react';

interface InvoicePdfViewerProps {
  invoiceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Simple PDF viewer using blob URL inside an iframe
export const InvoicePdfViewer: React.FC<InvoicePdfViewerProps> = ({ invoiceId, open, onOpenChange }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPdf = async () => {
    if (!invoiceId) return;
    try {
      setLoading(true); setError(null);
      const blob = await StaffAPI.invoices.getPdf(invoiceId);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setBlobUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e?.message || 'Failed to load PDF');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchPdf();
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, invoiceId]);

  const download = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl; a.download = `invoice-${invoiceId}.pdf`; a.click();
  };

  const printPdf = () => {
    if (!blobUrl) return;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.opacity = '0';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between w-full">
            <span>Invoice PDF Preview</span>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" disabled={loading} onClick={fetchPdf} title="Reload">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" disabled={!blobUrl || loading} onClick={download} title="Download PDF">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" disabled={!blobUrl || loading} onClick={printPdf} title="Print">
                <Printer className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" disabled title="Email (coming soon)">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 border rounded bg-muted/50 overflow-hidden relative">
          {loading && <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">Loading PDF…</div>}
          {error && !loading && <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-sm text-red-600">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchPdf}>Retry</Button>
          </div>}
          {!loading && !error && blobUrl && (
            <iframe title="Invoice PDF" src={blobUrl} className="w-full h-full" />
          )}
          {!loading && !error && !blobUrl && <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">No PDF</div>}
        </div>
        <DialogFooter className="justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePdfViewer;
