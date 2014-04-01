$(document).ready(function(){
  $.zoom=5;
  $.limit=1;
  $.infoWindows = [];
  $('#search').on('input', function(){
    emptyRegion();
    $.limit=1;
    getCenterIds(this.value,$.limit);
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
    $.zoom=5;
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
    $.zoom=5;
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
    $.zoom=5;
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
    $.get('/getCenters1').success( function(results) {
      for(key in results.cObject) {
        if(results.cObject[key].id.match(id)){
          found.push(results.cObject[key]);
          oFound[key]=results.cObject[key];
        } else {
        }
      }
      drawTable(found,page);
      drawCents(oFound,found,page);
    });
  }

  function getRegion(region){
    console.log(region);
    var found=[],
        oFound={},
        offices = {};
    $.get('/getCenters1').success( function(results) {
      for(key in results.cObject) {
        if(results.cObject[key].region.match(region)){
          if(!offices[results.cObject[key].office]){
            offices[results.cObject[key].office]=results.cObject[key].officeName;
          }
          found.push(results.cObject[key]);
          oFound[key]=results.cObject[key];
        } else {
        }
      }
      drawOffices(offices);
      drawTable(found,$.limit);
      drawCents(oFound,found,$.limit);
    });
  }
  function getOffice(office){
    console.log(office);
    var found=[],
        oFound={},
         subCons= {};
    $.get('/getCenters1').success( function(results) {
      for(key in results.cObject) {
        if(results.cObject[key].office.match(office)&&results.cObject[key].region.match($('#region').val())){
          if(!subCons[results.cObject[key].subconsId]){
            subCons[results.cObject[key].subconsId]=results.cObject[key].subconsName;
          }
          found.push(results.cObject[key]);
          oFound[key]=results.cObject[key];
        } else {
        }
      }
      drawSubCons(subCons);
      drawTable(found,$.limit);
      drawCents(oFound,found,$.limit);
    });
  }
  function getSubCons(sub){
    var found=[],
        oFound={},
        mahallat= {};
    $.get('/getCenters1').success( function(results) {
      for(key in results.cObject) {
        if(results.cObject[key].office.match($('#offices').val()) && results.cObject[key].subconsId.match(sub) && results.cObject[key].region.match($('#region').val())){
          if(!mahallat[results.cObject[key].mahalla]){
            mahallat[results.cObject[key].mahalla]=results.cObject[key].mahalla;
          }
          found.push(results.cObject[key]);
          oFound[key]=results.cObject[key];
        }
      }
      emptyMahallt();
      drawSelect('#mahallat',mahallat);
      drawTable(found,$.limit);
      drawCents(oFound,found,$.limit);
    });
  }
  function getMahalla(mahalla){
    var found=[],
        oFound={},
        villages= {};
    $.get('/getCenters1').success( function(results) {
      for(key in results.cObject) {
        if(results.cObject[key].mahalla.match(mahalla) && results.cObject[key].office.match($('#offices').val()) && results.cObject[key].subconsId.match($('#subcons').val()) && results.cObject[key].region.match($('#region').val())){
          if(!villages[results.cObject[key].village]){
            villages[results.cObject[key].village]=results.cObject[key].village;
          }
          found.push(results.cObject[key]);
          oFound[key]=results.cObject[key];
        }
      }
      emptyVillage();
      drawSelect('#village',villages);
      drawTable(found,$.limit);
      drawCents(oFound,found,$.limit);
    });
  }
  function getVillage(village){
    var found=[],
        oFound={};
    $.get('/getCenters1').success( function(results) {
      for(key in results.cObject) {
        if(results.cObject[key].village.match(village) &&results.cObject[key].mahalla.match($('#mahallat').val) && results.cObject[key].office.match($('#offices').val()) && results.cObject[key].subconsId.match($('#subcons').val()) && results.cObject[key].region.match($('#region').val())){
          found.push(results.cObject[key]);
          oFound[key]=results.cObject[key];
        }
      }
      drawTable(found,$.limit);
      drawCents(oFound,found,$.limit);
    });
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
    $.get('/getCenters1').success( function(results) {
      $.limit = 1;
      console.log("got here");
      drawTable(results.cList,$.limit);
      drawCents(results.cObject,results.cList,$.limit);
    });
  }
  function drawCents(centers,centersList,page){
    var map,
    flag6=true;
    //drawTable(centersList,page);
    Object.keys(centers).forEach(function(key) {
      //centers.append('<tr><td>'+results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].id+'</td><td>'+results.subcons[constitId].mahallat[mahalla].villages[village].centers[key].name+'</td></tr>');
      if(flag6){
        var myOptions = {
            zoom: $.zoom,
            center: new google.maps.LatLng(28.544672,17.554362),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
        flag6=false;
      }
      var latlng = new google.maps.LatLng(parseFloat(centers[key].longtit), parseFloat(centers[key].langtit));
      var marker = new google.maps.Marker({map: map, position: latlng, clickable: true,title : centers[key].name });
      marker.info = new google.maps.InfoWindow({
        content: '<b>'+centers[key].name+'</b><br><b>'+centers[key].id+'</b>'
      });
      $.infoWindows.push(marker.info);
      google.maps.event.addListener(marker, 'click', function() {
        closeAllInfoWindows();
        marker.info.open(map, marker);
      });
    });
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
      cents.append('<tr><td>'+centers[i].id+'</td><td>'+centers[i].name+'</td></tr>');
    }
    if(page==1) {
      $('#prev').attr("class","disabled");
    } else {
      $('#prev').attr("class","");
    }

  }

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
    else if(!$('#search').val())
      paginateCents();
    else {
      getCenterIds($('#search').val(),$.limit);
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
      else if(!$('#search').val())
        paginateCents();
      else {
        getCenterIds($('#search').val(),$.limit);
      }
    } else{
      $('#prev').attr("class","disabled");
    }

  });

  function paginateCents(){
    $.get('/getCenters1').success( function(results) {
      drawTable(results.cList,$.limit);
    });
  }

  function closeAllInfoWindows() {
      for (var i=0;i<$.infoWindows.length;i++) {
         $.infoWindows[i].close();
      }
    }

  getCents();

});
