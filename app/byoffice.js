/*var postgMgr = require('./postgresql').postgMgr,
		totalMgr = require('./total').totalMgr,
		Step = require('step');

var query = 'SELECT COUNT (*) FROM tally_result INNER JOIN'+
            ' tally_resultform ON (tally_resultform.id=tally_result.result_form_id)'+
            ' WHERE tally_result.entry_version=2 AND tally_resultform.form_state=0 ',
    genderQ = ' AND tally_resultform.gender=',
    officeQuery = 'SELECT tally_office.id,tally_office.name, COUNT (*) FROM tally_result INNER JOIN'+
            ' tally_resultform ON (tally_resultform.id=tally_result.result_form_id)'+
            'INNER JOIN tally_office ON (tally_resultform.office_id = tally_office.id)'+
            ' WHERE tally_result.entry_version=2 AND tally_resultform.form_state=0 '+
            'AND tally_resultform.gender=',
    group = ' GROUP BY tally_office.id',
    validVotes = 'SELECT SUM (tally_result.votes) FROM tally_result INNER JOIN'+
            ' tally_resultform ON (tally_resultform.id=tally_result.result_form_id)'+
            ' WHERE tally_result.entry_version=2 AND tally_result.active= TRUE AND tally_resultform.form_state=0 ';
exports.officesMgr = {
	getTGender : function (gender,cb){
		postgMgr.connect(function (client) {
			client.query(query+genderQ+gender, function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    } else {
		    	client.end();
		    	cb (err,result.rows[0]);
		    }
		  }); 
		});
	},
	getOGender : function (gender,cb){
		postgMgr.connect(function (client) {
			client.query(officeQuery+gender+group, function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    } else {
		    	client.end();
		    	cb (err,result.rows);
		    }
		  }); 
		});
	},
	getValidVotes : function (cb){
		postgMgr.connect(function (client) {
			client.query(validVotes, function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    } else {
		    	client.end();
		    	cb (err,result.rows[0]);
		    }
		  }); 
		});
	},
	getFormsProcessed : function (cb){
		var all,processed,perc = 0;
		Step(
		  function getTotalForms() {
		    totalMgr.getTotalForms(this);
		  },
		  function getProcessed(err,result) {
		  	if (err) throw err;
		  	all=parseFloat(result.count);
		    totalMgr.getProcessed(this);
		  },
		  function returnPerc(err,result) {
		  	if (err) throw err;
		  	processed=parseFloat(result.count);
		    perc = (processed * 100)/all;
		    cb(err,perc);
		  }

		);
	},
}
 */