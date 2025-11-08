# Troubleshooting Guide

Solutions to common issues and problems in the Environics QA system.

## Installation & Setup Issues

### Cannot Install Dependencies

**Problem:** `npm install` fails with errors.

**Solutions:**

1. **Check Node.js version**
   ```bash
   node --version  # Should be v18+
   ```

2. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use alternative package manager**
   ```bash
   # Try using bun
   bun install
   ```

4. **Check internet connection**
   - Verify you can access npmjs.com
   - Check firewall/proxy settings

5. **Run with verbose logging**
   ```bash
   npm install --verbose
   ```

### Dev Server Won't Start

**Problem:** `npm run dev` fails or doesn't start.

**Solutions:**

1. **Port already in use**
   - Vite will automatically try next available port
   - Check terminal output for actual port number
   - Or manually kill process using port 5173:
     ```bash
     # Windows
     netstat -ano | findstr :5173
     taskkill /PID <PID> /F
     
     # Mac/Linux
     lsof -i :5173
     kill -9 <PID>
     ```

2. **Check for syntax errors**
   ```bash
   npm run lint
   ```

3. **Clear Vite cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

4. **Reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

### Build Fails

**Problem:** `npm run build` produces errors.

**Solutions:**

1. **Check TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```

2. **Check ESLint errors**
   ```bash
   npm run lint
   ```

3. **Clear build cache**
   ```bash
   rm -rf dist
   npm run build
   ```

4. **Increase Node memory**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

## Application Issues

### Blank Page / White Screen

**Problem:** Application loads but shows blank page.

**Solutions:**

1. **Check browser console** (F12)
   - Look for JavaScript errors
   - Note any red error messages

2. **Clear browser cache**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Select "Cached images and files"

3. **Disable browser extensions**
   - Try incognito/private mode
   - Disable ad blockers temporarily

4. **Check for build errors**
   ```bash
   npm run build
   # Check terminal output
   ```

5. **Verify JavaScript is enabled**
   - Check browser settings
   - Ensure JavaScript is not blocked

### Components Not Rendering

**Problem:** Specific components don't appear or show incorrectly.

**Solutions:**

1. **Check component imports**
   ```typescript
   // Ensure correct path
   import { Button } from "@/components/ui/button";
   ```

2. **Verify component exists**
   ```bash
   ls src/components/ui/button.tsx
   ```

3. **Check for TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```

4. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Styling Issues / CSS Not Applied

**Problem:** Tailwind classes not working or styles incorrect.

**Solutions:**

1. **Check Tailwind config**
   - Verify `tailwind.config.ts` content paths
   - Ensure source files are included

2. **Restart dev server**
   ```bash
   npm run dev
   ```

3. **Check class names**
   ```typescript
   // Correct
   className="flex items-center gap-4"
   
   // Incorrect
   className="display-flex align-items-center gap-4"
   ```

4. **Clear build cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

5. **Verify Tailwind directives in CSS**
   ```css
   /* src/index.css should have: */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Routes Not Working

**Problem:** Navigation doesn't work or shows 404 errors.

**Solutions:**

1. **Check route definition**
   ```typescript
   // In App.tsx
   <Route path="/your-route" element={<YourComponent />} />
   ```

2. **Verify component import**
   ```typescript
   import YourComponent from "./pages/YourComponent";
   ```

3. **Check navigation call**
   ```typescript
   // Correct
   navigate("/your-route")
   
   // Incorrect
   navigate("your-route")  // Missing leading slash
   ```

4. **Verify BrowserRouter is wrapping routes**
   ```typescript
   <BrowserRouter>
     <Routes>{/* routes */}</Routes>
   </BrowserRouter>
   ```

### Hot Module Replacement Not Working

**Problem:** Changes don't reflect without manual refresh.

**Solutions:**

1. **Check for syntax errors**
   - Look at terminal for errors
   - Check browser console

2. **Restart dev server**
   ```bash
   npm run dev
   ```

3. **Check file is being watched**
   - Verify file is inside `src/` directory
   - Check `.gitignore` isn't excluding it

4. **Try manual refresh** (F5)

## Data Issues

### Projects Not Showing

**Problem:** Dashboard shows no projects or "No projects found".

**Solutions:**

1. **Check filter settings**
   - Clear search box
   - Set year filter to "All Years"

2. **Verify sample data**
   ```typescript
   // Check src/data/sampleData.ts
   console.log(sampleProjects);
   ```

3. **Check browser console for errors**
   - Press F12
   - Look for data loading errors

4. **Refresh the page** (F5)

### Search Not Working

**Problem:** Search box doesn't filter results.

**Solutions:**

1. **Check search logic**
   ```typescript
   // Verify case-insensitive search
   project.name.toLowerCase().includes(searchTerm.toLowerCase())
   ```

2. **Clear search term**
   - Delete text from search box
   - Verify all projects reappear

3. **Check state updates**
   ```typescript
   // Ensure setState is called
   setSearchTerm(e.target.value)
   ```

### Document Processing Stuck

**Problem:** Document shows "Processing" indefinitely.

**Solutions:**

1. **Refresh the page** (F5)

2. **Check mock data status**
   ```typescript
   // In sampleData.ts, verify:
   status: "Parsed"  // Not "Processing"
   ```

3. **Wait longer** (if real processing implemented)
   - Complex documents take time
   - Check back in a few minutes

4. **Verify file format supported**
   - PDF, Excel, Word, CSV, Images only

## Performance Issues

### Slow Loading / Lag

**Problem:** Application is slow or unresponsive.

**Solutions:**

1. **Check browser performance**
   - Open Task Manager / Activity Monitor
   - Check CPU and memory usage
   - Close unused tabs

2. **Clear browser cache**
   - Cached files may be corrupted
   - Clear and reload

3. **Disable browser extensions**
   - Try incognito mode
   - Test with extensions disabled

4. **Check network connection**
   - Verify internet speed
   - Check for network issues

5. **Use production build locally**
   ```bash
   npm run build
   npm run preview
   ```

### Memory Issues

**Problem:** Browser tab crashes or becomes unresponsive.

**Solutions:**

1. **Close other tabs/applications**
   - Free up system memory

2. **Increase browser memory limit**
   - Chrome: Use `--max-old-space-size` flag
   - Restart browser

3. **Use lighter browser**
   - Try Firefox or Edge if using Chrome

4. **Check for memory leaks**
   - Open Chrome DevTools
   - Performance → Memory profiler
   - Look for increasing memory usage

## TypeScript Issues

### Type Errors

**Problem:** TypeScript shows type errors.

**Solutions:**

1. **Check type definitions**
   ```typescript
   // Verify type exists in src/types/index.ts
   import { Project } from "@/types";
   ```

2. **Restart TypeScript server**
   - VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

3. **Check for missing properties**
   ```typescript
   // Ensure all required properties provided
   const project: Project = {
     project_id: "123",
     name: "Test",
     client: "Client",
     location: "Location",
     status: "Not Started",
     start_date: "2025-01-01",
     // end_date is optional
   };
   ```

4. **Use type assertions carefully**
   ```typescript
   // Last resort only
   const value = something as SomeType;
   ```

### Import Errors

**Problem:** Cannot find module errors.

**Solutions:**

1. **Check path alias**
   ```typescript
   // Use @ alias
   import { Button } from "@/components/ui/button";
   
   // Not relative paths (unless in same directory)
   import { Button } from "../../components/ui/button";
   ```

2. **Verify tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. **Check file extension**
   ```typescript
   // Don't include .tsx extension in imports
   import Component from "./Component";  // Correct
   import Component from "./Component.tsx";  // Wrong
   ```

## Git Issues

### Merge Conflicts

**Problem:** Git merge conflicts when pulling/pushing.

**Solutions:**

1. **Stash local changes**
   ```bash
   git stash
   git pull
   git stash pop
   ```

2. **Resolve conflicts manually**
   ```bash
   # Open conflicted files
   # Look for <<<<<<< HEAD markers
   # Keep desired changes
   # Remove conflict markers
   git add .
   git commit -m "Resolved conflicts"
   ```

3. **Use merge tool**
   ```bash
   git mergetool
   ```

### Cannot Push Changes

**Problem:** Git push fails.

**Solutions:**

1. **Pull latest changes first**
   ```bash
   git pull --rebase
   git push
   ```

2. **Check branch protection**
   - May need to create pull request
   - Contact repository admin

3. **Check authentication**
   - Verify Git credentials
   - Update access tokens if needed

## Browser-Specific Issues

### Chrome Issues

1. **Disable cache during development**
   - DevTools (F12) → Network tab
   - Check "Disable cache"

2. **Clear site data**
   - DevTools → Application → Clear storage

3. **Reset Chrome settings**
   - Settings → Reset settings

### Firefox Issues

1. **Disable tracking protection** (temporarily)
   - Shield icon in address bar

2. **Clear cookies and site data**
   - Settings → Privacy & Security

### Safari Issues

1. **Enable Developer Tools**
   - Safari → Preferences → Advanced
   - Check "Show Develop menu"

2. **Clear cache**
   - Develop → Empty Caches

3. **Disable content blockers** (temporarily)

## Environment Issues

### Windows-Specific

1. **Line ending issues**
   ```bash
   git config core.autocrlf true
   ```

2. **Path length issues**
   - Enable long paths in Windows
   - Or shorten project path

3. **Permission issues**
   - Run terminal as administrator
   - Check folder permissions

### Mac-Specific

1. **Xcode command line tools**
   ```bash
   xcode-select --install
   ```

2. **Permission issues**
   ```bash
   sudo chown -R $USER /usr/local
   ```

### Linux-Specific

1. **Permission issues**
   ```bash
   sudo chown -R $USER:$USER node_modules
   ```

2. **File watchers limit**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

## Getting Additional Help

### Before Asking for Help

1. **Check error messages carefully**
   - Read full error message
   - Note file names and line numbers

2. **Check browser console**
   - Press F12
   - Look at Console and Network tabs

3. **Try basic troubleshooting**
   - Refresh page
   - Clear cache
   - Restart server

4. **Search for similar issues**
   - Check [FAQ](./faq.md)
   - Search error message online

### Reporting Issues

When reporting problems, include:

1. **Environment details**
   - OS and version
   - Browser and version
   - Node.js version

2. **Steps to reproduce**
   - What did you do?
   - What happened?
   - What did you expect?

3. **Error messages**
   - Full error text
   - Browser console errors
   - Terminal output

4. **Screenshots**
   - Visual issues
   - Error screens

5. **Code snippets** (if relevant)
   - What you changed
   - Relevant file contents

### Contact Information

- **System Administrator**: For access/deployment issues
- **Development Team**: For bugs/technical issues
- **Project Manager**: For feature requests
- **Documentation Team**: For documentation errors

---

*For more information, see [FAQ](./faq.md) and [Development Setup](./development-setup.md)*
