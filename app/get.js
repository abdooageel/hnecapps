var url=require('url'),
		Step = require('step'),
		mathjs = require('mathjs'),
		helperMgr = require('./helper').helperMgr,
		candidatesMgr=require('./candidates').candidatesMgr,
		officesMgr = require('./offices').officesMgr,
		ballotsMgr = require('./ballots').ballotsMgr,
		csv = require("csv"),
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
					ballots.result[key].stations =  ballots2[result.li[key]].stations;
					ballots.result[key].completed = ballots2[result.li[key]].completed;
					ballots.result[key].ballot_id = result.li[key];
					ballots.result[key].percentage = ballots2[result.li[key]].percentage;
					ballots.result[key].valid_votes=ballots2[result.li[key]].votes;
			  	ballots.result[key].subconst_name=ballots.subs[key].subconst_name;
			  	ballots.result[key].subsubconst_name=ballots.subs[key].subsubconst_name;
			  	ballots.result[key].seats=ballots.subs[key].seats;
			  	ballots.result[key].race_type=ballots.subs[key].race_type;
			  	ballots.result[key].race_type_ar=ballots.subs[key].race_type_ar;
			  	ballots.result[key].candidate_count=ballots.subs[key].candidate_count;
			  	ballots.result[key].vote_area=ballots.subs[key].vote_area;
			  	ballots.result[key].constit_name=ballots.subs[key].constit_name;
			  	ballots.result[key].constit_name_en=ballots.subs[key].constit_name_en;


				}
				res.locals={
		  		name : ballots.name,
		  		name_en : ballots.name_en,
		  		vote_area: ballots.vote_area,
		  		ballots : ballots.result,
		  		arUrl : "/constituency/"+id+"/ar",
			    enUrl : "/constituency/"+id+"/en"
		  	},
		  	cb(res,candidates);
		  }

		);
	},
	handleGetBallot : function(req,res,cb){
		this.handleGetConstit(req,res,function(res,candidates){
			res.locals.ballot = res.locals.ballots[0]
			res.locals.constit_id=req.params.cid;
			res.locals.candidates=candidates;
			res.locals.arUrl = "/ballot/"+req.params.cid+"/"+req.params.bid+"/ar",
			res.locals.enUrl = "/ballot/"+req.params.cid+"/"+req.params.bid+"/en"
			res.render('ballot');
		});
	},

	handleGetIndex : function (req,res){
		var all = {};
		Step(

		  function getOffices(){
		  	helperMgr.getConstits(present,this);
		  },
		  function final(err,result){
		  	var males,females,uni,
		  			valid_votes,processed,regs = 0;
		  	if (err) throw err
		  	constits = calculate(result);
		  	res.locals={
		  		constits : constits,
			    arUrl : "/ar",
			    enUrl : "/en"
			  }
			  res.render('index');
		  }
		);
  },
}
function calculate(result){
	for (key in result){
		result[key].valid_votes=0;
		for (subkey in result[key].subs){
				result[key].valid_votes+=ballots2[result[key].subs[subkey].race_number].votes;
			}
	}
	return result;

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
			votes : row[i+1],
			ballot : row[1]
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
})
.on('close', function(count){
})
.on('error', function(error){
  console.log(error.message);
});
