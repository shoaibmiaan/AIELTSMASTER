// src/lib/readingBandMap.ts

/**
 * Converts a raw IELTS Reading score (0–40) into an IELTS Band score (1.0–9.0)
 * Based on official Academic IELTS band conversion charts.
 */
export function mapRawScoreToBand(score: number): number {
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 33) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 27) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 19) return 5.5;
  if (score >= 15) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 8) return 3.5;
  if (score >= 6) return 3.0;
  if (score >= 4) return 2.5;
  if (score >= 2) return 2.0;
  if (score >= 1) return 1.5;
  return 1.0; // Score 0 or unattempted
}
