# Architecture Overview

This document provides a comprehensive overview of the Environics QA application architecture, design patterns, and technical implementation details.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Client)                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │         React Application (SPA)                    │  │
│  │  ┌─────────────┐  ┌──────────────┐               │  │
│  │  │   Router    │  │   State      │               │  │
│  │  │  (React     │  │  (React      │               │  │
│  │  │   Router)   │  │   Query)     │               │  │
│  │  └─────────────┘  └──────────────┘               │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │          UI Components                    │    │  │
│  │  │  (shadcn/ui, Radix UI, Tailwind CSS)     │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/REST (Future)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (To Be Implemented)             │
│  ┌───────────────────────────────────────────────────┐  │
│  │         RESTful API Endpoints                      │  │
│  │  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │   Business   │  │   Data       │              │  │
│  │  │    Logic     │  │   Access     │              │  │
│  │  └──────────────┘  └──────────────┘              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      Database                            │
│  (Projects, Events, Documents, QA/QC Data)              │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── QueryClientProvider (TanStack Query)
│   └── TooltipProvider
│       ├── Toaster (Toast Notifications)
│       ├── Sonner (Toast Alternative)
│       └── BrowserRouter
│           └── SidebarProvider
│               ├── AppSidebar (Navigation)
│               └── Main Content
│                   ├── Header
│                   │   └── SidebarTrigger
│                   └── Routes
│                       ├── Index (→ Dashboard)
│                       ├── NewProject
│                       ├── ProjectDetail
│                       ├── EventDetail
│                       ├── DocumentDetail
│                       ├── QAQCProcesses
│                       ├── QAQCProcessDetail
│                       ├── Questionnaires
│                       ├── QuestionnaireDetail
│                       └── NotFound
```

### Data Flow Architecture

```
┌──────────────┐
│  User Action │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌─────────────────┐
│  Component   │────▶│  Event Handler  │
└──────────────┘     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  State Update   │
                     │  - useState     │
                     │  - useQuery     │
                     │  - useForm      │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │   Re-render     │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │   UI Update     │
                     └─────────────────┘
```

## Directory Structure

### Complete Source Code Organization

```
src/
├── components/              # Reusable UI components
│   ├── ui/                 # Base shadcn/ui components
│   │   ├── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── sidebar.tsx
│   │   ├── toast.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── ... (40+ components)
│   │
│   ├── AppSidebar.tsx      # Application navigation sidebar
│   ├── ProjectCard.tsx     # Project display card
│   ├── StatusBadge.tsx     # Status indicator
│   ├── EventCard.tsx       # Event display card
│   ├── DocumentCard.tsx    # Document display card
│   └── NewQAQCProcessDialog.tsx  # QA/QC process creation
│
├── pages/                  # Route page components
│   ├── Index.tsx           # Entry point (redirects to Dashboard)
│   ├── Dashboard.tsx       # Main dashboard page
│   ├── NewProject.tsx      # Project creation form
│   ├── ProjectDetail.tsx   # Project details view
│   ├── EventDetail.tsx     # Event details view
│   ├── DocumentDetail.tsx  # Document details view
│   ├── QAQCProcesses.tsx   # QA/QC processes list
│   ├── QAQCProcessDetail.tsx  # Process results view
│   ├── Questionnaires.tsx  # Questionnaires list
│   ├── QuestionnaireDetail.tsx  # Questionnaire editor
│   └── NotFound.tsx        # 404 error page
│
├── types/                  # TypeScript type definitions
│   └── index.ts            # All application types
│
├── data/                   # Data and mock data
│   └── sampleData.ts       # Sample/mock data for development
│
├── hooks/                  # Custom React hooks
│   ├── use-toast.ts        # Toast notification hook
│   └── use-mobile.tsx      # Mobile detection hook
│
├── lib/                    # Utility functions
│   └── utils.ts            # General utility functions
│
├── App.tsx                 # Root application component
├── main.tsx                # Application entry point
├── index.css               # Global styles
├── App.css                 # App-specific styles
└── vite-env.d.ts           # Vite type definitions
```

## Technology Stack

### Core Technologies

| Technology | Version | Purpose | Documentation |
|-----------|---------|---------|---------------|
| **React** | 18.3.1 | UI library | [react.dev](https://react.dev) |
| **TypeScript** | 5.8.3 | Type safety | [typescriptlang.org](https://www.typescriptlang.org/) |
| **Vite** | 5.4.19 | Build tool | [vitejs.dev](https://vitejs.dev) |

### UI Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| **shadcn/ui** | Latest | Component library |
| **Radix UI** | Various | Accessible primitives |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **Lucide React** | 0.462.0 | Icon library |
| **next-themes** | 0.3.0 | Theme management |

### State Management

| Technology | Version | Purpose |
|-----------|---------|---------|
| **TanStack Query** | 5.83.0 | Server state management |
| **React Hook Form** | 7.61.1 | Form state management |
| **Zod** | 3.25.76 | Schema validation |

### Routing

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Router DOM** | 6.30.1 | Client-side routing |

### Utilities

| Technology | Purpose |
|-----------|---------|
| **date-fns** | Date manipulation |
| **recharts** | Data visualization |
| **sonner** | Toast notifications |
| **clsx** | Conditional classes |
| **tailwind-merge** | Class merging |
| **class-variance-authority** | Component variants |

## Design Patterns

### 1. Component Patterns

#### Page Components
Located in `src/pages/` - Route-level components that:
- Handle routing and navigation
- Fetch data using React Query
- Compose smaller components
- Manage page-level state

**Example:**
```typescript
const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredProjects = sampleProjects.filter(/* ... */);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Page content */}
    </div>
  );
};
```

#### UI Components
Located in `src/components/ui/` - Reusable, styled components that:
- Follow shadcn/ui patterns
- Built on Radix UI primitives
- Fully typed with TypeScript
- Accept variant props

**Example:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### Feature Components
Located in `src/components/` - Domain-specific components that:
- Encapsulate business logic
- Reusable across pages
- May have internal state

**Example:**
```typescript
interface ProjectCardProps {
  project: Project;
  onView: (id: string) => void;
}

export const ProjectCard = ({ project, onView }: ProjectCardProps) => {
  return (
    <Card onClick={() => onView(project.project_id)}>
      {/* Card content */}
    </Card>
  );
};
```

### 2. State Management Patterns

#### Local Component State
For UI-only, component-specific state:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
```

#### Form State
Using React Hook Form with Zod validation:

```typescript
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
  },
});
```

#### Server State
Using TanStack Query for data fetching:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
});
```

### 3. Routing Pattern

React Router DOM v6 with component-based routes:

```typescript
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/project/new" element={<NewProject />} />
  <Route path="/project/:projectId" element={<ProjectDetail />} />
  <Route path="/event/:eventId" element={<EventDetail />} />
  <Route path="/document/:documentId" element={<DocumentDetail />} />
  <Route path="/qaqc-processes" element={<QAQCProcesses />} />
  <Route path="/qaqc-processes/:processId" element={<QAQCProcessDetail />} />
  <Route path="/questionnaires" element={<Questionnaires />} />
  <Route path="/questionnaires/:id" element={<QuestionnaireDetail />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Type System

### Core Domain Types

All types are defined in `src/types/index.ts`:

```typescript
// Status enums
export type ProjectStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";
export type EventType = "PVV" | "GWMS" | "Drilling" | "SV_Sampling" | "Excavation" | "Survey";
export type DocumentStatus = "Not Uploaded" | "Processing" | "Parsed";
export type FileFormat = "PDF" | "Excel" | "Word" | "CSV" | "Image";
export type RelationType = "Equals" | "Not Equals" | "Contains" | ">" | "<";
export type QAQCResult = "Passed" | "Failed";
export type QuestionStatus = "Passed" | "Failed";

// Data models
export interface Project {
  project_id: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  start_date: string;
  end_date?: string;
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
```

## Build Configuration

### Vite Configuration

**File:** `vite.config.ts`

- **React Plugin**: Uses SWC for fast compilation
- **Path Aliases**: `@/` resolves to `src/`
- **Dev Server**: Hot Module Replacement (HMR)
- **Build**: Optimized production bundle

### TypeScript Configuration

**Main Config:** `tsconfig.json`
- Extends base configurations
- References app and node configs

**App Config:** `tsconfig.app.json`
- Strict mode enabled
- Path aliases configured
- Target: ES2020

### Tailwind Configuration

**File:** `tailwind.config.ts`

- Custom theme with design tokens
- Dark mode support (class-based)
- Typography plugin
- Animation plugin
- Content paths configured

### ESLint Configuration

**File:** `eslint.config.js`

- React-specific rules
- React Hooks plugin
- TypeScript integration
- React Refresh plugin

## Performance Optimizations

### Code Splitting
- **Route-based splitting**: Each page is a separate chunk
- **Component lazy loading**: Heavy components loaded on demand

### Asset Optimization
- **Image optimization**: Automatic in production builds
- **CSS purging**: Unused Tailwind classes removed
- **Bundle analysis**: Monitor bundle sizes

### Caching Strategies
- **React Query caching**: Automatic server data caching
- **Browser caching**: Static assets cached
- **Service Worker**: (Future enhancement)

### Rendering Optimizations
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Memoize expensive computations
- **Virtual scrolling**: (For large lists - future enhancement)

## Security Considerations

### Current Implementation
- **Type safety**: TypeScript prevents many runtime errors
- **Input validation**: Zod schemas validate form inputs
- **XSS prevention**: React's built-in escaping

### Future Enhancements
- **Authentication**: User login system
- **Authorization**: Role-based access control
- **API Security**: JWT tokens, HTTPS
- **CSRF Protection**: Token-based protection
- **Content Security Policy**: Strict CSP headers

## Scalability Considerations

### Current State
- Client-side only application
- Mock data for development
- No backend integration

### Future Scaling Strategy

1. **Backend Integration**
   - RESTful API development
   - Database implementation
   - Authentication service

2. **Performance**
   - CDN for static assets
   - Server-side rendering (SSR)
   - Progressive Web App (PWA)

3. **Data Management**
   - Pagination for large datasets
   - Infinite scroll implementation
   - Advanced filtering and search

4. **Monitoring**
   - Error tracking (Sentry)
   - Analytics (Google Analytics)
   - Performance monitoring

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Utility function testing
- Hook testing

### Integration Tests
- Page-level testing
- User flow testing
- API integration testing

### E2E Tests
- Playwright for end-to-end testing
- Critical user journeys
- Cross-browser testing

See [Testing Guide](./testing-guide.md) for detailed testing documentation.

## Deployment Architecture

### Development
- Local Vite dev server
- Hot Module Replacement
- Source maps enabled

### Production
- Optimized build with `npm run build`
- Static file hosting
- CDN distribution

See [Deployment Guide](./deployment.md) for deployment procedures.

---

*For implementation details, see [Development Setup](./development-setup.md)*
