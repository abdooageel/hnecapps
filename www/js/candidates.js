$(document).ready(function(){
  $.zoom=5;
  $.limit=1;
  $.res=null;
  $.infoWindows = [];
  $('#search').on('input', function(){
    emptySearchNames();
    emptyRegion();
    $.limit=1;
    getCandidateIds(this.value,$.limit);
  });
  $('#searchNames').on('input', function(){
    emptyRegion();
    emptySearch();
    $.limit=1;
    searchNames(this.value,$.limit);
  });
  $('#searchMahalla').on('input', function(){
    emptyRegion();
    emptySearch();
    emptySearchNames();
    $.limit=1;
  });

  $('#region').on('change', function() {
    emptySearch();
    $.zoom=5;
    $.limit=1;
    if(this.value == "all"){
      emptyAll();
      getCandidates();
    } else {
      getRegion(this.value);
    }
  });
  $('#mainDists').on('change', function() {
    emptySearch();
    $.zoom=5;
    $.limit=1;
    if(this.value=="all"){
      emptySubCons();
      getRegion($('#region').val());
    } else {
      getMainDists(this.value);
    }
  });
  $('#subcons').on('change', function() {
    emptySearch();
    $.zoom=6;
    $.limit=1;
    if(this.value=="all"){
      getMainDists($('#mainDists').val());
    } else {
      getSubCons(this.value);
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
    var offices = $("#mainDists");
    offices.empty();
    offices.append($("<option/>").val('all').text('الكل'));
    emptySubCons();
  }
  function emptySubCons(){
    var subcons=$("#subcons");
    subcons.empty();
    subcons.append($("<option/>").val('all').text('الكل'));
  }




//////////////////////////
  function getCandidateIds(id,page){
    var found=[],
        oFound={};
    for(key in $.res.cObject) {
      if($.res.cObject[key].id.match(id)){
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      }
    }
    drawTable(found,page);
    //drawCents(oFound,found,page);
    
  }
  ///////////////////////////
  function searchNames(id,page){
    var found=[],
        oFound={},
        name = "";
    id = id.replace(/\s/g, '');
    for(key in $.res.cObject) {
      name = $.res.cObject[key].name.replace(/\s/g, '');
      if(name.match(id)){
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      }
    }
    drawTable(found,page);
  }
   /////////////////////////////
  function getRegion(region){
    var found=[],
        oFound={},
        mainDists = {};

    for(key in $.res.cObject) {
      if($.res.cObject[key].region.match(region)){
        if(!mainDists[$.res.cObject[key].mainDist]){
          mainDists[$.res.cObject[key].mainDist]=$.res.cObject[key].mainDistAr;
        }
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      } else {
      }
    }
    drawMainDists(mainDists);
    drawTable(found,$.limit);
    //drawCents(oFound,found,$.limit);

  }
  function getMainDists(mainDist){
    var found=[],
        oFound={},
         subCons= {};
    for(key in $.res.cObject) {
      if($.res.cObject[key].mainDist.match(mainDist)&& $.res.cObject[key].region.match($('#region').val())){
        if(!subCons[$.res.cObject[key].subconsId]){
          subCons[$.res.cObject[key].subconsId]=$.res.cObject[key].subconsNameAr;
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
    drawTable(found,$.limit);
    //drawCents(oFound,found,$.limit);
    
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
  function drawMainDists(mainDists){
    emptyAll();
    Object.keys(mainDists).forEach(function(key) {
      $('#mainDists').append($("<option />").val(key).text(mainDists[key]));
    });  
  }
  function getCandidates(){
    $.ajax({
      url: "/getCands",
      async: false,
      dataType: 'json',
      success: function(results) {
        $.limit = 1;
        $.res = results;
        drawTable(results.cList,$.limit);
      }
    });
  }


  function drawTable(candidates,page){
    var limit = page*10,
        i = (page -1)*10,
        cands= $('#candidates');
    cands.empty();
    if(limit > candidates.length){
      limit = candidates.length;
      $('#next').attr("class","disabled");
    } else {
      $('#next').attr("class","");
    }
    for(i ; i<limit;i++){
      cands.append('<tr data-id='+candidates[i].id+' data-name='+candidates[i].name+'><td>'+candidates[i].name+'</td><td>'+
                   candidates[i].subconsNameAr+'</td><td><a href="/candidate/'+candidates[i].id+'"><span class="glyphicon glyphicon-search"></span></a></td></tr>');
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
      if($('#mainDists').val()!="all"){
        if($('#subcons').val()!="all"){
          getSubCons($('#subcons').val());
        } else {
          getMainDists($('#mainDists').val());
        }
      } else {
        getRegion($('#region').val());
      }
    }
    else if(!$('#search').val() && !$('#searchNames').val())
      paginateCents();
    else {
      if(!$('#searchNames').val()){
        getCandidateIds($('#search').val(),$.limit);
      } else{
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
            getSubCons($('#subcons').val());
          } else {
            getMainDists($('#mainDists').val());
          }
        } else {
          getRegion($('#region').val());
        }
      }
      else if(!$('#search').val() && !$('#searchNames').val())
        paginateCents();
      else {
        if(!$('#searchNames').val()){
          getCandidateIds($('#search').val(),$.limit);
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


  getCandidates();

});
