var Step = require('step'),
		mathjs = require('mathjs'),
		helperMgr = require('./helper').helperMgr,
		officesMgr = require('./offices').officesMgr,
		ballotsMgr = require('./ballots').ballotsMgr,
		stationsMgr = require('./stations').stationsMgr,
		fs = require('fs'),
		math = mathjs();
var present = require('./tally_present');
		
exports.indexMgr = {
	getIndex : function (cb){
		var all = {};
		Step(
		  function getMales() {
		    officesMgr.getTGender(0,this);
		  },
		  function getFemales(err,result) {
		  	if (err) throw err;
		  	all.males=parseInt(result.count);
		    officesMgr.getTGender(1,this);
		  },
		  function getUni(err,result) {
		  	if (err) throw err;
		  	all.females=parseInt(result.count);
		    officesMgr.getTGender(3,this);
		  },
		  function getValidVotes(err,result){
		  	if (err) throw err;
		  	all.uni=parseInt(result.count);
		  	officesMgr.getValidVotes(this);
		  },
		  function getFormsProcessed(err,result){
		  	if (err) throw err;
		  	all.valid_votes=result.sum;
		  	officesMgr.getFormsProcessed(this);
		  },
		  function getTotalRegs(err,result){
		  	if (err) throw err;
		  	all.processed=result;
		  	stationsMgr.getTotalRegs(this);
		  },
		  function returnAll(err,result){
		  	if (err) throw err;
		  	all.regs = result.sum;
		  	if(all.uni%2==0){
		  		all.males +=all.uni/2;
		  		all.females +=all.uni/2;
		  	} else {
		  		all.males +=all.uni/2+0.5;
		  		all.females +=all.uni/2-0.5;
		  	}
		  	cb(err,all);
		  }
		);
	},
	getConstits : function (cb){
		var all = {};
		Step(
			function getConstits(){
				helperMgr.getConstits(present,this);
			},
			function getInfo(err,result){
				all.constits = result;
				ballotsMgr.getBallotsInfo(this)
			},
		  function returnConstits(err,result) {
		  	all.ballots=result
		  	cb(err,all);
		    //officesMgr.getOGender(0,this);
		  }
		  /*function getFemales(err,result) {
		  	if (err) throw err;
		  	all.males=result;
		    officesMgr.getOGender(1,this);
		  },
		  function getUni(err,result) {
		  	if (err) throw err;
		  	all.females=result;
		    officesMgr.getOGender(3,this);
		  },*/
		  /*function getValidVotes(err,result){
		  	if (err) throw err;
		  	all.uni=parseInt(result.count);
		  	officesMgr.getValidOVotes(this);
		  },
		  function getFormsProcessed(err,result){
		  	if (err) throw err;
		  	all.valid_votes=result.sum;
		  	officesMgr.getFormsProcessed(this);
		  },
		  function getTotalRegs(err,result){
		  	if (err) throw err;
		  	all.processed=result;
		  	stationsMgr.getTotalRegs(this);
		  },*/
		  /*function returnAll(err,result){
		  	var dataSource=[];
		  	if (err) throw err;
		  	all.uni = result;
		  	for (key in all){
	  			for (subkey in all[key]){
	  				if(key != "uni"){
		  				if(!dataSource[all[key][subkey].id]){
		  					dataSource[all[key][subkey].id]={};
		  					dataSource[all[key][subkey].id]["id"]=all[key][subkey].id;
		  					dataSource[all[key][subkey].id]["office"]=all[key][subkey].name,
		  					dataSource[all[key][subkey].id][key]=parseInt(all[key][subkey].count);
		  				} else {
		  					dataSource[all[key][subkey].id][key]=parseInt(all[key][subkey].count);
		  				}
		  			} else {
		  				dataSource[all[key][subkey].id].males+=math.floor(parseInt(all[key][subkey].count)/2)+parseInt(all[key][subkey].count)%2;
		  				dataSource[all[key][subkey].id].females+=math.floor(parseInt(all[key][subkey].count)/2);
		  			}
	  			}	
		  	}
		  	cb(err,dataSource);*/
		  	/*if(all.uni%2==0){
		  		all.males +=all.uni/2;
		  		all.females +=all.uni/2;
		  	} else {
		  		all.males +=all.uni/2+0.5;
		  		all.females +=all.uni/2-0.5;
		  	}
		  	cb(err,all);*/
		  /*}*/
		);
	}
}