export type ProjectStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";

export type EventType = "PVV" | "GWMS" | "Drilling" | "SV_Sampling" | "Excavation" | "Survey";

export type DocumentStatus = "Not Uploaded" | "Processing" | "Parsed";

export type FileFormat = "PDF" | "Excel" | "Word" | "CSV" | "Image";

export type RelationType = "Equals" | "Not Equals" | "Contains" | ">" | "<";

export type QAQCResult = "Passed" | "Failed";

export type QuestionStatus = "Passed" | "Failed";

export interface Project {
  project_id: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  start_date: string;
  end_date: string;
}

export interface Event {
  event_id: string;
  name: string;
  project: Project;
  start_datetime: string;
  end_datetime: string;
  event_types: EventType[];
}

export interface DocumentType {
  document_type_id: string;
  name: string;
  properties: string[];
}

export interface Document {
  document_id: string;
  event: Event;
  type: DocumentType;
  file_name: string;
  file_format: FileFormat;
  properties_values: Record<string, any>;
  status: DocumentStatus;
}

export interface Question {
  question_id: string;
  document_1: DocumentType;
  property_1: string;
  relation: RelationType;
  // Second part can be either document+property OR fixed value
  document_2?: DocumentType;
  property_2?: string;
  comparison_value?: string;
  system_value: string;
}

export interface Questionnaire {
  questionnaire_id: string;
  name: string;
  description: string;
  event_type?: EventType;
  questions: Question[];
}

export interface Result {
  question: Question;
  status: QuestionStatus;
  comment: string;
}

export interface QAQCProcess {
  process_id: string;
  name: string;
  description: string;
  time: string;
  event: Event;
  questionnaire: Questionnaire;
  result: QAQCResult;
  results: Result[];
}