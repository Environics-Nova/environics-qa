# User Manual

Complete guide for using the Environics QA system for environmental site assessment quality assurance and quality control.

## Table of Contents

- [Introduction](#introduction)
- [Dashboard Overview](#dashboard-overview)
- [Managing Projects](#managing-projects)
- [Working with Events](#working-with-events)
- [Document Management](#document-management)
- [QA/QC Processes](#qaqc-processes)
- [Questionnaires](#questionnaires)
- [Tips and Best Practices](#tips-and-best-practices)

## Introduction

Environics QA is designed to help environmental consulting firms manage their site assessment projects, track field events, handle documentation, and automate quality control checks.

### Who Should Use This Manual

- Environmental consultants
- Project managers
- QA/QC coordinators
- Field technicians
- Administrative staff

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection
- Screen resolution: 1280x720 or higher

## Dashboard Overview

### Accessing the Dashboard

1. Open your web browser
2. Navigate to the application URL
3. The dashboard is the home page

### Dashboard Components

#### Header Section
- **Application Title**: "Environics"
- **Subtitle**: Brief description
- **New Project Button**: Create new projects

#### Filters Section
- **Search Box**: Search by project name or client
- **Year Filter**: Filter projects by year

#### Projects Grid
- Displays all projects as cards
- Shows key information at a glance
- Click any card to view details

### Understanding Project Cards

Each project card displays:
- **Project Name**: Large title at top
- **Client**: Client organization name
- **Location**: Project location
- **Status Badge**: Current project status (color-coded)
- **Dates**: Start date and end date (if applicable)
- **View Button**: Access project details

**Status Colors:**
- 🔵 **Blue** - Not Started
- 🟡 **Yellow** - In Progress
- 🟢 **Green** - Completed
- 🔴 **Red** - Cancelled

## Managing Projects

### Creating a New Project

1. Click **"New Project"** button (top right)
2. Fill in required fields:
   - **Project Name*** - Descriptive project title
   - **Client*** - Client organization name
   - **Location*** - Physical location address
   - **Project Status** - Select from dropdown
   - **Start Date*** - Project start date
   - **End Date** - Optional completion date
3. Click **"Create Project"**
4. You'll be redirected to the dashboard

**Example:**
```
Project Name: Industrial Site Phase I ESA
Client: ABC Manufacturing Inc.
Location: 123 Industrial Parkway, Toronto, ON
Status: In Progress
Start Date: 2025-01-15
End Date: 2025-06-30
```

### Viewing Project Details

1. From dashboard, click on any project card
2. View comprehensive project information:
   - Basic details
   - Associated events
   - Documents
   - QA/QC history

### Searching for Projects

**By Name or Client:**
1. Use search box in filters section
2. Type project name or client name
3. Results filter in real-time

**By Year:**
1. Click year dropdown in filters
2. Select specific year or "All Years"
3. View filtered results

### Project Status Workflow

Typical project lifecycle:

```
Not Started → In Progress → Completed
                    ↓
                Cancelled
```

**Status Meanings:**
- **Not Started**: Project created but work hasn't begun
- **In Progress**: Active project with ongoing work
- **Completed**: Project finished successfully
- **Cancelled**: Project terminated before completion

## Working with Events

### What is an Event?

An **Event** represents a specific field activity within a project, such as:
- Site visits
- Sampling activities
- Drilling operations
- Surveys

### Event Types

| Type | Full Name | Description |
|------|-----------|-------------|
| **PVV** | Pre-Visit Verification | Initial site assessment |
| **GWMS** | Groundwater Monitoring System | Groundwater monitoring |
| **Drilling** | Drilling Operations | Borehole drilling |
| **SV Sampling** | Soil/Vegetation Sampling | Sample collection |
| **Excavation** | Excavation Work | Excavation activities |
| **Survey** | Site Survey | Land surveying |

### Viewing Event Details

1. Navigate to project details
2. Find events section
3. Click on an event card
4. View event information:
   - Event name
   - Project association
   - Start and end date/time
   - Event types
   - Associated documents

### Event Timeline

Events are typically ordered chronologically:
- View start and end timestamps
- Track event duration
- Monitor overlapping events

## Document Management

### Document Types

The system supports multiple document categories:
- Field reports
- Laboratory results
- Chain of custody forms
- Site photographs
- Survey data

### Supported File Formats

- **PDF** - Reports and documents
- **Excel** - Data sheets and tables
- **Word** - Text documents
- **CSV** - Raw data files
- **Images** - Photos and diagrams

### Document Processing Pipeline

```
Not Uploaded → Processing → Parsed
```

**Stages:**
1. **Not Uploaded**: Document slot created but file not uploaded
2. **Processing**: File uploaded, being parsed for properties
3. **Parsed**: Properties extracted and available for QA/QC

### Viewing Document Details

1. Navigate to event details
2. Find documents section
3. Click on document card
4. View:
   - File name and format
   - Processing status
   - Extracted properties
   - Property values

### Document Properties

Documents have extracted properties used for validation:
- **Metadata**: Date, time, author
- **Location Data**: GPS coordinates, site ID
- **Measurements**: Lab results, field readings
- **Identifiers**: Sample IDs, well numbers

**Example Properties:**
```
Property Name         | Value
---------------------|------------------
Sample ID            | SW-001
Collection Date      | 2025-01-20
Laboratory           | ABC Labs
pH                   | 7.2
Temperature          | 15.3°C
```

## QA/QC Processes

### What is a QA/QC Process?

A **QA/QC Process** is an automated quality check that:
- Validates document properties
- Compares values against standards
- Ensures data consistency
- Identifies errors or anomalies

### Accessing QA/QC Processes

1. Click **"QA/QC Processes"** in sidebar
2. View list of all processes
3. See process results at a glance

### Process Information

Each process shows:
- **Process Name**: Descriptive title
- **Time**: When process was run
- **Event**: Associated event
- **Questionnaire**: Template used
- **Result Badge**: Passed (green) or Failed (red)
- **Description**: Brief summary

### Viewing Process Results

1. Click on a process card
2. View detailed results:
   - Overall result (Passed/Failed)
   - Event details
   - Questionnaire used
   - Individual question results

### Understanding Question Results

Each question shows:
- **Question**: What is being validated
- **Status**: Passed or Failed
- **Comment**: System explanation
- **Values Compared**: Actual vs expected values

**Example Question:**
```
Question: Sample ID in Field Form equals Sample ID in Lab Report
Document 1: Field Data Form
Property 1: Sample ID
Relation: Equals
Document 2: Laboratory Report
Property 2: Sample ID

Result: Passed ✓
System Value: SW-001
Comment: Values match correctly
```

### Creating a New QA/QC Process

1. Click **"New Process"** button
2. Select:
   - **Event**: Which event to validate
   - **Questionnaire**: Which validation template to use
3. Click **"Run Process"**
4. View results

### Interpreting Results

**Passed Process:**
- All validation questions passed
- Data is consistent and valid
- No action required

**Failed Process:**
- One or more questions failed
- Review failed questions
- Check source documents
- Correct errors if found
- Re-run process

## Questionnaires

### What is a Questionnaire?

A **Questionnaire** is a template containing validation rules (questions) used by QA/QC processes.

### Viewing Questionnaires

1. Click **"Questionnaires"** in sidebar
2. View list of all questionnaires
3. Click to view details

### Questionnaire Components

- **Name**: Questionnaire title
- **Description**: Purpose and scope
- **Event Type**: Applicable event type (optional)
- **Questions**: List of validation rules

### Question Structure

Each question defines a validation rule:

**Components:**
1. **First Document & Property**: Source value
2. **Relation/Operator**: How to compare
3. **Second Document & Property OR Fixed Value**: Target value

**Relation Types:**
- **Equals** - Values must be identical
- **Not Equals** - Values must be different
- **Contains** - Text must contain substring
- **>** - First value greater than second
- **<** - First value less than second

**Example Questions:**

```
Question 1:
Field Form.Sample ID Equals Lab Report.Sample ID
Purpose: Ensure sample IDs match between forms

Question 2:
Lab Report.pH > 6.5
Purpose: Verify pH is above minimum threshold

Question 3:
Field Notes.Location Contains "Site A"
Purpose: Confirm correct site location
```

### Questionnaire Best Practices

1. **Be Specific**: Clear, unambiguous validation rules
2. **Group Related**: Organize questions logically
3. **Event-Specific**: Create questionnaires for specific event types
4. **Document Purpose**: Clear descriptions
5. **Test Thoroughly**: Validate with sample data

## Tips and Best Practices

### Project Management

✅ **Do:**
- Use clear, descriptive project names
- Keep client names consistent
- Set realistic start/end dates
- Update project status regularly

❌ **Don't:**
- Use abbreviations without context
- Leave status as "Not Started" indefinitely
- Set unrealistic timelines

### Event Organization

✅ **Do:**
- Create events as they're scheduled
- Use multiple event types when applicable
- Record accurate start/end times

❌ **Don't:**
- Create events retroactively without proper dates
- Mix unrelated activities in one event

### Document Handling

✅ **Do:**
- Upload documents promptly
- Use descriptive file names
- Verify document processing completed
- Check extracted properties for accuracy

❌ **Don't:**
- Upload corrupted or invalid files
- Use generic file names like "doc1.pdf"
- Proceed with QA/QC before parsing completes

### QA/QC Processes

✅ **Do:**
- Run processes after all documents are parsed
- Review failed questions carefully
- Document corrective actions
- Re-run after making corrections

❌ **Don't:**
- Ignore failed results
- Run processes on incomplete data
- Assume automation is infallible

### Data Quality

✅ **Do:**
- Double-check data entry
- Maintain consistent naming conventions
- Validate extracted properties
- Keep thorough records

❌ **Don't:**
- Rush through data entry
- Use inconsistent formats
- Skip validation steps

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Click` | Select/navigate |
| `Ctrl+Click` (Windows) | Open in new tab |
| `Cmd+Click` (Mac) | Open in new tab |
| `Backspace` | Browser back |
| `F5` | Refresh page |

## Common Workflows

### Workflow 1: New Project Setup

1. Create project on dashboard
2. Add initial events
3. Upload field documents
4. Wait for processing
5. Run initial QA/QC

### Workflow 2: Daily QA/QC Check

1. Navigate to QA/QC Processes
2. Review recent processes
3. Check for failures
4. Investigate failed questions
5. Correct issues
6. Re-run validation

### Workflow 3: Project Completion

1. Ensure all events completed
2. Upload final documents
3. Run final QA/QC checks
4. Verify all validations pass
5. Update project status to "Completed"

## Troubleshooting

### Can't Find a Project

- Use search box with project name or client
- Check year filter setting
- Verify project was created

### Document Not Processing

- Check file format is supported
- Ensure file is not corrupted
- Wait a few minutes and refresh
- Contact support if persists

### QA/QC Process Failed

- Review individual failed questions
- Check source document properties
- Verify data accuracy
- Correct errors and re-run

### Page Not Loading

- Check internet connection
- Refresh browser (F5)
- Clear browser cache
- Try different browser

## Getting Help

For additional assistance:
1. Check the [FAQ](./faq.md)
2. Review [Troubleshooting Guide](./troubleshooting.md)
3. Contact your system administrator

---

*For technical documentation, see [Architecture](./architecture.md) and [API Documentation](./api-documentation.md)*
