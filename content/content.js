(function() {
  'use strict';

  let branchButton = null;
  let dropdown = null;
  let currentTaskId = null;
  let observer = null;
  let urlCheckInterval = null;

  function extractTaskId() {
    const match = window.location.pathname.match(/task\/(\d+)/);
    if (match) return match[1];
    
    const homeMatch = window.location.pathname.match(/\/home\/\d+\/(\d+)/);
    if (homeMatch) return homeMatch[1];
    
    return null;
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
    button.className = 'TaskPaneToolbar-button asana-git-branch-btn';
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Generate Git branch name');
    button.style.width = '28px';
    button.style.height = '28px';
    button.style.padding = '0';
    button.style.border = '1px solid transparent';
    button.style.borderRadius = '6px';
    button.style.backgroundColor = 'transparent';
    button.style.color = '#DE4C36';
    button.style.cursor = 'pointer';
    button.style.display = 'inline-flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.marginLeft = '8px';
    button.style.zIndex = '999999';
    button.style.position = 'relative';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M251.172245,116.593517 L139.398753,4.82845302 C132.966433,-1.60948434 122.525852,-1.60948434 116.085106,4.82845302 L92.8753863,28.0381721 L122.317995,57.4807809 C129.16041,55.1690784 137.005593,56.7195763 142.460425,62.1744081 C147.940536,67.6629464 149.479799,75.5755422 147.111919,82.4404282 L175.487156,110.815665 C182.352042,108.450594 190.273064,109.98143 195.755985,115.472777 C203.418591,123.132574 203.418591,135.547794 195.755985,143.213209 C188.09057,150.878624 175.67535,150.878624 168.007126,143.213209 C162.243319,137.443783 160.81922,128.977839 163.737639,121.877008 L137.275245,95.4146135 L137.272436,165.052198 C139.140337,165.979126 140.904309,167.212221 142.460425,168.762719 C150.123031,176.422516 150.123031,188.837736 142.460425,196.508768 C134.79501,204.171375 122.374173,204.171375 114.719993,196.508768 C107.057387,188.837736 107.057387,176.422516 114.719993,168.762719 C116.613174,166.872347 118.804095,165.442631 121.141077,164.481996 L121.141077,94.1955625 C118.804095,93.2405457 116.615983,91.8192558 114.719993,89.9148396 C108.914052,84.1173254 107.518042,75.5980132 110.492639,68.4690928 L81.4713611,39.4421974 L4.83125614,116.076685 C-1.60949009,122.52024 -1.60949009,132.960821 4.83125614,139.398759 L116.604747,251.166631 C123.039876,257.604569 133.477648,257.604569 139.921203,251.166631 L251.172245,139.9184 C257.61018,133.477654 257.61018,123.031455 251.172245,116.593517" fill="#DE4C36"></path>
      </svg>
    `;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    }, true);
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

  function findTaskPaneToolbar() {
    return document.querySelector('.TaskPaneToolbar');
  }

  function closeDropdownIfExists() {
    if (dropdown && dropdown.parentNode) {
      dropdown.parentNode.removeChild(dropdown);
      dropdown = null;
      document.removeEventListener('click', handleOutsideClick);
    }
  }

  function injectButton() {
    const taskPane = document.querySelector('.TaskPane:not(.asana-git-branch-injected)');
    
    if (!taskPane) {
      return false;
    }

    closeDropdownIfExists();

    taskPane.classList.add('asana-git-branch-injected');

    const moreActionsButton = findMoreActionsButton();

    if (!moreActionsButton) {
      taskPane.classList.remove('asana-git-branch-injected');
      return false;
    }

    const button = createButton();
    const parent = moreActionsButton.parentNode;

    if (parent) {
      parent.insertBefore(button, moreActionsButton.nextSibling);
      branchButton = button;
      return true;
    }

    taskPane.classList.remove('asana-git-branch-injected');
    return false;
  }

  function init() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
      injectButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const intervals = [100, 500, 1000, 2000];
    intervals.forEach(delay => {
      setTimeout(() => {
        injectButton();
      }, delay);
    });
  }

  init();

  function checkTaskChange() {
    const newTaskId = extractTaskId();
    if (newTaskId !== currentTaskId) {
      currentTaskId = newTaskId;
      closeDropdownIfExists();
      injectButton();
    }
  }

  urlCheckInterval = setInterval(checkTaskChange, 100);

  window.addEventListener('popstate', () => {
    checkTaskChange();
  });

  const pushStateOriginal = history.pushState;
  history.pushState = function() {
    pushStateOriginal.apply(this, arguments);
    checkTaskChange();
  };
})();
