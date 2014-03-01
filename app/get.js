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
				centers = [],
				stations = {},
				ballots3 = {},
				percentage = {},
				centers = {},
				scount =0,
				blocked = [26,29,30,31,37,43,47,52,55,56,58];


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
					if(!include(blocked,result.li[key])){
						ballots.result[key]={
							constit_id : ballots.subs[key].constit_id,
							stations :  ballots2[result.li[key]].stations,
							completed : ballots2[result.li[key]].completed,
							ballot_id : result.li[key],
							percentage : ballots2[result.li[key]].percentage,
							valid_votes : ballots2[result.li[key]].votes,
					  	subconst_name : ballots.subs[key].subconst_name,
					  	subsubconst_name : ballots.subs[key].subsubconst_name,
					  	seats : ballots.subs[key].seats,
					  	race_type : ballots.subs[key].race_type,
					  	race_type_ar : ballots.subs[key].race_type_ar,
					  	candidate_count : ballots.subs[key].candidate_count,
					  	vote_area : ballots.subs[key].vote_area,
					  	constit_name : ballots.subs[key].constit_name,
					  	constit_name_en : ballots.subs[key].constit_name_en,
						};
					}
					
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
	handleGetCenters : function(req,res,cb){
		var page = 1;
		if(url.parse(req.url, true).query.p){
			page = parseInt(url.parse(req.url, true).query.p);
		}
		this.handleGetConstit(req,res,function(res,candidates){
/*			console.log(ballots3[req.params.bid]);
*/			res.locals.ballot = res.locals.ballots[0];
			res.locals.constit_id=req.params.cid;
			res.locals.centers=paginateObj(ballots3[req.params.bid],page);
			res.locals.arUrl = "/centers/"+req.params.cid+"/"+req.params.bid+"/ar",
			res.locals.enUrl = "/centers/"+req.params.cid+"/"+req.params.bid+"/en",
			res.locals.pagination = {
				page:page,
				pageCount :math.ceil(Object.keys(ballots3[req.params.bid]).length/10)
			}
			res.render('centers');
		});
	},
	handleGetCenter : function(req,res,cb){
		this.handleGetConstit(req,res,function(res,candidates){
			res.locals.ballot = res.locals.ballots[0];
			res.locals.constit_id=req.params.cid;
			res.locals.ballot_id = req.params.bid;
			res.locals.center_name = centers[url.parse(req.url, true).query.c].name;
			res.locals.center=ballots3[req.params.bid][url.parse(req.url, true).query.c];
			res.locals.arUrl = "/centers/"+req.params.cid+"/"+req.params.bid+"/ar/?c="+url.parse(req.url, true).query.c,
			res.locals.enUrl = "/centers/"+req.params.cid+"/"+req.params.bid+"/en/?c="+url.parse(req.url, true).query.c,
			res.render('center');
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
				if(!include(blocked,result[key].subs[subkey].race_number)){
					result[key].valid_votes+=ballots2[result[key].subs[subkey].race_number].votes;
				}
			}
	}
	return result;

}					
///////////////////////////////
csv()
.from.path(__dirname+'/stations.csv', { delimiter: ',', escape: '"' })
.to.stream(fs.createWriteStream(__dirname+'/sample.out'))
.transform( function(row){
  row.unshift(row.pop());
  return row;
})
.on('record', function(row,index){
	if(!centers[row[1]]){
		centers[row[1]]={};

		centers[row[1]] = {
			center_id : row[1],
			name : row[2].trim()
		}
	}

})
.on('close', function(count){
	/*for (key in centers){
		console.log(centers[key].name);
	}*/
	doCandidates();
})
.on('error', function(error){
  console.log(error.message);
});

/////////////////////////////
function doCandidates(){
	csv()
	.from.path(__dirname+'/candidate_votes.csv', { delimiter: ',', escape: '"' })
	.to.stream(fs.createWriteStream(__dirname+'/sample2.out'))
	.transform( function(row){
	  row.unshift(row.pop());
	  return row;
	})
	.on('record', function(row,index){
		if(!include(blocked,row[1])){
			
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
		}
	})
	.on('close', function(count){
		doForms();
	})
	.on('error', function(error){
	  console.log(error.message);
	});
}

function doForms(){
	csv()
	.from.path(__dirname+'/form_results.csv', { delimiter: ',', escape: '"' })
	.to.stream(fs.createWriteStream(__dirname+'/sample1.out'))
	.transform( function(row){
	  row.unshift(row.pop());
	  return row;
	})
	.on('record', function(row,index){
		/*if (row[9]==1)
			{	scount++;
			}
*/
		if(!include(blocked,row[2])){
			var li = [];

			if(!ballots3[row[2]]){
				li = [];
				
				ballots3[row[2]]={};
				ballots3[row[2]][row[3]]={};
				ballots3[row[2]][row[3]].stations={};
				ballots3[row[2]][row[3]].center_id =row[3];
				ballots3[row[2]][row[3]].center_name = centers[row[3]].name;
				ballots3[row[2]][row[3]].votes=parseInt(row[11]);
				ballots3[row[2]][row[3]].candidates={};
				var obj = {
					number : row[9],
					name : row[10],
					cvotes : parseInt(row[11])
				}
				li.push(obj);
				ballots3[row[2]][row[3]].candidates[row[9]]={};
				ballots3[row[2]][row[3]].candidates[row[9]]={
						number : obj.number,
						name :obj.name,
						votes:obj.cvotes
					};;
				ballots3[row[2]][row[3]].stations[row[4]]={
					votes : parseInt(row[19]),
					candidates : li
				};
				ballots3[row[2]][row[3]].center_id =row[3];

			} else if(!ballots3[row[2]][row[3]]){
				li = [];
				ballots3[row[2]][row[3]]={};
				ballots3[row[2]][row[3]].stations={};
				ballots3[row[2]][row[3]].center_id =row[3];
				ballots3[row[2]][row[3]].center_name = centers[row[3]].name;
				ballots3[row[2]][row[3]].votes=parseInt(row[11]); 
				ballots3[row[2]][row[3]].candidates={};
				var obj = {
					number : row[9],
					name : row[10],
					cvotes : parseInt(row[11])
				}
				li.push(obj);
				ballots3[row[2]][row[3]].candidates[row[9]]={};
				ballots3[row[2]][row[3]].candidates[row[9]]={
						number : obj.number,
						name :obj.name,
						votes:obj.cvotes
					};//center candidates
				ballots3[row[2]][row[3]].stations[row[4]]={
					station : row[4],
					votes : row[19],
					candidates : li
				};
				 
			} else if (!ballots3[row[2]][row[3]].stations[row[4]]){
				ballots3[row[2]][row[3]].votes+=parseInt(row[11]);
				li = [];
				var obj = {
					number : row[9],
					name : row[10],
					cvotes : parseInt(row[11])
				}
				li.push(obj);
				ballots3[row[2]][row[3]].stations[row[4]]={
					station : row[4],
					votes : row[19],
					candidates : li
				};
				if(!ballots3[row[2]][row[3]].candidates[row[9]]){
					ballots3[row[2]][row[3]].candidates[row[9]]={};
					ballots3[row[2]][row[3]].candidates[row[9]]={
						number : obj.number,
						name :obj.name,
						votes:obj.cvotes
					};
				} else {
					ballots3[row[2]][row[3]].candidates[row[9]].votes+=obj.cvotes;
				}
			} else {
				ballots3[row[2]][row[3]].votes+=parseInt(row[11]);
				li = ballots3[row[2]][row[3]].stations[row[4]].candidates;
				var obj = {
					number : row[9],
					name : row[10],
					cvotes : parseInt(row[11])
				}
				li.push(obj);
				ballots3[row[2]][row[3]].stations[row[4]].candidates=li;
				if(!ballots3[row[2]][row[3]].candidates[row[9]]){
					ballots3[row[2]][row[3]].candidates[row[9]]={};
					ballots3[row[2]][row[3]].candidates[row[9]]={
						number:obj.number,
						name :obj.name,
						votes:obj.cvotes
					};
				} else {
					ballots3[row[2]][row[3]].candidates[row[9]].votes+=obj.cvotes;
				}
			}
		}
	})
	.on('close', function(count){
/*		console.log(scount);
*/	})
	.on('error', function(error){
	  console.log(error.message);
	});
}



////////////////////////////////////////center names /////////


function paginateObj(centers, page){
	var obj ={};
	var j=0;
	for (var i = ((page-1)*10); i<Object.keys(centers).length;i++){
		if (j>9)
			break;
		obj[Object.keys(centers)[i]]=centers[Object.keys(centers)[i]];
		obj[Object.keys(centers)[i]].sn = i;
		j++;
	}
	return obj;
}

function include(arr,obj) {
  return (arr.indexOf(obj) != -1);
}