$(document).ready(function(){
  $.zoom=5;
  $.limit=1;
  $.res=null;
  $.infoWindows = [];
  $('#search').on('input', function(){
    emptySearchNames();
    emptyRegion();
    $.limit=1;
    getCenterIds(this.value,$.limit);
  });
  $('#searchNames').on('input', function(){
    emptyRegion();
    emptySearch();
    $.limit=1;
    searchNames(this.value,$.limit);
  });
  $('#region').on('change', function() {
    emptySearch();
    $.zoom=5;
    $.limit=1;
    if(this.value == "all"){
      emptyAll();
      getCents();
    } else {
      getRegion(this.value);
    }
  });
  $('#offices').on('change', function() {
    emptySearch();
    $.zoom=5;
    $.limit=1;
    if(this.value=="all"){
      emptySubCons();
      getRegion($('#region').val());
    } else {
      getOffice(this.value);
    }
  });
  $('#subcons').on('change', function() {
    emptySearch();
    $.zoom=6;
    $.limit=1;
    if(this.value=="all"){
      emptyMahallt();
      getOffice($('#offices').val());
    } else {
      getSubCons(this.value);
    }
  });

  $('#mahallat').on('change', function() {
    emptySearch();
    $.zoom=7;
    $.limit=1;
    if(this.value=="all"){
      emptyVillage();
      getSubCons($('#subcons').val());
    } else {
      getMahalla(this.value);
    }
  });
  $('#village').on('change', function() {
    emptySearch();
    $.zoom=8;
    $.limit=1;
    if(this.value=="all"){
      $('#centers').empty();
      getMahalla($('#mahallat').val());
    } else {
      getVillage(this.value);
    }
  }); 
  function emptySearch(){
    $('#search').val('');
  }
  function emptySearchNames(){
    $('#searchNames').val('');
  }
  function emptyRegion(){
    $("#region").val('all');
    emptyAll();
  }
  function emptyAll(){
    var offices = $("#offices");
    offices.empty();
    offices.append($("<option/>").val('all').text('الكل'));
    emptySubCons();
  }
  function emptySubCons(){
    var subcons=$("#subcons");
    subcons.empty();
    subcons.append($("<option/>").val('all').text('الكل'));
    emptyMahallt();
    emptyVillage();
  }

  function emptyMahallt(){
    var mahallat=$("#mahallat");
    mahallat.empty();
    mahallat.append($("<option/>").val('all').text('الكل'));
    emptyVillage();
  }

  function emptyVillage(){
    var village=$("#village");
    village.empty();
    village.append($("<option/>").val('all').text('الكل'));
    $('#centers').empty();
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


//////////////////////////
  function getCenterIds(id,page){
    var found=[],
        oFound={};
    for(key in $.res.cObject) {
      if($.res.cObject[key].id.match(id)){
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      } else {
      }
    }
    drawTable(found,page);
    //drawCents(oFound,found,page);
    
  }
  ///////////////////////////
  function searchNames(id,page){
    var found=[],
        oFound={};
    for(key in $.res.cObject) {
      if($.res.cObject[key].name.match(id)){
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      } else {
      }
    }
    drawTable(found,page);
    //drawCents(oFound,found,page);
  }
  /////////////////////////////
  function getRegion(region){
    console.log(region);
    var found=[],
        oFound={},
        offices = {};
    for(key in $.res.cObject) {
      if($.res.cObject[key].region.match(region)){
        if(!offices[$.res.cObject[key].office]){
          offices[$.res.cObject[key].office]=$.res.cObject[key].officeName;
        }
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      } else {
      }
    }
    drawOffices(offices);
    drawTable(found,$.limit);
    //drawCents(oFound,found,$.limit);

  }
  function getOffice(office){
    console.log(office);
    var found=[],
        oFound={},
         subCons= {};
    for(key in $.res.cObject) {
      if($.res.cObject[key].office.match(office)&& $.res.cObject[key].region.match($('#region').val())){
        if(!subCons[$.res.cObject[key].subconsId]){
          subCons[$.res.cObject[key].subconsId]=$.res.cObject[key].subconsName;
        }
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      } else {
      }
    }
    drawSubCons(subCons);
    drawTable(found,$.limit);
    //drawCents(oFound,found,$.limit);

  }
  function getSubCons(sub){
    var found=[],
        oFound={},
        mahallat= {};
    for(key in $.res.cObject) {
      if($.res.cObject[key].office.match($('#offices').val()) && $.res.cObject[key].subconsId.match(sub) && $.res.cObject[key].region.match($('#region').val())){
        if(!mahallat[$.res.cObject[key].mahalla]){
          mahallat[$.res.cObject[key].mahalla]=$.res.cObject[key].mahalla;
        }
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      }
    }
    emptyMahallt();
    drawSelect('#mahallat',mahallat);
    drawTable(found,$.limit);
    //drawCents(oFound,found,$.limit);
    
  }
  function getMahalla(mahalla){
    var found=[],
        oFound={},
        villages= {};
    for(key in $.res.cObject) {
      if($.res.cObject[key].mahalla.match(mahalla) && $.res.cObject[key].office.match($('#offices').val()) && $.res.cObject[key].subconsId.match($('#subcons').val()) && $.res.cObject[key].region.match($('#region').val())){
        if(!villages[$.res.cObject[key].village]){
          villages[$.res.cObject[key].village]=$.res.cObject[key].village;
        }
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      }
    }
    emptyVillage();
    drawSelect('#village',villages);
    drawTable(found,$.limit);
  //  drawCents(oFound,found,$.limit);
  }
  function getVillage(village){
    var found=[],
        oFound={};
    for(key in $.res.cObject) {
      if($.res.cObject[key].village.match(village) &&$.res.cObject[key].mahalla.match($('#mahallat').val) && $.res.cObject[key].office.match($('#offices').val()) && $.res.cObject[key].subconsId.match($('#subcons').val()) && $.res.cObject[key].region.match($('#region').val())){
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      }
    }
    drawTable(found,$.limit);

  }




  function drawSelect(name,object){
    Object.keys(object).forEach(function(key) {
      $(name).append($("<option />").val(key).text(object[key]));
    }); 
  }

  function drawSubCons(subCons){
    emptySubCons();
    Object.keys(subCons).forEach(function(key) {
      $('#subcons').append($("<option />").val(key).text(subCons[key]));
    });  
  }
  function drawOffices(offices){
    emptyAll();
    Object.keys(offices).forEach(function(key) {
      $('#offices').append($("<option />").val(key).text(offices[key]));
    });  
  }
  function getCents(){
    $.ajax({
      url: "/getCenters1",
      async: false,
      dataType: 'json',
      success: function(results) {
        $.limit = 1;
        $.res = results;
        drawTable(results.cList,$.limit);
      }
    });
  }
  function drawCents(centers,centersList,page){
    var map,
    flag6=true;
    var bounds = new google.maps.LatLngBounds();
    Object.keys(centers).forEach(function(key) {
      if(flag6){
        var myOptions = {
            zoom: $.zoom,
            //center: new google.maps.LatLng(28.544672,17.554362),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
        flag6=false;
      }
      var latlng = new google.maps.LatLng(parseFloat(centers[key].longtit), parseFloat(centers[key].langtit));
      var marker = new google.maps.Marker({map: map, position: latlng, clickable: true,title : centers[key].name });
      bounds.extend(marker.position);
      marker.info = new google.maps.InfoWindow({
        content: '<b>'+centers[key].name+'</b><br><b>'+centers[key].id+'</b>'
      });

      $.infoWindows.push(marker.info);
      google.maps.event.addListener(marker, 'click', function() {
        closeAllInfoWindows();
        marker.info.open(map, marker);
      });
    });
    map.fitBounds(bounds);
  }

  function drawTable(centers,page){
    var limit = page*10,
        i = (page -1)*10,
        cents= $('#centers');
    cents.empty();
    if(limit > centers.length){
      limit = centers.length;
      $('#next').attr("class","disabled");
    } else {
      $('#next').attr("class","");
    }
    for(i ; i<limit;i++){
      cents.append('<tr  data-lng='+centers[i].longtit+' data-lat='+centers[i].langtit+
                   ' data-id='+centers[i].id+' data-name='+centers[i].name+'><td>'+
                   centers[i].id+'</td><td>'+centers[i].name+'</td><td>'+centers[i].mahalla+
                   '</td><td>'+centers[i].village+'</td><td>'+centers[i].subconsName+
                   '</td><td>'+centers[i].officeName+'</td></tr>');
    }
    if(page==1) {
      $('#prev').attr("class","disabled");
    } else {
      $('#prev').attr("class","");
    }

  }
  
  $('body').on('click', '#centerstable tbody tr', function () {
    var lng = $(this).data("lng"),
        lat = $(this).data("lat"),
        id = $(this).data("id"),
        name = $(this).data("name");
    var myOptions = {
            zoom: 8,
            center: new google.maps.LatLng(lng,lat),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
    var latlng = new google.maps.LatLng(parseFloat(lng), parseFloat(lat));
      var marker = new google.maps.Marker({map: map, position: latlng, clickable: true,title : name });
      marker.info = new google.maps.InfoWindow({
        content: '<b>'+name+'</b><br><b>'+id+'</b>'
      });
      $.infoWindows.push(marker.info);
      google.maps.event.addListener(marker, 'click', function() {
        closeAllInfoWindows();
        marker.info.open(map, marker);
      });
  });
  
  $('#nextlink').on('click', function() {
    $.limit+=1;
    if($('#region').val()!="all"){
      if($('#offices').val()!="all"){
        if($('#subcons').val()!="all"){
          if($('#mahallat').val()!="all"){
            if($('#village').val()!="all"){
              getVillage($('#village').val());
            } else {
              getMahalla($('#mahallat').val());
            }
          } else {
            getSubCons($('#subcons').val());
          }
        } else {
          getOffice($('#offices').val());
        }
      } else {
        getRegion($('#region').val());
      }
    }
    else if(!$('#search').val() && !$('#searchNames').val())
      paginateCents();
    else {
      if(!$('#searchNames').val()){
        getCenterIds($('#search').val(),$.limit);
      } else {
        searchNames($('#searchNames').val(),$.limit);
      }
      
    }

  });

  $('#prevlink').on('click', function() {
    if($.limit > 1){
      $.limit-=1;
      if($('#region').val()!="all"){
        if($('#offices').val()!="all"){
          if($('#subcons').val()!="all"){
            if($('#mahallat').val()!="all"){
              if($('#village').val()!="all"){
                getVillage($('#village').val());
              } else {
                getMahalla($('#mahallat').val());
              }
            } else {
              getSubCons($('#subcons').val());
            }
          } else {
            getOffice($('#offices').val());
          }
        } else {
          getRegion($('#region').val());
        }
      }
      else if(!$('#search').val() && !$('#searchNames').val())
        paginateCents();
      else {
        if(!$('#searchNames').val()){
          getCenterIds($('#search').val(),$.limit);
        } else {
          searchNames($('#searchNames').val(),$.limit);
        }
      }
    } else{
      $('#prev').attr("class","disabled");
    }

  });

  function paginateCents(){
    drawTable($.res.cList,$.limit);
  }

  function closeAllInfoWindows() {
      for (var i=0;i<$.infoWindows.length;i++) {
         $.infoWindows[i].close();
      }
    }

  getCents();

});
