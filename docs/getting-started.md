# Getting Started with Environics QA

This guide will walk you through setting up and using the Environics QA system for the first time.

## Prerequisites

Ensure you have the following installed on your system:

### Required Software
- **Node.js** v18.0.0 or higher - [Download](https://nodejs.org/)
- **npm** v8.0.0 or higher (included with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Optional but Recommended
- **Bun** - Faster alternative to npm - [Install](https://bun.sh/)
- **VS Code** - Recommended code editor - [Download](https://code.visualstudio.com/)

### System Requirements
- **OS**: Windows, macOS, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Installation

### Step 1: Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd environics-qa
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using Bun (faster):
```bash
bun install
```

This will install all required packages listed in `package.json`.

### Step 3: Verify Installation

Check that all dependencies are installed correctly:
```bash
npm list --depth=0
```

### Step 4: Start Development Server

```bash
npm run dev
```

You should see output similar to:
```
  VITE v5.4.19  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Open in Browser

Navigate to `http://localhost:5173` in your web browser.

## First-Time Setup

### Understanding the Interface

When you first open the application, you'll see:

1. **Left Sidebar** - Navigation menu with:
   - 🏠 Home (Dashboard)
   - ✓ QA/QC Processes
   - 📄 Questionnaires

2. **Main Dashboard** - Displays:
   - Project list in card format
   - Search and filter options
   - "New Project" button

3. **Header** - Contains:
   - Sidebar toggle button
   - Page title

### Creating Your First Project

1. Click the **"New Project"** button (top right)

2. Fill in the project details:
   - **Project Name*** (required): e.g., "Downtown Site Assessment"
   - **Client*** (required): e.g., "Acme Corporation"
   - **Location*** (required): e.g., "123 Main St, Toronto, ON"
   - **Project Status**: Select from dropdown (default: "Not Started")
   - **Start Date*** (required): Pick a date
   - **End Date** (optional): Leave empty for ongoing projects

3. Click **"Create Project"**

4. You'll be redirected to the dashboard where you can see your new project card

### Exploring a Project

Click on any project card to view:
- **Project Details** - Basic information
- **Events** - Associated field activities
- **Documents** - Uploaded files and reports
- **QA/QC History** - Past quality checks

## Key Concepts

### 1. Projects
A **Project** represents a complete environmental site assessment:
- Has a unique identifier
- Contains multiple events
- Tracks status and timeline
- Associated with a specific client and location

**Example Project:**
```
Name: Industrial Site Phase I ESA
Client: Manufacturing Co.
Location: 456 Industrial Rd
Status: In Progress
Start Date: 2025-01-15
End Date: 2025-06-30
```

### 2. Events
An **Event** is a specific field activity within a project:
- Belongs to one project
- Has a specific type (PVV, GWMS, Drilling, etc.)
- Contains documents
- Tracked by date/time

**Event Types:**
- **PVV** - Pre-Visit Verification
- **GWMS** - Groundwater Monitoring System
- **Drilling** - Drilling operations
- **SV Sampling** - Soil/Vegetation Sampling
- **Excavation** - Excavation work
- **Survey** - Site surveys

### 3. Documents
A **Document** is a file uploaded for an event:
- Supported formats: PDF, Excel, Word, CSV, Images
- Goes through processing pipeline: Not Uploaded → Processing → Parsed
- Contains extracted properties for validation

### 4. Questionnaires
A **Questionnaire** is a template for QA/QC validation:
- Collection of validation questions/rules
- Can be specific to event types
- Reusable across multiple processes

### 5. QA/QC Processes
A **QA/QC Process** is an executed quality check:
- Applies a questionnaire to event documents
- Validates document properties
- Produces pass/fail results

## Basic Workflows

### Workflow 1: Setting Up a Project

```
1. Create Project
   ↓
2. Add Events to Project
   ↓
3. Upload Documents to Events
   ↓
4. Wait for Document Processing
   ↓
5. Run QA/QC Process
   ↓
6. Review Results
```

### Workflow 2: Running QA/QC

```
1. Navigate to QA/QC Processes
   ↓
2. Click "New Process"
   ↓
3. Select Event
   ↓
4. Select Questionnaire
   ↓
5. Run Process
   ↓
6. View Results (Passed/Failed)
   ↓
7. Review Failed Questions
   ↓
8. Take Corrective Action
```

## Navigation Guide

### Route Structure

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Home page with project list |
| `/project/new` | New Project | Create new project form |
| `/project/:id` | Project Detail | View project details and events |
| `/event/:id` | Event Detail | View event details and documents |
| `/document/:id` | Document Detail | View document properties |
| `/qaqc-processes` | QA/QC List | List all processes |
| `/qaqc-processes/:id` | Process Detail | View process results |
| `/questionnaires` | Questionnaire List | List all questionnaires |
| `/questionnaires/:id` | Questionnaire Detail | View questionnaire questions |

### Keyboard Shortcuts

Currently, the application uses standard browser shortcuts:
- `Ctrl/Cmd + Click` - Open link in new tab
- `Back/Forward` - Browser navigation
- `F5` - Refresh page

## Common Tasks

### Task: Search for a Project

1. Go to Dashboard (Home)
2. Use the search box in the filters section
3. Type project name or client name
4. Projects filter in real-time

### Task: Filter Projects by Year

1. Go to Dashboard
2. Use the "Filter by year" dropdown
3. Select a specific year or "All Years"
4. View filtered results

### Task: View QA/QC Results

1. Navigate to "QA/QC Processes" from sidebar
2. Click on a process card
3. View overall result (Passed/Failed badge)
4. Scroll to see individual question results
5. Read comments for failed questions

### Task: View Document Properties

1. Navigate to a project
2. Click on an event
3. Find the document list
4. Click on a document
5. View extracted properties

## Next Steps

Now that you're familiar with the basics:

1. **Learn More About Features**:
   - [Project Management Guide](./project-management.md)
   - [QA/QC Processes Guide](./qaqc-processes.md)
   - [Questionnaires Guide](./questionnaires.md)

2. **For Developers**:
   - [Development Setup](./development-setup.md)
   - [Architecture Overview](./architecture.md)
   - [Component Library](./components.md)

3. **Get Help**:
   - [FAQ](./faq.md)
   - [Troubleshooting](./troubleshooting.md)

## Troubleshooting Quick Tips

### Application Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

Vite will automatically try the next available port. Check the terminal output for the actual port number.

### Browser Shows Blank Page

1. Check browser console for errors (F12)
2. Ensure all dependencies are installed
3. Try clearing browser cache
4. Restart the dev server

### Changes Not Reflecting

1. Check that the dev server is running
2. Refresh the browser (F5)
3. Check for compilation errors in terminal

## Additional Resources

- **Full User Manual**: [User Manual](./user-manual.md)
- **Component Reference**: [Components](./components.md)
- **API Documentation**: [API](./api-documentation.md)

---

*Ready to dive deeper? Check out the [User Manual](./user-manual.md) for comprehensive feature documentation.*
