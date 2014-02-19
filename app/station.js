var postgMgr = require('./postgresql').postgMgr;

var totalRegs = 'SELECT SUM (tally_station.registrants) FROM tally_station';

exports.totalMgr = {
	
 	getTotalRegs : function(cb){
		postgMgr.connect(function (client) {
			client.query(totalRegs, function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    } else {
		    	client.end();
		    	cb (err,result.rows);
		    }
		  }); 
		});
	}
}