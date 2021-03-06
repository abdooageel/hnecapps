var postgMgr = require('./postgresql').postgMgr;

var totalForms = 'SELECT COUNT(*) FROM tally_result INNER JOIN'+
            ' tally_resultform ON (tally_resultform.id=tally_result.result_form_id)',
    processed = ' WHERE tally_result.entry_version=2 AND tally_resultform.form_state=0 AND tally_result.active= TRUE  ';

exports.totalMgr = {
  
  getTotalForms : function(cb){
    postgMgr.connect(function (client) {
      client.query(totalForms, function(err, result) {
        if(err) {
          return console.error('error running query3', err);
        } else {
          client.end();
          cb (err,result.rows[0]);
        }
      }); 
    });
  },
  getProcessed : function(cb){
    postgMgr.connect(function (client) {
      client.query(totalForms+processed, function(err, result) {
        if(err) {
          return console.error('error running query4', err);
        } else {
          client.end();
          cb (err,result.rows[0]);
        }
      }); 
    });
  }
}