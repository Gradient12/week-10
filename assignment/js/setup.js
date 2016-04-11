// Leaflet map setup
var map = L.map('map', {
  center: [35.67, 139.77],
  zoom: 10
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 10,
  maxZoom: 10,
  ext: 'png'
}).addTo(map);



// my map on cartodb
var layerUrl = 'https://gradient.cartodb.com/api/v2/viz/8eb562d2-ff7c-11e5-ac72-0e5db1731f59/viz.json';

var tempLayer;

// Use of CartoDB.js
cartodb.createLayer(map, layerUrl)
  .addTo(map)
  .on('done', function(layer) {
    // layer is a cartodb.js Layer object - can call getSubLayer on it!
    // console.log(layer);
    layer.on('featureClick', function(e, latlng, pos, data) {
      console.log(e,data);
      if(data.hasOwnProperty('nl_name_2')){ // this is a town, not a station
          console.log('User clicked a town in Tokyo.');
          selectStationsInTown(layer,data.nl_name_2);
      }
      else{
          console.log('User clicked something, not a town in Tokyo.');
          removeCartoDBSubLayer(layer);
      }
    });
  }).on('error', function(err) {
      console.log(err);
  });
