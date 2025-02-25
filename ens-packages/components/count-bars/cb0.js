(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // In a Node/CommonJS environment or bundler that supports modules.
    module.exports = factory();
  } else {
    // Otherwise, attach functions to the global object.
    const exports = factory();
    // Attach your component initializer to a global name (for example, ENSComponent)
    global.ENSComponent = exports.createCountBar;
    global.getSavedStyles = exports.getSavedStyles;
  }
})(typeof window !== "undefined" ? window : this, function () {

  // --- Component Code (CB0.js) ---
  
  /**
   * Initializes and renders the Count Bar component.
   * @param {Object} options - The options for the component.
   * @param {HTMLElement} options.rootDiv - The container element.
   * @param {Object} options.styles - A nested style object.
   */
  async function createCountBar(options) {
    const { rootDiv, styles = {} } = options;
    
    // Fetch count data.
    let currentCount = "", dayCount = "", yearCount = "";
    try {
      const response = await fetch(`https://matrix.911-ens-services.com/count/${clientID}`);
      const countData = await response.json();
      currentCount = countData.activeCount;
      dayCount = countData.currentDateCount;
      yearCount = countData.totalCount;
    } catch (error) {
      console.error("Error fetching counts:", error.message);
    }
    
    // Clear previous content.
    rootDiv.innerHTML = "";
    
    // Create the main container.
    const container = document.createElement("div");
    container.id = "countBlock";
    container.style.width = "100%";
    container.style.display = "flex";
    container.style.justifyContent = "space-around";
    container.style.alignItems = "center";
    container.style.padding = styles.container?.padding ? styles.container.padding + "px" : "10px";
    container.style.backgroundColor = styles.container?.backgroundColor || "#222";
    rootDiv.appendChild(container);
    
    // Create an inner wrapper.
    const countWrap = document.createElement("div");
    countWrap.style.display = "flex";
    countWrap.style.justifyContent = "space-around";
    countWrap.style.width = "100%";
    container.appendChild(countWrap);
    
    // Helper to create a section.
    function createSection(id, text, sectionStyle, defaultBg) {
      const section = document.createElement("div");
      section.id = id;
      section.style.flex = "none"; // allow custom width.
      section.style.margin = sectionStyle?.margin ? sectionStyle.margin + "px" : "5px";
      section.style.padding = sectionStyle?.padding ? sectionStyle.padding + "px" : "10px";
      section.style.borderRadius = sectionStyle?.borderRadius ? sectionStyle.borderRadius + "px" : "5px";
      section.style.border = sectionStyle?.borderThickness
        ? sectionStyle.borderThickness + "px solid " + (sectionStyle.borderColor || "#ccc")
        : "1px solid #ccc";
      section.style.backgroundColor = sectionStyle?.backgroundColor || defaultBg;
      section.style.width = sectionStyle?.width ? sectionStyle.width + "%" : "100%";
    
      const textElem = document.createElement("h3");
      textElem.innerText = text;
      textElem.style.fontSize = sectionStyle?.fontSize ? sectionStyle.fontSize + "px" : "16px";
      textElem.style.color = sectionStyle?.textColor || "#000";
      section.appendChild(textElem);
      return section;
    }
    
    // Create independent blocks.
    countWrap.appendChild(
      createSection("currentCount", `CURRENT INCIDENTS: ${currentCount}`, styles.currentBlock, "#ffcccc")
    );
    countWrap.appendChild(
      createSection("dailyCount", `DAILY TOTAL INCIDENTS: ${dayCount}`, styles.dailyBlock, "#ccffcc")
    );
    countWrap.appendChild(
      createSection("yearlyCount", `YEARLY INCIDENTS: ${yearCount}`, styles.yearlyBlock, "#ccccff")
    );
    
    // Optional clock.
    if (styles.clock?.show) {
      const clockSection = document.createElement("div");
      clockSection.id = "liveClock";
      clockSection.style.flex = "none";
      clockSection.style.margin = styles.clock.margin ? styles.clock.margin + "px" : "5px";
      clockSection.style.padding = styles.clock.padding ? styles.clock.padding + "px" : "10px";
      clockSection.style.borderRadius = styles.clock.borderRadius ? styles.clock.borderRadius + "px" : "5px";
      clockSection.style.border = styles.clock.borderThickness
        ? styles.clock.borderThickness + "px solid " + (styles.clock.borderColor || "#ccc")
        : "1px solid #ccc";
      clockSection.style.backgroundColor = styles.clock.backgroundColor || "#ddd";
      clockSection.style.width = styles.clock.width ? styles.clock.width + "%" : "100%";
    
      const clockText = document.createElement("h3");
      clockText.style.fontSize = styles.clock.fontSize ? styles.clock.fontSize + "px" : "16px";
      clockText.style.color = styles.clock.textColor || "#000";
      clockSection.appendChild(clockText);
      countWrap.appendChild(clockSection);
    
      function updateClock() {
        const now = new Date();
        const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: (styles.clock.hourFormat !== "24") };
        clockText.innerText = now.toLocaleTimeString([], options);
      }
      updateClock();
      setInterval(updateClock, 1000);
    }
    getSavedStyles(clientKey);
  }

  const clientKey = window.clientID
  
  /**
   * Retrieves the saved style settings for a given client.
   * @param {string} clientKey - The unique client key.
   * @returns {Promise<Object|null>} The saved style settings or null.
   */
  async function getSavedStyles(clientKey) {
    try {
      const response = await fetch(`https://matrix.911-ens-services.com/client/${clientKey}/countbar_styles`);
      if (!response.ok) {
        console.error("Failed to load saved styles:", response.statusText);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Error retrieving saved styles:", error);
      return null;
    }
  }
  
  // Return the public API.
  return { createCountBar, getSavedStyles };
});
