async function mapRun(options) {
    const { rootDiv, countyCode, activeData } = options;

    if (map) {
        map.remove(); // Ensure previous map instance is removed
    }

    const mapArea = document.createElement("div");
    mapArea.id = "map";
    mapArea.style.height = "800px";
    rootDiv.appendChild(mapArea);

    let countyCords = "";
    let latitude = "";
    let longitude = "";
    let centcord = "";
    let alertStatus = "off";
    let warnings = [];
    let warningData = [];
    let watch = [];
    let weatherData = "";

    mapboxgl.accessToken = 'pk.eyJ1Ijoid29tYmF0MTk3MiIsImEiOiJjbDdycmxjNXIwaTJ1M3BudXB2ZTZoZm1tIn0.v-NAvl8Ba0yPtAtxOt9iTg';

    // Wait for county coordinates and weather data to be fetched before initializing the map
    try {
        await countyCordsGrab();    // Fetch and set county coordinates (latitude and longitude)
        await countyWeatherGrab();  // Fetch weather data (warnings, etc.)

        // Check if we have valid coordinates before initializing the map
        if (longitude && latitude && !isNaN(longitude) && !isNaN(latitude)) {
            mapDraw();  // Initialize the map now that coordinates are available
        } else {
            console.error('Invalid coordinates for map center:', { latitude, longitude });
        }
    } catch (error) {
        console.error("Error during map initialization:", error);
    }

    // Fetch county coordinates
    async function countyCordsGrab() {
        try {
            const response = await fetch(`https://api.weather.gov/zones/county/${countyCode}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const countyData = await response.json();
            countyCords = countyData.geometry.coordinates;

            if (!countyCords || countyCords.length === 0) throw new Error("Invalid county coordinates.");

            // Calculate the centroid for centering the map
            centcord = findCentroid(countyCords);
            let [lon, lat] = centcord;
            longitude = parseFloat(lon);
            latitude = parseFloat(lat);

            console.log(`Coordinates for map center: Latitude (${latitude}), Longitude (${longitude})`);
        } catch (error) {
            console.error('Error fetching county coordinates:', error.message);
        }
    }

    // Fetch weather data
    async function countyWeatherGrab() {
        try {
            const response = await fetch(`https://api.weather.gov/alerts/active?zone=${countyCode}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const countyWeatherData = await response.json();
            weatherData = countyWeatherData;
            processWeatherData(weatherData);  // Process weather data
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
        }
    }

    function processWeatherData(weatherData) {
        if (weatherData.features?.length) {
            weatherData.features.forEach(item => {
                if (item.properties.event.includes("Warning")) {
                    alertStatus = "Warning";
                    warningData.push(item);
                    warnings.push(item.properties.headline);
                } else if (item.properties.event.includes("Watch")) {
                    if (alertStatus === "off") {
                        alertStatus = "Watch";
                    }
                    watch.push(item.properties.headline);
                }
            });
        } else {
            alertStatus = "off";
            console.log("No warnings.");
        }
    }

    // Draw the map with the fetched coordinates
    function mapDraw() {
        // Initialize the map with the fetched longitude and latitude
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/standard',
            center: [longitude, latitude],  // Set map center using fetched coordinates
            zoom: 10
        });

        map.addControl(new mapboxgl.FullscreenControl());

        // Add markers or routes from `activeData`
        addMarkers(activeData);

        // Add weather-related layers if applicable
        if (alertStatus !== "off") {
            addWeatherLayer();
        }

        // Handle loading of polygon layers or routes based on county boundaries
        addCountyBoundaryLayer();
    }

    // Add markers based on `activeData`
    function addMarkers(data) {
        const icons = {
            'Fire': 'https://ensloadout.911emergensee.com/ens-packages/icopacks/0/fire.png',
            'Law': 'https://ensloadout.911emergensee.com/ens-packages/icopacks/0/police.png',
            'EMS': 'https://ensloadout.911emergensee.com/ens-packages/icopacks/0/ems.png',
            'Road Closure': 'https://ensloadout.911emergensee.com/ens-packages/icopacks/0/roadclosure.png'
        };

        data.forEach(point => {
            const iconType = point.agency_type;
            const iconUrl = icons[iconType] || icons['Road Closure'];

            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.backgroundImage = `url(${iconUrl})`;
            el.style.width = '29px';
            el.style.height = '37px';
            el.style.backgroundSize = 'cover';

            new mapboxgl.Marker(el)
                .setLngLat([point.longitude, point.latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${point.battalion}</h3><p>${point.type}</p>`))
                .addTo(map);
        });
    }

    // Add a layer for county boundaries
    function addCountyBoundaryLayer() {
        map.on('load', function () {
            if (countyCords.length > 0) {
                countyCords.forEach((coords, i) => {
                    const geojsonData = {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': [coords]
                        }
                    };

                    map.addLayer({
                        'id': `county-boundary-${i}`,
                        'type': 'line',
                        'source': {
                            'type': 'geojson',
                            'data': geojsonData
                        },
                        'layout': {},
                        'paint': {
                            'line-color': '#FF0000',
                            'line-width': 2
                        }
                    });
                });
            }
        });
    }

    // Add weather layer if needed (e.g., warnings)
    function addWeatherLayer() {
        map.on('load', function() {
            map.addLayer({
                "id": "weather-layer",
                "type": "raster",
                "source": {
                    "type": "raster",
                    "tiles": ["https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=bfa689a00c0a5864039c9e7396f1e745"],
                    "tileSize": 256
                },
                "layout": {
                    "visibility": "visible"
                }
            });
        });
    }

    // Function to calculate the centroid of coordinates
    function findCentroid(coordsArray) {
        let latSum = 0;
        let lonSum = 0;
        let count = 0;

        coordsArray.forEach(coordBlock => {
            coordBlock.forEach(coords => {
                coords.forEach(coord => {
                    latSum += coord[0];
                    lonSum += coord[1];
                    count++;
                });
            });
        });

        return [latSum / count, lonSum / count];
    }
}
