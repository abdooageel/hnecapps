//var blocked = [3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,22,23,24,25,26,27,28,29,30,31,35,39,41,44,46,69,70,71,73,74,75,77,78,79,80,81,82,85,86,87,88,91,93,97,98,102];
var blocked = [3,18,22,27,35,41,74,75,77,102];
exports.helperMgr = {
  getConstits : function(present,cb){
    var constits = getConstObj(present);
    cb(null,constits);
  },
  getBallotsids : function(constId,present,cb){
    var li = [],
        obj={},
        constits = getConstObj(present);
    for (key in constits[constId.cid].subs){
      li.push(constits[constId.cid].subs[key].race_number);
    }
    if(constId.bid){
      var newObj = {};
      for(var key = 0 ;key < constits[constId.cid].subs.length;key++){
        if(constits[constId.cid].subs[key].race_number == parseInt(constId.bid) ){
          newObj = constits[constId.cid].subs[key];
        }
      }
      constits[constId.cid].subs =[];
      constits[constId.cid].subs.push(newObj);
  }
    obj = {
      li : li,
      constit : constits[constId.cid]
    }
    cb(null,obj);
  }
}

function getConstObj(present){
  constituancy = {};
  for (key in present){
    if(!(include(blocked,present[key].race_number))){
      var obj = {};
      if (constituancy[present[key].constit_id] == undefined){
        constituancy[present[key].constit_id]={};
        constituancy[present[key].constit_id].id=present[key].constit_id;
        constituancy[present[key].constit_id].name= present[key].constit_name;
        constituancy[present[key].constit_id].name_en= present[key].constit_name_en;
        constituancy[present[key].constit_id].vote_area=present[key].region;
        constituancy[present[key].constit_id].subs = [];
        obj = makeObj(present,key);
        constituancy[present[key].constit_id].subs.push(obj);
      } else {
        obj = makeObj(present,key);
        constituancy[present[key].constit_id].subs.push(obj);
      }
    }
  }
  return constituancy;
  
}
function makeObj(present,key){
  var obj = {
    constit_id : present[key].constit_id,
    constit_name : present[key].constit_name,
    constit_name_en : present[key].constit_name_en,
    office_id:present[key].office_id,
    office_name:present[key].office,
    race_number:present[key].race_number,
    race_type:present[key].type,
    race_type_ar:present[key].ballot_type,
    subconst_name:present[key].subconst_name,
    ballot_type:present[key].ballot_type,
    seats:present[key].seats,
    candidate_count:present[key].candidate_count,
    entered_stations:present[key].entered_stations,
    total_stations:present[key].total_stations,
    percentage:present[key].percentage,
    vote_area:present[key].region
  }
  return obj;
}

function include(arr,obj) {
  return (arr.indexOf(obj) != -1);
}