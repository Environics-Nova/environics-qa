import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  Loader2,
  FileWarning,
  Download,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  /** URL or data source for the PDF */
  url: string | null;
  /** Optional: a local File object for immediate preview */
  file?: File | null;
  /** Title to show in the toolbar */
  title?: string;
  /** Whether the document is still being processed */
  isProcessing?: boolean;
}

const ZOOM_STEP = 0.15;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const DEFAULT_ZOOM = 1.0;

export default function PdfViewer({
  url,
  file,
  title,
  isProcessing = false,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(DEFAULT_ZOOM);
  const [rotation, setRotation] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Determine the PDF source (local file takes priority for instant preview)
  const pdfSource = file ? file : url;

  // Observe container width for responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setCurrentPage(1);
      setLoadError(null);
    },
    []
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    setLoadError(error.message || "Failed to load PDF");
  }, []);

  const goToPreviousPage = () =>
    setCurrentPage((p) => Math.max(1, p - 1));

  const goToNextPage = () =>
    setCurrentPage((p) => Math.min(numPages, p + 1));

  const zoomIn = () =>
    setScale((s) => Math.min(MAX_ZOOM, s + ZOOM_STEP));

  const zoomOut = () =>
    setScale((s) => Math.max(MIN_ZOOM, s - ZOOM_STEP));

  const fitToWidth = () => {
    if (containerWidth > 0) {
      // Approximate: standard A4 width is 595 pts ≈ 595px at scale 1
      const fitScale = (containerWidth - 48) / 595;
      setScale(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, fitScale)));
    }
  };

  const rotate = () => setRotation((r) => (r + 90) % 360);

  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  const handleDownload = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  // ── No source provided ──
  if (!pdfSource) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/30 rounded-lg border border-dashed border-border p-12">
        <FileWarning className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground text-sm">
          No PDF available to display
        </p>
      </div>
    );
  }

  const zoomPercent = Math.round(scale * 100);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-muted/20 rounded-lg border border-border overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none border-none"
          : "h-full"
      }`}
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-card border-b border-border shrink-0">
        {/* Left: title + processing */}
        <div className="flex items-center gap-2 min-w-0">
          {title && (
            <span className="text-sm font-medium truncate max-w-[200px]">
              {title}
            </span>
          )}
          {isProcessing && (
            <span className="inline-flex items-center gap-1.5 text-xs text-processing px-2 py-0.5 rounded-full bg-processing/10 border border-processing/20 animate-pulse shrink-0">
              <Loader2 className="w-3 h-3 animate-spin" />
              Extracting…
            </span>
          )}
        </div>

        {/* Center: page navigation */}
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page</TooltipContent>
          </Tooltip>

          <span className="text-xs tabular-nums text-muted-foreground select-none min-w-[60px] text-center">
            {currentPage} / {numPages || "–"}
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={goToNextPage}
                disabled={currentPage >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page</TooltipContent>
          </Tooltip>
        </div>

        {/* Right: zoom + controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={zoomOut}
                disabled={scale <= MIN_ZOOM}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>

          <button
            onClick={fitToWidth}
            className="text-xs tabular-nums text-muted-foreground hover:text-foreground transition-colors min-w-[40px] text-center"
            title="Click to fit to width"
          >
            {zoomPercent}%
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={zoomIn}
                disabled={scale >= MAX_ZOOM}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={rotate}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate</TooltipContent>
          </Tooltip>

          {url && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* ── PDF Canvas ── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-[hsl(var(--muted)/0.3)]"
      >
        {loadError ? (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <FileWarning className="w-12 h-12 text-destructive/50 mb-4" />
            <p className="text-sm text-destructive font-medium mb-1">
              Failed to load PDF
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              {loadError}
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-4 px-2">
            <Document
              file={pdfSource}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Loading PDF…
                  </p>
                </div>
              }
              className="pdf-document"
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
                loading={
                  <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                }
                className="pdf-page shadow-lg rounded-sm"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  );
}
