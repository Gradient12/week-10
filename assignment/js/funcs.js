function selectStationsInTown(layer,townName){
    var sub_metro = layer.getSubLayer(3);
    var sub_jr = layer.getSubLayer(2);
    var sub_pr_tram = layer.getSubLayer(1);
    var sub_tokyo = layer.getSubLayer(0);
    console.log(townName);
    // sub_metro.set({'sql': 'SELECT * FROM mlit_metro_sta WHERE ST_contains((SELECT the_geom FROM jpn_adm_town where "nl_name_2" = '+ townName +'),public."mlit_metro_sta".the_geom)'});
}

function removeCartoDBSubLayer(layer){

}
