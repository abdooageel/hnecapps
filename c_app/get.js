var url=require('url'),
  parserMgr=require('./csvparser'),
  Step = require("step"),
  centers = {};

Step(
  function getCenters(){
    parserMgr.parseCenters(this);
  },
  function returnCenters(err,result){
    centers = result;
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
}
        
