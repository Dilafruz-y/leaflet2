
// Define function to create the circle radius based on the magnitude
function radiusSize(feature) {
  return feature.properties.mag * 2;

}

// Define function to set the circle color based on the magnitude

function quakedepth(d) {
  if (d <= 10) {
    return "#ccff33"
  }
  else if (d > 10 && d <= 30)  {
    return "#ffff33"
  }
  else if (d > 30 && d <= 50) {
    return "#ffcc33"
  }
  else if (d > 50 && d <= 70) {
    return "#ff9933"
  }
  else if (d > 70 && d <= 90) {
    return "#ff6633"
  }
  else {
    return "#ff3333"
  }
};

function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
};

function getCircleMarkers(feature, latlng) {

  var options = {
    radius: radiusSize(feature),
    fillcolor: quakedepth(feature.geometry.coordinates[2]),
    color: "black",
    weight: 1,
    opacity: 1,
    fillopacity: 0.8
  }
  return L.circleMarker(latlng, options);
};

function createFeatures(earthquakeData, platesData) {



  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  var earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: getCircleMarkers,
    onEachFeature: onEachFeature
  });
  
  var platesLines = L.geoJson(platesData, {
    style: {
      color: "#FFA500",
      opacity: 0.8,
      fillcolor: "#333333",
      fillopacity: 0
    }
  });

  createMap(earthquakes, platesLines);
  
  
  
  

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
 
 
  
}


function createMap(earthquakes, platesLines) {
  // Define outdoormap, satellitemap, and grayscalemap layers
  
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });
    // Light Scale
    var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });
    // Outdoors Layer
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });
  // Create the faultline layer
  
  
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Outdoor Map": outdoorsmap,
    "Greyscale Map": grayscalemap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plate" : platesLines
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [satellitemap, earthquakes, platesLines]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

 
  

  // Add legend to the map
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mags = [-10, 10, 30, 50, 70, 90],
          labels = ['<strong>Depth</strong>'];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              labels.push('<i style="background:' + quakedepth(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+'));
      }
      div.innerHTML = labels.join('<br>');
  
      return div;
  };
  
  legend.addTo(myMap);
}

 // Plates date
 platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
 quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

 // Request earthduake data
 d3.json(quakesURL, function(earthquakeData) {
   console.log(earthquakeData);

  d3.json(platesURL, function(platesData) {
    console.log(platesData);
    createFeatures(earthquakeData.features, platesData.features);
  });
 });
 


