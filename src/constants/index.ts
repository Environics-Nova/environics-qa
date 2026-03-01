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
  Drilling: ["Drilling Log"],
  GWMS: ["Groundwater Monitoring"],
  SV_Sampling: ["Soil Sample Analysis"],
  Survey: ["Site Survey Report"],
  PVV: [],
  Excavation: [],
};

/** Duration (in ms) after which the success dialog auto-closes */
export const UPLOAD_SUCCESS_CLOSE_DELAY_MS = 1500;

/** Polling interval (in ms) for checking document extraction status */
export const EXTRACTION_POLL_INTERVAL_MS = 5000;
