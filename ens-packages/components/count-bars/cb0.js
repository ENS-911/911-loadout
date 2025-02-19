async function createCountBar(options) {
    let dayCount = "";
    let yearCount = "";

    const { rootDiv, styles = {} } = options; // Accept styles dynamically

    try {
        const response = await fetch(`https://matrix.911-ens-services.com/count/${clientID}`);
        const countData = await response.json();
        currentCount = countData.activeCount;
        dayCount = countData.currentDateCount;
        yearCount = countData.totalCount;
        bar();
    } catch (error) {
        console.error('Error fetching counts:', error.message);
    }
    
    function bar() {
        const countBlock = document.createElement("div");
        countBlock.id = "countBlock";
        countBlock.style.width = "100%"; // Ensures full width
        countBlock.style.display = "flex";
        countBlock.style.justifyContent = "space-around";
        countBlock.style.alignItems = "center";
        countBlock.style.padding = "10px";
        countBlock.style.backgroundColor = styles.backgroundColor || "#222"; // Dynamic background
        rootDiv.appendChild(countBlock);
    
        const countWrap = document.createElement("div");
        countWrap.style.display = "flex";
        countWrap.style.justifyContent = "space-around";
        countWrap.style.width = "100%";
        countBlock.appendChild(countWrap);
    
        function createSection(id, text, defaultBg = "#f4f4f4", defaultColor = "#000") {
            const sectionWrapper = document.createElement("div");
            sectionWrapper.id = id; // Unique ID for targeting
            sectionWrapper.style.flex = "1";
            sectionWrapper.style.margin = "5px";
            sectionWrapper.style.padding = "10px";
            sectionWrapper.style.borderRadius = "5px";
            sectionWrapper.style.border = "1px solid #ccc";
            sectionWrapper.style.backgroundColor = styles.sectionBackground || defaultBg;
    
            const sectionText = document.createElement("h3");
            sectionText.innerText = text;
            sectionText.style.fontSize = styles.fontSize || "16px";
            sectionText.style.color = styles.textColor || defaultColor;
            sectionText.classList.add("countItem");
    
            sectionWrapper.appendChild(sectionText);
            return sectionWrapper;
        }
    
        // Assign Unique IDs to Each Section
        countWrap.appendChild(createSection("currentCount", `CURRENT INCIDENTS: ${currentCount}`, "#ffcccc"));
        countWrap.appendChild(createSection("dailyCount", `DAILY TOTAL INCIDENTS: ${dayCount}`, "#ccffcc"));
        countWrap.appendChild(createSection("yearlyCount", `YEARLY INCIDENTS: ${yearCount}`, "#ccccff"));
    
        // Optional: Add live clock if enabled
        if (styles.showClock) {
            const clockSection = createSection("liveClock", getCurrentTime(), "#ddd");
            countWrap.appendChild(clockSection);
            setInterval(() => {
                clockSection.innerText = getCurrentTime();
            }, 1000);
        }
    }    

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString();
    }
}

window.ENSComponent = createCountBar;
