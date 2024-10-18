async function createCountBar(options) {
    let dayCount = ""
    let yearCount = ""

    const { rootDiv } = options;

    try {
        const response = await fetch(`https://matrix.911-ens-services.com/count/${clientID}`);
        const countData = await response.json();
        dayCount = countData.currentDateCount;
        yearCount = countData.totalCount;
        bar()
    } catch (error) {
            console.error('Error fetching counts:', error.message);
    }
    
    function bar() {

    const countBlock = document.createElement("div");
    countBlock.id = 'countBlock';
    rootDiv.appendChild(countBlock);

    const countWrap = document.createElement("div");
    countBlock.appendChild(countWrap);
    countWrap.className = "countWrap";

    const dayBlock = document.createElement("h3");
    countWrap.appendChild(dayBlock);
    dayBlock.innerText = `DAILY TOTAL INCIDENTS: ${dayCount}`;
    dayBlock.className = "countItem";

    const yearBlock = document.createElement("h3");
    countWrap.appendChild(yearBlock);
    yearBlock.innerText = `YEARLY INCIDENTS: ${yearCount}`;
    yearBlock.className = "countItem";
    }
}