$(document).ready(function(){
  var infoWindows = [];

  function getCents(){
      $.get('/getCenters1').success( function(results) {
        drawCents(results);
      });

  }
  function drawCents(centers){
    //var centers = $('#centers'),
        var map,
        flag6=true;
    //centers.empty();
    Object.keys(centers).forEach(function(key) {
      //centers.append('<tr><td>'+results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].id+'</td><td>'+results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].name+'</td></tr>');
      if(flag6){
        var myOptions = {
            zoom: 5,
            center: new google.maps.LatLng(28.544672,17.554362),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
        flag6=false;
      }
      var latlng = new google.maps.LatLng(parseFloat(centers[key].longtit), parseFloat(centers[key].langtit));
      var marker = new google.maps.Marker({
          position: latlng,
          map: map,
          title : centers[key].name
      });
      var infowindow = new google.maps.InfoWindow();
      infowindow.setContent('<b>'+centers[key].name+'</b><br><b>'+centers[key].id+'</b>');
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

getCents();

});