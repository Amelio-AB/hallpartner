import { createJsonAdapter } from '@amelio/web-platform/quote-flow';
import type { Adapter } from '@amelio/web-platform/quote-flow';
import {
  buildQuoteReceiptSummary, parseQuoteReceiptSummary
} from './quote-receipt-summary';
import type { QuoteSummaryValue } from './quote-receipt-summary';

export const RECEIPT_KEY = 'hp-quote-receipt';
const MAX_AGE_MS = 30 * 60 * 1000;
export type Receipt = {
  requestId: string;
  customerCopy: 'accepted' | 'unconfirmed';
  createdAt: number;
  summary?: QuoteSummaryValue[];
};

export function parseReceipt(value: unknown, now = Date.now()): Receipt | null {
  if (!value || typeof value !== 'object') return null;
  const r = value as Record<string, unknown>;
  if (typeof r.requestId !== 'string' || !/^[a-f0-9]{24}$/.test(r.requestId) ||
      typeof r.createdAt !== 'number' || !Number.isFinite(r.createdAt) ||
      r.createdAt > now || now - r.createdAt > MAX_AGE_MS) return null;
  const result: Receipt = { requestId: r.requestId, createdAt: r.createdAt,
    customerCopy: r.customerCopy === 'accepted' ? 'accepted' : 'unconfirmed' };
  const summary = parseQuoteReceiptSummary(r.summary);
  if (summary.length) result.summary = summary;
  return result;
}

/** Keep AMP's HTTP/error handling. Only allowlisted project facts cross navigation. */
export function createQuoteConfirmationAdapter(
  onSuccess: (receipt: Receipt | null) => void,
  fetcher: typeof fetch = globalThis.fetch,
): Adapter {
  return async (submission, context) => {
    let receipt: Receipt | null = null;
    const adapter = createJsonAdapter('/api/lead.php', async (url, init) => {
      const response = await fetcher(url, init);
      if (response.status === 200) {
        const body = await response.clone().json();
        if (body?.status === 'success') receipt = parseReceipt({
          requestId: body.requestId, customerCopy: body.customerCopy, createdAt: Date.now(),
        });
      }
      return response;
    });
    const result = await adapter(submission, context);
    if (result.status === 'success' && !context.signal.aborted) {
      // Storage/navigation failures must never turn an accepted enquiry into a retry.
      const summary = buildQuoteReceiptSummary(submission.answers);
      const confirmed = receipt && summary.length ? { ...receipt, summary } : receipt;
      try { onSuccess(confirmed); } catch { /* AMP still shows its confirmed success. */ }
    }
    return result;
  };
}
