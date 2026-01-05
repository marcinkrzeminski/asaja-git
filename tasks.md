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
- [x] Button appears on task pages
- [x] Button is positioned as second-to-last
- [x] Dropdown opens on click
- [x] Branch names are correctly formatted
- [x] Branch names are trimmed to 32 chars
- [x] Copy buttons work for both fields
- [x] "Copied!" feedback appears
- [x] Dropdown closes on outside click
- [x] Works after navigating between tasks
- [x] Handles long task titles
- [x] Handles special characters in titles
- [x] Works with empty task titles
- [x] Responsive on different screen sizes

## Additional Fixes
- [x] Fix toolbar detection (skip text editor toolbar)
- [x] Fix button injection to place after More actions button
- [x] Fix toggle issue (remove click listener when closing)
- [x] Fix SPA navigation (re-inject when URL changes)
- [x] Fix dropdown positioning (intelligent screen awareness)
- [x] Clean up debug logs and comments
- [x] Fix branch name truncation (truncate at word boundaries)
- [x] Make copy button smaller with proper spacing
- [x] Fix dropdown positioning to be relative to button
- [x] Fix view switching (re-inject on DOM changes)
