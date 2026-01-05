# Tasks: Asana Git Branch Generator

## Phase 1: Setup
- [ ] Create project structure
- [ ] Create manifest.json with V3 config
- [ ] Create content script structure
- [ ] Set up URL pattern matching

## Phase 2: Task Data Extraction
- [ ] Implement URL parsing to extract task ID
- [ ] Implement task title extraction from textarea
- [ ] Implement branch name generation with 32-char limit
- [ ] Add error handling for missing elements

## Phase 3: UI Injection
- [ ] Create button element with SVG branch icon
- [ ] Implement toolbar detection with multiple selector strategies
- [ ] Inject button as second-to-last child
- [ ] Create dropdown HTML structure
- [ ] Style dropdown to match Asana's UI

## Phase 4: Interactivity
- [ ] Add click handler to toggle dropdown visibility
- [ ] Implement copy-to-clipboard functionality
- [ ] Add "Copied!" feedback animation
- [ ] Handle clicks outside dropdown to close it
- [ ] Re-inject button on page navigation (SPA handling)

## Phase 5: Refinement
- [ ] Use MutationObserver to detect dynamic content changes
- [ ] Add loading states (show button only after title loads)
- [ ] Handle edge cases (very long titles, special characters)
- [ ] Test across different Asana page states

## Testing
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
