var url=require('url'),
  parserMgr=require('./csvparser'),
  Step = require("step"),
  centers = {},
  all={};

Step(
  function getCenters(){
    parserMgr.parseCenters(this);
  },
  function returnCenters(err,result,allObject,allList){
    centers = result;
    all={cObject : allObject,cList : allList}
  }
);
  
exports.getMgr = {

  handleGetIndex : function (req,res,cb){
    //var centers = parserMgr.parseCenters();
    res.locals={
      arUrl : "/ar",
      enUrl : "/en",
      centers : centers
    }
    cb(res);

  },
  handleGetAllCents : function(req,res,cb){
    
    cb(all);
  },

}
        
