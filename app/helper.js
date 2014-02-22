var Step = require('step');


exports.helperMgr = {
	getConstits : function(present,cb){
		var constits = getConstObj(present);
		cb(null,constits);
	},
	getBallotsids : function(constId,present,cb){
		var li = [],
				obj={},
				constits = getConstObj(present);
		for (key in constits[constId].subs){
			li.push(constits[constId].subs[key].race_number);
		}
		obj = {
			li : li,
			constit : constits[constId]
		}
		cb(null,obj);
	}
	/*getBallotsInfo : function(constId,ballots,cb){
		for (key in ballots.li){

		}
		cb(null,li);
	}*/
}

function getConstObj(present){
	constituancy = {};
	for (key in present){
		var obj = {};
		if (constituancy[present[key].constituancy_id] == undefined){
			constituancy[present[key].constituancy_id]={};
			constituancy[present[key].constituancy_id].id=present[key].constituancy_id;
			constituancy[present[key].constituancy_id].name= present[key].constityancy_name;
			constituancy[present[key].constituancy_id].subs = [];
			obj = makeObj(present,key);
			constituancy[present[key].constituancy_id].subs.push(obj);
		} else {
			obj = makeObj(present,key);
			constituancy[present[key].constituancy_id].subs.push(obj);
		}
	}
	return constituancy;
	
}
function makeObj(present,key){
	var obj = {
		constit_id : present[key].constituancy_id,
		constit_name : present[key].constityancy_name,
		office_id:present[key].office_id,
		office_name:present[key].office,
		race_number:present[key].race_number,
		race_type:present[key].race_type,
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