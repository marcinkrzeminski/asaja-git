# 📋 Implementation Plan: Asana Git Branch Name Generator

### Summary
Chrome extension that injects a Git branch name generator button into Asana task pages. The button appears as the second-to-last action button and opens a dropdown with two copyable branch name formats.

---

## 1. Extension Structure

```
asana-git-branch/
├── manifest.json                    # Chrome extension config (V3)
├── content/
│   ├── content.js                   # Main content script
│   └── styles.css                   # UI styling to match Asana
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 2. Core Functionality

### Task Data Extraction
```javascript
// Extract task ID from URL: /task/1212648769804108
const taskId = window.location.pathname.match(/task\/(\d+)/)[1];
const shortId = taskId.slice(-6); // Returns "804108"

// Extract task title from textarea
const taskTitle = document.querySelector('textarea[aria-label="Task Name"]').value;
// Returns: "Selective Static Generation for Top 300 Pages"
```

### Branch Name Generation
```javascript
function generateBranchName(taskId, taskTitle) {
  const shortId = taskId.slice(-6); // Last 6 digits
  const sanitized = taskTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-');            // Collapse multiple hyphens

  // Trim to fit within 32 chars (excluding "feature/" prefix)
  const maxTitleLength = 32 - shortId.length - 1; // -1 for hyphen
  const truncatedTitle = sanitized.slice(0, maxTitleLength);

  return `feature/${shortId}-${truncatedTitle}`;
}

// Example: "feature/804108-selective-static"
```

### UI Output
For task "Selective Static Generation for Top 300 Pages" (ID: 1212648769804108):

**Dropdown Fields:**
1. `feature/804108-selective-static`
2. `git checkout -b feature/804108-selective-static`

---

## 3. UI Injection

### Button Position
- Locate toolbar with action buttons (Complete, Assign, etc.)
- Inject **as second-to-last button** (before close button)
- Use Git branch icon (SVG)

### Toolbar Selection Strategy
```javascript
// Try multiple selector strategies to handle dynamic class names:
const selectors = [
  '[data-test-id="task-pane-actions"]', // Test ID (most reliable)
  '.TaskPaneActions', // Class name pattern
  '[role="toolbar"]', // Semantic selector
  '.TaskToolbar-paneToolbar', // Another class pattern
  '.top-bar' // Fallback
];
```

### Dropdown UI
```html
<div class="branch-dropdown" hidden>
  <div class="dropdown-header">Link Task to Branch</div>
  <div class="dropdown-content">
    <div class="field-group">
      <label>A valid branch name for this task:</label>
      <div class="input-wrapper">
        <input type="text" readonly value="feature/804108-selective-static">
        <button class="copy-btn">📋</button>
      </div>
    </div>
    <div class="field-group">
      <label>Create & checkout a new branch for this task:</label>
      <div class="input-wrapper">
        <input type="text" readonly value="git checkout -b feature/804108-selective-static">
        <button class="copy-btn">📋</button>
      </div>
    </div>
  </div>
</div>
```

---

## 4. Implementation Steps

### Phase 1: Setup
1. Create `manifest.json` with:
   - `manifest_version: 3`
   - `content_scripts` for `app.asana.com`
   - Host permissions for clipboard access
   - Minimal required permissions

2. Create base content script structure with:
   - URL pattern matching (`*://app.asana.com/*/task/*`)
   - Initial page load detection

### Phase 2: Task Data Extraction
3. Implement URL parsing to extract task ID
4. Implement task title extraction from textarea
5. Implement branch name generation with 32-char limit
6. Add error handling for missing elements

### Phase 3: UI Injection
7. Create button element with SVG branch icon
8. Implement toolbar detection with multiple selector strategies
9. Inject button as second-to-last child
10. Create dropdown HTML structure
11. Style dropdown to match Asana's UI (colors, spacing, shadows)

### Phase 4: Interactivity
12. Add click handler to toggle dropdown visibility
13. Implement copy-to-clipboard functionality
14. Add "Copied!" feedback animation
15. Handle clicks outside dropdown to close it
16. Re-inject button on page navigation (SPA handling)

### Phase 5: Refinement
17. Use MutationObserver to detect dynamic content changes
18. Add loading states (show button only after title loads)
19. Handle edge cases (very long titles, special characters)
20. Test across different Asana page states (task view, project view, etc.)

---

## 5. Technical Considerations

### Asana SPA Handling
- Asana is a Single Page App - need MutationObserver
- Monitor DOM changes for toolbar appearance
- Re-inject button on task navigation

### Clipboard Access
- Use `navigator.clipboard.writeText()`
- Fallback: `document.execCommand('copy')` for older browsers
- User permission handling

### Performance
- Debounce MutationObserver callbacks
- Cache element references
- Minimal DOM queries

### Styling
- Match Asana's color scheme (purple #2c4bff, gray backgrounds)
- Use system fonts
- Responsive design for different screen sizes
- Dark mode compatibility (detect `prefers-color-scheme`)

### Error Handling
- Graceful degradation if elements not found
- Retry logic for dynamic content
- Console warnings for debugging

---

## 6. File Contents Preview

### manifest.json
```json
{
  "manifest_version": 3,
  "name": "Asana Git Branch Generator",
  "version": "1.0.0",
  "description": "Generate Git branch names from Asana tasks",
  "content_scripts": [
    {
      "matches": ["*://app.asana.com/*/task/*"],
      "js": ["content/content.js"],
      "css": ["content/styles.css"]
    }
  ],
  "permissions": ["activeTab"]
}
```

### content.js (Core Logic)
- URL pattern matching
- Task ID extraction
- Title extraction
- Branch name generation
- Button injection
- Dropdown creation
- Copy functionality

### styles.css
- Dropdown positioning (absolute/fixed)
- Button styling
- Input field styling
- Hover effects
- Animations
- Asana theme matching

---

## 7. Testing Checklist

- [ ] Button appears on task pages
- [ ] Button is positioned as second-to-last
- [ ] Dropdown opens on click
- [ ] Branch names are correctly formatted
- [ ] Branch names are trimmed to 32 chars
- [ ] Copy buttons work for both fields
- [ ] "Copied!" feedback appears
- [ ] Dropdown closes on outside click
- [ ] Works after navigating between tasks
- [ ] Handles long task titles
- [ ] Handles special characters in titles
- [ ] Works with empty task titles
- [ ] Responsive on different screen sizes

---

## Requirements Summary

✅ Branch name: `feature/804108-selective-static` (32 chars)
✅ Single prefix: `feature/`
✅ Two copyable fields (branch name + git command)
✅ Button injected as second-to-last
✅ Matches Asana UI style
