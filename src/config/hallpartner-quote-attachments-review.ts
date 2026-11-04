import type { QuoteConfig } from '@amelio/web-platform/quote-flow';
import { hallpartnerQuoteConfig } from './hallpartner-quote.ts';

/**
 * Opt-in V2 file UI on the fourth question step; AMP-001 still adds only one
 * automatic review step. Never submit V2 attachments to /api/lead.php (V1).
 * Browser-local review only. A real upload receiver does not exist.
 */
export const hallpartnerQuoteAttachmentsReviewConfig: QuoteConfig = {
  ...hallpartnerQuoteConfig,
  id: 'hallpartner-offert-files-review-v2',
  steps: hallpartnerQuoteConfig.steps.map(step => step.id !== 'planning' ? step : {
    ...step,
    fields: [
      ...step.fields,
      {
        id: 'documents.attachments',
        kind: 'files' as const,
        label: 'Välj bilder eller dokument (endast lokal test)',
        hint: 'Inga filer lämnar webbläsaren i denna arbetsversion.',
        help: {
          title: 'Frivilliga filer – bara för granskning',
          text: 'Skisser, ritningar eller platsbilder kan vara användbara längre fram. Ingen fil skickas eller lagras på Hallpartners server i detta granskningsläge.'
        },
        files: {
          maxFiles: 10,
          maxFileBytes: 15 * 1024 * 1024,
          maxTotalBytes: 50 * 1024 * 1024,
          allowedFormats: ['jpg', 'png', 'webp', 'pdf', 'docx'] as const
        }
      }
    ]
  })
};
