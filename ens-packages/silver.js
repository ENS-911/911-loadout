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
let countyCords = ""
let weatherData = ""
let countyCode = ""
let alertStatus = "off"
let warnings = []
let warningData = []
let watch = []
let latitude = ""
let longitude = ""
let centcord = ""

rootDiv.innerHTML = "";

//const mapArea = document.createElement("div");
//mapArea.id = "map";
//mapArea.style.height = "900px";
//rootDiv.appendChild(mapArea);

//const tableBlock = document.createElement("div");
//tableBlock.id = 'tableBlock';
//rootDiv.appendChild(tableBlock);

function preLoad() {
    loadStylesheet('https://ensloadout.911emergensee.com/ens-packages/silver0.css');
    //loadScript('https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js');
    //loadStylesheet('https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css');
    loadScript('https://ensloadout.911emergensee.com/ens-packages/components/count-bars/cb0.js');
    loadStylesheet('https://ensloadout.911emergensee.com/ens-packages/components/count-bars/cb0.css');
    //loadScript('https://ensloadout.911emergensee.com/ens-packages/components/map/map.js');

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

function launch() {
    createCountBar({
        rootDiv: rootDiv
    });
}

preLoad()