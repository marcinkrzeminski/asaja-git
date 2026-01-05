# Asana Git Branch Generator

A Chrome extension that adds a Git branch name generator to Asana task pages.

## Features

- Automatically generates Git branch names based on Asana task titles
- Extracts the last 6 digits of the task ID
- Trims branch names to 32 characters
- Provides two copyable formats:
  - Branch name: `feature/804108-selective-static`
  - Git command: `git checkout -b feature/804108-selective-static`
- Matches Asana's UI design
- Supports dark mode

## Installation

### Manual Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `asana-git-branch` directory

## Usage

1. Navigate to any task in Asana (e.g., `https://app.asana.com/1/PROJECT_ID/task/TASK_ID`)
2. Look for the Git branch icon (🌿) in the task action toolbar
3. Click the icon to open the branch name dropdown
4. Click the copy button (📋) next to any field to copy it to your clipboard
5. Use the branch name in your Git workflow

## Branch Name Format

Branch names follow this format:
```
feature/{last-6-digits}-{sanitized-title}
```

Example:
- Task ID: `1212648769804108`
- Task Title: "Selective Static Generation for Top 300 Pages"
- Branch Name: `feature/804108-selective-static`

The title is sanitized by:
- Converting to lowercase
- Removing special characters
- Replacing spaces with hyphens
- Trimming to fit within 32 characters

## Development

### Project Structure

```
asana-git-branch/
├── manifest.json          # Chrome extension manifest (V3)
├── content/
│   ├── content.js        # Main content script
│   └── styles.css        # UI styling
├── icons/
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
├── plan.md               # Detailed implementation plan
└── tasks.md              # Task breakdown
```

### Testing the Extension

1. Load the extension in Chrome (see Installation)
2. Navigate to a task in Asana
3. Verify the Git branch icon appears in the toolbar
4. Click the icon and verify the dropdown opens
5. Test copy functionality for both fields
6. Navigate between tasks and verify the button persists

### Building for Distribution

To create a distributable `.zip` file:

```bash
zip -r asana-git-branch.zip . -x "*.git*" "*.md"
```

## Troubleshooting

### Button doesn't appear

- Ensure you're on a task page (URL contains `/task/`)
- Refresh the page after loading the extension
- Check the browser console for errors

### Branch names are incorrect

- Verify the task has a title
- Check the URL contains a valid task ID

### Copy functionality doesn't work

- Ensure the extension has clipboard permissions
- Try the fallback copy mechanism (built-in)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License

## Credits

Created to replicate the Git branch name generation feature found in Shortcut and Jira for Asana users.
