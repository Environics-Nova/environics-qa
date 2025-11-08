# Component Library

Complete reference for all UI components in the Environics QA application.

## Component Categories

- [shadcn/ui Base Components](#shadcnui-base-components)
- [Custom Feature Components](#custom-feature-components)
- [Page Components](#page-components)

## shadcn/ui Base Components

These components are located in `src/components/ui/` and follow the shadcn/ui design system.

### Alert

Display important messages and notifications.

**Location:** `src/components/ui/alert.tsx`

**Usage:**
```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>
```

**Variants:**
- `default` - Standard alert
- `destructive` - Error/warning alert

### Button

Clickable button component with multiple variants.

**Location:** `src/components/ui/button.tsx`

**Usage:**
```typescript
import { Button } from "@/components/ui/button";

<Button variant="default" size="default">
  Click me
</Button>
```

**Variants:**
- `default` - Primary button
- `destructive` - Danger button
- `outline` - Outlined button
- `secondary` - Secondary button
- `ghost` - Transparent button
- `link` - Link-styled button

**Sizes:**
- `default` - Standard size
- `sm` - Small
- `lg` - Large
- `icon` - Icon-only

### Card

Container component for content grouping.

**Location:** `src/components/ui/card.tsx`

**Usage:**
```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog

Modal dialog for overlaying content.

**Location:** `src/components/ui/dialog.tsx`

**Usage:**
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Input

Text input field component.

**Location:** `src/components/ui/input.tsx`

**Usage:**
```typescript
import { Input } from "@/components/ui/input";

<Input
  type="text"
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Types:**
- `text` - Standard text
- `email` - Email input
- `password` - Password input
- `number` - Numeric input
- `date` - Date picker
- `file` - File upload

### Label

Form label component.

**Location:** `src/components/ui/label.tsx`

**Usage:**
```typescript
import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

### Select

Dropdown selection component.

**Location:** `src/components/ui/select.tsx`

**Usage:**
```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Badge

Small status indicator component.

**Location:** `src/components/ui/badge.tsx`

**Usage:**
```typescript
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Badge</Badge>
```

**Variants:**
- `default` - Primary badge
- `secondary` - Secondary badge
- `destructive` - Error badge
- `outline` - Outlined badge

### Tabs

Tabbed interface component.

**Location:** `src/components/ui/tabs.tsx`

**Usage:**
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>Content for tab 1</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>Content for tab 2</p>
  </TabsContent>
</Tabs>
```

### Toast

Toast notification system.

**Location:** `src/components/ui/toast.tsx`, `src/components/ui/toaster.tsx`

**Usage:**
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed successfully.",
});

// With variant
toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
});
```

### Sidebar

Collapsible navigation sidebar.

**Location:** `src/components/ui/sidebar.tsx`

**Usage:**
```typescript
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/">Home</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <main>
    <SidebarTrigger />
    {/* Main content */}
  </main>
</SidebarProvider>
```

## Custom Feature Components

These components are domain-specific and located in `src/components/`.

### AppSidebar

Main application navigation sidebar.

**Location:** `src/components/AppSidebar.tsx`

**Usage:**
```typescript
import { AppSidebar } from "@/components/AppSidebar";

<SidebarProvider>
  <AppSidebar />
  <main>{/* Content */}</main>
</SidebarProvider>
```

**Features:**
- Navigation links to main pages
- Active route highlighting
- Collapsible design
- Icon-based navigation

**Navigation Items:**
- Home (Dashboard)
- QA/QC Processes
- Questionnaires

### ProjectCard

Display card for project information.

**Location:** `src/components/ProjectCard.tsx`

**Props:**
```typescript
interface ProjectCardProps {
  project: Project;
  onView: (projectId: string) => void;
}
```

**Usage:**
```typescript
import { ProjectCard } from "@/components/ProjectCard";

<ProjectCard
  project={project}
  onView={(id) => navigate(`/project/${id}`)}
/>
```

**Features:**
- Displays project name, client, location
- Status badge (color-coded)
- Start/end dates
- Click to view details

### StatusBadge

Status indicator with color coding.

**Location:** `src/components/StatusBadge.tsx`

**Props:**
```typescript
interface StatusBadgeProps {
  status: ProjectStatus | QAQCResult | QuestionStatus;
}
```

**Usage:**
```typescript
import { StatusBadge } from "@/components/StatusBadge";

<StatusBadge status="In Progress" />
```

**Status Colors:**
- Not Started → Blue
- In Progress → Yellow
- Completed → Green
- Cancelled → Red
- Passed → Green
- Failed → Red

### EventCard

Display card for event information.

**Location:** `src/components/EventCard.tsx`

**Props:**
```typescript
interface EventCardProps {
  event: Event;
  onView: (eventId: string) => void;
}
```

**Usage:**
```typescript
import { EventCard } from "@/components/EventCard";

<EventCard
  event={event}
  onView={(id) => navigate(`/event/${id}`)}
/>
```

**Features:**
- Event name and dates
- Event type badges
- Associated project info
- Click to view details

### DocumentCard

Display card for document information.

**Location:** `src/components/DocumentCard.tsx`

**Props:**
```typescript
interface DocumentCardProps {
  document: Document;
  onView: (documentId: string) => void;
}
```

**Usage:**
```typescript
import { DocumentCard } from "@/components/DocumentCard";

<DocumentCard
  document={document}
  onView={(id) => navigate(`/document/${id}`)}
/>
```

**Features:**
- File name and format
- Processing status
- Document type
- Click to view details

### NewQAQCProcessDialog

Dialog for creating new QA/QC processes.

**Location:** `src/components/NewQAQCProcessDialog.tsx`

**Props:**
```typescript
interface NewQAQCProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Usage:**
```typescript
import NewQAQCProcessDialog from "@/components/NewQAQCProcessDialog";

const [isOpen, setIsOpen] = useState(false);

<>
  <Button onClick={() => setIsOpen(true)}>New Process</Button>
  <NewQAQCProcessDialog
    open={isOpen}
    onOpenChange={setIsOpen}
  />
</>
```

**Features:**
- Event selection dropdown
- Questionnaire selection
- Form validation
- Success/error handling

## Page Components

Full-page components located in `src/pages/`.

### Dashboard

Main dashboard with project list.

**Location:** `src/pages/Dashboard.tsx`

**Features:**
- Project grid display
- Search functionality
- Year filter
- New project button
- Project cards

### NewProject

Project creation form.

**Location:** `src/pages/NewProject.tsx`

**Features:**
- Form with validation
- Required field indicators
- Date pickers
- Status dropdown
- Cancel/Submit actions

### ProjectDetail

Detailed project view.

**Location:** `src/pages/ProjectDetail.tsx`

**Features:**
- Project information display
- Associated events list
- Documents overview
- QA/QC history
- Edit capabilities (future)

### EventDetail

Detailed event view.

**Location:** `src/pages/EventDetail.tsx`

**Features:**
- Event information
- Project context
- Document list
- Event type badges
- Timeline display

### DocumentDetail

Detailed document view.

**Location:** `src/pages/DocumentDetail.tsx`

**Features:**
- Document metadata
- Processing status
- Property values table
- Event context
- Download option (future)

### QAQCProcesses

List of all QA/QC processes.

**Location:** `src/pages/QAQCProcesses.tsx`

**Features:**
- Process cards with results
- New process button
- Result badges (Passed/Failed)
- Click to view details

### QAQCProcessDetail

Detailed process results view.

**Location:** `src/pages/QAQCProcessDetail.tsx`

**Features:**
- Overall result display
- Event information
- Questionnaire details
- Individual question results
- Pass/fail indicators
- Result comments

### Questionnaires

List of all questionnaires.

**Location:** `src/pages/Questionnaires.tsx`

**Features:**
- Questionnaire cards
- Event type filtering
- Description display
- New questionnaire button (future)
- Click to view details

### QuestionnaireDetail

Detailed questionnaire view with questions.

**Location:** `src/pages/QuestionnaireDetail.tsx`

**Features:**
- Questionnaire information
- Questions list
- Question structure display
- Edit capabilities (future)

### NotFound

404 error page.

**Location:** `src/pages/NotFound.tsx`

**Features:**
- Error message
- Navigation options
- Back to home link

## Component Patterns

### Composition Pattern

Components are composed together:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Action</Button>
  </CardContent>
</Card>
```

### Props Pattern

Components accept typed props:

```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
  optional?: string;
}

export const Component = ({ title, onAction, optional }: ComponentProps) => {
  return <div>{/* Component JSX */}</div>;
};
```

### Children Pattern

Components can accept children:

```typescript
export const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="container">{children}</div>;
};
```

### Controlled Component Pattern

Form components are controlled:

```typescript
const [value, setValue] = useState("");

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

## Styling Guide

### Tailwind Classes

All components use Tailwind CSS:

```typescript
<div className="flex items-center gap-4 p-6 bg-background rounded-lg border">
  {/* Content */}
</div>
```

### Theme Variables

Use CSS variables for colors:

```typescript
className="bg-background text-foreground border-border"
```

### Responsive Design

Use responsive prefixes:

```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Dark Mode

Theme-aware styling:

```typescript
className="bg-white dark:bg-gray-900 text-black dark:text-white"
```

## Adding New Components

### 1. Create Component File

```typescript
// src/components/MyComponent.tsx
import { Card } from "@/components/ui/card";

interface MyComponentProps {
  title: string;
}

export const MyComponent = ({ title }: MyComponentProps) => {
  return (
    <Card>
      <h2>{title}</h2>
    </Card>
  );
};
```

### 2. Import and Use

```typescript
import { MyComponent } from "@/components/MyComponent";

<MyComponent title="Hello" />
```

### 3. Add to Documentation

Update this file with component details.

---

*For usage in context, see [User Manual](./user-manual.md) and [Development Setup](./development-setup.md)*
