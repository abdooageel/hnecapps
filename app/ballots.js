var postgMgr = require('./postgresql').postgMgr;

var query = 'select  '+
'ballot_number as ballot_id, '+
'sum(votes) as valid_votes '+
//'votes.total_votes, '+
//'votes.valid_votes, '+
//'reg.registrants, '+
//'forms.processed_forms, '+
//'forms.total_forms, '+
//'forms.percentage '+
'from votes_by_subconstituency ',
groupBy='group by 1 ',
ballotsQuery = 'WHERE ballot_number IN ';

exports.ballotsMgr = {
	getBallotsInfo : function (cb){
		postgMgr.connect(function (client) {
			client.query(query+groupBy, function(err, result) {
		    if(err) {
		      return console.error('error running query1', err);
		    } else {
		    	client.end();
		    	cb(err,result.rows);
		    }
		  }); 
		});
	},
	getConstBallots : function (ballots,cb){
		postgMgr.connect(function (client) {
			client.query(query+ballotsQuery+"("+ballots+")"+groupBy, function(err, result) {
		    if(err) {
		      return console.error('error running query1', err);
		    } else {
		    	client.end();
		    	cb(err,result.rows);
		    }
		  }); 
		});
	},
}
