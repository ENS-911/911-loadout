// ensloadout.js
(function () {
    // Fetch the client data from the API.
    const clientID = window.clientID
    async function portalOpen(clientID) {
        try {
          const response = await fetch(`https://matrix.911-ens-services.com/client/${clientID}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Client Information:", data);
      
          // Set the global county ID for use in the map
          window.nwsId = data.nws;
      
          // Retrieve the subscription level and display mode from the API data.
          const subscription = data.plan;       // e.g., "gold"
          const displayMode = data.display;       // "single" or "header_split"
      
          // If you’re using a global promise to signal readiness, resolve it here.
          if (window.clientDataReadyResolve) {
            window.clientDataReadyResolve();
          }
      
          // For single-display mode, load the normal subscription script (e.g., gold.js)
          if (displayMode === "single") {
            loadExternalScriptSingle(subscription);
          }
          // For header_split mode, load the split head and/or split main scripts as needed.
          else if (displayMode === "header_split") {
            // Always load the header part on every page
            if (document.getElementById("ENSSplitHead")) {
              loadExternalScriptSplitHead(subscription);
            }
            // Only load the main split script on the dedicated page if it exists.
            if (document.getElementById("ENSLoadOut")) {
              loadExternalScriptSplit(subscription);
            }
          }
        } catch (error) {
          console.error("Error fetching client information:", error.message);
        }
    }      
  
    // Load the normal single mode script (e.g., gold.js)
    function loadExternalScriptSingle(subscription) {
      const script = document.createElement("script");
      script.src = `https://ensloadout.911emergensee.com/ens-packages/${subscription}.js`;
      script.onload = () => {
        console.log(`Loaded ${subscription}.js for single mode`);
      };
      script.onerror = () => {
        console.error(`Error loading ${subscription}.js for single mode`);
      };
      document.head.appendChild(script);
    }
  
    // Load the header (split) script (e.g., goldSplitHead.js)
    function loadExternalScriptSplitHead(subscription) {
      const script = document.createElement("script");
      script.src = `https://ensloadout.911emergensee.com/ens-packages/${subscription}SplitHead.js`;
      script.onload = () => {
        console.log(`Loaded ${subscription}SplitHead.js for header split`);
      };
      script.onerror = () => {
        console.error(`Error loading ${subscription}SplitHead.js for header split`);
      };
      document.head.appendChild(script);
    }
  
    // Load the dedicated (split) main page script (e.g., goldSplit.js)
    function loadExternalScriptSplit(subscription) {
      const script = document.createElement("script");
      script.src = `https://ensloadout.911emergensee.com/ens-packages/${subscription}Split.js`;
      script.onload = () => {
        console.log(`Loaded ${subscription}Split.js for header split`);
      };
      script.onerror = () => {
        console.error(`Error loading ${subscription}Split.js for header split`);
      };
      document.head.appendChild(script);
    }
  
    // Start the process using the globally defined clientID.
    portalOpen(window.clientID);
  })();
  