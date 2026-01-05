# Tasks: Asana Git Branch Generator

## Phase 1: Setup
- [x] Create project structure
- [x] Create manifest.json with V3 config
- [x] Create content script structure
- [x] Set up URL pattern matching

## Phase 2: Task Data Extraction
- [x] Implement URL parsing to extract task ID
- [x] Implement task title extraction from textarea
- [x] Implement branch name generation with 32-char limit
- [x] Add error handling for missing elements

## Phase 3: UI Injection
- [x] Create button element with SVG branch icon
- [x] Implement toolbar detection with multiple selector strategies
- [x] Inject button as second-to-last child
- [x] Create dropdown HTML structure
- [x] Style dropdown to match Asana's UI

## Phase 4: Interactivity
- [x] Add click handler to toggle dropdown visibility
- [x] Implement copy-to-clipboard functionality
- [x] Add "Copied!" feedback animation
- [x] Handle clicks outside dropdown to close it
- [x] Re-inject button on page navigation (SPA handling)

## Phase 5: Refinement
- [x] Use MutationObserver to detect dynamic content changes
- [x] Add loading states (show button only after title loads)
- [x] Handle edge cases (very long titles, special characters)
- [x] Test across different Asana page states

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
