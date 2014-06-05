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
      emptyBallots();
      getRegion($('#region').val());
    } else {
      getMainDists(this.value);
    }
  });
  $('#ballots').on('change', function() {
    emptySearch();
    $.zoom=6;
    $.limit=1;
    if(this.value=="all"){
      getMainDists($('#mainDists').val());
    } else {
      getBallots(this.value);
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
    var mainDists = $("#mainDists");
    mainDists.empty();
    mainDists.append($("<option/>").val('all').text('الكل'));
    emptyBallots();
  }
  function emptyBallots(){
    var ballots=$("#ballots");
    ballots.empty();
    ballots.append($("<option/>").val('all').text('الكل'));
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
         ballots= {};
    for(key in $.res.cObject) {
      if($.res.cObject[key].mainDist.match(mainDist)&& $.res.cObject[key].region.match($('#region').val())){
        if(!ballots[$.res.cObject[key].ballot]){
          ballots[$.res.cObject[key].ballot]=$.res.cObject[key].ballot+"-"+$.res.cObject[key].ballotNameAr+"-"+$.res.cObject[key].type;
        }
        found.push($.res.cObject[key]);
        oFound[key]=$.res.cObject[key];
      } else {
      }
    }
    drawBallots(ballots);
    drawTable(found,$.limit);
    //drawCents(oFound,found,$.limit);

  }
  function getBallots(ballot){
    var found=[],
        oFound={}
        console.log($.res.cObject);
    for(key in $.res.cObject) {
      if($.res.cObject[key].ballot.match(ballot)){
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

  function drawBallots(ballots){
    emptyBallots();
    Object.keys(ballots).forEach(function(key) {
      $('#ballots').append($("<option />").val(key).text(ballots[key]));
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
    var limit = page*20,
        i = (page -1)*20,
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
                   candidates[i].ballotNameAr+'</td><td>'+candidates[i].type+'</td><td><a href="/candidate/'+candidates[i].id+'"><span class="glyphicon glyphicon-search"></span></a></td></tr>');
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
        if($('#ballots').val()!="all"){
          getBallots($('#ballots').val());
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
        if($('#mainDists').val()!="all"){
          if($('#ballots').val()!="all"){
            getBallots($('#ballots').val());
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
