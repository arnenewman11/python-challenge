// setup API endpoint
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//pull in tile layers (dark and sat)
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYXJuZW5ld21hbiIsImEiOiJjamViam5hc3AwZHMyMnJvN3JjcXVvd2wyIn0.UUHuGx9FWPqypIzv7SLP2g");

var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYmJhbGVzMTEiLCJhIjoiY2plYmptdmFwMGRydzJybzdpdzBxazk1aiJ9.ASSE0faIpkFAu87MR5RM0g");

// create map object, with default layer as dark
var myMap = L.map("map", {
  center: [40.00, -104.00],
  zoom: 3,
  layers: [darkmap],
});

//setup layer groups that will be created by adding markers, popups, and styling for each feature lat/lng in response
var earthquakes = new L.layerGroup();
var faults = new L.layerGroup();

//Pull in api data via the url and return a JSOn response. 
d3.json(url, function(response) {
  
  //create the circle markers based on the response point (comparable to OnEachFeature) and add 
  L.geoJSON(response, {
      pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleData,
    onEachFeature: function(feature, layer) {
  // create the popup (based on class exercise)
      layer.bindPopup("<h2>" + feature.properties.place +
        "</h2> <br ><p>" + new Date(feature.properties.time) + "</p>");
    }
  }).addTo(earthquakes)
  earthquakes.addTo(myMap)

//Style radius/color/opacituy based on 
//their characteristics (magnitude). Circles created after styling
    function styleData(feature) {
  return {
    stroke: false,
    fillOpacity: .5,
    fillColor: getColor(feature.properties.mag),
    radius: circRad(feature.properties.mag)    
    };
  }

   function getColor(d) {
    return d <= 1 ? "#76f15e":
           d <= 2 ? "#ddffb2":
           d <= 3 ? "#fed976":
           d <= 4 ? "#f27a10":
           d <= 5 ? "#f03b20":
           d > 5 ? "#bd0026":
                    "#ffffff";
  }

  function circRad(r) {
    return r*8;
  }
})

boundariesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(boundariesURL, function (response) {
  
  L.geoJSON(response, {
    style: polystyle
  }).addTo(faults);
  faults.addTo(myMap)

  function polystyle(feature) {
    return {
      fillColor: 'green',
      weight: 2,
      opacity: 1,
      color: 'green', //Outline color
      fillOpacity: 0.7
    };
  }

})


// Create a legend to display information about our map
var legend = L.control({position: "bottomright"});

function getColor(d) {
    return d <= 1 ? "#76f15e":
           d <= 2 ? "#ddffb2":
           d <= 3 ? "#fed976":
           d <= 4 ? "#f27a10":
           d <= 5 ? "#f03b20":
           d > 5 ? "#bd0026":
                    "#ffffff";
}
/// add a layer control div for the legend and label the squares based on their place amoung grades
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

return div;
};

legend.addTo(myMap);


// set basemaps and overlays to allow for layer contrl
var baseMaps = {
  "Dark Map": darkmap,
  "Satellite Map": satmap
};

var overlayMaps = {
   "Earthquakes": earthquakes,
   "Plate Boundries": faults
};

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
//}
