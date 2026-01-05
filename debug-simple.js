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
console.log('\nSearching for elements with multiple buttons (potential action bars)...');
const candidates = [];
document.querySelectorAll('div, section, nav, header').forEach(el => {
  const buttons = el.querySelectorAll('button');
  if (buttons.length >= 2 && buttons.length <= 10) {
    const className = el.className || '';
    const id = el.id || '';
    const dataTestId = el.getAttribute('data-test-id') || '';

    if (className.toLowerCase().includes('action') ||
        className.toLowerCase().includes('toolbar') ||
        id.toLowerCase().includes('action') ||
        dataTestId.toLowerCase().includes('action') ||
        dataTestId.toLowerCase().includes('top')) {
      candidates.push({
        tag: el.tagName,
        id: id,
        className: className.slice(0, 60),
        dataTestId: dataTestId,
        buttonCount: buttons.length,
        buttonTexts: Array.from(buttons).slice(0, 3).map(b => b.textContent.trim().slice(0, 20))
      });
    }
  }
});

if (candidates.length > 0) {
  console.log('Found', candidates.length, 'candidate action bars:');
  candidates.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.className || c.id || c.dataTestId}`);
    console.log(`     Buttons: ${c.buttonCount}, Examples:`, c.buttonTexts);
  });
} else {
  console.log('No candidate action bars found');
}

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
