# Environics QA Documentation

Welcome to the **Environics QA** project documentation! This is a comprehensive Environmental Site Assessment Quality Assurance and Quality Control (QA/QC) Management System.

## 📚 Documentation Index

### Getting Started
- **[Getting Started Guide](./docs/getting-started.md)** - Installation and first steps
- **[User Manual](./docs/user-manual.md)** - Complete user guide for end users

### Technical Documentation
- **[Architecture Overview](./docs/architecture.md)** - System architecture and design
- **[Development Setup](./docs/development-setup.md)** - Developer environment setup
- **[API Documentation](./docs/api-documentation.md)** - API endpoints and data models
- **[Component Library](./docs/components.md)** - UI component reference

### Feature Guides
- **[Project Management](./docs/project-management.md)** - Managing environmental projects
- **[QA/QC Processes](./docs/qaqc-processes.md)** - Quality control automation
- **[Questionnaires](./docs/questionnaires.md)** - Creating validation templates

### Development
- **[Testing Guide](./docs/testing-guide.md)** - Testing strategies and practices
- **[Deployment Guide](./docs/deployment.md)** - Deployment procedures
- **[Coding Standards](./docs/coding-standards.md)** - Code style and conventions

### Support
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions
- **[FAQ](./docs/faq.md)** - Frequently asked questions

## 🎯 Project Overview

**Environics QA** is a modern web application designed to streamline the management of environmental site assessment projects. It provides a comprehensive platform for tracking projects, events, documents, and automated QA/QC processes.

### Key Features

- **🗂️ Project Management** - Track environmental assessment projects with full lifecycle management
- **📅 Event Management** - Organize field events (PVV, GWMS, Drilling, Sampling, etc.)
- **📄 Document Management** - Upload, parse, and manage project documents
- **✅ Automated QA/QC** - Run quality checks with customizable questionnaires
- **📊 Results & Reporting** - Detailed validation results and reporting

### Technology Stack

**Frontend:**
- React 18.3 + TypeScript
- Vite (Build tool)
- shadcn/ui + Radix UI (Components)
- Tailwind CSS (Styling)
- React Router (Navigation)
- TanStack Query (State management)

**Development Tools:**
- ESLint (Linting)
- TypeScript (Type checking)
- Bun/npm (Package management)

## 🚀 Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd environics-qa

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📖 Documentation Navigation

- **New to the project?** Start with the [Getting Started Guide](./docs/getting-started.md)
- **Developer?** Check out [Development Setup](./docs/development-setup.md)
- **End user?** See the [User Manual](./docs/user-manual.md)
- **Need help?** Visit [Troubleshooting](./docs/troubleshooting.md) or [FAQ](./docs/faq.md)

## 🏗️ Project Structure

```
environics-qa/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Route page components
│   ├── types/          # TypeScript definitions
│   ├── data/           # Sample/mock data
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
├── public/             # Static assets
├── docs/               # This documentation
└── ...                 # Config files
```

## 📊 System Capabilities

### Projects
Create and manage environmental assessment projects with:
- Client and location tracking
- Status management (Not Started, In Progress, Completed, Cancelled)
- Timeline tracking with start and end dates
- Associated events and documents

### Events
Track field activities with support for:
- **PVV** - Pre-Visit Verification
- **GWMS** - Groundwater Monitoring System
- **Drilling** - Drilling operations
- **SV Sampling** - Soil/Vegetation Sampling
- **Excavation** - Excavation activities
- **Survey** - Site surveys

### Documents
Manage project documentation with:
- Multi-format support (PDF, Excel, Word, CSV, Images)
- Automatic parsing and property extraction
- Status tracking (Not Uploaded → Processing → Parsed)
- Property validation

### QA/QC Automation
Automate quality checks with:
- Custom questionnaire templates
- Property comparison (document-to-document or fixed values)
- Validation operators (Equals, Not Equals, Contains, >, <)
- Pass/fail results with detailed reporting

## 🔗 External Resources

- **Lovable Project**: https://lovable.dev/projects/fe87d1a6-977e-4114-acde-f10cb15b0202
- **React Documentation**: https://react.dev
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com

## 📝 Contributing

This is a proprietary project for Environics. For development guidelines, see:
- [Coding Standards](./docs/coding-standards.md)
- [Development Setup](./docs/development-setup.md)

## 📧 Support

For questions or issues:
1. Check the [FAQ](./docs/faq.md)
2. Review [Troubleshooting](./docs/troubleshooting.md)
3. Contact the development team

---

*Documentation Last Updated: November 8, 2025*
