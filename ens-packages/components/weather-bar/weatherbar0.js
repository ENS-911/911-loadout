async function createWeatherBar(options) {
    const { container, activeData, map } = options;

    // Mock data set for slice load parameters (all set to true)
    const weatherBarOptions = {
        showTemperatureSlice: true,
        showPrecipitationSlice: true,
        showCloudCoverSlice: true,
        showWindSlice: true,
        showEvacuationRoutesSlice: false
    };

    // Create the weather bar container
    const weatherBar = document.createElement('div');
    weatherBar.id = 'weatherBar';
    container.appendChild(weatherBar);

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
    
        // Displays a windy popup
        windSlice.onclick = () => {
            showWindPopup(map); // Pass the map object
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

    function showWindPopup(map) {
        // Ensure 'map' is initialized
        if (!map) {
            console.error('Map is not initialized.');
            return;
        }
    
        // Get the current map center coordinates
        const center = map.getCenter();
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
    }
      
    async function getForecastUrl(lat, lon) {
        try {
            const response = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
            if (!response.ok) {
                throw new Error(`Error fetching forecast URL: ${response.status}`);
            }
            const data = await response.json();
            const forecastUrl = data.properties.forecast;
            return forecastUrl;
        } catch (error) {
            console.error('Error fetching forecast URL:', error.message);
            return null;
        }
    }

    function createTemperatureSlice() {
        const tempSlice = document.createElement('div');
        tempSlice.className = 'weatherSlice';
        tempSlice.id = 'temperatureSlice';
        tempSlice.style.position = 'relative'; // Ensure relative positioning for dropdown
    
        // Create a container for icon and temperature
        const tempContent = document.createElement('div');
        tempContent.className = 'tempContent';
    
        // Elements for temperature and icon
        const tempIcon = document.createElement('img');
        tempIcon.alt = 'Current Conditions';
    
        const tempLabel = document.createElement('span');
    
        // Append icon and label to the tempContent container
        tempContent.appendChild(tempIcon);
        tempContent.appendChild(tempLabel);
    
        // Append tempContent to the tempSlice
        tempSlice.appendChild(tempContent);
    
        // Variable to store forecast data
        let forecastData = [];
    
        // Fetch and display temperature and icon
        async function fetchTemperature() {
            try {
                // Get the center coordinates from the map
                const center = map.getCenter();
                const lat = center.lat.toFixed(4);
                const lon = center.lng.toFixed(4);
    
                // Get the forecast URL
                const forecastUrl = await getForecastUrl(lat, lon);
    
                if (!forecastUrl) {
                    tempLabel.textContent = 'N/A';
                    return;
                }
    
                // Fetch the forecast data
                const response = await fetch(forecastUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const weatherData = await response.json();
                const currentPeriod = weatherData.properties.periods[0];
    
                // Display the temperature and icon
                const temperature = currentPeriod.temperature;
                const iconUrl = currentPeriod.icon;
    
                tempLabel.textContent = `${temperature}°`;
                tempIcon.src = iconUrl;
    
                // Store forecast data for dropdown
                forecastData = weatherData.properties.periods.slice(0, 5); // Get first 5 periods
            } catch (error) {
                console.error('Error fetching temperature:', error.message);
                tempLabel.textContent = 'N/A';
            }
        }
    
        // Handle the click event to show the forecast dropdown
        tempSlice.onclick = () => {
            if (forecastData.length === 0) {
                // Data not yet available
                console.warn('Forecast data not yet available.');
                return;
            }
    
            let dropdown = tempSlice.querySelector('.dropdown');
            if (dropdown) {
                const isVisible = dropdown.style.display === 'block';
                dropdown.style.display = isVisible ? 'none' : 'block';
                tempSlice.classList.toggle('active', !isVisible);
            } else {
                // Create and populate the dropdown
                dropdown = document.createElement('div');
                dropdown.className = 'dropdown';
    
                forecastData.forEach(forecast => {
                    const forecastItem = document.createElement('div');
                    forecastItem.className = 'forecastItem';
                    forecastItem.textContent = `${forecast.name}: ${forecast.temperature}°, ${forecast.shortForecast}`;
                    dropdown.appendChild(forecastItem);
                });
    
                tempSlice.appendChild(dropdown);
                tempSlice.classList.add('active');
            }
        };
    
        // Fetch the temperature when the slice is created
        fetchTemperature();
    
        weatherBar.appendChild(tempSlice);
    }
    
}
