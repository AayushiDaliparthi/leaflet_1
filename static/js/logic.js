// Create a Leaflet map object.
let myMap = L.map("map", {
    center: [61.217381, -149.863129], // Anchorage
    zoom: 8
  });
  
  // Add a tile layer to the map.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Function to create map with layers.
  function createMap(earthquakes) {
    // Define streetmap layer.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object to hold base layers.
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlay object to hold overlay layers.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Add layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  };
  
  // Define the endpoint for earthquake data.
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Perform a GET request to retrieve earthquake data.
  d3.json(queryUrl).then(function (data) {
    // Log the retrieved data.
    console.log(data);
    // Create features from the data.
    createFeatures(data.features);
  });
  
  // Function to define marker size based on magnitude.
  function markerSize(magnitude) {
    return magnitude * 4000;
  }
  
  // Function to define marker color based on depth.
  function markerColor(depth) {
    if (depth > 90) return "#800080"; // purple
    else if (depth > 70) return "#9932CC"; // dark orchid
    else if (depth > 50) return "#4B0082"; // indigo
    else if (depth > 30) return "#0000FF"; // blue
    else if (depth > 10) return "#00FFFF"; // cyan
    else return "#00FF00"; // lime
  }
  
  // Function to create features from earthquake data.
  function createFeatures(earthquakeData) {
    // Function to create popups for each feature.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Create a GeoJSON layer with markers for earthquakes.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
  
      pointToLayer: function(feature, latlng) {
        // Define marker style.
        var markers = {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          opacity: 1,
          fillOpacity: .8
        }
        // Create and return a circle marker.
        return L.circle(latlng, markers);
      }
    });
  
    // Send earthquakes layer to the createMap function.
    createMap(earthquakes);
  
    // Create a legend for the map.
    var legend = L.control({
      position: "bottomright"
    });
  
    // Add legend to the map.
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var grades = [-10, 10, 30, 50, 70, 90];
      var colors = [
        "#00FF00", // lime
        "#00FFFF", // cyan
        "#0000FF", // blue
        "#4B0082", // indigo
        "#9932CC", // dark orchid
        "#800080" // purple
      ];
  
      // Loop through grades to generate legend labels.
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Add legend to the map.
    legend.addTo(myMap);
  };
  