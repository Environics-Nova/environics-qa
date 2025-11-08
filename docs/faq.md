# Frequently Asked Questions (FAQ)

Common questions and answers about the Environics QA system.

## General Questions

### What is Environics QA?

Environics QA is a web-based application for managing environmental site assessment projects, organizing field events, handling documentation, and automating quality assurance/quality control (QA/QC) processes.

### Who should use this system?

- Environmental consultants
- Project managers
- QA/QC coordinators
- Field technicians
- Laboratory personnel
- Administrative staff

### Is Environics QA cloud-based or on-premise?

Currently, it's a client-side web application. Future versions will include cloud hosting options and on-premise deployment.

### What browsers are supported?

Modern web browsers including:
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

### Do I need to install any software?

No. Environics QA runs entirely in your web browser. Just navigate to the application URL.

## Project Management

### How do I create a new project?

1. Click "New Project" button on the dashboard
2. Fill in required fields (Name, Client, Location, Start Date)
3. Click "Create Project"

See [Project Management Guide](./project-management.md) for details.

### Can I edit a project after creating it?

Currently, project editing is not implemented in the UI. This feature is planned for future releases.

### What do the project status options mean?

- **Not Started**: Project created but work hasn't begun
- **In Progress**: Active project with ongoing work
- **Completed**: Project finished successfully
- **Cancelled**: Project terminated before completion

### Can I delete a project?

Project deletion is not currently available in the UI. Contact your administrator if you need to remove a project.

### How do I search for projects?

Use the search box in the filters section on the dashboard. Search works on project names and client names in real-time.

### Can I filter projects by year?

Yes. Use the year dropdown filter on the dashboard to view projects from specific years.

## Events

### What is an event?

An event represents a specific field activity within a project, such as a site visit, sampling activity, or drilling operation.

### What are the different event types?

- **PVV** - Pre-Visit Verification
- **GWMS** - Groundwater Monitoring System
- **Drilling** - Drilling operations
- **SV Sampling** - Soil/Vegetation Sampling
- **Excavation** - Excavation work
- **Survey** - Site surveys

### Can an event have multiple types?

Yes. An event can be associated with multiple event types if the activity includes different work categories.

### How do I add an event to a project?

Event creation is currently done through sample data. Future releases will include event creation forms.

## Documents

### What file formats are supported?

- PDF documents
- Excel spreadsheets
- Word documents
- CSV files
- Image files (JPG, PNG, etc.)

### What does "document processing" mean?

Document processing refers to the automated parsing and property extraction from uploaded files. The system extracts relevant data fields for use in QA/QC validation.

### How long does document processing take?

Processing time varies based on file size and complexity. Simple documents may process in seconds, while complex files may take a few minutes.

### What are document properties?

Properties are data fields extracted from documents, such as:
- Sample IDs
- Collection dates
- Laboratory results
- GPS coordinates
- Technician names

### Can I manually edit extracted properties?

Property editing is not currently available in the UI. This feature is planned for future releases.

### Why is my document stuck in "Processing" status?

If a document remains in "Processing" for an extended period:
1. Refresh the page
2. Check file format compatibility
3. Verify file is not corrupted
4. Contact support if issue persists

## QA/QC Processes

### What is a QA/QC process?

A QA/QC process is an automated quality check that validates document properties against defined rules (questionnaires) to ensure data consistency and accuracy.

### When should I run a QA/QC process?

Run processes after:
- All event documents are uploaded and parsed
- You need to verify data consistency
- Before finalizing project deliverables

### What does "Passed" mean?

A "Passed" result means all validation questions in the questionnaire were satisfied. The data is consistent and meets quality standards.

### What does "Failed" mean?

A "Failed" result means one or more validation questions did not pass. Review the failed questions to identify and correct issues.

### Can I re-run a QA/QC process?

Yes. You can run processes multiple times, for example after correcting data issues identified in a previous run.

### How do I interpret question results?

Each question shows:
- **Status**: Passed or Failed
- **Comment**: System explanation of the result
- **Values**: What was compared and what was expected

### What should I do if a process fails?

1. Review the failed questions
2. Check source document properties
3. Verify data accuracy
4. Correct any errors in source documents
5. Re-run the process

## Questionnaires

### What is a questionnaire?

A questionnaire is a template containing validation rules (questions) used by QA/QC processes to check data quality.

### Can I create my own questionnaires?

Questionnaire creation through the UI is not currently available. This feature is planned for future releases. Currently, questionnaires are predefined.

### What types of validation rules are supported?

- **Equals**: Values must match exactly
- **Not Equals**: Values must be different
- **Contains**: Text must contain specific substring
- **Greater Than (>)**: Numeric comparison
- **Less Than (<)**: Numeric comparison

### Can I validate against fixed values?

Yes. Questions can compare document properties against either:
- Properties from other documents (cross-document validation)
- Fixed reference values (threshold validation)

### Are questionnaires reusable?

Yes. Questionnaires are templates that can be used multiple times across different events and processes.

### Can questionnaires be event-specific?

Yes. Questionnaires can be associated with specific event types, making them applicable only to relevant events.

## Technical Questions

### What technology is Environics QA built with?

- **Frontend**: React 18.3, TypeScript, Vite
- **UI**: shadcn/ui, Radix UI, Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router DOM

See [Architecture Overview](./architecture.md) for details.

### Is there an API available?

Currently, the application uses client-side mock data. API development is planned for future releases. See [API Documentation](./api-documentation.md) for planned endpoints.

### Can I integrate Environics QA with other systems?

API integration will be available in future releases once the backend is implemented.

### Is my data secure?

Currently, the application runs client-side with mock data. Future versions will include:
- User authentication
- Role-based access control
- Encrypted data transmission
- Secure data storage

### Can I export data?

Data export functionality is planned for future releases.

### Does it work offline?

Currently, no. The application requires an internet connection. Offline capabilities may be added in future versions.

## Troubleshooting

### The application won't load

1. Check your internet connection
2. Try refreshing the page (F5)
3. Clear browser cache
4. Try a different browser
5. Check if the server is online

### I can't find my project

- Check search filters are not too restrictive
- Try clearing the search box
- Set year filter to "All Years"
- Verify the project was created successfully

### Documents aren't uploading

Document upload UI is not yet implemented. This feature is coming in future releases.

### The page is blank or showing errors

1. Check browser console for errors (F12)
2. Refresh the page
3. Try incognito/private mode
4. Clear browser cache
5. Update your browser to the latest version

### Buttons or links aren't working

1. Ensure JavaScript is enabled
2. Disable browser extensions temporarily
3. Try a different browser
4. Check for console errors

See [Troubleshooting Guide](./troubleshooting.md) for more help.

## Development Questions

### Can I contribute to the project?

This is a proprietary project for Environics. For internal contributions, see [Development Setup](./development-setup.md).

### How do I set up a development environment?

See [Development Setup](./development-setup.md) for complete instructions.

### Where is the source code?

The project is hosted on Git. Contact your administrator for repository access.

### How do I report bugs?

Contact your project administrator or development team with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and version

### Are there coding standards?

Yes. See [Coding Standards](./coding-standards.md) for guidelines.

### How do I add a new component?

See [Component Library](./components.md) and [Development Setup](./development-setup.md).

## Feature Requests

### Can I request new features?

Yes. Contact your project manager or development team with:
- Feature description
- Use case explanation
- Expected benefit
- Priority level

### What features are planned?

Planned features include:
- Backend API integration
- Document upload functionality
- Project/event editing
- Questionnaire creation UI
- User authentication
- Data export
- Advanced filtering
- Reporting dashboard
- Email notifications
- Mobile app

### When will feature X be available?

Check with your project manager for the development roadmap and feature timelines.

## Getting More Help

### Where can I find more documentation?

- [Getting Started Guide](./getting-started.md)
- [User Manual](./user-manual.md)
- [Architecture Overview](./architecture.md)
- [Component Library](./components.md)
- [Troubleshooting Guide](./troubleshooting.md)

### Who do I contact for support?

Contact your:
- System administrator for access issues
- Project manager for feature questions
- Development team for technical issues
- QA/QC coordinator for process questions

### Is there training available?

Contact your organization's training coordinator for:
- Onboarding sessions
- Feature demonstrations
- Best practices workshops
- Advanced training

### Can I access a sandbox/test environment?

Check with your administrator about available test environments for training and experimentation.

---

*Last Updated: November 8, 2025*
