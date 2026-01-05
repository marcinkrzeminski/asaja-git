/**
 * Asana Git Branch Generator - Debug Helper
 * Run this in the Chrome DevTools console on an Asana task page
 */

console.log('🚀 Starting Asana Git Branch Generator Debug...');

(function() {
  try {
    console.log('✅ Debug helper is running');
    console.log('=== Asana Git Branch Generator Debug ===\n');

  // Check if we're on a task page
  const isTaskPage = window.location.pathname.match(/\/task\/(\d+)/);
  console.log('1. URL Check:', isTaskPage ? '✅ On task page' : '❌ Not on task page');
  if (isTaskPage) {
    console.log('   Task ID:', isTaskPage[1]);
    console.log('   Short ID (last 6):', isTaskPage[1].slice(-6));
  }

  // Check for task title textarea
  const taskTitle = document.querySelector('textarea[aria-label="Task Name"]');
  console.log('\n2. Task Title:', taskTitle ? '✅ Found' : '❌ Not found');
  if (taskTitle) {
    console.log('   Value:', taskTitle.value);
    console.log('   Parent:', taskTitle.parentElement);
  }

  // Check all potential toolbar selectors
  const toolbarSelectors = [
    '[data-test-id="task-pane-actions"]',
    '[data-test-id="top-bar"]',
    '[data-test-id="task-top-bar"]',
    '.TaskPaneActions',
    '[role="toolbar"]',
    '.TaskToolbar-paneToolbar',
    '.top-bar',
    '.TaskPaneHeaderActions',
    '.TaskPanePrimaryActions',
    '.TaskPane-paneToolbar',
    '.TaskActionsToolbar',
    '[data-test-id="task-details-pane-actions"]'
  ];

  console.log('\n3. Toolbar Search:');
  let foundToolbar = false;
  toolbarSelectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      console.log('   ✅ Found:', selector);
      console.log('      Element:', element);
      console.log('      Buttons:', element.querySelectorAll('button').length);
      foundToolbar = true;
    }
  });

  if (!foundToolbar) {
    console.log('   ❌ No toolbar found with any selector');
  }

  // Find all buttons on the page to understand the structure
  const allButtons = document.querySelectorAll('button');
  console.log('\n4. All Buttons:', allButtons.length);
  const buttonTexts = [];
  allButtons.forEach(btn => {
    const text = btn.textContent.trim().slice(0, 30);
    const ariaLabel = btn.getAttribute('aria-label');
    if (text || ariaLabel) {
      buttonTexts.push(`   - "${text || ariaLabel}"`);
    }
  });
  if (buttonTexts.length > 0) {
    console.log('   Button labels (first 20):');
    buttonTexts.slice(0, 20).forEach(t => console.log(t));
  }

  // Look for task pane elements
  console.log('\n5. Task Pane Elements:');
  const taskPaneSelectors = [
    '.TaskPanePane-content',
    '.TaskPane-content',
    '.task-pane-content',
    '[data-test-id="task-details-pane"]',
    '.TaskPane',
    '.task-pane'
  ];

  taskPaneSelectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      console.log('   ✅ Found:', selector);
    }
  });

  // Generate sample branch name
  if (isTaskPage && taskTitle) {
    console.log('\n6. Branch Name Generation:');
    const taskId = isTaskPage[1];
    const shortId = taskId.slice(-6);
    const title = taskTitle.value;
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const maxTitleLength = 32 - shortId.length - 1;
    const truncatedTitle = sanitized.slice(0, maxTitleLength);
    const branchName = `feature/${shortId}-${truncatedTitle}`;
    console.log('   Task ID:', taskId);
    console.log('   Short ID:', shortId);
    console.log('   Title:', title);
    console.log('   Sanitized:', sanitized);
    console.log('   Truncated:', truncatedTitle);
    console.log('   Branch Name:', branchName);
    console.log('   Git Command:', `git checkout -b ${branchName}`);
  }

  // Check if our button is already injected
  const ourButton = document.querySelector('.asana-git-branch-btn');
  console.log('\n7. Extension Button:', ourButton ? '✅ Found' : '❌ Not found');
  if (ourButton) {
    console.log('   Parent:', ourButton.parentElement);
  }

  console.log('\n=== Debug Complete ===');
  console.log('💡 Tip: Inspect elements by right-clicking and selecting "Inspect"');
  console.log('💡 Share the console output if you need help debugging');
  } catch (error) {
    console.error('❌ Error in debug helper:', error);
    console.error('Stack trace:', error.stack);
  }
})();
