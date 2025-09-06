import { Project, Event, DocumentType, Document, EventType, Questionnaire, Question, QAQCProcess, Result } from "../types";

// Document Types
export const documentTypes: DocumentType[] = [
  {
    document_type_id: "dt-1",
    name: "Drilling Log",
    properties: ["Depth", "Soil_Type", "Moisture_Content", "PID_Reading", "Sample_ID"]
  },
  {
    document_type_id: "dt-2", 
    name: "Groundwater Monitoring",
    properties: ["Well_ID", "Water_Level", "pH", "Conductivity", "Temperature", "Turbidity"]
  },
  {
    document_type_id: "dt-3",
    name: "Soil Sample Analysis",
    properties: ["Sample_ID", "Depth", "VOC_Concentration", "SVOC_Concentration", "Metals_Concentration"]
  },
  {
    document_type_id: "dt-4",
    name: "Site Survey Report",
    properties: ["Survey_Date", "Surveyor", "Equipment_Used", "Coordinates", "Elevation"]
  }
];

// Sample Projects
export const sampleProjects: Project[] = [
  {
    project_id: "proj-1",
    name: "Downtown Manufacturing Site Assessment",
    client: "Acme Manufacturing Corp",
    location: "123 Industrial Ave, Toronto, ON",
    status: "In Progress",
    start_date: "2024-01-15",
    end_date: "2024-06-30"
  },
  {
    project_id: "proj-2", 
    name: "Former Gas Station Remediation",
    client: "Petrol Plus Inc",
    location: "456 Main St, Vancouver, BC",
    status: "Completed",
    start_date: "2023-08-01",
    end_date: "2024-02-28"
  },
  {
    project_id: "proj-3",
    name: "Industrial Complex Phase II ESA",
    client: "Metro Development Ltd",
    location: "789 Commerce Blvd, Calgary, AB",
    status: "Not Started", 
    start_date: "2024-03-01",
    end_date: "2024-09-15"
  },
  {
    project_id: "proj-4",
    name: "Waterfront Redevelopment Assessment",
    client: "Coastal Properties Inc",
    location: "321 Harbor Dr, Halifax, NS",
    status: "In Progress",
    start_date: "2024-02-01",
    end_date: "2024-08-31"
  }
];

// Sample Events
export const sampleEvents: Event[] = [
  {
    event_id: "evt-1",
    name: "Initial Site Investigation",
    project: sampleProjects[0],
    start_datetime: "2024-01-20T09:00:00",
    end_datetime: "2024-01-20T17:00:00",
    event_types: ["Drilling", "SV_Sampling"]
  },
  {
    event_id: "evt-2",
    name: "Groundwater Monitoring Round 1",
    project: sampleProjects[0], 
    start_datetime: "2024-02-01T08:00:00",
    end_datetime: "2024-02-01T16:00:00",
    event_types: ["GWMS"]
  },
  {
    event_id: "evt-3",
    name: "Vapor Monitoring & Site Survey",
    project: sampleProjects[1],
    start_datetime: "2023-08-15T10:00:00", 
    end_datetime: "2023-08-15T18:00:00",
    event_types: ["PVV", "Survey"]
  },
  {
    event_id: "evt-4",
    name: "Remediation Excavation Phase 1",
    project: sampleProjects[3],
    start_datetime: "2024-02-10T09:30:00",
    end_datetime: "2024-02-10T15:30:00", 
    event_types: ["Excavation", "SV_Sampling"]
  }
];

// Sample Documents
export const sampleDocuments: Document[] = [
  {
    document_id: "doc-1",
    event: sampleEvents[0],
    type: documentTypes[0],
    file_name: "drilling_log_BH01.pdf",
    file_format: "PDF",
    status: "Parsed",
    properties_values: {
      "Depth": "15.2 m",
      "Soil_Type": "Clay with sand",
      "Moisture_Content": "18%", 
      "PID_Reading": "45 ppm",
      "Sample_ID": "BH01-5.0"
    }
  },
  {
    document_id: "doc-2",
    event: sampleEvents[0], 
    type: documentTypes[2],
    file_name: "soil_analysis_BH01.xlsx",
    file_format: "Excel",
    status: "Processing",
    properties_values: {}
  },
  {
    document_id: "doc-3",
    event: sampleEvents[1],
    type: documentTypes[1],
    file_name: "groundwater_monitoring_MW01.pdf", 
    file_format: "PDF",
    status: "Not Uploaded",
    properties_values: {}
  },
  {
    document_id: "doc-4",
    event: sampleEvents[0],
    type: documentTypes[3],
    file_name: "site_survey_jan2024.pdf",
    file_format: "PDF", 
    status: "Parsed",
    properties_values: {
      "Survey_Date": "2024-01-20",
      "Surveyor": "John Smith, P.Eng",
      "Equipment_Used": "Total Station, GPS",
      "Coordinates": "43.6532° N, 79.3832° W",
      "Elevation": "76.2 m"
    }
  }
];

// Helper functions to get related data
export const getProjectEvents = (projectId: string): Event[] => {
  return sampleEvents.filter(event => event.project.project_id === projectId);
};

export const getEventDocuments = (eventId: string): Document[] => {
  return sampleDocuments.filter(doc => doc.event.event_id === eventId);
};

export const getRequiredDocuments = (eventTypes: EventType[]): DocumentType[] => {
  const requiredDocs: DocumentType[] = [];
  
  eventTypes.forEach(type => {
    switch(type) {
      case "Drilling":
        requiredDocs.push(documentTypes[0]); // Drilling Log
        break;
      case "GWMS": 
        requiredDocs.push(documentTypes[1]); // Groundwater Monitoring
        break;
      case "SV_Sampling":
        requiredDocs.push(documentTypes[2]); // Soil Sample Analysis
        break;
      case "Survey":
        requiredDocs.push(documentTypes[3]); // Site Survey Report
        break;
    }
  });
  
  return requiredDocs;
};