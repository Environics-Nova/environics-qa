/** Mapping of file extensions to human-readable format labels */
export const FILE_FORMAT_MAP: Record<string, string> = {
  pdf: "PDF",
  xls: "Excel",
  xlsx: "Excel",
  doc: "Word",
  docx: "Word",
  csv: "CSV",
  png: "Image",
  jpg: "Image",
  jpeg: "Image",
};

/** Accepted file extensions for document upload */
export const ACCEPTED_FILE_EXTENSIONS =
  ".pdf,.xls,.xlsx,.doc,.docx,.csv,.png,.jpg,.jpeg";

/** Map of event types to their required document type names */
export const EVENT_TYPE_TO_DOC_TYPE: Record<string, string[]> = {
  Survey: ["Survey Log"],
  SVSampling: ["Soil Vapour Log"],
  Drilling: ["Borehole Log"],
  PVV: ["Daily field activity log"],
  Excavation: ["Confirmatory & interim Soil Samples"],
  GWMS: ["GWMS Logs"],
};

/** Duration (in ms) after which the success dialog auto-closes */
export const UPLOAD_SUCCESS_CLOSE_DELAY_MS = 1500;

/** Polling interval (in ms) for checking document extraction status */
export const EXTRACTION_POLL_INTERVAL_MS = 5000;
