var url=require('url'),
  parserMgr=require('./csvparser'),
  Step = require("step"),
  candidates = {},
  all={};

Step(
  function getCenters(){
    parserMgr.parseCandidates(this);
  },
  function returnCenters(err,result,allObject,allList){
    candidates = result;
    all={cObject : allObject,cList : allList};
  }
);
  
exports.getMgr = {

  handleGetIndex : function (req,res,cb){
    res.locals={
      arUrl : "/ar",
      enUrl : "/en",
      candidates : candidates
    }
    cb(res);

  },
  handleGetAllCands : function(req,res,cb){
    
    cb(all);
  },

  handleGetCand : function (req,res,cb){
    res.locals={
      arUrl : "/candidate/"+req.id+"/ar",
      enUrl : "/candidate/"+req.id+"/en",
      facebookurl : "http://candidates.hnec.ly/candidate/"+req.id,
      candidate : all.cObject[req.id]
    }
    cb(res);

  }

}
        
