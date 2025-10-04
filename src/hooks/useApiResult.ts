import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface Options<TArgs extends any[], TResult> {
  onSuccess?: (result: TResult, args: TArgs) => void;
  onError?: (err: any, args: TArgs) => void;
  successMessage?: string | ((result: TResult) => string);
  errorMessage?: string | ((err: any) => string);
  silent?: boolean;
}

export function useApiResult<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: Options<TArgs, TResult> = {}
) {
  const { onSuccess, onError, successMessage, errorMessage, silent } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResult | null>(null);

  const run = useCallback(async (...args: TArgs) => {
    setLoading(true); setError(null);
    try {
      const res = await fn(...args);
      setData(res);
      if (!silent) {
        if (successMessage) {
          toast.success(typeof successMessage === 'function' ? successMessage(res) : successMessage);
        }
      }
      onSuccess?.(res, args);
      return res;
    } catch (e: any) {
      const msg = e?.message || 'Request failed';
      setError(msg);
      if (!silent) {
        if (errorMessage) {
          toast.error(typeof errorMessage === 'function' ? errorMessage(e) : errorMessage);
        } else {
          toast.error(msg);
        }
      }
      onError?.(e, args);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fn, onSuccess, onError, successMessage, errorMessage, silent]);

  return { run, loading, error, data } as const;
}
