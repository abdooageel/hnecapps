var url=require('url'),
		Step = require('step'),
		mathjs = require('mathjs'),
		helperMgr = require('./helper').helperMgr,
		candidatesMgr=require('./candidates').candidatesMgr,
		officesMgr = require('./offices').officesMgr,
		ballotsMgr = require('./ballots').ballotsMgr,
		stationsMgr = require('./stations').stationsMgr,
		csv = require("csv"),
		indexMgr = require('./index').indexMgr;
		math = mathjs();
var present = require('./tally_present'),
		fs = require('fs');
		var ballots = {},
				ballots2 = {},
				percentage = {};


 exports.getMgr = {
	handleGetConstit : function(req,res,cb){
		var id = req.params.id,
				bid = req.params.bid;
		if(!id){
			id = req.params.cid;
		}
		Step(
			function getBallotsids(){
				var obj = {
					cid : id,
					bid: bid
				}
		  	helperMgr.getBallotsids(obj,present,this);
		  },
		  function getBallotsInfo(err,result){
		  	candidates= null;
		  	ballots = result.constit;
		  	ballots.subs.sort(function(a, b) { 
				  return a.race_number - b.race_number;
				});
				if(bid){
					result.li = [];
					result.li.push(bid);
					candidates = ballots2[bid].candidates;
				}
				ballots.result=[];
				for (key in result.li){
					ballots.result[key]={};
					ballots.result[key].constit_id = ballots.subs[key].constit_id; 
					ballots.result[key].ballot_id = result.li[key];
					ballots.result[key].percentage = ballots2[result.li[key]].percentage;
					ballots.result[key].valid_votes=ballots2[result.li[key]].votes;
			  	ballots.result[key].subconst_name=ballots.subs[key].subconst_name;
			  	ballots.result[key].subsubconst_name=ballots.subs[key].subsubconst_name;
			  	ballots.result[key].seats=ballots.subs[key].seats;
			  	ballots.result[key].race_type=ballots.subs[key].race_type;
			  	ballots.result[key].candidate_count=ballots.subs[key].candidate_count;
			  	ballots.result[key].vote_area=ballots.subs[key].vote_area;
				}
				res.locals={
		  		name : ballots.name,
		  		ballots : ballots.result,
		  		arUrl : "/constituancy/"+id+"/ar",
			    enUrl : "/constituancy/"+id+"/en"
		  	},
		  	cb(res,candidates);
		  }

		);
	},
	handleGetBallot : function(req,res,cb){
		this.handleGetConstit(req,res,function(res,candidates){
			res.locals.constit_id=req.params.cid;
			res.locals.candidates=candidates;
			res.render('ballot');
		});
	},

	handleGetIndex : function (req,res){
		var all = {};
		Step(
		  function getIndex() {
		    indexMgr.getIndex(this);
		  },
		  function getOffices(err,result){
		  	if (err) throw err;
		  	all=result;
		  	indexMgr.getConstits(this);
		  },
		  function final(err,result){
		  	var males,females,uni,
		  			valid_votes,processed,regs = 0;
		  	if (err) throw err
		  	constits = calculate(result);
		  	regs = all.regs;
		  	processed = all.processed;
		  	males = all.males;
		  	females=all.females;
		  	valid_votes = all.valid_votes;
		  	turnout = (males + females)*100/regs;
		  	res.locals={
		  		males : males,
		  		females : females,
		  		all : males+females,
		  		valid_votes : valid_votes,
		  		constits : constits,
		  		regs : regs,
		  		turnout:math.round(turnout,2),
		  		processed : math.round(processed,2),
			    arUrl : "/ar",
			    enUrl : "/en"
			  }
			  res.render('index');
		  }
		);
  },
}
function calculate(result){
	for (key in result.constits){
		result.constits[key].valid_votes=0;
		for (subkey in result.constits[key].subs){
				result.constits[key].valid_votes+=ballots2[result.constits[key].subs[subkey].race_number].votes;
			}
	}
	return result.constits;

}					

csv()
.from.path(__dirname+'/candidate_votes.csv', { delimiter: ',', escape: '"' })
.to.stream(fs.createWriteStream(__dirname+'/sample.out'))
.transform( function(row){
  row.unshift(row.pop());
  return row;
})
.on('record', function(row,index){
	var li = [],
			total_votes=0;
	for (var i = 5 ; i < row.length;i+=2){
		if(!row[i+1])
			break;
		var obj = {
			name : row[i],
			votes : row[i+1]
		}
		total_votes+=parseInt(row[i+1]);
		li.push(obj);
	}
	percentage[row[1]]=row[4];
	ballots2[row[1]]= {
		percentage : row[4],
		stations : row[2],
		completed : row[3],
		votes : total_votes,
		candidates : li
	}
	


  //console.log('#'+index+' '+JSON.stringify(row[0])+' '+JSON.stringify(row[1])+' '+JSON.stringify(row[4]));
})
.on('close', function(count){
  // when writing to a file, use the 'close' event
  // the 'end' event may fire before the file has been written
  //console.log(percentage);
  //console.log('Number of lines: '+count);
})
.on('error', function(error){
  console.log(error.message);
});

/*if(result.constits[key].registrants!=undefined){
		if(result.ballots[subkey].registrants!=null)
		result.constits[key].registrants+=parseInt(result.ballots[subkey].registrants);
	} else {
		if(result.ballots[subkey].registrants!=null)
		result.constits[key].registrants=parseInt(result.ballots[subkey].registrants);
	}
	if(result.constits[key].percentage!=undefined){
		if(result.ballots[subkey].percentage!=null){
			result.constits[key].pn_forms+=1;
			result.constits[key].percentage=(result.constits[key].percentage+=parseInt(result.ballots[subkey].percentage))/result.constits[key].pn_forms;
		}
	} else {
		if(result.ballots[subkey].percentage!=null){
			result.constits[key].percentage=parseInt(result.ballots[subkey].percentage);
			result.constits[key].pn_forms=1;
		}
	}*/


		  	//ballotsMgr.getConstBallots(result.li,this);
		  /*},
*/		 /* function returnBallots(err,result){
		  	ballots.result = result;
		  	if(result != undefined){
		  		ballots.result.sort(function(a, b) { 
				  	return a.ballot_id - b.ballot_id;
					});
		  	}
		  	for (key in ballots.result){
		  		if(ballots.subs[key]!=undefined){
		  			ballots.result[key].percentage = percentage[ballots.result[key].ballot_id];
			  		ballots.result[key].constit_id=ballots.subs[key].constit_id;
			  		ballots.result[key].subconst_name=ballots.subs[key].subconst_name;
			  		ballots.result[key].subsubconst_name=ballots.subs[key].subsubconst_name;
			  		ballots.result[key].seats=ballots.subs[key].seats;
			  		ballots.result[key].race_type=ballots.subs[key].race_type;
			  		ballots.result[key].candidate_count=ballots.subs[key].candidate_count;
			  		ballots.result[key].vote_area=ballots.subs[key].vote_area;
			  	}
			  }
		  	res.locals={
		  		name : ballots.name,
		  		ballots : ballots.result,
		  		arUrl : "/constituancy/"+id+"/ar",
			    enUrl : "/constituancy/"+id+"/en"
		  	},
		  	cb(res); 
		  }*/