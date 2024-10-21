// Helper function to load external scripts
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error(`Error loading script: ${src}`);
    document.head.appendChild(script);
}

// Helper function to load external stylesheets
function loadStylesheet(href) {
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
}

// Data Store
let activeData = "";

// Clear the rootDiv
rootDiv.innerHTML = "";

// Initialize sortBlock and tableBlock
const sortBlock = document.createElement("div");
sortBlock.id = 'sortBlock';
rootDiv.appendChild(sortBlock);

const tableBlock = document.createElement("div");
tableBlock.id = 'tableBlock';
rootDiv.appendChild(tableBlock);

// Fetch and process active data
// Fetch and process active data
async function dataGrab() {
    try {
        console.log(clientID);
        const response = await fetch(`https://matrix.911-ens-services.com/data/${clientID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        activeData = await response.json();
        window.activeData = activeData; // Make activeData globally accessible
        console.log("Active data fetched", activeData);
        
        // Trigger sort bar and table loading after data is fetched
        sortBarTrigger(); 
        tableTrigger(); // Trigger table loading after data is fetched
    } catch (error) {
        console.error('Error fetching client information:', error.message);
    }
}


// Trigger table script
function tableTrigger() {
    loadScript('https://ensloadout.911emergensee.com/ens-packages/components/live-tables/lt0.js', function() {
        console.log("Table script loaded. Checking for createTable...");
        // Ensure table script is fully loaded and will use the `activeData`
        if (typeof window.createTable === 'function') {
            console.log('createTable is defined.');
            // Call createTable with appropriate options
            const { renderTableBody, initialSortByDate } = window.createTable({
                rootDiv: tableBlock, // Use tableBlock instead of rootDiv
                activeData: activeData
            });
            // Make functions globally accessible
            window.renderTableBody = renderTableBody;
            window.initialSortByDate = initialSortByDate;
            // Initialize table
            window.initialSortByDate();
            window.renderTableBody(activeData);
        } else {
            console.error('Table script is loaded, but createTable is not defined.');
        }
    });
    loadStylesheet('https://ensloadout.911emergensee.com/ens-packages/components/live-tables/lt0.css');
}


// Wait until renderTableBody is available before initializing sort bar
function waitForFunctions(functionNames, callback) {
    const checkInterval = setInterval(function() {
        const allFunctionsAvailable = functionNames.every(fnName => typeof window[fnName] === 'function');
        if (allFunctionsAvailable) {
            console.log(`${functionNames.join(', ')} are defined. Proceeding with sort bar setup.`);
            clearInterval(checkInterval);
            callback();
        } else {
            console.log(`Waiting for ${functionNames.filter(fnName => typeof window[fnName] !== 'function').join(', ')} to become available...`);
        }
    }, 100); // Check every 100ms
}


// Trigger sort bar script
function sortBarTrigger() {
    loadScript('https://ensloadout.911emergensee.com/ens-packages/components/sort-bars/sb0.js', function () {
        console.log("Sort bar script loaded. Checking for createSortBar...");
        
        // Wait for both createSortBar and renderTableBody to become available
        waitForFunctions(['createSortBar', 'renderTableBody'], function() {
            console.log("Initializing sort bar...");
            window.createSortBar({
                rootDiv: sortBlock,  // Place the sort bar in the sortBlock div
                updateTable: window.renderTableBody, // Function to update the table
                hasMap: false,  // No map in Bronze
                activeData: activeData // Data to filter
            });
        });
    });
    loadStylesheet('https://ensloadout.911emergensee.com/ens-packages/components/sort-bars/sb0.css');
}

// Load the table and sort bar on page load
dataGrab(); // Fetch the data and load the table + sort bar
