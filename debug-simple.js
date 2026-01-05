/**
 * Simple Debug Script - Copy and paste into Chrome DevTools Console
 */

console.log('=== Asana Git Branch Generator Debug ===');

// 1. Check URL
const isTaskPage = window.location.pathname.match(/\/task\/(\d+)/);
console.log('URL Check:', isTaskPage ? '✅ Task page found' : '❌ Not a task page');
console.log('Full URL:', window.location.href);
console.log('Pathname:', window.location.pathname);

if (isTaskPage) {
  console.log('Task ID:', isTaskPage[1]);
  console.log('Short ID (last 6):', isTaskPage[1].slice(-6));
}

// 2. Find task title
const taskTitle = document.querySelector('textarea[aria-label="Task Name"]');
console.log('\nTask Title Textarea:', taskTitle ? '✅ Found' : '❌ Not found');
if (taskTitle) {
  console.log('Value:', taskTitle.value);
  console.log('Parent element:', taskTitle.parentElement);
}

// 3. List all elements with data-test-id
console.log('\nElements with data-test-id:');
const testElements = document.querySelectorAll('[data-test-id]');
console.log('Count:', testElements.length);
testElements.forEach((el, i) => {
  if (i < 10) {
    console.log(`  - ${el.getAttribute('data-test-id')}: ${el.tagName}.${el.className.slice(0, 30)}`);
  }
});

// 4. Search for potential toolbars
console.log('\nSearching for toolbars...');
const searchTerms = ['toolbar', 'action', 'pane', 'top-bar'];
document.querySelectorAll('*').forEach(el => {
  const id = el.id || '';
  const className = el.className || '';
  const dataTestId = el.getAttribute('data-test-id') || '';

  if (id.toLowerCase().includes('toolbar') ||
      className.toLowerCase().includes('toolbar') ||
      dataTestId.toLowerCase().includes('toolbar') ||
      dataTestId.toLowerCase().includes('action') ||
      className.toLowerCase().includes('action')) {
    console.log(`Found:`, {
      tag: el.tagName,
      id: id,
      className: className.slice(0, 50),
      dataTestId: dataTestId,
      children: el.children.length
    });
  }
});

// 5. List all buttons with text
console.log('\nButtons with text:');
document.querySelectorAll('button').forEach(btn => {
  const text = btn.textContent.trim();
  const ariaLabel = btn.getAttribute('aria-label');
  const title = btn.getAttribute('title');

  if (text || ariaLabel || title) {
    console.log(`  Button: "${(text || ariaLabel || title).slice(0, 30)}"`);
  }
});

// 6. Check if extension button exists
const ourButton = document.querySelector('.asana-git-branch-btn');
console.log('\nExtension button:', ourButton ? '✅ Found!' : '❌ Not found');

console.log('\n=== Debug Complete ===');
