# Coding Standards

Guidelines and best practices for contributing to the Environics QA codebase.

## Code Style

### TypeScript

#### File Naming

- **Components**: PascalCase - `ProjectCard.tsx`
- **Pages**: PascalCase - `Dashboard.tsx`
- **Utilities**: camelCase - `utils.ts`
- **Types**: camelCase - `index.ts`
- **Hooks**: camelCase with 'use' prefix - `use-toast.ts`

#### Variable Naming

```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 1024 * 1024;
const API_BASE_URL = "https://api.example.com";

// Variables and functions: camelCase
const projectName = "Downtown Assessment";
const handleSubmit = () => {};

// Components and types: PascalCase
interface ProjectCardProps {}
const ProjectCard = () => {};

// Boolean variables: use is/has/should prefix
const isLoading = true;
const hasErrors = false;
const shouldRender = true;

// Private properties: prefix with underscore (optional)
const _internalValue = 123;
```

#### Type Annotations

Always use explicit types for function parameters and return values:

```typescript
// Good
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// Avoid
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

#### Interfaces vs Types

- **Use interfaces** for object shapes and component props
- **Use types** for unions, intersections, and aliases

```typescript
// Interface for objects
interface Project {
  project_id: string;
  name: string;
  status: ProjectStatus;
}

// Type for unions
type ProjectStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";

// Type for intersections
type ProjectWithMeta = Project & { metadata: Record<string, string> };
```

### React Components

#### Component Structure

```typescript
// 1. Imports
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Project } from "@/types";

// 2. Types/Interfaces
interface ProjectCardProps {
  project: Project;
  onView: (id: string) => void;
}

// 3. Component
export const ProjectCard = ({ project, onView }: ProjectCardProps) => {
  // 3a. Hooks
  const [isHovered, setIsHovered] = useState(false);
  
  // 3b. Event handlers
  const handleClick = () => {
    onView(project.project_id);
  };
  
  // 3c. Render helpers (if needed)
  const renderStatus = () => {
    return <Badge>{project.status}</Badge>;
  };
  
  // 3d. JSX
  return (
    <Card onClick={handleClick}>
      {/* Card content */}
    </Card>
  );
};
```

#### Functional Components

Always use functional components with hooks:

```typescript
// Good
const MyComponent = () => {
  const [state, setState] = useState("");
  return <div>{state}</div>;
};

// Avoid class components
class MyComponent extends React.Component {
  // ...
}
```

#### Props Destructuring

Destructure props in function parameters:

```typescript
// Good
const ProjectCard = ({ project, onView }: ProjectCardProps) => {
  return <div>{project.name}</div>;
};

// Avoid
const ProjectCard = (props: ProjectCardProps) => {
  return <div>{props.project.name}</div>;
};
```

#### Default Props

Use default parameters instead of defaultProps:

```typescript
// Good
interface ButtonProps {
  variant?: string;
  size?: string;
}

const Button = ({ variant = "default", size = "md" }: ButtonProps) => {
  // ...
};

// Avoid
Button.defaultProps = {
  variant: "default",
  size: "md",
};
```

### JSX

#### Conditional Rendering

```typescript
// Simple conditions: use &&
{isLoading && <Spinner />}

// If-else: use ternary
{isLoading ? <Spinner /> : <Content />}

// Complex conditions: extract to variable
const content = isLoading ? <Spinner /> : hasError ? <Error /> : <Content />;
return <div>{content}</div>;

// Or use early return
if (isLoading) return <Spinner />;
if (hasError) return <Error />;
return <Content />;
```

#### List Rendering

Always provide keys when rendering lists:

```typescript
// Good
{projects.map(project => (
  <ProjectCard key={project.project_id} project={project} />
))}

// Avoid using index as key (unless list is static)
{projects.map((project, index) => (
  <ProjectCard key={index} project={project} />
))}
```

#### Event Handlers

```typescript
// Inline for simple callbacks
<Button onClick={() => setOpen(true)}>Open</Button>

// Named function for complex logic
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Complex logic
};

<form onSubmit={handleSubmit}>
```

#### Boolean Props

```typescript
// Explicitly pass boolean props
<Input disabled={true} required={false} />

// Or use shorthand for true
<Input disabled required={false} />
```

### Styling

#### Tailwind Classes

```typescript
// Use className prop
<div className="flex items-center gap-4">

// Group related utilities
<div className="flex items-center justify-between gap-4 p-6 bg-card rounded-lg border">

// Use responsive prefixes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Use cn() utility for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "large" && "large-classes"
)}>
```

#### Theme Variables

Use CSS variables for colors:

```typescript
// Good - uses theme
className="bg-background text-foreground border-border"

// Avoid - hardcoded colors
className="bg-white text-black border-gray-300"
```

## Code Organization

### Imports

Order imports logically:

```typescript
// 1. React imports
import { useState, useEffect } from "react";

// 2. Third-party libraries
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// 3. Component imports
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 4. Local imports
import { Project } from "@/types";
import { sampleProjects } from "@/data/sampleData";

// 5. Styles (if any)
import "./styles.css";
```

### File Structure

Keep files focused and modular:

```
✅ Good
src/components/ProjectCard.tsx (150 lines)
src/components/EventCard.tsx (120 lines)

❌ Avoid
src/components/Cards.tsx (500 lines with multiple components)
```

### Code Splitting

Extract reusable logic:

```typescript
// Extract to custom hook
const useProjectFilter = (projects: Project[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  
  const filtered = projects.filter(/* logic */);
  
  return { filtered, searchTerm, setSearchTerm, yearFilter, setYearFilter };
};

// Extract to utility function
const formatProjectDate = (date: string): string => {
  return format(new Date(date), "MMM dd, yyyy");
};
```

## Best Practices

### State Management

```typescript
// Keep state close to where it's used
const ProjectCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  // ...
};

// Lift state up when shared
const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <>
      <SearchBox value={searchTerm} onChange={setSearchTerm} />
      <ProjectList searchTerm={searchTerm} />
    </>
  );
};

// Use React Query for server state
const { data, isLoading } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
});
```

### Error Handling

```typescript
// Handle errors gracefully
try {
  await submitForm(data);
  toast({ title: "Success!" });
} catch (error) {
  console.error("Form submission failed:", error);
  toast({ 
    title: "Error", 
    description: error.message,
    variant: "destructive" 
  });
}

// Provide error boundaries
<ErrorBoundary fallback={<ErrorPage />}>
  <MyComponent />
</ErrorBoundary>

// Validate input
const schema = z.object({
  email: z.string().email("Invalid email"),
  age: z.number().min(0).max(150),
});
```

### Performance

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Lazy load routes
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Debounce rapid updates
const debouncedSearch = useDebouncedValue(searchTerm, 300);
```

### Accessibility

```typescript
// Use semantic HTML
<button>Click me</button>  // Not <div onClick>

// Provide labels
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// Add ARIA attributes when needed
<button 
  aria-label="Close dialog"
  aria-expanded={isOpen}
>

// Ensure keyboard navigation works
<div 
  role="button" 
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
```

### Security

```typescript
// Sanitize user input
const sanitized = DOMPurify.sanitize(userInput);

// Use environment variables for secrets
const apiKey = import.meta.env.VITE_API_KEY;

// Validate on both client and server
const schema = z.object({ email: z.string().email() });
const validated = schema.parse(input);
```

## Comments and Documentation

### When to Comment

```typescript
// ✅ Document complex logic
// Calculate project completion percentage based on
// completed tasks divided by total tasks
const completionRate = (completedTasks / totalTasks) * 100;

// ✅ Explain "why" not "what"
// Use Set to deduplicate years efficiently
const uniqueYears = [...new Set(years)];

// ❌ Don't state the obvious
// Set the name variable to "John"
const name = "John";
```

### JSDoc for Public APIs

```typescript
/**
 * Filters projects based on search term and year.
 * 
 * @param projects - Array of projects to filter
 * @param searchTerm - Text to search in project names
 * @param year - Year to filter by, or "all" for no filter
 * @returns Filtered array of projects
 */
function filterProjects(
  projects: Project[],
  searchTerm: string,
  year: string
): Project[] {
  // Implementation
}
```

### TODO Comments

```typescript
// TODO: Add pagination when project count exceeds 100
// FIXME: Handle edge case when date is invalid
// NOTE: This is a temporary workaround until API is ready
```

## Testing

### Test File Naming

```
src/components/ProjectCard.tsx
src/components/__tests__/ProjectCard.test.tsx
```

### Test Structure

```typescript
describe("ProjectCard", () => {
  it("renders project name", () => {
    // Arrange
    const project = { name: "Test Project", /* ... */ };
    
    // Act
    render(<ProjectCard project={project} />);
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });
  
  it("calls onView when clicked", () => {
    // Arrange
    const onView = jest.fn();
    const project = { project_id: "123", /* ... */ };
    
    // Act
    render(<ProjectCard project={project} onView={onView} />);
    fireEvent.click(screen.getByRole("button"));
    
    // Assert
    expect(onView).toHaveBeenCalledWith("123");
  });
});
```

## Git Commit Messages

### Format

```
type(scope): subject

body

footer
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(projects): add project status filter

- Added status dropdown to filter bar
- Updated filter logic to handle status
- Added tests for new filter

Closes #123
```

```
fix(qaqc): resolve incorrect validation result

The validation was comparing strings case-sensitively.
Changed to lowercase comparison for consistent results.

Fixes #456
```

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.log statements (except intentional logging)
- [ ] No commented-out code
- [ ] Types are properly defined
- [ ] Error handling is implemented
- [ ] Responsive design works
- [ ] Accessibility considered
- [ ] Performance optimized
- [ ] Documentation updated if needed

## Tools and Linting

### ESLint

Run linter before committing:

```bash
npm run lint
npm run lint -- --fix  # Auto-fix issues
```

### TypeScript

Check types:

```bash
npx tsc --noEmit
```

### Prettier (if configured)

Format code:

```bash
npx prettier --write src/
```

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

*These standards help maintain code quality and consistency across the project.*
