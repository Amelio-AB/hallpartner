/**
 * Customer-facing label derived from the existing 96-bit server reference.
 *
 * Keep the full requestId for transport, logging and troubleshooting.
 * The first 40 bits are a practical short lookup key, not an absolute
 * uniqueness guarantee; an authoritative collision-free case sequence
 * would require persistent server-side storage.
 */
export function formatLeadReference(requestId: string): string | null {
  if (!/^[a-f0-9]{24}$/.test(requestId)) return null;
  return 'HP-' + requestId.slice(0, 10).toUpperCase();
}
