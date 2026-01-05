(function() {
  'use strict';

  let branchButton = null;
  let dropdown = null;

  function extractTaskId() {
    const match = window.location.pathname.match(/task\/(\d+)/);
    return match ? match[1] : null;
  }

  function extractTaskTitle() {
    const textarea = document.querySelector('textarea[aria-label="Task Name"]');
    return textarea ? textarea.value : null;
  }

  function generateBranchName(taskId, taskTitle) {
    if (!taskId) return null;

    const shortId = taskId.slice(-6);

    if (!taskTitle) {
      return `feature/${shortId}`;
    }

    const sanitized = taskTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const maxTitleLength = 32 - shortId.length - 1;
    const truncatedTitle = sanitized.slice(0, maxTitleLength);

    return `feature/${shortId}-${truncatedTitle}`;
  }

  function createButton() {
    const button = document.createElement('button');
    button.className = 'asana-git-branch-btn';
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Generate Git branch name');
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1 0 5v1a2.5 2.5 0 0 1 0 5v1a2.5 2.5 0 0 1-5 0v-1a2.5 2.5 0 0 1 0-5v-1a2.5 2.5 0 0 1 0-5v-1A2.5 2.5 0 0 1 8 1Zm2.5 8.5v-1H5.5v1h5ZM8 2a1.5 1.5 0 0 0-1.5 1.5v1H9.5v-1A1.5 1.5 0 0 0 8 2ZM5.5 9.5v1H9.5v-1H5.5Zm0 4v1a1.5 1.5 0 0 0 3 0v-1H5.5Z"/>
      </svg>
    `;
    button.addEventListener('click', toggleDropdown);
    return button;
  }

  function createDropdown(branchName) {
    const dropdown = document.createElement('div');
    dropdown.className = 'asana-git-branch-dropdown';
    dropdown.innerHTML = `
      <div class="dropdown-header">Link Task to Branch</div>
      <div class="dropdown-content">
        <div class="field-group">
          <label>A valid branch name for this task:</label>
          <div class="input-wrapper">
            <input type="text" readonly value="${branchName}" class="branch-input">
            <button class="copy-btn" data-type="branch-name">📋</button>
          </div>
        </div>
        <div class="field-group">
          <label>Create & checkout a new branch for this task:</label>
          <div class="input-wrapper">
            <input type="text" readonly value="git checkout -b ${branchName}" class="branch-input">
            <button class="copy-btn" data-type="git-command">📋</button>
          </div>
        </div>
      </div>
    `;

    dropdown.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const input = btn.previousElementSibling;
        copyToClipboard(input.value, btn);
        e.stopPropagation();
      });
    });

    return dropdown;
  }

  function copyToClipboard(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCopiedFeedback(button);
      }).catch(err => {
        console.error('Failed to copy:', err);
        fallbackCopy(text, button);
      });
    } else {
      fallbackCopy(text, button);
    }
  }

  function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopiedFeedback(button);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    document.body.removeChild(textarea);
  }

  function showCopiedFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓';
    button.classList.add('copied');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 1500);
  }

  function toggleDropdown() {
    if (dropdown && dropdown.parentNode) {
      dropdown.parentNode.removeChild(dropdown);
      dropdown = null;
    } else {
      const taskId = extractTaskId();
      const taskTitle = extractTaskTitle();
      const branchName = generateBranchName(taskId, taskTitle);

      if (branchName) {
        dropdown = createDropdown(branchName);
        document.body.appendChild(dropdown);

        const buttonRect = branchButton.getBoundingClientRect();
        dropdown.style.top = `${buttonRect.bottom + 5}px`;
        dropdown.style.left = `${buttonRect.left}px`;

        setTimeout(() => {
          document.addEventListener('click', handleOutsideClick);
        }, 0);
      }
    }
  }

  function handleOutsideClick(e) {
    if (dropdown && !dropdown.contains(e.target) && e.target !== branchButton) {
      if (dropdown.parentNode) {
        dropdown.parentNode.removeChild(dropdown);
      }
      dropdown = null;
      document.removeEventListener('click', handleOutsideClick);
    }
  }

  function findToolbar() {
    const selectors = [
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

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Skip the text editor toolbar (it has [role="toolbar"] but 0 buttons)
        if (selector === '[role="toolbar"]') {
          const buttons = element.querySelectorAll('button');
          if (buttons.length === 0) {
            console.log('[Asana Git] Skipping text editor toolbar (no buttons)');
            continue;
          }
        }
        console.log('[Asana Git] Found toolbar:', selector, element);
        return element;
      }
    }

    console.log('[Asana Git] No toolbar found with selectors, searching for containers with buttons...');

    // Fallback: Find elements with multiple buttons that look like action bars
    const potentialToolbars = document.querySelectorAll('div, section, nav, header');
    for (const el of potentialToolbars) {
      const buttons = el.querySelectorAll('button');
      if (buttons.length >= 2 && buttons.length <= 10) {
        const className = el.className || '';
        const id = el.id || '';
        const dataTestId = el.getAttribute('data-test-id') || '';

        // Look for action-related classes/IDs
        const isActionRelated =
          className.toLowerCase().includes('action') ||
          className.toLowerCase().includes('toolbar') ||
          id.toLowerCase().includes('action') ||
          dataTestId.toLowerCase().includes('action') ||
          dataTestId.toLowerCase().includes('top');

        if (isActionRelated && !className.includes('TextEditor')) {
          console.log('[Asana Git] Found potential action bar:', className, id, dataTestId, buttons.length, 'buttons');
          return el;
        }
      }
    }

    console.log('[Asana Git] No toolbar found');
    return null;
  }

  function findInjectionPoint() {
    const toolbar = findToolbar();
    if (toolbar) {
      const buttons = toolbar.querySelectorAll('button');
      console.log('[Asana Git] Toolbar has', buttons.length, 'buttons');
      if (buttons.length > 0) {
        return { element: toolbar, method: 'toolbar' };
      }
    }

    const taskNameTextarea = document.querySelector('textarea[aria-label="Task Name"]');
    if (taskNameTextarea) {
      const parent = taskNameTextarea.closest('.TaskPanePane-content, .TaskPane-content, .task-pane-content, .TaskPane');
      if (parent) {
        console.log('[Asana Git] Found task name parent, will inject there');
        return { element: parent, method: 'near-title' };
      }
    }

    console.log('[Asana Git] Could not find injection point');
    return null;
  }

  function injectButton() {
    if (branchButton && branchButton.parentNode) {
      console.log('[Asana Git] Button already injected');
      return true;
    }

    // Find the Close details button specifically
    const closeButton = document.querySelector('div[role="button"][aria-label="Close details"]');

    if (closeButton) {
      const parent = closeButton.parentElement;
      if (parent) {
        branchButton = createButton();
        parent.insertBefore(branchButton, closeButton);
        console.log('[Asana Git] Button injected before Close details button');
        return true;
      }
    }

    console.log('[Asana Git] Close details button not found, trying fallback');
    const injectionPoint = findInjectionPoint();
    if (!injectionPoint) {
      console.log('[Asana Git] No injection point found');
      return false;
    }

    branchButton = createButton();

    if (injectionPoint.method === 'toolbar') {
      const buttons = injectionPoint.element.querySelectorAll('button, div[role="button"]');
      if (buttons.length > 1) {
        injectionPoint.element.insertBefore(branchButton, buttons[buttons.length - 1]);
        console.log('[Asana Git] Button injected into toolbar as second-to-last');
      } else {
        injectionPoint.element.appendChild(branchButton);
        console.log('[Asana Git] Button injected into toolbar (append)');
      }
    } else if (injectionPoint.method === 'near-title') {
      const container = document.createElement('div');
      container.className = 'asana-git-button-container';
      container.style.cssText = 'display: flex; gap: 8px; margin-top: 12px;';
      container.appendChild(branchButton);
      injectionPoint.element.appendChild(container);
      console.log('[Asana Git] Button injected near task title');
    }

    return true;
  }

  function init() {
    const isTaskPage = window.location.pathname.match(/\/task\/\d+/);
    console.log('[Asana Git] Init called, is task page:', !!isTaskPage);

    if (!isTaskPage) {
      return;
    }

    console.log('[Asana Git] Starting injection process');

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          console.log('[Asana Git] DOM loaded, trying injection');
          tryInject();
        }, 1000);
      });
    } else {
      console.log('[Asana Git] DOM ready, trying injection now');
      tryInject();
    }
  }

  function tryInject() {
    if (injectButton()) {
      console.log('[Asana Git] Button successfully injected');
      return;
    }

    console.log('[Asana Git] Initial injection failed, setting up MutationObserver');
    const observer = new MutationObserver((mutations) => {
      if (injectButton()) {
        console.log('[Asana Git] Button injected via MutationObserver');
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      if (injectButton()) {
        console.log('[Asana Git] Button injected via delayed retry');
        observer.disconnect();
      } else {
        console.log('[Asana Git] Injection failed after timeout');
        observer.disconnect();
      }
    }, 10000);
  }

  const originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    setTimeout(init, 500);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    setTimeout(init, 500);
  };

  window.addEventListener('popstate', () => {
    setTimeout(init, 500);
  });

  init();
})();
