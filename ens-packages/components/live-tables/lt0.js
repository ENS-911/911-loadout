const tableDiv = document.getElementById("tableBlock");

const tableWrap = document.createElement("table");
tableDiv.appendChild(tableWrap);
tableWrap.className = "tableWrap";

// Create table header (thead)
const thead = document.createElement("thead");
tableWrap.appendChild(thead);

const headerRow = document.createElement("tr");
thead.appendChild(headerRow);

// Define headers and associated data keys for sorting
const headers = [
    { title: "Agency Type", key: "agency_type" },
    { title: "Status", key: "status" },
    { title: "Sequence Number", key: "sequencenumber" },
    { title: "Creation Date", key: "creation", isDate: true }, // Mark this column as date
    { title: "Jurisdiction", key: "jurisdiction" },
    { title: "Event Type", key: "type" },
    { title: "Location", key: "location" },
    { title: "City", key: "db_city" }
];

let sortDirection = {}; // Store sorting direction for each column

headers.forEach(header => {
    const th = document.createElement("th");
    th.innerText = header.title;
    th.style.cursor = "pointer"; // Make the headers clickable

    // Add sorting arrows
    const arrow = document.createElement("span");
    arrow.innerHTML = " &#x25B2;&#x25BC;"; // Up/Down arrows
    th.appendChild(arrow);

    th.addEventListener("click", () => {
        // Determine the current sort direction (asc or desc)
        sortDirection[header.key] = !sortDirection[header.key] ? "asc" : (sortDirection[header.key] === "asc" ? "desc" : "asc");

        // Sort activeData based on the clicked column and direction
        activeData.sort((a, b) => {
            let valA = a[header.key];
            let valB = b[header.key];

            // If the column is a date, compare the raw strings (no parsing or conversions)
            if (header.isDate) {
                valA = a[header.key];
                valB = b[header.key];
            }

            if (sortDirection[header.key] === "asc") {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });

        // Clear and re-render the table body with the sorted data
        renderTableBody();
    });

    headerRow.appendChild(th);
});

// Function to render the table body (tbody)
function renderTableBody() {
    // Clear existing tbody if it exists
    const existingTbody = tableWrap.querySelector("tbody");
    if (existingTbody) {
        existingTbody.remove();
    }

    // Create new tbody
    const tbody = document.createElement("tbody");
    tableWrap.appendChild(tbody);

    activeData.forEach(function (bar) {
        const tRow = document.createElement("tr");
        tbody.appendChild(tRow);

        const typeTc = document.createElement("td");
        tRow.appendChild(typeTc);
        typeTc.innerText = `${bar.agency_type}`;

        const statTc = document.createElement("td");
        tRow.appendChild(statTc);
        statTc.innerText = `${bar.status}`;

        const numbTc = document.createElement("td");
        tRow.appendChild(numbTc);
        numbTc.innerText = `${bar.sequencenumber}`;

        // Display the date directly as YYYY-MM-DD HH:MM:SS in 24-hour format, extracted from the string
        const dateTc = document.createElement("td");
        tRow.appendChild(dateTc);
        dateTc.innerText = formatDate(bar.creation); // Use formatDate to extract and display the proper format

        const agencyTc = document.createElement("td");
        tRow.appendChild(agencyTc);
        agencyTc.innerText = `${bar.jurisdiction}`;

        const eventTc = document.createElement("td");
        tRow.appendChild(eventTc);
        eventTc.innerText = `${bar.type}`;

        const locTc = document.createElement("td");
        tRow.appendChild(locTc);
        locTc.innerText = `${bar.location}`;

        const areaTc = document.createElement("td");
        tRow.appendChild(areaTc);
        areaTc.innerText = `${bar.db_city}`;
    });
}

// Format date without timezone conversion and in 24-hour format
function formatDate(dateString) {
    // Assuming dateString is in ISO format (YYYY-MM-DDTHH:MM:SSZ or YYYY-MM-DDTHH:MM:SS)
    const datePart = dateString.split('T')[0]; // Extract the YYYY-MM-DD part
    const timePart = dateString.split('T')[1].split('.')[0]; // Extract the HH:MM:SS part and ignore milliseconds

    return `${datePart} ${timePart}`; // Return in "YYYY-MM-DD HH:MM:SS" format
}

// Initial sort by date (most recent at the top)
function initialSortByDate() {
    activeData.sort((a, b) => {
        let dateA = a.creation;
        let dateB = b.creation;
        return dateB.localeCompare(dateA); // Compare as strings (most recent first)
    });

    // Render the sorted table
    renderTableBody();
}

// Initial render of the table body with sorted data
initialSortByDate();
