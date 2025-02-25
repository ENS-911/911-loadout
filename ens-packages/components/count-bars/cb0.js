/* File: countBarTools.js */

window.initializeEditTools = function(toolsContainer) {
    // --- Default Styles ---
    const defaultStyles = {
      container: {
        padding: "10",
        backgroundColor: "#222"
      },
      currentBlock: {
        fontSize: "16",
        textColor: "#000",
        backgroundColor: "#ffcccc",
        width: "100",
        borderThickness: "1",
        borderColor: "#ccc",
        borderRadius: "5",
        padding: "10",
        margin: "5"
      },
      dailyBlock: {
        fontSize: "16",
        textColor: "#000",
        backgroundColor: "#ccffcc",
        width: "100",
        borderThickness: "1",
        borderColor: "#ccc",
        borderRadius: "5",
        padding: "10",
        margin: "5"
      },
      yearlyBlock: {
        fontSize: "16",
        textColor: "#000",
        backgroundColor: "#ccccff",
        width: "100",
        borderThickness: "1",
        borderColor: "#ccc",
        borderRadius: "5",
        padding: "10",
        margin: "5"
      },
      clock: {
        show: false,
        hourFormat: "12",
        fontSize: "16",
        textColor: "#000",
        backgroundColor: "#ddd",
        borderThickness: "1",
        borderColor: "#ccc",
        borderRadius: "5",
        padding: "10",
        margin: "5",
        width: "100"
      }
    };
  
    // --- Global Settings Object ---
    window.countBarStyles = {
      container: Object.assign({}, defaultStyles.container),
      currentBlock: Object.assign({}, defaultStyles.currentBlock),
      dailyBlock: Object.assign({}, defaultStyles.dailyBlock),
      yearlyBlock: Object.assign({}, defaultStyles.yearlyBlock),
      clock: Object.assign({}, defaultStyles.clock)
    };
  
    // --- Helper: Create a Group of Controls ---
    // Each group has a title and then for each control a row with two columns:
    // one for the label (fixed width) and one for the input.
    function createGroup(groupTitle, targetObj, controls) {
      const groupContainer = document.createElement("div");
      groupContainer.className = "tool-group";
      groupContainer.style.marginBottom = "20px";
  
      // Group title.
      const titleElem = document.createElement("div");
      titleElem.textContent = groupTitle;
      titleElem.style.fontWeight = "bold";
      titleElem.style.marginBottom = "10px";
      groupContainer.appendChild(titleElem);
  
      // For each control, create a row with two columns.
      controls.forEach(control => {
        const row = document.createElement("div");
        row.className = "control-row";
        // Use CSS Grid for two columns: fixed label and flexible input.
        row.style.display = "grid";
        row.style.gridTemplateColumns = "150px 1fr"; // 150px for label, rest for input.
        row.style.columnGap = "10px";
        row.style.alignItems = "center";
        row.style.marginBottom = "8px";
  
        // Label column.
        const labelElem = document.createElement("label");
        labelElem.textContent = control.label;
        row.appendChild(labelElem);
  
        // Input column.
        let input;
        if (control.type === "select") {
          input = document.createElement("select");
          control.options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.label;
            input.appendChild(option);
          });
          input.value = targetObj[control.key];
        } else if (control.type === "checkbox") {
          input = document.createElement("input");
          input.type = "checkbox";
          input.checked = targetObj[control.key];
        } else {
          input = document.createElement("input");
          input.type = control.type; // "number" or "color"
          input.value = targetObj[control.key];
          if (control.type === "number") {
            input.style.width = "60px"; // Use built-in up/down arrows.
          }
        }
  
        // Use the "input" event for immediate update.
        input.addEventListener("input", function(e) {
          let value;
          if (e.target.type === "checkbox") {
            value = e.target.checked;
          } else {
            value = e.target.value;
          }
          targetObj[control.key] = value;
          updatePreview();
        });
  
        row.appendChild(input);
        groupContainer.appendChild(row);
      });
  
      return groupContainer;
    }
  
    // --- Create Groups for Each Settings Category ---
  
    // Container Settings.
    const containerGroup = createGroup("Container Settings", window.countBarStyles.container, [
      { key: "padding", type: "number", label: "Padding" },
      { key: "backgroundColor", type: "color", label: "Background Color" }
    ]);
    toolsContainer.appendChild(containerGroup);
  
    // Current Count Block Settings.
    const currentGroup = createGroup("Current Count Block Settings", window.countBarStyles.currentBlock, [
      { key: "fontSize", type: "number", label: "Font Size" },
      { key: "textColor", type: "color", label: "Text Color" },
      { key: "backgroundColor", type: "color", label: "Background Color" },
      { key: "width", type: "number", label: "Width (%)" },
      { key: "borderThickness", type: "number", label: "Border Thickness" },
      { key: "borderColor", type: "color", label: "Border Color" },
      { key: "borderRadius", type: "number", label: "Border Radius" },
      { key: "padding", type: "number", label: "Padding" },
      { key: "margin", type: "number", label: "Margin" }
    ]);
    toolsContainer.appendChild(currentGroup);
  
    // Daily Count Block Settings.
    const dailyGroup = createGroup("Daily Count Block Settings", window.countBarStyles.dailyBlock, [
      { key: "fontSize", type: "number", label: "Font Size" },
      { key: "textColor", type: "color", label: "Text Color" },
      { key: "backgroundColor", type: "color", label: "Background Color" },
      { key: "width", type: "number", label: "Width (%)" },
      { key: "borderThickness", type: "number", label: "Border Thickness" },
      { key: "borderColor", type: "color", label: "Border Color" },
      { key: "borderRadius", type: "number", label: "Border Radius" },
      { key: "padding", type: "number", label: "Padding" },
      { key: "margin", type: "number", label: "Margin" }
    ]);
    toolsContainer.appendChild(dailyGroup);
  
    // Yearly Count Block Settings.
    const yearlyGroup = createGroup("Yearly Count Block Settings", window.countBarStyles.yearlyBlock, [
      { key: "fontSize", type: "number", label: "Font Size" },
      { key: "textColor", type: "color", label: "Text Color" },
      { key: "backgroundColor", type: "color", label: "Background Color" },
      { key: "width", type: "number", label: "Width (%)" },
      { key: "borderThickness", type: "number", label: "Border Thickness" },
      { key: "borderColor", type: "color", label: "Border Color" },
      { key: "borderRadius", type: "number", label: "Border Radius" },
      { key: "padding", type: "number", label: "Padding" },
      { key: "margin", type: "number", label: "Margin" }
    ]);
    toolsContainer.appendChild(yearlyGroup);
  
    // Clock Settings.
    const clockGroup = createGroup("Clock Settings", window.countBarStyles.clock, [
      { key: "show", type: "checkbox", label: "Show Clock" },
      { key: "hourFormat", type: "select", label: "Hour Format", options: [
        { value: "12", label: "12-hour" },
        { value: "24", label: "24-hour" }
      ] },
      { key: "fontSize", type: "number", label: "Font Size" },
      { key: "textColor", type: "color", label: "Text Color" },
      { key: "backgroundColor", type: "color", label: "Background Color" },
      { key: "borderThickness", type: "number", label: "Border Thickness" },
      { key: "borderColor", type: "color", label: "Border Color" },
      { key: "borderRadius", type: "number", label: "Border Radius" },
      { key: "padding", type: "number", label: "Padding" },
      { key: "margin", type: "number", label: "Margin" },
      { key: "width", type: "number", label: "Width (%)" }
    ]);
    toolsContainer.appendChild(clockGroup);
  
    // --- Update Preview: Apply CSS Changes Immediately ---
    function updatePreview() {
      // Update container styles (element ID: "countBlock")
      const container = document.getElementById("countBlock");
      if (container) {
        container.style.padding = window.countBarStyles.container.padding + "px";
        container.style.backgroundColor = window.countBarStyles.container.backgroundColor;
      }
  
      // Helper: Update styles for a count block element.
      function updateBlock(elementId, settings) {
        const elem = document.getElementById(elementId);
        if (elem) {
          // Prevent flexbox interference.
          elem.style.flex = "none";
          elem.style.margin = settings.margin + "px";
          elem.style.padding = settings.padding + "px";
          elem.style.backgroundColor = settings.backgroundColor;
          elem.style.border = settings.borderThickness + "px solid " + settings.borderColor;
          elem.style.borderRadius = settings.borderRadius + "px";
          elem.style.width = settings.width + "%";
          // Update inner text styling (assumes an <h3> exists)
          const h3 = elem.querySelector("h3");
          if (h3) {
            h3.style.fontSize = settings.fontSize + "px";
            h3.style.color = settings.textColor;
          }
        }
      }
  
      updateBlock("currentCount", window.countBarStyles.currentBlock);
      updateBlock("dailyCount", window.countBarStyles.dailyBlock);
      updateBlock("yearlyCount", window.countBarStyles.yearlyBlock);
  
      // Update clock element styles (element ID: "liveClock")
      const clockElem = document.getElementById("liveClock");
      if (clockElem) {
        clockElem.style.display = window.countBarStyles.clock.show ? "flex" : "none";
        clockElem.style.margin = window.countBarStyles.clock.margin + "px";
        clockElem.style.padding = window.countBarStyles.clock.padding + "px";
        clockElem.style.backgroundColor = window.countBarStyles.clock.backgroundColor;
        clockElem.style.border = window.countBarStyles.clock.borderThickness + "px solid " + window.countBarStyles.clock.borderColor;
        clockElem.style.borderRadius = window.countBarStyles.clock.borderRadius + "px";
        clockElem.style.width = window.countBarStyles.clock.width + "%";
        const h3 = clockElem.querySelector("h3");
        if (h3) {
          h3.style.fontSize = window.countBarStyles.clock.fontSize + "px";
          h3.style.color = window.countBarStyles.clock.textColor;
        }
      }
    }
  
    // --- Initial CSS Application ---
    updatePreview();
  };
  