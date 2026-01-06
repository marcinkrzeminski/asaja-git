(function() {
  'use strict';

  let branchButton = null;
  let dropdown = null;
  let currentTaskId = null;

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

    const maxTitleLength = 24;

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
        <path d="M251.172 116.594L139.4 4.828c-6.433-6.437-16.873-6.437-23.314 0l-23.21 23.21 29.443 29.443c6.842-2.312 14.688-.761 20.142 4.693 5.48 5.489 7.02 13.402 4.652 20.266l28.375 28.376c6.865-2.365 14.786-.835 20.269 4.657 7.663 7.663 20.075 0 27.74-7.665 7.666-20.08 7.663 20.076 0 0 0 1.5 188 3.71c7.663 7.663 20.076 0 0 1.5 19.282 298l7.15 6a1.498 1.499 0 1 1.414 1.415l-3.658 3.659a.999.999 0 1 1.408 1.415l-3.658 3.659c3.51-3.51-9.22 0 12.73l-1.552 10.032a1.997 1.997 0 0 1.24.94 26H10V1c0.0.6 0.4 1.1s-0.4,1.0 1.4-1 24v12c0.0.6 0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1s1,0 4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1.4,1 1.4,8,3,3,3,3.6.8,8 8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.4,1.1 4,8,3,3,3,3.6,8.8,8,8,8s1,0 4,4,4,0h12v1c0,0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1 1.4,8,3,3,3,3.6,8.8,8,8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.4,1.1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.1 4,8,3,3,3,3.6,8.8,8,8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.4,1 1 4,8,3,3,3,3,6,8.8,8,8 8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1 1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.4,1 1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.4,1.1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0h12v1c0,0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1 1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0h12v1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1v4c0,0.6,0.4 1.0 1.4,1 4,1.1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0h12V1c0.0.6,0.4 1.1s-0.4,1.0 1.4-1V4c0,0.6,0.4 1.0 1.1,1.4,1,4,1 1 4,1.1 4,8,3,3,3,3,6,8.8,8,8,8s1,0 4,4,4,0Z"></path>
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

  function findMoreActionsButton() {
    return document.querySelector('.TaskPaneExtraActionsButton');
  }

  function injectButton() {
    if (branchButton && branchButton.parentNode) {
      return;
    }

    const moreActionsButton = findMoreActionsButton();

    if (!moreActionsButton) {
      console.log('[Asana Git] More Actions button not found');
      return false;
    }

    const button = createButton();
    const parent = moreActionsButton.parentNode;

    if (parent) {
      parent.insertBefore(button, moreActionsButton.nextSibling);
      branchButton = button;
      console.log('[Asana Git] Button injected successfully');
      return true;
    }

    return false;
  }

  function init() {
    const isTaskPage = window.location.pathname.includes('/task/');
    console.log('[Asana Git] Init called, isTaskPage:', isTaskPage);

    if (!isTaskPage) {
      return;
    }

    if (branchButton && branchButton.parentNode) {
      return;
    }

    setTimeout(() => {
      if (injectButton()) {
        console.log('[Asana Git] Button injected on page load');
      }
    }, 500);
  }

  init();
})();
