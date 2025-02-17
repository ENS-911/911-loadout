(() => {
    const initPage = () => {
      const rootDiv = document.getElementById("ENSLoadOut");
      if (!rootDiv) {
        console.error("ENSLoadOut container not found.");
        return;
      }
      rootDiv.innerHTML = "";
  
      // Helper: Load a script and return a Promise
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
            reject(new Error(`Script load error for ${src}`));
          };
          document.head.appendChild(script);
        });
      };
  
      // Helper: Load a CSS file
      const loadCSS = (href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      };
  
      // Load the necessary stylesheets
      loadCSS("https://ensloadout.911emergensee.com/ens-packages/gold0.css");
      loadCSS("https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css");
      loadCSS("https://ensloadout.911emergensee.com/ens-packages/components/weather-bar/weatherbar0.css");
      loadCSS("https://ensloadout.911emergensee.com/ens-packages/components/sort-bars/sb0.css");
      loadCSS("https://ensloadout.911emergensee.com/ens-packages/components/live-tables/lt0.css");
  
      // Chain loading of required scripts
      loadScript("https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js")
        .then(() => loadScript("https://ensloadout.911emergensee.com/ens-packages/components/weather-bar/weatherbar0.js"))
        .then(() => loadScript("https://ensloadout.911emergensee.com/ens-packages/components/map/map.js"))
        .then(() => loadScript("https://ensloadout.911emergensee.com/ens-packages/components/sort-bars/sb0.js"))
        .then(() => loadScript("https://ensloadout.911emergensee.com/ens-packages/components/live-tables/lt0.js"))
        .then(() => {
          // Fetch the active call data for this client.
          fetch(`https://matrix.911-ens-services.com/data/${clientID}`)
            .then((resp) => {
              if (!resp.ok) {
                throw new Error(`HTTP error: ${resp.status}`);
              }
              return resp.json();
            })
            .then((activeData) => {
              // Create a container for the map.
              const mapContainer = document.createElement("div");
              mapContainer.id = "mapContainer";
              mapContainer.style.width = "100%";
              mapContainer.style.height = "800px";
              mapContainer.style.position = "relative";
              rootDiv.appendChild(mapContainer);
  
              // Initialize the map (mapRun should be defined in map.js)
              mapRun({
                container: mapContainer,
                activeData: activeData,
                countyCode: window.nwsId || ""
              }).then((map) => {
                // Initialize weather bar if available.
                if (typeof createWeatherBar === "function") {
                  createWeatherBar({
                    container: mapContainer,
                    activeData: activeData,
                    map: map
                  });
                }
                // Initialize sort bar if available.
                if (typeof createSortBar === "function") {
                  createSortBar({
                    rootDiv: rootDiv,
                    activeData: activeData,
                    updateTable: (filteredData) => {
                      if (window.renderTableBody) window.renderTableBody(filteredData);
                    },
                    updateMap: (filteredData) => {
                      if (window.updateMap) window.updateMap(filteredData);
                    },
                    hasMap: true
                  });
                }
                // Initialize the table if available.
                if (typeof createTable === "function") {
                  const tableSetup = createTable({
                    rootDiv: rootDiv,
                    updateTable: window.renderTableBody,
                    activeData: activeData
                  });
                  window.renderTableBody = tableSetup.renderTableBody;
                  window.initialSortByDate = tableSetup.initialSortByDate;
                  window.initialSortByDate();
                  window.renderTableBody(activeData);
                }
              });
            })
            .catch((e) => console.error("Error fetching active data:", e));
        })
        .catch((error) => {
          console.error("Error loading scripts:", error);
        });
    };
  
    // Run initPage immediately if the DOM is ready; otherwise, wait for DOMContentLoaded.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initPage);
    } else {
      initPage();
    }
  })();
  