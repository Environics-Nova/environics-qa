# Project Management Guide

Comprehensive guide to managing environmental site assessment projects in the Environics QA system.

## Table of Contents

- [Introduction](#introduction)
- [Creating Projects](#creating-projects)
- [Managing Project Information](#managing-project-information)
- [Project Status Lifecycle](#project-status-lifecycle)
- [Working with Events](#working-with-events)
- [Project Organization](#project-organization)
- [Best Practices](#best-practices)

## Introduction

Projects are the foundation of the Environics QA system. Each project represents a complete environmental site assessment with associated events, documents, and quality control processes.

### What is a Project?

A **Project** in Environics QA represents:
- A client engagement for environmental assessment
- A specific site or location
- A defined scope and timeline
- Multiple field events and activities
- Collection of documents and reports
- QA/QC validation history

### Project Lifecycle

```
Planning → Execution → Documentation → Validation → Completion
    ↓          ↓            ↓              ↓            ↓
Not Started → In Progress → Documents → QA/QC → Completed
```

## Creating Projects

### Access Project Creation

1. Navigate to the dashboard (home page)
2. Click the **"New Project"** button in the top right corner

### Required Information

All new projects require:

#### Project Name *
- Descriptive title for the project
- Should be clear and specific
- Recommended format: `[Type] - [Location] - [Year]`

**Examples:**
```
✓ Phase I ESA - 123 Industrial Ave - 2025
✓ Groundwater Monitoring - Site A - Q1 2025
✓ Soil Remediation - Downtown Complex
```

#### Client *
- Name of the client organization
- Use full legal name for consistency
- Keep naming format consistent across projects

**Examples:**
```
✓ ABC Manufacturing Inc.
✓ Acme Environmental Services
✓ City of Toronto - Public Works
```

#### Location *
- Physical address or site description
- Be as specific as possible
- Include city and province/state

**Examples:**
```
✓ 123 Industrial Parkway, Toronto, ON M1A 2B3
✓ Northwest Corner of Main St & 5th Ave
✓ Former Factory Site, Lot 45, Industrial Zone
```

#### Project Status
- Select from dropdown menu
- Default: "Not Started"
- Options: Not Started, In Progress, Completed, Cancelled

#### Start Date *
- When project work begins
- Use date picker for consistent formatting
- Should be a realistic date

#### End Date (Optional)
- Expected or actual completion date
- Leave blank for ongoing projects
- Can be updated as project progresses

### Creating a Project

**Step-by-step:**

1. **Click "New Project"**
   - Button is in the header on the dashboard

2. **Fill in the form**
   ```
   Project Name: Phase I ESA - Industrial Site
   Client: Manufacturing Co. Ltd.
   Location: 456 Industrial Rd, Toronto, ON
   Status: Not Started
   Start Date: 2025-01-15
   End Date: 2025-06-30
   ```

3. **Review information**
   - Check all fields are correct
   - Verify dates are logical
   - Ensure no typos

4. **Click "Create Project"**
   - Form validates required fields
   - Success message appears
   - Redirected to dashboard

5. **Verify project was created**
   - Find project card on dashboard
   - Check information is correct

### Form Validation

The system validates:
- **Required fields** - Cannot be empty
- **Date format** - Must be valid dates
- **Logical dates** - End date should be after start date (if provided)

**Validation errors:**
```
❌ "Please fill in all required fields"
   → One or more required fields are empty

❌ "End date must be after start date"
   → Check date logic
```

## Managing Project Information

### Viewing Project Details

1. **From Dashboard**
   - Click on any project card
   - Or click "View" button on card

2. **Project Detail Page Shows:**
   - **Header section**: Project name and key info
   - **Project Details**: All project information
   - **Events**: Associated field activities
   - **Documents**: Uploaded files (via events)
   - **QA/QC History**: Past validation processes

### Project Information Display

**Basic Information:**
- Project ID (unique identifier)
- Project Name
- Client Organization
- Site Location
- Current Status (color-coded badge)
- Start Date
- End Date (if set)

**Associated Data:**
- Number of events
- Document count (across all events)
- QA/QC processes run
- Last updated date

### Editing Projects

**Current Status:** Project editing is not yet available in the UI.

**Planned Features:**
- Edit project information
- Update status
- Modify dates
- Add notes/comments

**Workaround:** Contact your system administrator to make changes.

## Project Status Lifecycle

### Status Options

#### Not Started
- **When to use**: Project created but work hasn't begun
- **Typical duration**: Days to weeks
- **Next status**: In Progress

**Activities:**
- Planning and scheduling
- Resource allocation
- Initial client meetings
- Site access arrangements

#### In Progress
- **When to use**: Active field work and documentation
- **Typical duration**: Weeks to months
- **Next status**: Completed or Cancelled

**Activities:**
- Field events execution
- Document collection
- Sample analysis
- Ongoing QA/QC
- Client updates

#### Completed
- **When to use**: All work finished, final deliverables submitted
- **Typical duration**: Permanent
- **Next status**: None (terminal state)

**Activities:**
- Final reports delivered
- All QA/QC passed
- Client acceptance
- Project closure
- Archiving

#### Cancelled
- **When to use**: Project terminated before completion
- **Typical duration**: Permanent
- **Next status**: None (terminal state)

**Reasons:**
- Client request
- Budget constraints
- Site access issues
- Scope changes
- Force majeure

### Status Workflow

**Typical progression:**
```
Not Started → In Progress → Completed
```

**Alternative paths:**
```
Not Started → Cancelled
In Progress → Cancelled
```

### Updating Project Status

**Best Practices:**
1. Update status promptly when changes occur
2. Document reason for status changes
3. Notify stakeholders of status updates
4. Keep status aligned with actual work

**Status Change Triggers:**
```
Not Started → In Progress
- First field event scheduled
- Team mobilization begins

In Progress → Completed
- All events completed
- All documents uploaded and validated
- Final QA/QC passed
- Deliverables submitted

In Progress → Cancelled
- Client terminates contract
- Budget exhausted
- Project becomes infeasible
```

## Working with Events

### Event Overview

Events are the building blocks of projects. Each event represents a specific field activity.

### Event Types

Projects can have multiple events of different types:

**1. PVV (Pre-Visit Verification)**
- Initial site assessment
- Safety evaluation
- Access verification
- Planning activities

**2. GWMS (Groundwater Monitoring System)**
- Groundwater sampling
- Well monitoring
- Water level measurements

**3. Drilling**
- Borehole drilling
- Soil boring
- Test pit excavation

**4. SV Sampling (Soil/Vegetation Sampling)**
- Soil sample collection
- Vegetation sampling
- Surface sampling

**5. Excavation**
- Test pit excavation
- Trench excavation
- Subsurface investigation

**6. Survey**
- Land surveying
- Topographic surveys
- Boundary surveys
- GPS surveys

### Viewing Project Events

1. Navigate to project detail page
2. Scroll to "Events" section
3. View list of all project events
4. Click event to see details

### Event Information

Each event displays:
- Event name
- Event type(s)
- Start and end date/time
- Associated documents
- QA/QC processes run

## Project Organization

### Dashboard Organization

**Filter Projects:**
- **Search box**: Filter by project name or client
- **Year filter**: Show projects from specific years
- **Real-time filtering**: Results update as you type

### Search Tips

**Effective search terms:**
```
✓ "Phase I" - Find all Phase I assessments
✓ "Downtown" - Find projects at downtown locations
✓ "Acme" - Find all Acme client projects
✓ "2024" - Find projects with "2024" in name
```

**Search behavior:**
- Case-insensitive
- Partial matching
- Searches project names and client names
- Real-time results

### Year Filtering

**Use cases:**
- Review projects from specific year
- Annual reporting
- Year-end summaries
- Archive old projects

**How to filter:**
1. Click year dropdown
2. Select year or "All Years"
3. View filtered results

### Project Cards

Each project card shows:
- Project name (large header)
- Client name
- Location
- Status badge (color-coded)
- Dates (start and end if applicable)
- View button

**Card Layout:**
```
┌─────────────────────────────┐
│ Project Name                │
│                             │
│ Client: Client Name         │
│ Location: Site Location     │
│                             │
│ [Status Badge]              │
│                             │
│ Jan 15, 2025 - Jun 30, 2025│
│                             │
│         [View Button]       │
└─────────────────────────────┘
```

## Best Practices

### Naming Conventions

**Project Names:**
```
✓ Phase I ESA - 123 Main St - 2025
✓ Groundwater Monitoring - Site A
✓ Soil Remediation - Industrial Complex

✗ Project 1
✗ Client ABC
✗ ESA
```

**Client Names:**
```
✓ ABC Manufacturing Inc.
✓ Acme Environmental Services Ltd.
✓ City of Toronto - Public Works

✗ ABC Mfg
✗ Acme Env
✗ City
```

**Locations:**
```
✓ 123 Industrial Ave, Toronto, ON M1A 2B3
✓ Northeast corner of Main St & Oak Ave
✓ Former Steel Mill Site, Lot 12

✗ Toronto
✗ The site
✗ Site A
```

### Project Planning

**Before creating project:**
1. Gather all required information
2. Confirm client name spelling
3. Verify site address
4. Determine realistic timeline
5. Identify project team members

**Initial setup:**
1. Create project record
2. Add initial events
3. Upload planning documents
4. Set milestones
5. Configure notifications

### Timeline Management

**Start Date considerations:**
- Use actual mobilization date
- Not contract signing date
- When field work begins
- Adjust if delayed

**End Date considerations:**
- Use realistic completion estimate
- Include buffer for delays
- Update as project progresses
- Leave blank if uncertain

**Milestone tracking:**
```
Project Start → Field Events → Lab Analysis → Draft Report → Final Report
     ↓              ↓              ↓              ↓              ↓
  Jan 15         Feb 1-10       Feb 15         Mar 1          Mar 15
```

### Status Management

**Keep status current:**
- Update weekly at minimum
- Update immediately for major changes
- Document status change reasons
- Communicate with stakeholders

**Status accuracy:**
- Don't leave as "Not Started" too long
- Update to "In Progress" when work begins
- Only mark "Completed" when truly done
- Use "Cancelled" appropriately

### Documentation

**Maintain good records:**
- Update project info regularly
- Keep dates accurate
- Document changes
- Track milestones
- Record issues and resolutions

**Project notes (future feature):**
- Meeting notes
- Client communications
- Change requests
- Issue tracking
- Lessons learned

### Quality Assurance

**Project-level QA:**
- Regular status reviews
- Timeline tracking
- Budget monitoring
- Scope verification
- Risk management

**Data quality:**
- Consistent naming
- Accurate dates
- Complete information
- Regular updates
- Proper documentation

### Collaboration

**Team communication:**
- Share project updates
- Coordinate field events
- Review documents together
- Discuss QA/QC results
- Plan corrective actions

**Client engagement:**
- Regular status updates
- Milestone notifications
- Issue communication
- Report delivery
- Project closeout

### Reporting

**Project metrics:**
- Number of events
- Document count
- QA/QC pass rate
- Timeline adherence
- Budget tracking

**Reporting periods:**
- Weekly status updates
- Monthly summaries
- Quarterly reviews
- Annual reports
- Project closeout report

## Common Workflows

### New Project Setup Workflow

```
1. Create Project
   ↓
2. Plan Events
   ↓
3. Schedule Field Work
   ↓
4. Execute Events
   ↓
5. Upload Documents
   ↓
6. Run QA/QC
   ↓
7. Generate Reports
   ↓
8. Complete Project
```

### Project Monitoring Workflow

```
Daily:
- Check event progress
- Monitor document uploads
- Review QA/QC alerts

Weekly:
- Update project status
- Review timeline
- Team meetings

Monthly:
- Status reports
- Budget review
- Client updates
```

### Project Closeout Workflow

```
1. Complete all events
2. Upload final documents
3. Run final QA/QC
4. Generate final reports
5. Client review
6. Address comments
7. Deliver final deliverables
8. Update status to "Completed"
9. Archive project
```

## Troubleshooting

### Cannot Find Project

**Solutions:**
- Clear search filters
- Check year filter (set to "All Years")
- Verify project was created
- Check spelling in search

### Project Information Incorrect

**Solutions:**
- Contact administrator for corrections
- Document required changes
- Wait for editing feature (coming soon)

### Wrong Project Status

**Solutions:**
- Contact administrator to update
- Document correct status
- Note when status changed

## Tips for Success

1. **Be specific**: Use clear, descriptive names
2. **Be consistent**: Follow naming conventions
3. **Be accurate**: Keep dates and info current
4. **Be organized**: Use filters and search effectively
5. **Be proactive**: Update status regularly
6. **Be thorough**: Complete all required fields
7. **Be communicative**: Share updates with team

## Future Enhancements

**Planned features:**
- Project editing
- Bulk project import
- Advanced filtering
- Custom fields
- Project templates
- Budget tracking
- Resource scheduling
- Automated notifications
- Project dashboard
- Custom reports

---

*For more information, see [User Manual](./user-manual.md) and [Getting Started](./getting-started.md)*
