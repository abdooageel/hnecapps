var url=require('url'),
    Step = require('step'),
    mathjs = require('mathjs'),
    helperMgr = require('./helper').helperMgr,
    parserMgr=require('./csvparser'),
    csv = require("csv"),
    math = mathjs(),
    present = require('./present'),
    fs = require('fs'),
    ballots = {},
    ballots2 = {},
    stations = {},
    ballots3 = {},
    centers = {},
    //blocked = [];
    blocked = [3,39,73,74,75,77,102];


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
          arUrl : "/cor/constituency/"+id+"/ar",
          enUrl : "/cor/constituency/"+id+"/en",
          site : true
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
      res.locals.arUrl = "/cor/ballot/"+req.params.cid+"/"+req.params.bid+"/ar",
      res.locals.enUrl = "/cor/ballot/"+req.params.cid+"/"+req.params.bid+"/en",
      res.locals.site = true,
      res.render('pballot');
    });
  },
  handleGetCenters : function(req,res,cb){
    var page = 1,
        pagecount = 1;
    if(ballots3[req.params.bid]!=undefined){
      pagecount = math.ceil(Object.keys(ballots3[req.params.bid]).length/10);
    } else {
      pagecount = 1;
    }

    if(url.parse(req.url, true).query.p){
      page = parseInt(url.parse(req.url, true).query.p);
    }
    this.handleGetConstit(req,res,function(res,candidates){
      res.locals.ballot = res.locals.ballots[0];
      res.locals.constit_id=req.params.cid;
      res.locals.centers=paginateObj(ballots3[req.params.bid],page);
      res.locals.arUrl = "/cor/centers/"+req.params.cid+"/"+req.params.bid+"/ar",
      res.locals.enUrl = "/cor/centers/"+req.params.cid+"/"+req.params.bid+"/en",
      res.locals.site = true,
      res.locals.pagination = {
        page:page,
        pageCount :pagecount,
      }
      res.render('pcenters');
    });
  },
  handleGetCenter : function(req,res,cb){
    this.handleGetConstit(req,res,function(res,candidates){
      res.locals.ballot = res.locals.ballots[0];
      res.locals.constit_id=req.params.cid;
      res.locals.ballot_id = req.params.bid;
      res.locals.center_number=url.parse(req.url, true).query.c;
      res.locals.center_name = centers[url.parse(req.url, true).query.c].name;
      res.locals.center=ballots3[req.params.bid][url.parse(req.url, true).query.c];
      res.locals.arUrl = "/cor/centers/"+req.params.cid+"/"+req.params.bid+"/ar/?c="+url.parse(req.url, true).query.c,
      res.locals.enUrl = "/cor/centers/"+req.params.cid+"/"+req.params.bid+"/en/?c="+url.parse(req.url, true).query.c,
      res.locals.site = true,
      res.render('pcenter');
    });
  },

  handleGetIndex : function (req,res){
    var all = {};
    Step(
      function getOffices(){
        helperMgr.getConstits(present,this);
      },
      function final(err,result){
        if (err) throw err
        constits = calculate(result);
        res.locals={
          constits : constits,
          arUrl : "/cor/ar",
          enUrl : "/cor/en",
          site : true
        }
        res.render('pindex');
      }
    );
  },
}
function calculate(result){
  for (key in result){
      result[key].valid_votes=0;
      for (subkey in result[key].subs){
        if(!include(blocked,result[key].subs[subkey].race_number) && (ballots2[result[key].subs[subkey].race_number]!= undefined)){
          result[key].valid_votes+=ballots2[result[key].subs[subkey].race_number].votes;
        }
      }
  }
  return result;
}         


////////////////////parsing csv's one at a time/////////////////////////

var all = parserMgr.parseAll(blocked);
centers = all.centers;
ballots2=all.ballots2;
ballots3=all.ballots3;

/*console.log(ballots3[91][row[3]].candidates[row[9]]);
*/

/////////////////////////////////////////////////


function paginateObj(centers, page){
  var obj ={};
  if(centers != undefined){
    var j=0;
    for (var i = ((page-1)*10); i<Object.keys(centers).length;i++){
      if (j>9)
        break;
      obj[Object.keys(centers)[i]]=centers[Object.keys(centers)[i]];
      obj[Object.keys(centers)[i]].sn = i;
      j++;
    }
  }
  return obj;
}

function include(arr,obj) {
  return (arr.indexOf(obj) != -1);
}