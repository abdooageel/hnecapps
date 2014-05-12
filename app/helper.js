var blocked = [37,47,52];

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
      if (constituancy[present[key].constituancy_id] == undefined){
        constituancy[present[key].constituancy_id]={};
        constituancy[present[key].constituancy_id].id=present[key].constituancy_id;
        constituancy[present[key].constituancy_id].name= present[key].constityancy_name;
        constituancy[present[key].constituancy_id].name_en= present[key].constituency_name_en;
        constituancy[present[key].constituancy_id].vote_area=present[key].vote_area;
        constituancy[present[key].constituancy_id].subs = [];
        obj = makeObj(present,key);
        constituancy[present[key].constituancy_id].subs.push(obj);
      } else {
        obj = makeObj(present,key);
        constituancy[present[key].constituancy_id].subs.push(obj);
      }
    }
  }
  return constituancy;
  
}
function makeObj(present,key){
  var obj = {
    constit_id : present[key].constituancy_id,
    constit_name : present[key].constityancy_name,
    constit_name_en : present[key].constituency_name_en,
    office_id:present[key].office_id,
    office_name:present[key].office,
    race_number:present[key].race_number,
    race_type:present[key].type,
    race_type_ar:present[key].ballot_type,
    subconst_name:present[key].subconst_name,
    subsubconst_name:present[key].subsubconst_name,
    ballot_type:present[key].ballot_type,
    seats:present[key].seats,
    candidate_count:present[key].candidate_count,
    entered_stations:present[key].entered_stations,
    total_stations:present[key].total_stations,
    percentage:present[key].percentage,
    vote_area:present[key].vote_area
  }
  return obj;
}

function include(arr,obj) {
  return (arr.indexOf(obj) != -1);
}