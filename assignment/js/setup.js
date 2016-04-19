// Leaflet map setup
var map = L.map('map', {
  center: [35.67, 139.65],
  zoom: 12
});

var basemap =
L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  minZoom: 9,
  maxZoom: 14,
  ext: 'png'
});

map.addLayer(basemap);

// my map on cartodb
var layerUrl = 'https://gradient.cartodb.com/api/v2/viz/2c433cc6-005a-11e6-8ec5-0e5db1731f59/viz.json';

var sqlClient = new cartodb.SQL({
  user: 'gradient',
});

// // states of checkboxes
// var wifiOn = true;
// var metroOn = true;
// var jrOn = true;
// var prOn = true;

// Use of CartoDB.js
cartodb.createLayer(map, layerUrl)
  .addTo(map)
  .on('done', function(layer) {
    updateInfoForTokyo(layer);

    layer.on('featureClick', function(e, latlng, pos, data) {
      console.log(e,data);
      if(data.hasOwnProperty('nl_name_2')){ // this is a town, not a station
          console.log('User clicked a town in Tokyo.');
          selectStationsInTown(layer,data.nl_name_2);
          selectWifiInTown(layer,data.nl_name_2);
          updateNumberOfStationsInTown(data.nl_name_2);
          updateNumberOfWifiInTown(data.nl_name_2);
          updatePlaceCheckbox(data.name_2);
      }
      else{
          console.log('User clicked something (a station), not a town in Tokyo. Show Tokyo\'s statistics.');
          updateInfoForTokyo(layer);
      }
    });

  }).on('error', function(err) {
      console.log(err);
  });

function updateInfoForTokyo(layer){
    selectStationsInTokyo(layer);
    selectWifiInTokyo(layer);
    updateNumberOfStationsInTokyo();
    updateNumberOfWifiInTokyo();
    updatePlaceCheckbox('Tokyo');
}

function updateNumberOfStationsInTown(townName){
    // console.log('getting number');
    sql = generateCountSql('japan_sub_jr_pr', 'jpn_adm_town', 'nl_name_2', townName);
    sqlClient.execute(sql)
      .done(function(data) {
          try{
              // 府中市 (fucho) always fails
            //   console.log('got number');
            //   console.log(data);
              var n = data.rows[0].count;
              $('#num-stations').empty();
              $('#num-stations').append('<p class="number"> '+ n +'<span class="facility-label">stations</span></p>');
          }
          catch(err){}
      })
      .error(function(errors) {
          console.log("errors:" + errors);
      });
}

function updateNumberOfStationsInTokyo(){
    sql = generateCountSql('japan_sub_jr_pr', 'jpn_adm_prefecture', 'name_1', 'Tokyo');
    console.log(sql);
    sqlClient.execute(sql)
      .done(function(data) {
          try{
              console.log(data);
              var n = data.rows[0].count;
              $('#num-stations').empty();
              $('#num-stations').append('<p class="number"> '+ n +'<span class="facility-label">stations</span></p>');
          }
          catch(err){}
      })
      .error(function(errors) {
          console.log("errors:" + errors);
      });
}

function updatePlaceCheckbox(name){
    $('#place').empty();
    $('#place').append(
    '<label class="btn btn-success active"> <input id="chk-' + name + '" type="checkbox" checked autocomplete="off">'+
     name + '</label>');
}

function updateNumberOfWifiInTokyo(){
    sql = generateCountSql('jta_free_wifi', 'jpn_adm_prefecture', 'name_1', 'Tokyo');
    sqlClient.execute(sql)
      .done(function(data) {
          try{
              var n = data.rows[0].count;
              $('#num-wifi').empty();
              $('#num-wifi').append('<p class="number"> '+ n +'<span class="facility-label">free wifi spots</span></p>');
          }
          catch(err){}
      })
      .error(function(errors) {
          console.log("errors:" + errors);
      });
}

function updateNumberOfWifiInTown(townName){
    sql = generateCountSql('jta_free_wifi', 'jpn_adm_town', 'nl_name_2', townName);
    sqlClient.execute(sql)
      .done(function(data) {
          try{
              var n = data.rows[0].count;
              $('#num-wifi').empty();
              $('#num-wifi').append('<p class="number"> '+ n +'<span class="facility-label">free wifi spots</span></p>');
          }
          catch(err){}
      })
      .error(function(errors) {
          console.log("errors:" + errors);
      });
}

// test
$(':checkbox').change(function(){
    console.log('changed');
    // var checkbox = $(this);
    // wifiOn = document.getElementById("chk-wifi").checked;
    // metroOn = document.getElementById("chk-metro").checked;
    //
});
