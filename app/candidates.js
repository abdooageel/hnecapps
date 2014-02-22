var postgMgr = require('./postgresql').postgMgr;

var query = 'select  '+
			'ballot_number as ballot_id, '+
			'candidate_name, '+
			'candidate_id, '+
			'sum(votes) as candidate_valid_votes  '+
			'from votes_by_subconstituency ',
	groupby ='group by 1,2,3 '+
			'ORDER BY candidate_valid_votes DESC;',
	ballotQ = 'WHERE ballot_number = ';



exports.candidatesMgr = {
	getCandidates : function (limit,cb){
		postgMgr.connect(function (client) {
			client.query(query+groupby, function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    } else {
		    	client.end();
		    	cb (result.rows);
		    }
		  }); 
		});
	},
	getBCandidates : function (id,cb){
		postgMgr.connect(function (client) {
			client.query(query+ballotQ+id+groupby, function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    } else {
		    	client.end();
		    	cb (result.rows);
		    }
		  }); 
		});
	}
}