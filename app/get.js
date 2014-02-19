var url=require('url'),
		Step = require('step'),
		mathjs = require('mathjs'),
		candidatesMgr=require('./candidates').candidatesMgr,
		officesMgr = require('./offices').officesMgr;
		math = mathjs();


exports.getMgr = {
  get : function(req,res,cb){
  	var base = req.url;
	  switch(base){
      case "/" :
        this.handleGetIndex(req.params,res,cb);
        break;
      default:
    }
	},
	handleGetIndex : function (req,res){
		var all = {};
		Step(
		  function getMales() {
		    officesMgr.getTGender(0,this);
		  },
		  function getFemales(err,result) {
		  	if (err) throw err;
		  	all.male=result[0];
		    officesMgr.getTGender(1,this);
		  },
		  function getUni(err,result) {
		  	if (err) throw err;
		  	all.female=result[0];
		    officesMgr.getTGender(3,this);
		  },
		  function getValidVotes(err,result){
		  	if (err) throw err;
		  	all.uni=result[0];
		  	officesMgr.getValidVotes(this);
		  },
		  function getFormsProcessed(err,result){
		  	if (err) throw err;
		  	all.valid_votes=result[0];
		  	officesMgr.getFormsProcessed(this);
		  },
		  function final(err,result){
		  	var males,females,uni,valid_votes,processed = 0;
		  	if (err) throw err;
		  	processed = result;
		  	console.log(processed);
		  	males = parseInt(all.male.count);
		  	females=parseInt(all.female.count);
		  	uni=parseInt(all.uni.count);
		  	valid_votes = all.valid_votes.sum;
		  	processed = result;
		  	if(uni%2==0){
		  		males +=uni/2;
		  		females +=uni/2;
		  	} else {
		  		males +=uni/2+0.5;
		  		females +=uni/2-0.5;
		  	}
		  	
		  	res.locals={
		  		males : males,
		  		females : females,
		  		all : males+females,
		  		valid_votes : valid_votes,
		  		processed : math.round(processed,3),
			    arUrl : "/ar",
			    enUrl : "/en"
			  }
			  res.render('index');
		  }
		);
		
    


  },
}
