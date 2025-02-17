(() => {
    const init = () => {
      if (!clientID) {
        console.error("Client ID is missing. Cannot initialize header split.");
        return;
      }
  
      // Helper: Load a CSS file
      const loadCSS = (href) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      };
      loadCSS("https://ensloadout.911emergensee.com/ens-packages/components/count-bars/cb0.css");
  
      // Helper: Load a script dynamically, returning a Promise
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = () => {
            console.error(`Error loading script: ${src}`);
            reject(new Error(`Script load error for ${src}`));
          };
          document.head.appendChild(script);
        });
      };
  
      // Look for the header container.
      const headerContainer = document.getElementById("ENSSplitHead");
      if (!headerContainer) {
        console.error("ENSSplitHead container not found.");
        return;
      }
  
      // Create (or locate) a dedicated container for the count bar inside the header.
      let countContainer = document.getElementById("globalCountBar");
      if (!countContainer) {
        countContainer = document.createElement("div");
        countContainer.id = "globalCountBar";
        headerContainer.appendChild(countContainer);
      }
  
      // Initialize the count bar once cb0.js is loaded.
      const initCountBar = () => {
        if (typeof createCountBar === "function") {
          createCountBar({ rootDiv: countContainer });
        } else {
          console.error("createCountBar is not available even after loading cb0.js");
        }
      };
  
      // Load cb0.js if needed, then initialize the count bar.
      if (typeof createCountBar !== "function") {
        loadScript("https://ensloadout.911emergensee.com/ens-packages/components/count-bars/cb0.js")
          .then(initCountBar)
          .catch((error) => console.error(error));
      } else {
        initCountBar();
      }
    };
  
    // If the DOM is still loading, wait for it; otherwise, run immediately.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
  