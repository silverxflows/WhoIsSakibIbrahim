/* ========================================
   Who Is Sakib Ibrahim?
   Shared JavaScript Functions
   ======================================== */

/* ========================================
   Main Menu Keyboard Navigation
   ======================================== */

/**
 * Initializes keyboard navigation for the Main Menu.
 * The Up and Down arrow keys move between menu options.
 * The Enter key opens the currently selected option.
 */
function initializeMainMenuKeyboardNavigation() {
  const menuOptions = document.querySelectorAll(".menu-option");

  // Stop this function on pages without the Main Menu.
  if (menuOptions.length === 0) {
    return;
  }

  let selectedIndex = 0;

  /**
   * Changes the currently selected Main Menu option.
   *
   * @param {number} newIndex - Index of the new menu option.
   */
  function updateSelectedMenuOption(newIndex) {
    menuOptions[selectedIndex].classList.remove("selected");

    selectedIndex = newIndex;

    menuOptions[selectedIndex].classList.add("selected");
    menuOptions[selectedIndex].focus();
  }

  /**
   * Handles keyboard controls for the Main Menu.
   *
   * @param {KeyboardEvent} event - Keyboard event triggered by the user.
   */
  function handleMainMenuKeydown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      const nextIndex = (selectedIndex + 1) % menuOptions.length;
      updateSelectedMenuOption(nextIndex);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      const previousIndex =
        (selectedIndex - 1 + menuOptions.length) % menuOptions.length;

      updateSelectedMenuOption(previousIndex);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      menuOptions[selectedIndex].click();
    }
  }

  // Keep keyboard, focus, and mouse selection synchronized.
  menuOptions.forEach((menuOption, index) => {
    menuOption.addEventListener("focus", () => {
      menuOptions[selectedIndex].classList.remove("selected");

      selectedIndex = index;

      menuOption.classList.add("selected");
    });

    menuOption.addEventListener("mouseenter", () => {
      menuOptions[selectedIndex].classList.remove("selected");

      selectedIndex = index;

      menuOption.classList.add("selected");
    });
  });

  document.addEventListener("keydown", handleMainMenuKeydown);
}

/* ========================================
   Inventory Helper Functions
   ======================================== */

/**
 * Converts pipe-separated text into an array of specifications.
 *
 * @param {string} specificationText - Text separated by | symbols.
 * @returns {string[]} An array containing individual specifications.
 */
function getSpecificationArray(specificationText) {
  if (!specificationText) {
    return [];
  }

  return specificationText
    .split("|")
    .map((specification) => specification.trim())
    .filter((specification) => specification !== "");
}

/**
 * Converts a specification array into an HTML bullet list.
 *
 * @param {string[]} specifications - Array of specification strings.
 * @returns {string} An HTML unordered list.
 */
function createSpecificationList(specifications) {
  if (specifications.length === 0) {
    return "<p>No additional specifications are available.</p>";
  }

  const listItems = specifications
    .map((specification) => `<li>${specification}</li>`)
    .join("");

  return `<ul class="detail-spec-list">${listItems}</ul>`;
}

/**
 * Creates the correct upgrade display.
 * A single upgrade appears as plain text.
 * Multiple upgrades appear as a bullet list.
 *
 * @param {string} upgradeText - Upgrade information separated by | symbols.
 * @returns {string} Formatted HTML for the upgrade section.
 */
function createUpgradeDisplay(upgradeText) {
  const upgrades = getSpecificationArray(upgradeText);

  if (upgrades.length === 0) {
    return "";
  }

  if (upgrades.length === 1) {
    return `<p class="simple-upgrade-name">${upgrades[0]}</p>`;
  }

  return createSpecificationList(upgrades);
}

/* ========================================
   Interactive Inventory
   ======================================== */

/**
 * Initializes the interactive inventory detail panel.
 * Clicking an inventory row displays its specifications.
 */
function initializeInventoryDetails() {
  const inventoryItems = document.querySelectorAll(".inventory-item");
  const detailTitle = document.querySelector("#inventory-detail-title");
  const detailContent = document.querySelector("#inventory-detail-content");

  // Stop this function on pages without the inventory feature.
  if (
    inventoryItems.length === 0 ||
    detailTitle === null ||
    detailContent === null
  ) {
    return;
  }

  /**
   * Returns the icon assigned to an inventory item.
   *
   * @param {HTMLElement} item - Selected inventory row.
   * @returns {string} Equipment icon.
   */
  function getInventoryIcon(item) {
    return item.dataset.icon || "◆";
  }

  /**
   * Removes the selected style from every inventory row.
   */
  function clearSelectedInventoryItems() {
    inventoryItems.forEach((inventoryItem) => {
      inventoryItem.classList.remove("selected-item");
    });
  }

  /**
   * Displays the selected inventory item's information.
   *
   * @param {HTMLElement} item - Inventory row selected by the user.
   */
  function displayInventoryDetails(item) {
    const itemName = item.dataset.name || "Inventory Item";
    const currentSpecs = getSpecificationArray(item.dataset.currentSpecs);
    const upgradeSpecs = item.dataset.upgradeSpecs;
    const status = item.dataset.status;
    const statusType = item.dataset.statusType || "";
    const icon = getInventoryIcon(item);

    detailTitle.textContent = `${icon} ${itemName}`;

    let detailHTML = `
      <div class="detail-section">
        <h3>⚙ Current Equipment</h3>
        ${createSpecificationList(currentSpecs)}
      </div>
    `;

    // Add the upgrade section only when an upgrade is available.
    if (upgradeSpecs) {
      detailHTML += `
        <div class="detail-section">
          <h3>⬆ Next Upgrade</h3>
          ${createUpgradeDisplay(upgradeSpecs)}
        </div>
      `;
    }

    // Add the status section when the item includes a status.
    if (status) {
      detailHTML += `
        <div class="detail-section">
          <h3>★ Status</h3>
          <p class="detail-status ${statusType}">${status}</p>
        </div>
      `;
    }

    detailContent.innerHTML = detailHTML;

    clearSelectedInventoryItems();
    item.classList.add("selected-item");
  }

  // Add mouse and keyboard events to every inventory item.
  inventoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      displayInventoryDetails(item);
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        displayInventoryDetails(item);
      }
    });
  });
}

/* ========================================
   jQuery Side Quest Details
   ======================================== */

/**
 * Initializes the jQuery show-and-hide controls
 * on the Side Quests page.
 */
function initializeQuestDetailToggles() {
  // Stop this function if jQuery did not load.
  if (typeof window.jQuery === "undefined") {
    return;
  }

  const questButtons = $(".quest-toggle-button");

  // Stop this function on pages without quest toggle buttons.
  if (questButtons.length === 0) {
    return;
  }

  questButtons.on("click", function () {
    const selectedButton = $(this);
    const targetSelector = selectedButton.data("target");
    const detailPanel = $(targetSelector);
    const isExpanded = selectedButton.attr("aria-expanded") === "true";
    const isFutureButton = selectedButton.hasClass("future-toggle-button");

    // Stop if the button does not point to a valid detail panel.
    if (detailPanel.length === 0) {
      return;
    }

    // Show or hide the related quest details with a jQuery animation.
    detailPanel.stop(true, true).slideToggle(300);

    // Update the button state for accessibility.
    selectedButton.attr("aria-expanded", String(!isExpanded));

    // Update the button text to match the panel state.
    if (isExpanded) {
      selectedButton.text(
        isFutureButton
          ? "Show Future Quest Details"
          : "Show Completed Quest Details",
      );
    } else {
      selectedButton.text(
        isFutureButton
          ? "Hide Future Quest Details"
          : "Hide Completed Quest Details",
      );
    }
  });
}

/* ========================================
   Title Screen Loading Sequence
   ======================================== */

/**
 * Initializes the title-screen loading sequence.
 * Pressing Start reveals a progress bar and redirects
 * the visitor to the Main Menu after loading completes.
 */
function initializeTitleScreenLoading() {
  const pressStartButton = document.querySelector("#press-start-button");
  const titleScreenContent = document.querySelector("#title-screen-content");
  const loadingScreen = document.querySelector("#loading-screen");
  const loadingBar = document.querySelector("#loading-bar");
  const loadingPercent = document.querySelector("#loading-percent");
  const loadingStatus = document.querySelector("#loading-status");

  // Stop this function on pages without the title-screen feature.
  if (
    pressStartButton === null ||
    titleScreenContent === null ||
    loadingScreen === null ||
    loadingBar === null ||
    loadingPercent === null ||
    loadingStatus === null
  ) {
    return;
  }

  const loadingMessages = [
    { percent: 0, message: "Initializing Portfolio..." },
    { percent: 15, message: "Loading Character Profile..." },
    { percent: 35, message: "Loading Inventory..." },
    { percent: 55, message: "Loading Side Quests..." },
    { percent: 75, message: "Restoring Save Data..." },
    { percent: 90, message: "Preparing Journey..." },
    {
      percent: 100,
      message: "Mission Ready<br><br>Launching Portfolio...",
    },
  ];

  /**
   * Returns the correct status message for the current percentage.
   *
   * @param {number} currentPercent - Current loading percentage.
   * @returns {string} Matching loading message.
   */
  function getLoadingMessage(currentPercent) {
    let currentMessage = loadingMessages[0].message;

    loadingMessages.forEach((loadingStep) => {
      if (currentPercent >= loadingStep.percent) {
        currentMessage = loadingStep.message;
      }
    });

    return currentMessage;
  }

  /**
   * Starts the loading animation and redirects to the Main Menu.
   */
  function startLoadingSequence() {
    pressStartButton.disabled = true;
    titleScreenContent.classList.add("hidden");
    loadingScreen.classList.remove("hidden");

    let currentPercent = 0;

    loadingBar.style.width = "0%";
    loadingPercent.textContent = "0%";
    loadingStatus.textContent = getLoadingMessage(0);

    const progressBar = loadingScreen.querySelector('[role="progressbar"]');

    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", "0");
    }

    const loadingInterval = window.setInterval(() => {
      currentPercent += 1;

      loadingBar.style.width = `${currentPercent}%`;
      loadingPercent.textContent = `${currentPercent}%`;
      loadingStatus.innerHTML = getLoadingMessage(currentPercent);

      if (progressBar) {
        progressBar.setAttribute("aria-valuenow", String(currentPercent));
      }

      if (currentPercent >= 100) {
        window.clearInterval(loadingInterval);

        loadingScreen.classList.add("complete");

        window.setTimeout(() => {
          window.location.href = "home.html";
        }, 650);
      }
    }, 28);
  }

  pressStartButton.addEventListener("click", startLoadingSequence);
}

/* ========================================
   Interactive Passion Flip Cards
   ======================================== */

/**
 * Initializes the interactive Passion cards.
 * Each card can be independently flipped with
 * a mouse click, Enter key, or Space key.
 */
function initializePassionCards() {
  const passionCards = document.querySelectorAll(".passion-card");

  // Stop this function on pages without passion cards.
  if (passionCards.length === 0) {
    return;
  }

  /**
   * Flips a selected passion card and updates
   * its accessibility state.
   *
   * @param {HTMLElement} card - Passion card being toggled.
   */
  function togglePassionCard(card) {
    const isFlipped = card.classList.toggle("is-flipped");

    card.setAttribute("aria-pressed", String(isFlipped));
  }

  passionCards.forEach((card) => {
    // Flip the card when clicked.
    card.addEventListener("click", () => {
      togglePassionCard(card);
    });

    // Flip the card when Enter or Space is pressed.
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        togglePassionCard(card);
      }
    });
  });
}

/* ========================================
   Passion Video Performance
   ======================================== */

/**
 * Plays Passion-card videos only when they are
 * visible within the browser viewport.
 *
 * Videos outside the viewport are automatically
 * paused to reduce bandwidth and processing usage.
 */
function initializePassionVideos() {
  const passionVideos = document.querySelectorAll(".passion-media video");

  // Stop this function on pages without Passion videos.
  if (passionVideos.length === 0) {
    return;
  }

  // Fallback for older browsers without IntersectionObserver support.
  if (!("IntersectionObserver" in window)) {
    passionVideos.forEach((video) => {
      video.play().catch(() => {
        // Some browsers may still block autoplay.
      });
    });

    return;
  }

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Muted autoplay may still be restricted by some browsers.
          });
        } else {
          video.pause();
        }
      });
    },
    {
      root: null,
      rootMargin: "100px 0px",
      threshold: 0.25,
    },
  );

  passionVideos.forEach((video) => {
    videoObserver.observe(video);
  });
}

/* ========================================
   Website Initialization
   ======================================== */

/**
 * Starts all shared website features after the page loads.
 * Each feature safely exits on pages where it is not needed.
 */
function initializeWebsite() {
  initializeMainMenuKeyboardNavigation();
  initializeInventoryDetails();
  initializeQuestDetailToggles();
  initializeTitleScreenLoading();
  initializePassionCards();
  initializePassionVideos();
}

/* Wait until the HTML document is ready before starting website features. */
document.addEventListener("DOMContentLoaded", initializeWebsite);