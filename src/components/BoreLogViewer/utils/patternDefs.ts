/**
 * SVG pattern definitions for geological symbols used in bore logs.
 * Each pattern is designed to tile seamlessly at the specified dimensions.
 */

export interface PatternDef {
  id: string;
  label: string;
  width: number;
  height: number;
  /** SVG path/shape elements (inner content of <pattern>) */
  content: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

// ──────────────────────────────────────────────
// USCS Soil Classification Patterns
// ──────────────────────────────────────────────
const USCS_PATTERNS: PatternDef[] = [
  {
    id: 'uscs-cl',
    label: 'Clay (CL)',
    width: 16,
    height: 12,
    content: `
      <line x1="0" y1="4" x2="16" y2="4" stroke="#555" stroke-width="0.6"/>
      <line x1="0" y1="8" x2="16" y2="8" stroke="#555" stroke-width="0.6"/>
      <line x1="3" y1="0" x2="3" y2="4" stroke="#555" stroke-width="0.4"/>
      <line x1="8" y1="0" x2="8" y2="4" stroke="#555" stroke-width="0.4"/>
      <line x1="13" y1="0" x2="13" y2="4" stroke="#555" stroke-width="0.4"/>
      <line x1="5.5" y1="4" x2="5.5" y2="8" stroke="#555" stroke-width="0.4"/>
      <line x1="10.5" y1="4" x2="10.5" y2="8" stroke="#555" stroke-width="0.4"/>
      <line x1="3" y1="8" x2="3" y2="12" stroke="#555" stroke-width="0.4"/>
      <line x1="8" y1="8" x2="8" y2="12" stroke="#555" stroke-width="0.4"/>
      <line x1="13" y1="8" x2="13" y2="12" stroke="#555" stroke-width="0.4"/>
    `,
  },
  {
    id: 'uscs-gp',
    label: 'Gravel, Poorly Graded (GP)',
    width: 20,
    height: 16,
    content: `
      <circle cx="5" cy="4" r="2.5" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="15" cy="4" r="1.8" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="10" cy="12" r="2.2" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="2" cy="12" r="1.5" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="17" cy="11" r="2" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="8" cy="6" r="0.7" fill="#555"/>
      <circle cx="13" cy="9" r="0.7" fill="#555"/>
      <circle cx="3" cy="8" r="0.5" fill="#555"/>
    `,
  },
  {
    id: 'uscs-gw',
    label: 'Gravel, Well Graded (GW)',
    width: 20,
    height: 16,
    content: `
      <circle cx="5" cy="4" r="3" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="15" cy="5" r="2" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="10" cy="12" r="2.5" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="3" cy="12" r="1.5" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="17" cy="12" r="1.8" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="8" cy="7" r="0.8" fill="#555"/>
      <circle cx="14" cy="9" r="0.6" fill="#555"/>
      <circle cx="2" cy="7" r="0.5" fill="#555"/>
      <circle cx="18" cy="3" r="0.5" fill="#555"/>
    `,
  },
  {
    id: 'uscs-sc',
    label: 'Clayey Sand (SC)',
    width: 20,
    height: 16,
    content: `
      <circle cx="3" cy="3" r="0.8" fill="#555"/>
      <circle cx="8" cy="2" r="0.7" fill="#555"/>
      <circle cx="14" cy="4" r="0.8" fill="#555"/>
      <circle cx="18" cy="2" r="0.6" fill="#555"/>
      <circle cx="5" cy="7" r="0.7" fill="#555"/>
      <circle cx="11" cy="6" r="0.6" fill="#555"/>
      <circle cx="16" cy="8" r="0.7" fill="#555"/>
      <line x1="0" y1="11" x2="20" y2="11" stroke="#555" stroke-width="0.5"/>
      <line x1="4" y1="11" x2="4" y2="16" stroke="#555" stroke-width="0.3"/>
      <line x1="10" y1="11" x2="10" y2="16" stroke="#555" stroke-width="0.3"/>
      <line x1="16" y1="11" x2="16" y2="16" stroke="#555" stroke-width="0.3"/>
      <circle cx="2" cy="14" r="0.6" fill="#555"/>
      <circle cx="8" cy="13" r="0.7" fill="#555"/>
      <circle cx="14" cy="14" r="0.6" fill="#555"/>
    `,
  },
  {
    id: 'uscs-sm',
    label: 'Silty Sand (SM)',
    width: 16,
    height: 12,
    content: `
      <circle cx="3" cy="3" r="0.7" fill="#555"/>
      <circle cx="8" cy="2" r="0.6" fill="#555"/>
      <circle cx="13" cy="4" r="0.7" fill="#555"/>
      <circle cx="5" cy="7" r="0.6" fill="#555"/>
      <circle cx="11" cy="6" r="0.5" fill="#555"/>
      <circle cx="2" cy="10" r="0.6" fill="#555"/>
      <circle cx="8" cy="9" r="0.7" fill="#555"/>
      <circle cx="14" cy="10" r="0.5" fill="#555"/>
    `,
  },
  {
    id: 'uscs-pt',
    label: 'Peat (PT)',
    width: 20,
    height: 12,
    content: `
      <path d="M0,3 C3,1 6,5 10,3 C14,1 17,5 20,3" fill="none" stroke="#555" stroke-width="0.7"/>
      <path d="M0,7 C3,5 6,9 10,7 C14,5 17,9 20,7" fill="none" stroke="#555" stroke-width="0.7"/>
      <path d="M0,11 C3,9 6,13 10,11 C14,9 17,13 20,11" fill="none" stroke="#555" stroke-width="0.7"/>
      <line x1="4" y1="2" x2="4" y2="4" stroke="#333" stroke-width="0.4"/>
      <line x1="12" y1="6" x2="12" y2="8" stroke="#333" stroke-width="0.4"/>
    `,
  },
];

// ──────────────────────────────────────────────
// BGS Rock Patterns
// ──────────────────────────────────────────────
const BGS_PATTERNS: PatternDef[] = [
  {
    id: 'bgs-gran',
    label: 'Granite',
    width: 16,
    height: 16,
    content: `
      <line x1="2" y1="2" x2="6" y2="6" stroke="#555" stroke-width="0.6"/>
      <line x1="6" y1="2" x2="2" y2="6" stroke="#555" stroke-width="0.6"/>
      <line x1="10" y1="10" x2="14" y2="14" stroke="#555" stroke-width="0.6"/>
      <line x1="14" y1="10" x2="10" y2="14" stroke="#555" stroke-width="0.6"/>
      <line x1="10" y1="2" x2="14" y2="6" stroke="#555" stroke-width="0.6"/>
      <line x1="14" y1="2" x2="10" y2="6" stroke="#555" stroke-width="0.6"/>
      <line x1="2" y1="10" x2="6" y2="14" stroke="#555" stroke-width="0.6"/>
      <line x1="6" y1="10" x2="2" y2="14" stroke="#555" stroke-width="0.6"/>
    `,
  },
  {
    id: 'bgs-sltst',
    label: 'Siltstone',
    width: 16,
    height: 8,
    content: `
      <line x1="0" y1="4" x2="16" y2="4" stroke="#555" stroke-width="0.6"/>
      <circle cx="4" cy="2" r="0.4" fill="#555"/>
      <circle cx="12" cy="2" r="0.4" fill="#555"/>
      <circle cx="8" cy="6" r="0.4" fill="#555"/>
    `,
  },
  {
    id: 'bgs-quart',
    label: 'Quartzite',
    width: 16,
    height: 16,
    content: `
      <line x1="0" y1="4" x2="16" y2="4" stroke="#555" stroke-width="0.5"/>
      <line x1="0" y1="12" x2="16" y2="12" stroke="#555" stroke-width="0.5"/>
      <line x1="4" y1="0" x2="4" y2="4" stroke="#555" stroke-width="0.5"/>
      <line x1="12" y1="0" x2="12" y2="4" stroke="#555" stroke-width="0.5"/>
      <line x1="8" y1="4" x2="8" y2="12" stroke="#555" stroke-width="0.5"/>
      <line x1="4" y1="12" x2="4" y2="16" stroke="#555" stroke-width="0.5"/>
      <line x1="12" y1="12" x2="12" y2="16" stroke="#555" stroke-width="0.5"/>
    `,
  },
];

// ──────────────────────────────────────────────
// USGS Rock Patterns
// ──────────────────────────────────────────────
const USGS_PATTERNS: PatternDef[] = [
  {
    id: 'usgs-602',
    label: 'Conglomerate',
    width: 20,
    height: 16,
    content: `
      <circle cx="6" cy="5" r="3" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="16" cy="4" r="2" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="10" cy="13" r="2.5" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="3" cy="13" r="1.5" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="18" cy="12" r="1.8" fill="none" stroke="#555" stroke-width="0.7"/>
      <circle cx="12" cy="7" r="0.5" fill="#555"/>
      <circle cx="4" cy="9" r="0.5" fill="#555"/>
    `,
  },
  {
    id: 'usgs-607',
    label: 'Sandstone',
    width: 16,
    height: 12,
    content: `
      <circle cx="2" cy="2" r="0.6" fill="#555"/>
      <circle cx="6" cy="3" r="0.5" fill="#555"/>
      <circle cx="10" cy="1.5" r="0.6" fill="#555"/>
      <circle cx="14" cy="2.5" r="0.5" fill="#555"/>
      <circle cx="4" cy="6" r="0.6" fill="#555"/>
      <circle cx="8" cy="5.5" r="0.5" fill="#555"/>
      <circle cx="12" cy="6.5" r="0.6" fill="#555"/>
      <circle cx="2" cy="9.5" r="0.5" fill="#555"/>
      <circle cx="6" cy="10" r="0.6" fill="#555"/>
      <circle cx="10" cy="9" r="0.5" fill="#555"/>
      <circle cx="14" cy="10.5" r="0.6" fill="#555"/>
    `,
  },
];

// ──────────────────────────────────────────────
// Other Patterns
// ──────────────────────────────────────────────
const OTHER_PATTERNS: PatternDef[] = [
  {
    id: 'other-04',
    label: 'Asphalt / Fill',
    width: 12,
    height: 12,
    content: `
      <rect x="0" y="0" width="12" height="12" fill="#333"/>
    `,
  },
];

// ──────────────────────────────────────────────
// Backfill Patterns (for well construction)
// ──────────────────────────────────────────────
const BACKFILL_PATTERNS: PatternDef[] = [
  {
    id: 'bkfl-10',
    label: 'Backfill',
    width: 10,
    height: 10,
    content: `
      <circle cx="2" cy="2" r="1.2" fill="none" stroke="#666" stroke-width="0.6"/>
      <circle cx="7" cy="3" r="1.6" fill="none" stroke="#666" stroke-width="0.6"/>
      <circle cx="4" cy="7" r="1.4" fill="none" stroke="#666" stroke-width="0.6"/>
      <circle cx="9" cy="8" r="1" fill="none" stroke="#666" stroke-width="0.6"/>
    `,
  },
  {
    id: 'bkfl-22',
    label: 'Bentonite',
    width: 8,
    height: 8,
    content: `
      <line x1="0" y1="8" x2="8" y2="0" stroke="#555" stroke-width="0.7"/>
      <line x1="-4" y1="8" x2="4" y2="0" stroke="#555" stroke-width="0.7"/>
      <line x1="4" y1="8" x2="12" y2="0" stroke="#555" stroke-width="0.7"/>
    `,
  },
  {
    id: 'bkfl-31',
    label: 'Filter Pack / Sand',
    width: 8,
    height: 8,
    content: `
      <circle cx="2" cy="2" r="0.7" fill="#777"/>
      <circle cx="6" cy="2" r="0.7" fill="#777"/>
      <circle cx="4" cy="5" r="0.7" fill="#777"/>
      <circle cx="1" cy="7" r="0.7" fill="#777"/>
      <circle cx="7" cy="7" r="0.7" fill="#777"/>
    `,
  },
  {
    id: 'bkfl-32',
    label: 'Fine Grained Sand',
    width: 6,
    height: 6,
    content: `
      <circle cx="1.5" cy="1.5" r="0.4" fill="#888"/>
      <circle cx="4.5" cy="1.5" r="0.4" fill="#888"/>
      <circle cx="3" cy="3" r="0.4" fill="#888"/>
      <circle cx="1.5" cy="4.5" r="0.4" fill="#888"/>
      <circle cx="4.5" cy="4.5" r="0.4" fill="#888"/>
    `,
  },
  {
    id: 'bkfl-42',
    label: 'Concrete / Grout',
    width: 6,
    height: 6,
    content: `
      <line x1="0" y1="6" x2="6" y2="0" stroke="#555" stroke-width="0.6"/>
      <line x1="-3" y1="6" x2="3" y2="0" stroke="#555" stroke-width="0.6"/>
      <line x1="3" y1="6" x2="9" y2="0" stroke="#555" stroke-width="0.6"/>
      <line x1="0" y1="0" x2="6" y2="6" stroke="#555" stroke-width="0.6"/>
      <line x1="-3" y1="0" x2="3" y2="6" stroke="#555" stroke-width="0.6"/>
      <line x1="3" y1="0" x2="9" y2="6" stroke="#555" stroke-width="0.6"/>
    `,
  },
  {
    id: 'bkfl-50',
    label: 'Collapsed / Natural',
    width: 14,
    height: 10,
    content: `
      <circle cx="4" cy="3" r="2.5" fill="none" stroke="#666" stroke-width="0.7"/>
      <circle cx="11" cy="4" r="2" fill="none" stroke="#666" stroke-width="0.7"/>
      <circle cx="7" cy="8" r="2.2" fill="none" stroke="#666" stroke-width="0.7"/>
      <circle cx="1" cy="8" r="1.3" fill="none" stroke="#666" stroke-width="0.7"/>
      <circle cx="13" cy="8" r="1.5" fill="none" stroke="#666" stroke-width="0.7"/>
    `,
  },
];

// ──────────────────────────────────────────────
// Combined Registry
// ──────────────────────────────────────────────
const ALL_PATTERNS: PatternDef[] = [
  ...USCS_PATTERNS,
  ...BGS_PATTERNS,
  ...USGS_PATTERNS,
  ...OTHER_PATTERNS,
  ...BACKFILL_PATTERNS,
];

const PATTERN_MAP = new Map<string, PatternDef>(
  ALL_PATTERNS.map((p) => [p.id, p]),
);

/**
 * Retrieve a pattern definition by its graphicId.
 */
export function getPatternDef(graphicId: string): PatternDef | undefined {
  return PATTERN_MAP.get(graphicId);
}

/**
 * Get all registered pattern definitions.
 */
export function getAllPatterns(): PatternDef[] {
  return ALL_PATTERNS;
}

/**
 * Generate an SVG <defs> element containing all pattern definitions.
 * Should be included once per SVG document.
 */
export function generatePatternDefsMarkup(): string {
  return ALL_PATTERNS.map(
    (p) => `<pattern id="pat-${p.id}" patternUnits="userSpaceOnUse" width="${p.width}" height="${p.height}">${p.content}</pattern>`
  ).join('\n');
}
