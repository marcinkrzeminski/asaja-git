# Troubleshooting Guide

## Button Not Injected?

If the Git branch button doesn't appear on Asana task pages, follow these steps:

### Step 1: Reload the Extension
1. Go to `chrome://extensions/`
2. Find "Asana Git Branch Generator"
3. Click the refresh button 🔄
4. Reload the Asana page

### Step 2: Check Console for Errors
1. Open an Asana task page
2. Press `F12` or right-click → Inspect
3. Go to the **Console** tab
4. Look for errors or messages starting with `[Asana Git]`

### Step 3: Run the Debug Helper
1. Copy the contents of `debug-helper.js`
2. Paste it into the Console tab
3. Press Enter
4. Review the output to understand what's happening

### Step 4: Manual DOM Inspection
1. Right-click on the toolbar/action area in Asana
2. Select "Inspect"
3. Look for the structure and share if needed
4. Common toolbar selectors to look for:
   - `data-test-id` attributes
   - Class names containing "toolbar", "actions", "pane"

### Step 5: Test on Simple Page
1. Open `test-implementation.html` in your browser
2. Check if the button appears
3. This tests if the basic injection logic works

## Common Issues

### Issue: "No toolbar found"
**Cause:** Toolbar selectors don't match Asana's current DOM structure
**Solution:** Run debug helper and share the output. We can update the selectors.

### Issue: "Not on task page"
**Cause:** The URL doesn't match `/task/123456` pattern
**Solution:** Ensure you're viewing a task detail page, not a project or list view

### Issue: Button appears but doesn't work
**Cause:** JavaScript errors or permissions issues
**Solution:** Check console for error messages

### Issue: Dropdown positioning is wrong
**Cause:** Button position calculation issues
**Solution:** May need to adjust CSS or positioning logic

## Getting Help

If you're still having issues:

1. **Share Console Output:**
   ```bash
   # Copy everything in the Console tab including:
   # - [Asana Git] messages
   # - Any red errors
   # - Debug helper output
   ```

2. **Share DOM Structure:**
   - Right-click toolbar → Inspect
   - Right-click the element → Copy → Copy outerHTML
   - Share the HTML structure

3. **Share Screenshots:**
   - Show the Asana page
   - Show the Console tab
   - Show the Elements tab with toolbar selected

## Quick Fix: Fallback Injection

If toolbar detection fails, the extension will try to inject the button near the task title instead. Check if you see the button there.

## Permissions Check

Ensure the extension has necessary permissions:
1. Go to `chrome://extensions/`
2. Click "Details" on Asana Git Branch Generator
3. Verify "Site access" includes `app.asana.com`
