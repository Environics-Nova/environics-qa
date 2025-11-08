# Development Setup

This guide will help you set up your development environment for contributing to the Environics QA project.

## Prerequisites

### Required Software

- **Node.js** v18.0.0 or higher
  - Download: https://nodejs.org/
  - Check version: `node --version`

- **npm** v8.0.0 or higher (comes with Node.js)
  - Check version: `npm --version`

- **Git** 
  - Download: https://git-scm.com/
  - Check version: `git --version`

### Recommended Tools

- **VS Code** - Recommended code editor
  - Download: https://code.visualstudio.com/

- **Bun** - Faster alternative to npm (optional)
  - Install: https://bun.sh/
  - Check version: `bun --version`

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

1. **ES7+ React/Redux/React-Native snippets** - Code snippets
2. **Tailwind CSS IntelliSense** - Tailwind autocomplete
3. **TypeScript Vue Plugin (Volar)** - TypeScript support
4. **ESLint** - Code linting
5. **Prettier** - Code formatting
6. **GitLens** - Git integration
7. **Path Intellisense** - Path autocomplete

## Initial Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd environics-qa
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using Bun (faster):
```bash
bun install
```

### 3. Verify Installation

```bash
# List installed packages
npm list --depth=0

# Check for vulnerabilities
npm audit
```

### 4. Start Development Server

```bash
npm run dev
```

The application should be available at `http://localhost:5173`

## Project Scripts

### Available npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with HMR |
| `build` | `npm run build` | Create production build |
| `build:dev` | `npm run build:dev` | Create development build |
| `lint` | `npm run lint` | Run ESLint to check code quality |
| `preview` | `npm run preview` | Preview production build locally |

### Development Workflow

```bash
# Start development server
npm run dev

# In another terminal, run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Environment

### Environment Variables

Currently, the project doesn't use environment variables. If you need to add any:

1. Create `.env` file in root directory
2. Add variables with `VITE_` prefix:
   ```
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=Environics QA
   ```
3. Access in code:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

### Configuration Files

#### `vite.config.ts`
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### `tsconfig.json`
TypeScript configuration with path aliases and strict mode.

#### `tailwind.config.ts`
Tailwind CSS configuration with custom theme and plugins.

#### `components.json`
shadcn/ui component configuration.

## Project Structure for Development

```
environics-qa/
├── src/
│   ├── components/          # Add new components here
│   │   ├── ui/             # shadcn/ui components (auto-generated)
│   │   └── *.tsx           # Custom feature components
│   ├── pages/              # Add new pages here
│   ├── types/              # Add/modify types here
│   ├── data/               # Mock data for development
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── docs/                   # Project documentation
└── [config files]          # Various configuration files
```

## Development Guidelines

### Adding a New Page

1. Create page component in `src/pages/`:
   ```typescript
   // src/pages/MyNewPage.tsx
   const MyNewPage = () => {
     return (
       <div className="p-6">
         <h1>My New Page</h1>
       </div>
     );
   };
   
   export default MyNewPage;
   ```

2. Add route in `src/App.tsx`:
   ```typescript
   import MyNewPage from "./pages/MyNewPage";
   
   // In Routes component:
   <Route path="/my-new-page" element={<MyNewPage />} />
   ```

3. Add navigation link in `src/components/AppSidebar.tsx` if needed

### Adding a New Component

1. Create component file in `src/components/`:
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

2. Export from index (if creating a component library):
   ```typescript
   export { MyComponent } from './MyComponent';
   ```

### Adding a shadcn/ui Component

Use the CLI to add new shadcn/ui components:

```bash
# Add a specific component
npx shadcn-ui@latest add button

# Add multiple components
npx shadcn-ui@latest add card dialog form
```

Components will be added to `src/components/ui/`.

### Adding a New Type

Add types to `src/types/index.ts`:

```typescript
export interface MyNewType {
  id: string;
  name: string;
  // ... other properties
}
```

### Using Path Aliases

The project uses `@/` alias for the `src/` directory:

```typescript
// Instead of:
import { Button } from "../../components/ui/button";

// Use:
import { Button } from "@/components/ui/button";
```

## Styling Guidelines

### Tailwind CSS

Use Tailwind utility classes for styling:

```typescript
<div className="flex items-center gap-4 p-6 bg-background rounded-lg">
  <Button className="w-full md:w-auto">Click Me</Button>
</div>
```

### Theme Variables

Use CSS variables defined in `src/index.css`:

```typescript
// Background colors
bg-background
bg-foreground
bg-card
bg-popover

// Text colors
text-foreground
text-muted-foreground

// Border colors
border-border

// Primary colors
bg-primary
text-primary
```

### Responsive Design

Use Tailwind responsive prefixes:

```typescript
className="w-full md:w-1/2 lg:w-1/3"
//         mobile  tablet    desktop
```

### Dark Mode

The app supports dark mode via `next-themes`:

```typescript
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();

// Toggle theme
setTheme(theme === "dark" ? "light" : "dark");
```

## Debugging

### React DevTools

Install React DevTools browser extension:
- Chrome: https://chrome.google.com/webstore (search "React Developer Tools")
- Firefox: https://addons.mozilla.org/firefox/ (search "React Developer Tools")

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Console Logging

```typescript
// Development only logging
if (import.meta.env.DEV) {
  console.log("Debug info:", data);
}
```

### Error Boundaries

Wrap components with error boundaries for better error handling:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

## Code Quality

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint -- --fix
```

### Type Checking

TypeScript will check types during development. To run type checking manually:

```bash
npx tsc --noEmit
```

### Code Formatting

Use Prettier for consistent formatting (if configured):

```bash
npx prettier --write src/
```

## Git Workflow

### Branch Naming Convention

```
feature/feature-name
bugfix/bug-description
hotfix/critical-fix
docs/documentation-update
```

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(projects): add project filtering by status

fix(qaqc): resolve process result calculation issue

docs(readme): update installation instructions
```

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Run linter: `npm run lint`
4. Build project: `npm run build`
5. Commit changes with descriptive message
6. Push to remote branch
7. Create pull request
8. Request code review
9. Address review comments
10. Merge after approval

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

See [Testing Guide](./testing-guide.md) for detailed testing documentation.

## Common Development Tasks

### Task: Add a New Route

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link (if needed)
4. Test navigation

### Task: Add Mock Data

1. Open `src/data/sampleData.ts`
2. Add your mock data following existing patterns
3. Export the data
4. Import in components where needed

### Task: Style a Component

1. Use Tailwind utility classes
2. Use theme variables for colors
3. Ensure responsive design
4. Test in light and dark modes

### Task: Add Form Validation

1. Create Zod schema:
   ```typescript
   const schema = z.object({
     email: z.string().email(),
     name: z.string().min(2),
   });
   ```

2. Use with React Hook Form:
   ```typescript
   const form = useForm({
     resolver: zodResolver(schema),
   });
   ```

## Troubleshooting Development Issues

### Port Already in Use

Vite will automatically use the next available port. Check terminal for actual port.

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Tailwind Classes Not Working

1. Check `tailwind.config.ts` content paths
2. Restart dev server
3. Clear browser cache

### Hot Module Replacement Not Working

1. Check file is being watched
2. Restart dev server
3. Check for syntax errors

## Performance Tips

### Development Build Performance

- Use `bun` instead of `npm` for faster installs
- Keep dependencies minimal
- Use React DevTools Profiler to identify bottlenecks

### Production Build Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

## Additional Resources

- **React Documentation**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Vite Guide**: https://vitejs.dev/guide/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

## Next Steps

- Read [Coding Standards](./coding-standards.md)
- Review [Architecture Overview](./architecture.md)
- Check [Component Library](./components.md)
- Learn about [Testing](./testing-guide.md)

---

*Ready to contribute? Start with a small feature or bug fix and follow the guidelines above.*
