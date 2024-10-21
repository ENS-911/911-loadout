function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error(`Error loading script: ${src}`);
    document.head.appendChild(script);
}

function loadStylesheet(href) {
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
}

let map = null
let activeData = ""
let countyCode = ""

rootDiv.innerHTML = "";

async function preLoad() {
    loadStylesheet('https://ensloadout.911emergensee.com/ens-packages/silver0.css');
    await loadScript('https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js');
    loadStylesheet('https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css');
    await loadScript('https://ensloadout.911emergensee.com/ens-packages/components/count-bars/cb0.js');
    loadStylesheet('https://ensloadout.911emergensee.com/ens-packages/components/count-bars/cb0.css');
    await loadScript('https://ensloadout.911emergensee.com/ens-packages/components/map/map.js');
    await loadScript('https://ensloadout.911emergensee.com/ens-packages/components/sort-bars/sb0.js');
    loadStylesheet('https://ensloadout.911emergensee.com/ens-packages/components/sort-bars/sb0.css');
    await loadScript('https://ensloadout.911emergensee.com/ens-packages/components/live-tables/lt0.js');
    loadStylesheet('https://ensloadout.911emergensee.com/ens-packages/components/live-tables/lt0.css');

    dataGrab();
}

async function dataGrab() {
    try {
        const response = await fetch(`https://matrix.911-ens-services.com/data/${clientID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        activeData = await response.json();
        countyCode = nwsId;
        launch()
    } catch (error) {
        console.error('Error fetching client information:', error.message);
    }
}

async function launch() {
    // Initialize count bar
    await createCountBar({ rootDiv });

    // Initialize the map
    await mapRun({
        rootDiv: rootDiv,
        countyCode: countyCode,
        activeData: activeData
    });

    // Create the sort bar
    await createSortBar({
        rootDiv: rootDiv,
        activeData: activeData,
        updateTable: function(filteredData) {
            // Update the table with the filtered data
            if (window.renderTableBody) {
                window.renderTableBody(filteredData);
            }
        },
        updateMap: function(filteredData) {
            // Update the map with the filtered data
            if (window.updateMap) {
                window.updateMap(filteredData);
            }
        },
        hasMap: true
    });

    // Initialize the table
    const { renderTableBody, initialSortByDate } = createTable({
        rootDiv: rootDiv,
        updateTable: window.renderTableBody,
        activeData: activeData
    });

    // Make these functions globally accessible
    window.renderTableBody = renderTableBody;
    window.initialSortByDate = initialSortByDate;

    // Sort table by date initially
    window.initialSortByDate();

    // Render the initial table
    window.renderTableBody(activeData);
}

preLoad();