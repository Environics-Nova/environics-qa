# Testing Guide

Comprehensive guide to testing strategies and practices for the Environics QA application.

## Testing Philosophy

### Why Test?

- **Prevent regressions**: Ensure new changes don't break existing functionality
- **Document behavior**: Tests serve as living documentation
- **Enable refactoring**: Confidence to improve code safely
- **Catch bugs early**: Find issues before production

### Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /----\     - Critical user journeys
     /      \    - End-to-end workflows
    /--------\   
   /          \  Integration Tests (Some)
  /------------\ - Component interactions
 /              \- Page-level testing
/----------------\
|  Unit Tests    | Unit Tests (Many)
|  (Foundation)  | - Individual functions
|________________| - Isolated components
```

## Testing Stack

### Recommended Tools

- **Test Runner**: Vitest (Vite-native, fast)
- **React Testing**: React Testing Library
- **E2E Testing**: Playwright
- **Mocking**: MSW (Mock Service Worker)
- **Coverage**: Vitest coverage

### Installation

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Install E2E testing
npm install --save-dev @playwright/test

# Install coverage tool
npm install --save-dev @vitest/coverage-v8
```

### Configuration

#### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### src/test/setup.ts

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Unit Testing

### Component Testing

#### Basic Component Test

```typescript
// src/components/__tests__/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectCard } from '../ProjectCard';

describe('ProjectCard', () => {
  const mockProject = {
    project_id: '123',
    name: 'Test Project',
    client: 'Test Client',
    location: 'Test Location',
    status: 'In Progress' as const,
    start_date: '2025-01-15',
  };

  it('renders project information', () => {
    const onView = vi.fn();
    render(<ProjectCard project={mockProject} onView={onView} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('calls onView when clicked', async () => {
    const onView = vi.fn();
    const { user } = renderWithUser(<ProjectCard project={mockProject} onView={onView} />);

    await user.click(screen.getByRole('button', { name: /view/i }));

    expect(onView).toHaveBeenCalledWith('123');
  });

  it('displays status badge', () => {
    const onView = vi.fn();
    render(<ProjectCard project={mockProject} onView={onView} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });
});
```

#### Testing with User Events

```typescript
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function renderWithUser(ui: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(ui),
  };
}

// Usage
it('handles user input', async () => {
  const { user } = renderWithUser(<SearchBox />);
  
  await user.type(screen.getByRole('textbox'), 'search term');
  expect(screen.getByRole('textbox')).toHaveValue('search term');
});
```

### Testing Hooks

```typescript
// src/hooks/__tests__/use-toast.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useToast } from '../use-toast';

describe('useToast', () => {
  it('adds toast notification', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test',
        description: 'Test message',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test');
  });

  it('dismisses toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;

    act(() => {
      const toast = result.current.toast({ title: 'Test' });
      toastId = toast.id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
```

### Testing Utilities

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', true && 'visible');
    expect(result).toBe('base visible');
  });

  it('deduplicates Tailwind classes', () => {
    const result = cn('p-4', 'p-6');
    expect(result).toBe('p-6'); // Later class wins
  });
});
```

## Integration Testing

### Page Component Testing

```typescript
// src/pages/__tests__/Dashboard.test.tsx
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock dependencies
vi.mock('@/data/sampleData', () => ({
  sampleProjects: [
    {
      project_id: '1',
      name: 'Project Alpha',
      client: 'Client A',
      location: 'Location A',
      status: 'In Progress',
      start_date: '2025-01-15',
    },
    {
      project_id: '2',
      name: 'Project Beta',
      client: 'Client B',
      location: 'Location B',
      status: 'Completed',
      start_date: '2024-06-01',
    },
  ],
}));

function renderDashboard() {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
}

describe('Dashboard', () => {
  it('renders all projects', () => {
    renderDashboard();

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
  });

  it('filters projects by search term', async () => {
    const { user } = renderWithUser(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const searchBox = screen.getByPlaceholderText(/search/i);
    await user.type(searchBox, 'Alpha');

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Project Beta')).not.toBeInTheDocument();
  });

  it('shows "New Project" button', () => {
    renderDashboard();

    expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument();
  });
});
```

### Form Testing

```typescript
// src/pages/__tests__/NewProject.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NewProject from '../NewProject';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NewProject', () => {
  it('validates required fields', async () => {
    const { user } = renderWithUser(
      <BrowserRouter>
        <NewProject />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    // Should show validation errors
    expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const { user } = renderWithUser(
      <BrowserRouter>
        <NewProject />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/project name/i), 'New Project');
    await user.type(screen.getByLabelText(/client/i), 'Test Client');
    await user.type(screen.getByLabelText(/location/i), 'Test Location');
    await user.type(screen.getByLabelText(/start date/i), '2025-01-15');

    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
```

## E2E Testing with Playwright

### Setup Playwright

```bash
npm init playwright@latest
```

### E2E Test Example

```typescript
// tests/e2e/project-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Project Management Workflow', () => {
  test('complete project creation flow', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:5173');

    // Should see dashboard
    await expect(page.getByRole('heading', { name: 'Environics' })).toBeVisible();

    // Click new project button
    await page.getByRole('button', { name: /new project/i }).click();

    // Fill form
    await page.getByLabel(/project name/i).fill('E2E Test Project');
    await page.getByLabel(/client/i).fill('E2E Client');
    await page.getByLabel(/location/i).fill('E2E Location');
    await page.getByLabel(/start date/i).fill('2025-01-15');

    // Submit
    await page.getByRole('button', { name: /create project/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('http://localhost:5173/');

    // Should see new project
    await expect(page.getByText('E2E Test Project')).toBeVisible();
  });

  test('search functionality', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Type in search box
    await page.getByPlaceholder(/search/i).fill('Downtown');

    // Should filter results
    await expect(page.getByText('Downtown Site Assessment')).toBeVisible();
  });
});
```

### Visual Regression Testing

```typescript
test('dashboard visual regression', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Take screenshot
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

## Test Patterns

### AAA Pattern (Arrange-Act-Assert)

```typescript
it('handles button click', async () => {
  // Arrange
  const handleClick = vi.fn();
  const { user } = renderWithUser(<Button onClick={handleClick}>Click me</Button>);

  // Act
  await user.click(screen.getByRole('button'));

  // Assert
  expect(handleClick).toHaveBeenCalledOnce();
});
```

### Test Helpers

```typescript
// src/test/helpers.tsx
import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

### Mock Data Factory

```typescript
// src/test/factories.ts
import { Project } from '@/types';

export const createMockProject = (overrides?: Partial<Project>): Project => ({
  project_id: '123',
  name: 'Mock Project',
  client: 'Mock Client',
  location: 'Mock Location',
  status: 'In Progress',
  start_date: '2025-01-15',
  ...overrides,
});

// Usage
const project = createMockProject({ name: 'Custom Name' });
```

## Running Tests

### Command Line

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run specific file
npm test -- Dashboard.test.tsx

# Run with coverage
npm test -- --coverage

# Run E2E tests
npx playwright test

# Run E2E in UI mode
npx playwright test --ui
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Code Coverage

### Coverage Reports

```bash
# Generate coverage
npm test -- --coverage

# Open HTML report
open coverage/index.html
```

### Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
});
```

## Best Practices

### Do's

✅ **Test behavior, not implementation**
```typescript
// Good
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// Avoid
expect(component.state.isSubmitting).toBe(false);
```

✅ **Use semantic queries**
```typescript
// Preferred order
screen.getByRole('button', { name: /click me/i });
screen.getByLabelText(/email/i);
screen.getByPlaceholderText(/search/i);
screen.getByText(/welcome/i);
screen.getByTestId('custom-element'); // Last resort
```

✅ **Test user interactions**
```typescript
await user.click(button);
await user.type(input, 'text');
await user.selectOptions(select, 'option');
```

✅ **Make tests maintainable**
```typescript
// Extract common setup
function renderProjectCard(props = {}) {
  const defaultProps = {
    project: createMockProject(),
    onView: vi.fn(),
  };
  return render(<ProjectCard {...defaultProps} {...props} />);
}
```

### Don'ts

❌ **Don't test implementation details**
```typescript
// Bad
expect(wrapper.find('.internal-class')).toExist();

// Good
expect(screen.getByRole('button')).toBeInTheDocument();
```

❌ **Don't use brittle selectors**
```typescript
// Bad
wrapper.find('.MuiButton-root > span > svg');

// Good
screen.getByRole('button', { name: /save/i });
```

❌ **Don't make tests dependent on each other**
```typescript
// Bad
test('adds item', () => { /* test 1 */ });
test('edits item added in previous test', () => { /* depends on test 1 */ });

// Good - each test is independent
test('adds and edits item', () => { /* complete flow */ });
```

## Continuous Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging Tests

### Debugging in VS Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Test",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "${relativeFile}"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Debugging Playwright

```bash
# Run in debug mode
npx playwright test --debug

# Run with headed browser
npx playwright test --headed

# Record test
npx playwright codegen http://localhost:5173
```

### Console Logging

```typescript
import { screen, debug } from '@testing-library/react';

// Print entire document
debug();

// Print specific element
debug(screen.getByRole('button'));

// Use logRoles
import { logRoles } from '@testing-library/react';
logRoles(container);
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

*Good tests give you confidence to ship quality code.*
