$(document).ready(function(){
  var infoWindows = [];
  $('#region').on('change', function() {
    getCenters(this.value);
  });
  $('#offices').on('change', function() {
    getSubCons(this.value);
  });
  $('#subcons').on('change', function() {
    getMahallat(this.value);
  });

  $('#mahallat').on('change', function() {
    getVillages(this.value);
  });
  $('#village').on('change', function() {
    getCenters1(this.value);
  }); 

  function getCenters(id){
    var flag = true,
        flag2 = true,
        subcons=null,
        constitId=null,
        mahalla=null;
    $.get('/getCenters/'+id).success( function(results) {
      console.log(results);
      //setCenters(results);
      var options = $("#offices");
      options.empty();
      Object.keys(results.offices).forEach(function(key) {
        options.append($("<option />").val(results.offices[key].id).text(results.offices[key].name));
        if(flag){
          subcons = key;
          flag= false;
        }
      });
      drawSubs(results.offices[subcons]);
    });
  }
  function drawSubs(results) {
    var subconstits=$('#subcons'),
        flag2=true;
    subconstits.empty();
    Object.keys(results.subcons).forEach(function(key) {
      subconstits.append($("<option />").val(results.subcons[key].id).text(results.subcons[key].name));
      if(flag2){
        constitId = key;
        flag2= false;
      }
    });
    console.log(constitId);
    drawMahallat(results,constitId);
  }
  function drawMahallat(results,constitId){
    var mahallat=$('#mahallat'),
        flag3=true;
    mahallat.empty();
    Object.keys(results.subcons[constitId].mahallat).forEach(function(key) {
      mahallat.append($("<option />").val(results.subcons[constitId].mahallat[key].name).text(results.subcons[constitId].mahallat[key].name));
      if(flag3){
        mahalla = key;
        flag3= false;
      }
    });
    drawVillages(results,constitId,mahalla);
  }
  function drawVillages(results,constitId,mahalla){
    var flag4=true,
        villageId,
        village=$('#village');
    village.empty();
    Object.keys(results.subcons[constitId].mahallat[mahalla].villages).forEach(function(key) {
      village.append($("<option />").val(results.subcons[constitId].mahallat[mahalla].villages[key].name).text(results.subcons[constitId].mahallat[mahalla].villages[key].name));
      if(flag4){
        villageId = key;
        flag4= false;
      }
    });
    drawCenters(results,constitId,mahalla,villageId);
  }

  function drawCenters(results,constitId,mahalla,village){
    var centers = $('#centers'),
        map,
        flag5=true;
    centers.empty();
    Object.keys(results.subcons[constitId].mahallat[mahalla].villages[village].centers).forEach(function(key) {
      centers.append('<tr><td>'+results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].id+'</td><td>'+results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].name+'</td></tr>');
      if(flag5){
        var myOptions = {
            zoom: 10,
            center: new google.maps.LatLng(results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].longtit, results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].langtit),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
        flag5=false;
      }
      var latlng = new google.maps.LatLng(parseFloat(results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].longtit), parseFloat(results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].langtit));
      var marker = new google.maps.Marker({
          position: latlng,
          map: map,
          title : results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].name
      });
      var infowindow = new google.maps.InfoWindow();
      infowindow.setContent('<b>'+results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].name+'</b>');
      infoWindows.push(infowindow);
      google.maps.event.addListener(marker, 'click', function() {
        closeAllInfoWindows();
        infowindow.open(map, marker);
      });
    });
  }

  function closeAllInfoWindows() {
    for (var i=0;i<infoWindows.length;i++) {
       infoWindows[i].close();
    }
  }
  function getSubCons(sub){
    var region = $('#region').val();
    $.get('/getSubCons/'+region+'/'+sub).success( function(results) {
      drawSubs(results);
    });

  }
  function getMahallat(constitId){
    var region = $('#region').val(),
        office = $('#offices').val();
    $.get('/getSubCons/'+region+'/'+office).success( function(results) {
      drawMahallat(results,constitId);
    });
  }

  function getVillages(mahallaId){
    var region = $('#region').val(),
        office = $('#offices').val(),
        constitId = $('#subcons').val();
    $.get('/getSubCons/'+region+'/'+office).success( function(results) {
      drawVillages(results,constitId,mahallaId);
    });
  }

  function getCenters1(VillageId){
    var region = $('#region').val(),
        office = $('#offices').val(),
        constitId = $('#subcons').val();
        mahallaId = $('#mahallat').val();
    $.get('/getSubCons/'+region+'/'+office).success( function(results) {
      drawCenters(results,constitId,mahallaId,VillageId);
    });
  }


  getCenters($('#region').val());

});