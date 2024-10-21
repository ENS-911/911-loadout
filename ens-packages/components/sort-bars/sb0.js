function createSortBar(options) {
    const { rootDiv, updateTable, updateMap, hasMap = false, activeData } = options;

    // Create the sort bar container
    const sortBarDiv = document.createElement("div");
    sortBarDiv.id = "sortBar";
    rootDiv.appendChild(sortBarDiv);

    // Build the top section
    const topSection = document.createElement("div");
    topSection.id = "topSection";
    
    // Left Section: "ACTIVE INCIDENTS"
    const leftSection = document.createElement("div");
    leftSection.className = "leftSection";
    leftSection.innerText = "ACTIVE INCIDENTS";

    // Right Section: Status filters
    const rightSection = document.createElement("div");
    rightSection.className = "rightSection";
    const statusFilterText = document.createElement("p");
    statusFilterText.innerText = "Click to Filter by Status:";
    const statusFiltersDiv = document.createElement("div");
    statusFiltersDiv.id = "statusFilters";

    // Status radio buttons - with labels and values
    const statuses = [
        { label: "All Status", value: "all" },
        { label: "R = Reported", value: "Reported" },
        { label: "E = Enroute", value: "Enroute" },
        { label: "OS = On Scene", value: "On Scene" },
        { label: "T = Transporting", value: "Transporting" },
        { label: "H = At Hospital", value: "At Hospital" },
        { label: "Q = Queued", value: "Queued" }
    ];

    // Populate status radio buttons dynamically based on full dataset
    function renderStatusRadioButtons() {
        statusFiltersDiv.innerHTML = ''; // Clear existing radios

        // Get unique statuses from the full dataset (activeData)
        const availableStatuses = [...new Set(activeData.map(item => item.status))];

        statuses.forEach(status => {
            // Only show radio buttons for statuses that are present in the dataset
            if (status.value === 'all' || availableStatuses.includes(status.value)) {
                const label = document.createElement("label");
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "status";
                radio.value = status.value;
                if (status.value === "all") radio.checked = true; // Default to 'All' checked
                label.appendChild(radio);
                label.appendChild(document.createTextNode(` ${status.label}`));
                statusFiltersDiv.appendChild(label);

                // Attach event listener to each radio button
                radio.addEventListener("change", applyFilters);
            }
        });
    }

    // Call the function to render the radio buttons initially
    renderStatusRadioButtons();

    // Right Section: Append the status filter text and radio buttons
    rightSection.appendChild(statusFilterText);
    rightSection.appendChild(statusFiltersDiv);

    // Add left and right sections to the top section
    topSection.appendChild(leftSection);
    topSection.appendChild(rightSection);

    // Bottom Section with dropdowns
    const bottomSection = document.createElement("div");
    bottomSection.id = "bottomSection";

    const filterByType = createDropdown("Filter by Type", "filterByType");
    const filterByAgency = createDropdown("Filter by Agency", "filterByAgency");
    const filterByArea = createDropdown("Filter by Area", "filterByArea");

    bottomSection.appendChild(filterByType);
    bottomSection.appendChild(filterByAgency);
    bottomSection.appendChild(filterByArea);

    // Append top and bottom sections to the sort bar
    sortBarDiv.appendChild(topSection);
    sortBarDiv.appendChild(bottomSection);

    // Populate the dropdowns based on activeData (initial full dataset)
    populateDropdowns();

    // Create dropdowns for the bottom section
    function createDropdown(defaultText, id) {
        const select = document.createElement("select");
        select.id = id;
        const defaultOption = document.createElement("option");
        defaultOption.value = "all";
        defaultOption.innerText = defaultText;
        select.appendChild(defaultOption);
        select.addEventListener("change", applyFilters);
        return select;
    }

    // Populate the dropdowns dynamically based on the full dataset
    function populateDropdowns() {
        const types = [...new Set(activeData.map(item => item.type))];
        const agencies = [...new Set(activeData.map(item => item.agency_type))];
        const areas = [...new Set(activeData.map(item => item.db_city))];

        populateDropdown(filterByType, types);
        populateDropdown(filterByAgency, agencies);
        populateDropdown(filterByArea, areas);
    }

    // Function to populate a dropdown with unique values
    function populateDropdown(dropdown, items) {
        dropdown.innerHTML = '<option value="all">All</option>';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.innerText = item;
            dropdown.appendChild(option);
        });
    }

    // Apply filters based on the dropdown selections and radio buttons
    function applyFilters() {
        const selectedType = filterByType.value;
        const selectedAgency = filterByAgency.value;
        const selectedArea = filterByArea.value;
        const selectedStatus = document.querySelector('input[name="status"]:checked').value;
    
        // Filter the data based on the selected filters
        const filteredData = activeData.filter(item => {
            const typeMatch = selectedType === 'all' || item.type === selectedType;
            const agencyMatch = selectedAgency === 'all' || item.agency_type === selectedAgency;
            const areaMatch = selectedArea === 'all' || item.db_city === selectedArea;
            const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    
            return typeMatch && agencyMatch && areaMatch && statusMatch;
        });
    
        // Update the map with the filtered data
        if (updateMap) {
            updateMap(filteredData);
        }
    
        // Update the table with the filtered data
        if (updateTable) {
            updateTable(filteredData);
        }
    
        // Optionally, update the dropdowns based on the filtered data
        updateDropdownOptions(filteredData);
    }  

    // Function to update the dropdown options dynamically based on filtered data (optional)
    function updateDropdownOptions(filteredData) {
        const types = [...new Set(filteredData.map(item => item.type))];
        const agencies = [...new Set(filteredData.map(item => item.agency_type))];
        const areas = [...new Set(filteredData.map(item => item.db_city))];
        updateDropdown(filterByType, types, filterByType.value);
        updateDropdown(filterByAgency, agencies, filterByAgency.value);
        updateDropdown(filterByArea, areas, filterByArea.value);
    }

    // Helper function to update dropdowns, keep "All" option, and preserve the selected value
    function updateDropdown(dropdown, items, selectedValue) {
        dropdown.innerHTML = ''; // Clear existing options

        // Add the "All" option
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.innerText = 'All';
        dropdown.appendChild(allOption);

        // Add the filtered items to the dropdown
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.innerText = item;
            dropdown.appendChild(option);
        });

        // Restore the previous selected value (or default to 'all')
        dropdown.value = selectedValue || 'all';
    }
}
