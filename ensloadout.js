// Get the root div
const rootDiv = document.getElementById("ENSLoadOut");

// Display a loading message
const loading = document.createElement("h1");
rootDiv.appendChild(loading);
loading.innerText = `LOADING ${clientID}`;

let found = ""; // Holds the subscription level
let nwsId = ""; // Holds the National Weather Service ID

// Function to fetch client data and load appropriate script
async function portalOpen(clientID) {
    console.log("Client ID:", clientID);
    try {
        // Fetch client information based on the clientID
        const response = await fetch(`https://matrix.911-ens-services.com/client/${clientID}`);
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the client data
        const data = await response.json();
        console.log('Client Information:', data);
        
        // Retrieve the subscription level (plan) and other relevant data
        found = data.plan;
        nwsId = data.nws;

        // Display a message about the found subscription level
        const loaded = document.createElement("h2");
        rootDiv.appendChild(loaded);
        loaded.innerText = `CLIENT FOUND, SUBSCRIPTION LEVEL = ${found}`;

        // Load the external script based on the subscription level
        loadExternalScript(found);
        
    } catch (error) {
        console.error('Error fetching client information:', error.message);
        // You might want to show an error message in the UI as well
        const errorMessage = document.createElement("h2");
        rootDiv.appendChild(errorMessage);
        errorMessage.innerText = "Error loading client information.";
    }
}

// Function to dynamically load the external JavaScript based on the subscription level
function loadExternalScript(subscriptionLevel) {
    // Create a script element
    const script = document.createElement('script');
    
    // Set the source URL of the external JavaScript file based on the subscription level
    script.src = `https://ensloadout.911emergensee.com/ens-packages/${subscriptionLevel}.js`;
    
    // Append the script element to the document's head
    document.head.appendChild(script);
    
    // Optionally, handle the script's onload or onerror events
    script.onload = function () {
        console.log(`External script for ${subscriptionLevel} loaded successfully`);
        // Perform any post-load actions here
    };
    
    script.onerror = function () {
        console.error(`Error loading external script for ${subscriptionLevel}`);
        // Handle the error as needed
    };
}

// Call the portalOpen function with the provided clientID
portalOpen(clientID);
