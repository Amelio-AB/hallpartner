import type { QuoteConfig } from '@amelio/web-platform/quote-flow';
import { hallpartnerQuoteConfig } from './hallpartner-quote.ts';

/**
 * Review-only V2 configuration. Never connect this to /api/lead.php:
 * the installed PHP receiver validates contractVersion 1 and has no upload service.
 * Files stay in browser memory; the review adapter deliberately rejects uploads.
 */
export const hallpartnerQuoteAttachmentsReviewConfig: QuoteConfig = {
  ...hallpartnerQuoteConfig,
  id: 'hallpartner-offert-files-review-v2',
  steps: [
    ...hallpartnerQuoteConfig.steps,
    {
      id: 'documents',
      title: 'Ritningar och underlag',
      description: 'Frivilligt granskningssteg. Filerna skickas inte i denna arbetsversion.',
      fields: [
        {
          id: 'documents.attachments',
          kind: 'files',
          label: 'Bilder, ritningar eller andra dokument',
          help: {
            title: 'Vilka filer kan vara användbara?',
            text: 'En skiss, en ritning eller bilder från byggplatsen kan ge Hallpartner bättre förutsättningar. Det är frivilligt och ingen fil laddas upp i granskningsläget.'
          },
          files: {
            maxFiles: 10,
            maxFileBytes: 15 * 1024 * 1024,
            maxTotalBytes: 50 * 1024 * 1024,
            allowedFormats: ['jpg', 'png', 'webp', 'pdf', 'docx']
          }
        }
      ]
    }
  ]
};
