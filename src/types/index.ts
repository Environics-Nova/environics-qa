export type ProjectStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";

export type EventType = "PVV" | "GWMS" | "Drilling" | "SV_Sampling" | "Excavation" | "Survey";

export type DocumentStatus = "Not Uploaded" | "Processing" | "Parsed";

export type FileFormat = "PDF" | "Excel" | "Word" | "CSV" | "Image";

export type RelationType = "Equals" | "Not Equals" | "Contains" | ">" | "<";

export type QAQCResult = "Passed" | "Failed";

export type QuestionStatus = "Passed" | "Failed";

// API Response types
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

// Domain types matching API responses
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

// Legacy type alias for backward compatibility
export interface LegacyProject {
  project_id: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  start_date: string;
  end_date?: string;
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

// Legacy type alias for backward compatibility
export interface LegacyEvent {
  event_id: string;
  name: string;
  project: LegacyProject;
  start_datetime: string;
  end_datetime: string;
  event_types: EventType[];
}

export interface DocumentType {
  id: string;
  name: string;
  properties: string[];
  organization_id?: string;
}

// Legacy type alias for backward compatibility
export interface LegacyDocumentType {
  document_type_id: string;
  name: string;
  properties: string[];
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
  event?: Event;
  document_type?: DocumentType;
  created_at?: string;
  updated_at?: string;
}

// Legacy type alias for backward compatibility
export interface LegacyDocument {
  document_id: string;
  event: LegacyEvent;
  type: LegacyDocumentType;
  file_name: string;
  file_format: FileFormat;
  properties_values: Record<string, string | number | boolean | null>;
  status: DocumentStatus;
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

// Legacy type alias for backward compatibility
export interface LegacyQuestion {
  question_id: string;
  document_1: LegacyDocumentType;
  property_1: string;
  relation: RelationType;
  document_2?: LegacyDocumentType;
  property_2?: string;
  comparison_value?: string;
  system_value: string;
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

// Legacy type alias for backward compatibility
export interface LegacyQuestionnaire {
  questionnaire_id: string;
  name: string;
  description: string;
  event_type?: EventType;
  questions: LegacyQuestion[];
}

export interface Result {
  id: string;
  process_id: string;
  question_id: string;
  status: QuestionStatus;
  comment: string;
  question?: Question;
}

// Legacy type alias for backward compatibility
export interface LegacyResult {
  question: LegacyQuestion;
  status: QuestionStatus;
  comment: string;
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

// Legacy type alias for backward compatibility
export interface LegacyQAQCProcess {
  process_id: string;
  name: string;
  description: string;
  time: string;
  event: LegacyEvent;
  questionnaire: LegacyQuestionnaire;
  result: QAQCResult;
  results: LegacyResult[];
}

// Request DTOs
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