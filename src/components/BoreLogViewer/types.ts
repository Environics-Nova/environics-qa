// ──────────────────────────────────────────────
// Bore Log Report Types
// Matches the JSON schema from ESlog / eSdat
// ──────────────────────────────────────────────

/** Root data structure containing all reports and shared images */
export interface BoreLogData {
  reports: BoreLogReport[];
  images?: BoreLogImage[];
}

/** A shared image (e.g. logo) referenced by id */
export interface BoreLogImage {
  id: string;
  width: number;
  height: number;
  base64Data: string;
}

// ──────────────────────────────────────────────
// Report
// ──────────────────────────────────────────────
export interface BoreLogReport {
  id: number;
  versionId?: number;
  name: string;
  depthPerPage: number;
  startDepth: number;
  endDepth: number;
  endDepthComment?: string;
  fontSize?: number;
  elevation?: number | string;
  headerRows: HeaderRow[];
  columns: BoreLogColumn[];
  footerRows: FooterRow[];
}

// ──────────────────────────────────────────────
// Header
// ──────────────────────────────────────────────
export interface HeaderRow {
  id: number;
  showOnAllPages?: boolean;
  height: string | number;
  columns: HeaderColumn[];
}

export interface HeaderColumn {
  id: number;
  width?: number;
  halign?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  borderTop?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  border?: boolean;
  items: HeaderItem[];
}

export interface HeaderItem {
  id: number;
  label?: string;
  text?: string | null;
  image?: string;
  fontSize?: number;
  wrap?: boolean;
}

// ──────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────
export interface FooterRow {
  id: number;
  showOnAllPages?: boolean;
  height: number;
  columns: FooterColumn[];
}

export interface FooterColumn {
  id: number;
  width?: number;
  halign?: 'left' | 'center' | 'right';
  items: FooterItem[];
}

export interface FooterItem {
  id: number;
  label?: string;
  text?: string;
}

// ──────────────────────────────────────────────
// Column Types
// ──────────────────────────────────────────────
export type ColumnType = 'text' | 'axis' | 'graphic' | 'chart';

export interface BaseColumn {
  id: number;
  text: string;
  type: ColumnType;
  width: number | string;
  hidden?: boolean;
  fontSize?: string | number;
}

// ── Text Column ─────────────────────────────
export interface TextColumn extends BaseColumn {
  type: 'text';
  blocks: TextBlock[];
  autoAdjust?: boolean;
  showEndDepthComment?: boolean;
  enableWaterStrikesEdit?: boolean;
  waterStrikesOffset?: number | string;
  waterStrikesStyle?: string;
  waterStrikesShowIncCount?: boolean;
  waterStrikes?: WaterStrike[];
}

export interface TextBlock {
  id: number;
  d1: number;
  d2: number;
  text: string | number;
  depthRange?: string;
  topLineDashes?: number[];
  width?: number;
  offset?: number;
  background?: string;
  DSource?: string;
}

// ── Axis Column ─────────────────────────────
export interface AxisColumn extends BaseColumn {
  type: 'axis';
  majorTickFrequency?: number;
  minorTickFrequency?: number;
  yAxis?: YAxisConfig;
}

export interface YAxisConfig {
  autoCalculateTicks?: boolean;
  valueType: 'depth' | 'elevation' | 'scaleExpression';
  scaleExpression?: string;
  majorTickFrequency?: number;
  minorTickFrequency?: number;
}

// ── Graphic Column ──────────────────────────
export interface GraphicColumn extends BaseColumn {
  type: 'graphic';
  blocks: GraphicBlock[];
  showAnnotation?: boolean;
  defaultBlockWidth?: number | string;
  defaultBlockOffset?: number | string;
  headerOrientation?: 'horizontal' | 'vertical';
  annotationOrientation?: 'horizontal' | 'vertical';
  enableWellsEdit?: boolean;
  enableWellEdit?: boolean;
  enableWaterStrikesEdit?: boolean;
  waterStrikesOffset?: number | string;
  waterStrikesStyle?: string;
  waterStrikesShowIncCount?: boolean;
  waterStrikes?: WaterStrike[];
  wellConstructionWidth?: number;
  showWellNameForMultiWells?: boolean;
  wells?: WellConstruction[];
}

export interface GraphicBlock {
  id: number;
  d1: number;
  d2: number;
  graphicId?: string | null;
  text?: string;
  topLineDashes?: number[];
  background?: string;
  width?: number;
  offset?: number;
}

// ── Chart Column ────────────────────────────
export interface ChartColumn extends BaseColumn {
  type: 'chart';
  data: ChartDataPoint[];
  colour?: string;
  color?: string;
  useDepthRange?: boolean;
  xScaleStart?: number | string;
  xScaleEnd?: number | string;
  showXScaleLabels?: boolean;
  showXScaleGuidelines?: boolean;
  useLogScale?: boolean;
  dataPointSize?: string | number;
  lineWeight?: string | number;
  xScaleGuidelineColour?: string;
  xScaleGuidelines?: ChartGuideline[];
}

export interface ChartDataPoint {
  id: number;
  d1: number;
  d2: number | null;
  value?: number | string;
  text?: string;
  depthRange?: string;
  DSource?: string;
}

export interface ChartGuideline {
  id: number;
  value: number;
  label: string;
}

// ──────────────────────────────────────────────
// Well Construction
// ──────────────────────────────────────────────
export interface WellConstruction {
  id: number;
  name: string;
  topCasing: string | number;
  bottomCasing: string | number;
  topScreen: string | number;
  bottomScreen: string | number;
  bottomCap?: string | number;
}

// ──────────────────────────────────────────────
// Water Strike
// ──────────────────────────────────────────────
export interface WaterStrike {
  id: number;
  depth: number | string;
  recovery: number | string | null;
}

// ──────────────────────────────────────────────
// Union type for any column
// ──────────────────────────────────────────────
export type BoreLogColumn = TextColumn | AxisColumn | GraphicColumn | ChartColumn;

// ──────────────────────────────────────────────
// Type guards
// ──────────────────────────────────────────────
export function isTextColumn(col: BoreLogColumn): col is TextColumn {
  return col.type === 'text';
}

export function isAxisColumn(col: BoreLogColumn): col is AxisColumn {
  return col.type === 'axis';
}

export function isGraphicColumn(col: BoreLogColumn): col is GraphicColumn {
  return col.type === 'graphic';
}

export function isChartColumn(col: BoreLogColumn): col is ChartColumn {
  return col.type === 'chart';
}
