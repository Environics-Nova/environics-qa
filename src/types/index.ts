// ──────────────────────────────────────────────
// Status & Enum Types
// ──────────────────────────────────────────────
export type ProjectStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";
export type EventType = "PVV" | "GWMS" | "Drilling" | "SV_Sampling" | "Excavation" | "Survey";
export type DocumentStatus = "Not Uploaded" | "Processing" | "Parsed" | "Extraction Failed";
export type FileFormat = "PDF" | "Excel" | "Word" | "CSV" | "Image";
export type RelationType = "Equals" | "Not Equals" | "Contains" | ">" | "<";
export type QAQCResult = "Passed" | "Failed" | "Pending";
export type QuestionStatus = "Passed" | "Failed" | "Pending";

// ──────────────────────────────────────────────
// API Response Envelopes
// ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// ──────────────────────────────────────────────
// Domain Models
// ──────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  start_date: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  project_id: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  event_types: EventType[];
  project?: Project;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyDef {
  name: string;
  type: string;
}

export interface DocumentType {
  id: string;
  name: string;
  properties: PropertyDef[];
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Document {
  id: string;
  event_id: string;
  document_type_id: string;
  file_name: string;
  file_format: FileFormat;
  file_path?: string;
  properties_values: Record<string, string | number | boolean | null>;
  status: DocumentStatus;
  extraction_job_id?: string;
  extraction_status?: string;
  event?: Event;
  document_type?: DocumentType;
  created_at?: string;
  updated_at?: string;
}

export interface Question {
  id: string;
  questionnaire_id: string;
  document_1_id: string;
  property_1: string;
  relation: RelationType;
  document_2_id?: string;
  property_2?: string;
  comparison_value?: string;
  system_value: string;
  document_1?: DocumentType;
  document_2?: DocumentType;
}

export interface Questionnaire {
  id: string;
  name: string;
  description: string;
  event_type?: EventType;
  organization_id?: string;
  questions?: Question[];
  question_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Result {
  id: string;
  process_id: string;
  question_id: string;
  status: QuestionStatus;
  comment: string;
  question?: Question;
}

export interface QAQCProcess {
  id: string;
  name: string;
  description: string;
  time: string;
  event_id: string;
  questionnaire_id: string;
  result: QAQCResult;
  event?: Event;
  questionnaire?: Questionnaire;
  results?: Result[];
  created_at?: string;
  updated_at?: string;
}

// ──────────────────────────────────────────────
// Request DTOs
// ──────────────────────────────────────────────
export interface CreateProjectRequest {
  name: string;
  client: string;
  location: string;
  status?: ProjectStatus;
  start_date: string;
  end_date?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  client?: string;
  location?: string;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
}

export interface CreateEventRequest {
  name: string;
  start_datetime: string;
  end_datetime: string;
  event_types: EventType[];
}

export interface UpdateEventRequest {
  name?: string;
  start_datetime?: string;
  end_datetime?: string;
  event_types?: EventType[];
}

export interface CreateDocumentRequest {
  document_type_id: string;
  file_name: string;
  file_format: FileFormat;
}

export interface CreateDocumentTypeRequest {
  name: string;
  properties: PropertyDef[];
}

export interface UpdateDocumentRequest {
  properties_values?: Record<string, string | number | boolean | null>;
  status?: DocumentStatus;
}

export interface CreateQuestionnaireRequest {
  name: string;
  description: string;
  event_type?: EventType;
}

export interface UpdateQuestionnaireRequest {
  name?: string;
  description?: string;
  event_type?: EventType;
}

export interface CreateQuestionRequest {
  document_1_id: string;
  property_1: string;
  relation: RelationType;
  document_2_id?: string;
  property_2?: string;
  comparison_value?: string;
  system_value?: string;
}

export interface UpdateQuestionRequest {
  document_1_id?: string;
  property_1?: string;
  relation?: RelationType;
  document_2_id?: string;
  property_2?: string;
  comparison_value?: string;
  system_value?: string;
}

export interface CreateQAQCProcessRequest {
  name: string;
  description?: string;
  event_id: string;
  questionnaire_id: string;
}