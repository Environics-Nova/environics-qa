# API Documentation

This document describes the data models, types, and future API endpoints for the Environics QA system.

## Current Status

**Note:** The application currently uses client-side mock data. This documentation describes the data structures and planned API endpoints for future backend integration.

## Data Models

### Project

Represents an environmental site assessment project.

```typescript
interface Project {
  project_id: string;      // Unique identifier (UUID)
  name: string;            // Project name
  client: string;          // Client organization
  location: string;        // Project location
  status: ProjectStatus;   // Current status
  start_date: string;      // ISO 8601 date
  end_date?: string;       // ISO 8601 date (optional)
}

type ProjectStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";
```

**Example:**
```json
{
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Downtown Site Assessment",
  "client": "Acme Corporation",
  "location": "123 Main St, Toronto, ON",
  "status": "In Progress",
  "start_date": "2025-01-15",
  "end_date": "2025-06-30"
}
```

### Event

Represents a field activity within a project.

```typescript
interface Event {
  event_id: string;        // Unique identifier (UUID)
  name: string;            // Event name
  project: Project;        // Parent project
  start_datetime: string;  // ISO 8601 datetime
  end_datetime: string;    // ISO 8601 datetime
  event_types: EventType[]; // Array of event types
}

type EventType = "PVV" | "GWMS" | "Drilling" | "SV_Sampling" | "Excavation" | "Survey";
```

**Example:**
```json
{
  "event_id": "650e8400-e29b-41d4-a716-446655440001",
  "name": "Initial Site Visit",
  "project": { /* Project object */ },
  "start_datetime": "2025-01-20T09:00:00Z",
  "end_datetime": "2025-01-20T15:00:00Z",
  "event_types": ["PVV", "Survey"]
}
```

### DocumentType

Defines a category of documents with expected properties.

```typescript
interface DocumentType {
  document_type_id: string; // Unique identifier (UUID)
  name: string;             // Type name
  properties: string[];     // Expected property names
}
```

**Example:**
```json
{
  "document_type_id": "750e8400-e29b-41d4-a716-446655440002",
  "name": "Field Data Form",
  "properties": [
    "Sample ID",
    "Collection Date",
    "Location",
    "Depth",
    "Collector Name"
  ]
}
```

### Document

Represents an uploaded document with extracted properties.

```typescript
interface Document {
  document_id: string;           // Unique identifier (UUID)
  event: Event;                  // Parent event
  type: DocumentType;            // Document type
  file_name: string;             // Original filename
  file_format: FileFormat;       // File format
  properties_values: Record<string, any>; // Extracted values
  status: DocumentStatus;        // Processing status
}

type FileFormat = "PDF" | "Excel" | "Word" | "CSV" | "Image";
type DocumentStatus = "Not Uploaded" | "Processing" | "Parsed";
```

**Example:**
```json
{
  "document_id": "850e8400-e29b-41d4-a716-446655440003",
  "event": { /* Event object */ },
  "type": { /* DocumentType object */ },
  "file_name": "field_data_2025-01-20.pdf",
  "file_format": "PDF",
  "status": "Parsed",
  "properties_values": {
    "Sample ID": "SW-001",
    "Collection Date": "2025-01-20",
    "Location": "Site A - North Corner",
    "Depth": "1.5m",
    "Collector Name": "John Smith"
  }
}
```

### Question

Represents a single validation rule in a questionnaire.

```typescript
interface Question {
  question_id: string;       // Unique identifier (UUID)
  document_1: DocumentType;  // First document type
  property_1: string;        // First property name
  relation: RelationType;    // Comparison operator
  document_2?: DocumentType; // Second document type (optional)
  property_2?: string;       // Second property name (optional)
  comparison_value?: string; // Fixed comparison value (optional)
  system_value: string;      // System-generated description
}

type RelationType = "Equals" | "Not Equals" | "Contains" | ">" | "<";
```

**Example (Document-to-Document):**
```json
{
  "question_id": "950e8400-e29b-41d4-a716-446655440004",
  "document_1": { /* Field Form DocumentType */ },
  "property_1": "Sample ID",
  "relation": "Equals",
  "document_2": { /* Lab Report DocumentType */ },
  "property_2": "Sample ID",
  "system_value": "Field Form.Sample ID Equals Lab Report.Sample ID"
}
```

**Example (Fixed Value):**
```json
{
  "question_id": "a50e8400-e29b-41d4-a716-446655440005",
  "document_1": { /* Lab Report DocumentType */ },
  "property_1": "pH",
  "relation": ">",
  "comparison_value": "6.5",
  "system_value": "Lab Report.pH > 6.5"
}
```

### Questionnaire

A collection of validation questions.

```typescript
interface Questionnaire {
  questionnaire_id: string; // Unique identifier (UUID)
  name: string;             // Questionnaire name
  description: string;      // Purpose description
  event_type?: EventType;   // Applicable event type (optional)
  questions: Question[];    // Validation questions
}
```

**Example:**
```json
{
  "questionnaire_id": "b50e8400-e29b-41d4-a716-446655440006",
  "name": "Groundwater Sampling QA/QC",
  "description": "Quality checks for groundwater monitoring events",
  "event_type": "GWMS",
  "questions": [
    { /* Question 1 */ },
    { /* Question 2 */ },
    { /* Question 3 */ }
  ]
}
```

### Result

Result of a single question validation.

```typescript
interface Result {
  question: Question;       // Question that was validated
  status: QuestionStatus;   // Pass or fail
  comment: string;          // System-generated explanation
}

type QuestionStatus = "Passed" | "Failed";
```

**Example:**
```json
{
  "question": { /* Question object */ },
  "status": "Passed",
  "comment": "Sample ID 'SW-001' matches in both Field Form and Lab Report"
}
```

### QAQCProcess

Execution of a questionnaire against event documents.

```typescript
interface QAQCProcess {
  process_id: string;       // Unique identifier (UUID)
  name: string;             // Process name
  description: string;      // Process description
  time: string;             // ISO 8601 datetime
  event: Event;             // Event being validated
  questionnaire: Questionnaire; // Questionnaire used
  result: QAQCResult;       // Overall result
  results: Result[];        // Individual question results
}

type QAQCResult = "Passed" | "Failed";
```

**Example:**
```json
{
  "process_id": "c50e8400-e29b-41d4-a716-446655440007",
  "name": "GWMS Quality Check - Jan 2025",
  "description": "Validation of groundwater monitoring data",
  "time": "2025-01-21T14:30:00Z",
  "event": { /* Event object */ },
  "questionnaire": { /* Questionnaire object */ },
  "result": "Passed",
  "results": [
    { /* Result 1 */ },
    { /* Result 2 */ },
    { /* Result 3 */ }
  ]
}
```

## Future API Endpoints

### Projects

#### GET /api/projects
Get all projects with pagination.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `per_page` (optional) - Items per page (default: 20, max: 100)
- `status` (optional) - Filter by status
- `year` (optional) - Filter by year
- `client` (optional) - Filter by client
- `search` (optional) - Search term

**Response:**
```json
{
  "data": [
    { /* Project 1 */ },
    { /* Project 2 */ }
  ],
  "page": 1,
  "per_page": 20,
  "total_pages": 1,
  "total": 2
}
```

#### GET /api/projects/:id
Get project by ID.

**Response:**
```json
{
  "data": { /* Project object */ }
}
```

#### POST /api/projects
Create new project.

**Request Body:**
```json
{
  "name": "New Project",
  "client": "Client Name",
  "location": "Location",
  "status": "Not Started",
  "start_date": "2025-01-15",
  "end_date": "2025-06-30"
}
```

**Response:**
```json
{
  "data": { /* Created project */ },
  "message": "Project created successfully"
}
```

#### PUT /api/projects/:id
Update project.

**Request Body:**
```json
{
  "name": "Updated Name",
  "status": "In Progress"
}
```

**Response:**
```json
{
  "data": { /* Updated project */ },
  "message": "Project updated successfully"
}
```

#### DELETE /api/projects/:id
Delete project.

**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

### Events

#### GET /api/events
Get all events with pagination.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `per_page` (optional) - Items per page (default: 20, max: 100)
- `project_id` (optional) - Filter by project
- `event_type` (optional) - Filter by event type
- `start_date` (optional) - Filter by start date
- `end_date` (optional) - Filter by end date

**Response:**
```json
{
  "data": [
    { /* Event 1 */ },
    { /* Event 2 */ }
  ],
  "page": 1,
  "per_page": 20,
  "total_pages": 1,
  "total": 2
}
```

#### GET /api/events/:id
Get event by ID.

**Response:**
```json
{
  "data": { /* Event object */ }
}
```

#### POST /api/events
Create new event.

**Request Body:**
```json
{
  "name": "Site Visit",
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "start_datetime": "2025-01-20T09:00:00Z",
  "end_datetime": "2025-01-20T15:00:00Z",
  "event_types": ["PVV", "Survey"]
}
```

**Response:**
```json
{
  "data": { /* Created event */ },
  "message": "Event created successfully"
}
```

### Documents

#### GET /api/documents
Get all documents with pagination.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `per_page` (optional) - Items per page (default: 20, max: 100)
- `event_id` (optional) - Filter by event
- `status` (optional) - Filter by status
- `file_format` (optional) - Filter by format

**Response:**
```json
{
  "data": [
    { /* Document 1 */ },
    { /* Document 2 */ }
  ],
  "page": 1,
  "per_page": 20,
  "total_pages": 1,
  "total": 2
}
```

#### GET /api/documents/:id
Get document by ID.

**Response:**
```json
{
  "data": { /* Document object */ }
}
```

#### POST /api/documents
Upload new document.

**Request:** Multipart form data
```
event_id: "650e8400-e29b-41d4-a716-446655440001"
document_type_id: "750e8400-e29b-41d4-a716-446655440002"
file: [binary file data]
```

**Response:**
```json
{
  "data": { /* Created document */ },
  "message": "Document uploaded successfully"
}
```

#### GET /api/documents/:id/download
Download document file.

**Response:** Binary file data

### Questionnaires

#### GET /api/questionnaires
Get all questionnaires with pagination.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `per_page` (optional) - Items per page (default: 20, max: 100)
- `event_type` (optional) - Filter by event type

**Response:**
```json
{
  "data": [
    { /* Questionnaire 1 */ },
    { /* Questionnaire 2 */ }
  ],
  "page": 1,
  "per_page": 20,
  "total_pages": 1,
  "total": 2
}
```

#### GET /api/questionnaires/:id
Get questionnaire by ID.

**Response:**
```json
{
  "data": { /* Questionnaire object with questions */ }
}
```

#### POST /api/questionnaires
Create new questionnaire.

**Request Body:**
```json
{
  "name": "New Questionnaire",
  "description": "Description",
  "event_type": "GWMS",
  "questions": [
    { /* Question 1 */ },
    { /* Question 2 */ }
  ]
}
```

**Response:**
```json
{
  "data": { /* Created questionnaire */ },
  "message": "Questionnaire created successfully"
}
```

### QA/QC Processes

#### GET /api/qaqc-processes
Get all processes with pagination.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `per_page` (optional) - Items per page (default: 20, max: 100)
- `event_id` (optional) - Filter by event
- `result` (optional) - Filter by result (Passed/Failed)
- `start_date` (optional) - Filter by date range
- `end_date` (optional) - Filter by date range

**Response:**
```json
{
  "data": [
    { /* Process 1 */ },
    { /* Process 2 */ }
  ],
  "page": 1,
  "per_page": 20,
  "total_pages": 1,
  "total": 2
}
```

#### GET /api/qaqc-processes/:id
Get process by ID.

**Response:**
```json
{
  "data": { /* QAQCProcess object with full results */ }
}
```

#### POST /api/qaqc-processes
Run new QA/QC process.

**Request Body:**
```json
{
  "name": "Quality Check",
  "description": "Description",
  "event_id": "650e8400-e29b-41d4-a716-446655440001",
  "questionnaire_id": "b50e8400-e29b-41d4-a716-446655440006"
}
```

**Response:**
```json
{
  "data": { /* Process results */ },
  "message": "QA/QC process completed"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* Additional error details */ }
  }
}
```

**Common Error Codes:**
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (validation failed)
- `500` - Internal Server Error

## Authentication

Future API will use JWT (JSON Web Token) authentication:

```
Authorization: Bearer <token>
```

## Rate Limiting

Future API will implement rate limiting:
- 100 requests per minute per user
- Headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination

All list endpoints (GET requests that return arrays) support offset-based pagination.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number to retrieve (1-indexed) |
| `per_page` | integer | No | 20 | Number of items per page |

**Constraints:**
- `page`: Must be ≥ 1
- `per_page`: Must be between 1 and 100 (inclusive)
- Default: 20 items per page
- Maximum: 100 items per page

### Response Format

All paginated responses use a flat structure with pagination metadata at the root level:

```json
{
  "data": [ /* Array of items */ ],
  "page": 1,
  "per_page": 20,
  "total_pages": 5,
  "total": 95
}
```

**Response Fields:**
- `data` (array): The requested page of items
- `page` (integer): Current page number
- `per_page` (integer): Items per page for this response
- `total_pages` (integer): Total number of pages available
- `total` (integer): Total count of all items (across all pages)

### Examples

#### Example 1: First Page (Default)
**Request:**
```
GET /api/projects
```

**Response:**
```json
{
  "data": [
    {
      "project_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Downtown Site Assessment",
      "client": "Acme Corporation",
      "location": "123 Main St, Toronto, ON",
      "status": "In Progress",
      "start_date": "2025-01-15",
      "end_date": "2025-06-30"
    }
    /* ... 19 more projects ... */
  ],
  "page": 1,
  "per_page": 20,
  "total_pages": 5,
  "total": 95
}
```

#### Example 2: Specific Page
**Request:**
```
GET /api/projects?page=3&per_page=10
```

**Response:**
```json
{
  "data": [
    /* 10 projects from page 3 */
  ],
  "page": 3,
  "per_page": 10,
  "total_pages": 10,
  "total": 95
}
```

#### Example 3: Last Page (Partial)
**Request:**
```
GET /api/projects?page=5&per_page=20
```

**Response:**
```json
{
  "data": [
    /* Only 15 items on last page */
  ],
  "page": 5,
  "per_page": 20,
  "total_pages": 5,
  "total": 95
}
```

#### Example 4: Empty Result
**Request:**
```
GET /api/projects?page=10&per_page=20
```

**Response:**
```json
{
  "data": [],
  "page": 10,
  "per_page": 20,
  "total_pages": 5,
  "total": 95
}
```

### Pagination Calculations

**Calculating total pages:**
```javascript
total_pages = Math.ceil(total / per_page)
```

**Calculating offset:**
```javascript
offset = (page - 1) * per_page
```

**Determining if more pages exist:**
```javascript
has_next_page = page < total_pages
has_prev_page = page > 1
```

### Endpoints with Pagination

All list endpoints support pagination:

#### Projects
```
GET /api/projects?page=1&per_page=20
GET /api/projects?status=In%20Progress&page=2&per_page=10
```

#### Events
```
GET /api/events?page=1&per_page=20
GET /api/events?project_id=123&page=1&per_page=50
```

#### Documents
```
GET /api/documents?page=1&per_page=20
GET /api/documents?event_id=456&status=Parsed&page=2&per_page=25
```

#### Questionnaires
```
GET /api/questionnaires?page=1&per_page=20
GET /api/questionnaires?event_type=GWMS&page=1&per_page=10
```

#### QA/QC Processes
```
GET /api/qaqc-processes?page=1&per_page=20
GET /api/qaqc-processes?result=Failed&page=1&per_page=50
```

### Combining Pagination with Filters

Pagination works seamlessly with query filters:

**Example:**
```
GET /api/projects?status=In%20Progress&year=2025&page=2&per_page=15
```

**Response:**
```json
{
  "data": [ /* Filtered and paginated projects */ ],
  "page": 2,
  "per_page": 15,
  "total_pages": 3,
  "total": 42
}
```

**Note:** The `total` reflects the count of filtered items, not all items.

### Error Handling

#### Invalid Page Number
**Request:**
```
GET /api/projects?page=0
```

**Response:** `400 Bad Request`
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Page must be greater than or equal to 1",
    "details": {
      "parameter": "page",
      "value": 0,
      "min": 1
    }
  }
}
```

#### Invalid Per Page Value
**Request:**
```
GET /api/projects?per_page=150
```

**Response:** `400 Bad Request`
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Per page must be between 1 and 100",
    "details": {
      "parameter": "per_page",
      "value": 150,
      "min": 1,
      "max": 100
    }
  }
}
```

#### Non-numeric Values
**Request:**
```
GET /api/projects?page=abc
```

**Response:** `400 Bad Request`
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Page must be a valid integer",
    "details": {
      "parameter": "page",
      "value": "abc"
    }
  }
}
```

### Best Practices

#### For API Consumers

1. **Always handle empty pages**: Check if `data` array is empty
2. **Use total_pages for navigation**: Don't exceed `total_pages` value
3. **Cache results**: Store paginated results to minimize API calls
4. **Handle page out of range**: Gracefully handle requesting page > total_pages

**Example client logic:**
```javascript
async function fetchAllProjects() {
  const allProjects = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await fetch(`/api/projects?page=${page}&per_page=50`);
    const data = await response.json();
    
    allProjects.push(...data.data);
    totalPages = data.total_pages;
    page++;
  } while (page <= totalPages);

  return allProjects;
}
```

#### For API Implementation

1. **Validate parameters**: Always validate `page` and `per_page`
2. **Set reasonable defaults**: Use sensible default values
3. **Enforce maximum**: Prevent excessive page sizes
4. **Optimize queries**: Use database LIMIT and OFFSET efficiently
5. **Include metadata**: Always include complete pagination metadata
6. **Handle edge cases**: Empty results, last page, out of range

### Performance Considerations

**Large Datasets:**
- Pagination helps manage large result sets
- Limit impacts server performance
- Consider caching frequently accessed pages
- Use database indexes on sortable columns

**Recommended Page Sizes:**
- **Small objects**: 50-100 items per page
- **Medium objects**: 20-50 items per page  
- **Large objects with nested data**: 10-20 items per page

**Example: Optimizing for different use cases**
```
Light data browsing: ?per_page=50
Detailed review: ?per_page=20
Export/processing: ?per_page=100
```

### Future Enhancements

Planned pagination improvements:
- Cursor-based pagination for real-time data
- Sort order parameters (e.g., `?sort=created_at&order=desc`)
- Field selection to reduce payload size
- Pagination metadata in response headers
- Link headers for next/previous pages (RFC 5988)

## WebSocket Events

Future real-time updates via WebSocket:

**Events:**
- `document.processing` - Document processing started
- `document.parsed` - Document parsing completed
- `qaqc.started` - QA/QC process started
- `qaqc.completed` - QA/QC process completed

---

*This API documentation will be updated as the backend is implemented.*
