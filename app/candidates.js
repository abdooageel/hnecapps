var postgMgr = require('./postgresql').postgMgr;

var query = 'SELECT '+
              'DISTINCT ON (tally_candidate.candidate_id) tally_candidate.candidate_id,'+ 
              'tally_candidate.full_name, '+
              'tally_ballot."number", '+
              'tally_subconstituency.code, '+
              'tally_center.name, '+
              'tally_center.office, '+
              'tally_center.region '+

            'FROM ' +
              'public.tally_candidate, '+ 
              'public.tally_ballot, ' +
              'public.tally_subconstituency, ' +
              'public.tally_center '+
            'WHERE ' +
              'tally_candidate.ballot_id = tally_ballot.id AND '+
              '(tally_ballot.id = tally_subconstituency.ballot_general_id OR  tally_ballot.id = tally_subconstituency.ballot_women_id)AND '+
              'tally_center.sub_constituency_id = tally_subconstituency.id LIMIT '+10+' OFFSET '+0;



exports.candidatesMgr = {
	getCandidates : function (limit,cb){
		postgMgr.connect(function (client) {
			client.query(query, function(err, result) {
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