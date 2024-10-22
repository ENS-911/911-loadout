async function createWeatherBar(options) {
    const { rootDiv, activeData } = options;

    // Mock data set for slice load parameters (all set to true)
    const weatherBarOptions = {
        showTemperatureSlice: true,
        showPrecipitationSlice: true,
        showCloudCoverSlice: true,
        showWindSlice: true,
        showEvacuationRoutesSlice: true
    };

    // Create the weather bar container
    const weatherBar = document.createElement('div');
    weatherBar.id = 'weatherBar';
    rootDiv.appendChild(weatherBar);

    // Functions for each slice
    function createTemperatureSlice() {
        const tempSlice = document.createElement('div');
        tempSlice.className = 'weatherSlice';
        tempSlice.id = 'temperatureSlice';

        // Display temperature and current conditions icon
        const tempIcon = document.createElement('img');
        tempIcon.src = 'path/to/temperature-icon.png'; // Replace with actual icon URL
        tempIcon.alt = 'Current Conditions';
        tempSlice.appendChild(tempIcon);

        const tempLabel = document.createElement('span');
        tempLabel.textContent = 'Temperature';
        tempSlice.appendChild(tempLabel);

        // Clicking the slice shows a dropdown with current and 5-day forecasts
        tempSlice.onclick = () => {
            let dropdown = tempSlice.querySelector('.dropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                tempSlice.classList.toggle('active');
            } else {
                // Create and populate the dropdown
                dropdown = document.createElement('div');
                dropdown.className = 'dropdown';

                // Mock forecast data
                const forecastData = [
                    { day: 'Today', temp: '72°F', conditions: 'Sunny' },
                    { day: 'Tomorrow', temp: '75°F', conditions: 'Partly Cloudy' },
                    { day: 'Day 3', temp: '70°F', conditions: 'Rain' },
                    { day: 'Day 4', temp: '68°F', conditions: 'Thunderstorms' },
                    { day: 'Day 5', temp: '65°F', conditions: 'Cloudy' },
                ];

                forecastData.forEach(forecast => {
                    const forecastItem = document.createElement('div');
                    forecastItem.className = 'forecastItem';
                    forecastItem.textContent = `${forecast.day}: ${forecast.temp}, ${forecast.conditions}`;
                    dropdown.appendChild(forecastItem);
                });

                tempSlice.appendChild(dropdown);
                tempSlice.classList.add('active');
            }
        };

        weatherBar.appendChild(tempSlice);
    }

    function createPrecipitationSlice() {
        const precipSlice = document.createElement('div');
        precipSlice.className = 'weatherSlice';
        precipSlice.id = 'precipitationSlice';

        const precipLabel = document.createElement('span');
        precipLabel.textContent = 'Precipitation';
        precipSlice.appendChild(precipLabel);

        // Adds precipitation layer to the map
        precipSlice.onclick = () => {
            if (window.addPrecipitationLayer) {
                window.addPrecipitationLayer();
                precipSlice.classList.toggle('active');
            } else {
                console.warn('addPrecipitationLayer function is not defined');
            }
        };

        weatherBar.appendChild(precipSlice);
    }

    function createCloudCoverSlice() {
        const cloudSlice = document.createElement('div');
        cloudSlice.className = 'weatherSlice';
        cloudSlice.id = 'cloudCoverSlice';

        const cloudLabel = document.createElement('span');
        cloudLabel.textContent = 'Cloud Cover';
        cloudSlice.appendChild(cloudLabel);

        // Adds cloud cover layer to the map
        cloudSlice.onclick = () => {
            if (window.addCloudCoverLayer) {
                window.addCloudCoverLayer();
                cloudSlice.classList.toggle('active');
            } else {
                console.warn('addCloudCoverLayer function is not defined');
            }
        };

        weatherBar.appendChild(cloudSlice);
    }

    function createWindSlice() {
        const windSlice = document.createElement('div');
        windSlice.className = 'weatherSlice';
        windSlice.id = 'windSlice';
    
        const windLabel = document.createElement('span');
        windLabel.textContent = 'Wind';
        windSlice.appendChild(windLabel);
    
        // Display the Windy.com popup on click
        windSlice.onclick = () => {
            window.showWindPopup();
            windSlice.classList.toggle('active');
        };
    
        weatherBar.appendChild(windSlice);
    }

    function createEvacuationRoutesSlice() {
        const evacSlice = document.createElement('div');
        evacSlice.className = 'weatherSlice';
        evacSlice.id = 'evacuationRoutesSlice';

        const evacLabel = document.createElement('span');
        evacLabel.textContent = 'Evacuation Routes';
        evacSlice.appendChild(evacLabel);

        // Adds evacuation routes layer to the map
        evacSlice.onclick = () => {
            if (window.addEvacuationRoutesLayer) {
                window.addEvacuationRoutesLayer();
                evacSlice.classList.toggle('active');
            } else {
                console.warn('addEvacuationRoutesLayer function is not defined');
            }
        };

        weatherBar.appendChild(evacSlice);
    }

    // Call functions based on the mock parameters
    if (weatherBarOptions.showTemperatureSlice) {
        createTemperatureSlice();
    }
    if (weatherBarOptions.showPrecipitationSlice) {
        createPrecipitationSlice();
    }
    if (weatherBarOptions.showCloudCoverSlice) {
        createCloudCoverSlice();
    }
    if (weatherBarOptions.showWindSlice) {
        createWindSlice();
    }
    if (weatherBarOptions.showEvacuationRoutesSlice) {
        createEvacuationRoutesSlice();
    }

    window.showWindPopup = function() {
        // Ensure 'map' is initialized
        if (!window.map) {
            console.error('Map is not initialized.');
            return;
        }
    
        // Get the current map center coordinates
        const center = window.map.getCenter();
        const lat = center.lat.toFixed(3);
        const lon = center.lng.toFixed(3);
    
        // Construct the Windy.com embed URL with dynamic lat and lon
        const windyUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=10&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;
    
        // Create an overlay container
        const overlayContainer = document.createElement('div');
        overlayContainer.id = 'windyOverlay';
    
        // Create a popup container inside the overlay
        const popupContainer = document.createElement('div');
        popupContainer.id = 'windyPopup';
    
        // Create a close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => {
            document.body.removeChild(overlayContainer);
        };
        popupContainer.appendChild(closeButton);
    
        // Create the iframe
        const iframe = document.createElement('iframe');
        iframe.src = windyUrl;
    
        popupContainer.appendChild(iframe);
    
        // Append the popup to the overlay
        overlayContainer.appendChild(popupContainer);
    
        // Append the overlay to the body
        document.body.appendChild(overlayContainer);
    };    
    
}
