(function() {
  'use strict';

  let branchButton = null;
  let dropdown = null;
  let currentTaskId = null;
  let lastUrl = window.location.href;

  function extractTaskId() {
    const match = window.location.pathname.match(/task\/(\d+)/);
    return match ? match[1] : null;
  }

  function cleanup() {
    if (dropdown && dropdown.parentNode) {
      dropdown.parentNode.removeChild(dropdown);
      dropdown = null;
    }

    if (branchButton && branchButton.parentNode) {
      branchButton.parentNode.removeChild(branchButton);
      branchButton = null;
    }
  }

  function checkUrlChange() {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      init();
    }
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

    if (sanitized.length <= maxTitleLength) {
      return `feature/${shortId}-${sanitized}`;
    }

    const truncatedTitle = sanitized.slice(0, maxTitleLength);

    const lastHyphenIndex = truncatedTitle.lastIndexOf('-');
    if (lastHyphenIndex > 0) {
      return `feature/${shortId}-${truncatedTitle.slice(0, lastHyphenIndex)}`;
    }

    return `feature/${shortId}-${truncatedTitle}`;
  }

  function createButton() {
    const button = document.createElement('button');
    button.className = 'asana-git-branch-btn';
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Generate Git branch name');
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
        <path d="M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.835 20.269 4.657 7.663 7.66 7.663 20.075 0 27.74-7.665 7.666-20.08 7.666-27.749 0-5.764-5.77-7.188-14.235-4.27-21.336l-26.462-26.462-.003 69.637a19.82 19.82 0 0 1 5.188 3.71c7.663 7.66 7.663 20.076 0 27.747-7.665 7.662-20.086 7.662-27.74 0-7.663-7.671-7.663-20.086 0-27.746a19.654 19.654 0 0 1 6.421-4.281V94.196a19.378 19.378 0 0 1-6.421-4.281c-5.806-5.798-7.202-14.317-4.227-21.446L81.47 39.442l-76.64 76.635c-6.44 6.443-6.44 16.884 0 23.322l111.774 111.768c6.435 6.438 16.873 6.438 23.316 0l111.251-111.249c6.438-6.44 6.438-16.887 0-23.324" fill="#DE4C36"/>
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
      document.removeEventListener('click', handleOutsideClick);
    } else {
      const taskId = extractTaskId();
      const taskTitle = extractTaskTitle();
      const branchName = generateBranchName(taskId, taskTitle);

      if (branchName) {
        dropdown = createDropdown(branchName);
        document.body.appendChild(dropdown);

        const buttonRect = branchButton.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const dropdownHeight = dropdown.offsetHeight;
        const dropdownWidth = dropdown.offsetWidth;

        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        let top, left;

        if (spaceBelow >= dropdownHeight + 10) {
          top = buttonRect.bottom + 5;
        } else if (spaceAbove >= dropdownHeight + 10) {
          top = buttonRect.top - dropdownHeight - 5;
        } else {
          top = spaceBelow >= spaceAbove ? buttonRect.bottom + 5 : buttonRect.top - dropdownHeight - 5;
        }

        if (buttonRect.left + dropdownWidth > viewportWidth - 10) {
          left = buttonRect.right - dropdownWidth;
        } else if (buttonRect.left < 10) {
          left = 10;
        } else {
          left = buttonRect.left;
        }

        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;

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

    const potentialToolbars = document.querySelectorAll('div, section, nav, header');
    for (const el of potentialToolbars) {
      const buttons = el.querySelectorAll('button');
      if (buttons.length >= 2 && buttons.length <= 10) {
        const className = el.className || '';
        const id = el.id || '';
        const dataTestId = el.getAttribute('data-test-id') || '';

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
      return true;
    }

    const moreActionsButton = document.querySelector('div[role="button"][aria-label="More actions for this task"]');

    if (moreActionsButton) {
      const parent = moreActionsButton.parentElement;
      if (parent) {
        branchButton = createButton();
        parent.insertBefore(branchButton, moreActionsButton.nextSibling);
        return true;
      }
    }

    const injectionPoint = findInjectionPoint();
    if (!injectionPoint) {
      return false;
    }

    branchButton = createButton();

    if (injectionPoint.method === 'toolbar') {
      const buttons = injectionPoint.element.querySelectorAll('button, div[role="button"]');
      if (buttons.length > 1) {
        injectionPoint.element.insertBefore(branchButton, buttons[buttons.length - 1]);
      } else {
        injectionPoint.element.appendChild(branchButton);
      }
    } else if (injectionPoint.method === 'near-title') {
      const container = document.createElement('div');
      container.className = 'asana-git-button-container';
      container.style.cssText = 'display: flex; gap: 8px; margin-top: 12px;';
      container.appendChild(branchButton);
      injectionPoint.element.appendChild(container);
    }

    return true;
  }

  function init() {
    const isTaskPage = window.location.pathname.includes('/task/');
    console.log('[Asana Git] Init called, URL:', window.location.href);

    if (!isTaskPage) {
      if (currentTaskId) {
        console.log('[Asana Git] Left task page, cleaning up');
        cleanup();
        currentTaskId = null;
      }
      return;
    }

    const newTaskId = extractTaskId();
    console.log('[Asana Git] Current task ID:', currentTaskId, 'New task ID:', newTaskId);

    const buttonExists = branchButton && branchButton.parentNode;
    if (newTaskId && (newTaskId !== currentTaskId || !buttonExists)) {
      console.log('[Asana Git] Task changed or button missing, re-injecting');
      cleanup();
      currentTaskId = newTaskId;
      tryInject();
    } else if (buttonExists) {
      console.log('[Asana Git] Button already exists for current task');
    }
  }

  function tryInject() {
    let attempts = 0;
    const maxAttempts = 30;

    const attemptInjection = () => {
      attempts++;
      console.log(`[Asana Git] Injection attempt ${attempts}/${maxAttempts}`);

      if (injectButton()) {
        console.log('[Asana Git] Button successfully injected');
        return;
      }

      if (attempts >= maxAttempts) {
        console.log('[Asana Git] Failed to inject after max attempts');
        return;
      }

      setTimeout(attemptInjection, 500);
    };

    attemptInjection();
  }

  const originalPushState = history.pushState;
  history.pushState = function() {
    const result = originalPushState.apply(this, arguments);
    console.log('[Asana Git] pushState called');
    setTimeout(() => {
      checkUrlChange();
    }, 100);
    return result;
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function() {
    const result = originalReplaceState.apply(this, arguments);
    console.log('[Asana Git] replaceState called');
    setTimeout(() => {
      checkUrlChange();
    }, 100);
    return result;
  };

  window.addEventListener('popstate', () => {
    console.log('[Asana Git] popstate event');
    setTimeout(() => {
      checkUrlChange();
    }, 100);
  });

  setInterval(() => {
    checkUrlChange();
  }, 1000);

  init();
})();
