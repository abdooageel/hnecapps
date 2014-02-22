var postgMgr = require('./postgresql').postgMgr;

var query = 'select  '+
			'trf.ballot_id, '+
			'tc.full_name as candidate_name, '+
			'tc.id as candidate_id, '+
			'sum(case when tr.entry_version=2  '+
			'                and tr.active= true  '+
			'                and trf.form_state= 0 '+
			'                then tr.votes else 0 end) as candidate_valid_votes '+
			'from tally_resultform trf '+
			'join tally_result tr on tr.result_form_id = trf.id '+
			'join tally_candidate tc on tc.ballot_id = trf.ballot_id and tc.id = tr.candidate_id ',
	groupby ='group by 1,2,3 '+
			'ORDER BY candidate_valid_votes DESC;',
	ballotQ = 'WHERE trf.ballot_id = ';



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