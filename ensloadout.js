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
      
          window.nwsId = data.nws;
      
          const subscription = data.plan;
          const displayMode = data.display;
      
          if (window.clientDataReadyResolve) {
            window.clientDataReadyResolve();
          }
      
          if (displayMode === "single") {
            loadExternalScriptSingle(subscription);
          }
          else if (displayMode === "header_split") {
            if (document.getElementById("ENSSplitHead")) {
              loadExternalScriptSplitHead(subscription);
            }
            if (document.getElementById("ENSLoadOut")) {
              loadExternalScriptSplit(subscription);
            }
          }
        } catch (error) {
          console.error("Error fetching client information:", error.message);
        }
    }      
  
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
  
    portalOpen(window.clientID);
  })();
  