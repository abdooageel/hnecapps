var postgMgr = require('./postgresql').postgMgr;

/*var query = 'select  '+
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
*/
var postgMgr = require('./postgresql').postgMgr;

var query = 'select  '+
't.ballot_id, '+
'votes.valid_votes, '+
'votes.total_votes, '+
'reg.registrants, '+
'forms.processed_forms, '+
'forms.total_forms, '+
'forms.percentage '+
'from tally_resultform t '+
'left join '+
'(select tally_resultform.ballot_id, '+
'sum(case when tally_result.entry_version=2  '+
'        and tally_result.active= true  '+
'        and tally_resultform.form_state=0 '+
'        then tally_result.votes else null end) as valid_votes, '+
'sum(tally_result.votes) as total_votes '+
'from tally_result  '+
'inner join tally_resultform  '+
'        on (tally_resultform.id=tally_result.result_form_id) '+
'join tally_center '+
'        on (tally_center.id = tally_resultform.center_id) '+
'group by 1 '+
'order by 1) as votes '+
'on votes.ballot_id = t.ballot_id '+
'left join '+
'(select tally_resultform.ballot_id, '+
'sum(registrants) as registrants '+
'from tally_resultform  '+
'inner join tally_reconciliationform  '+
'        on (tally_reconciliationform.result_form_id=tally_resultform.id)  '+
'inner join tally_center  '+
'        on (tally_center.id=tally_resultform.center_id)  '+
'inner join tally_station  '+
'        on (tally_station.center_id=tally_center.id  '+
'        and tally_station.station_number=tally_resultform.station_number) '+
'group by 1 '+
'order by 1) as reg '+
'on reg.ballot_id = t.ballot_id '+
'left join '+
'(select ballot_id,processed_forms,total_forms, '+
'((processed_forms::decimal/total_forms::decimal)*100)::float4 as percentage '+
'from( '+
'select tally_resultform.ballot_id, '+
'count (case when tally_result.entry_version=2 '+
'        and tally_resultform.form_state=0  '+
'        and tally_result.active= true '+
'        then tally_result.* else null end) as processed_forms, '+
'count(tally_result.*) as total_forms '+
'from tally_result  '+
'inner join tally_resultform  '+
'        on (tally_resultform.id=tally_result.result_form_id)   '+
'join tally_center on tally_center.id = tally_resultform.center_id '+
'group by 1 '+
'order by 1)x '+
'group by 1,2,3,4) as forms '+
'on forms.ballot_id = t.ballot_id ',
groupBy='group by 1,2,3,4,5,6,7',
ballotsQuery = 'WHERE t.ballot_id IN ';
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
