var postgMgr = require('./postgresql').postgMgr;

//var totalRegs = 'SELECT SUM (tally_station.registrants) FROM tally_station';

var totalRegs = 'SELECT sum(registrants) FROM tally_resultform INNER JOIN tally_reconciliationform ON (tally_reconciliationform.result_form_id=tally_resultform.id) INNER JOIN tally_center ON (tally_center.id=tally_resultform.center_id) INNER JOIN tally_station ON (tally_station.center_id=tally_center.id AND tally_station.station_number=tally_resultform.station_number);';
exports.stationsMgr = {
 	getTotalRegs : function(cb){
		postgMgr.connect(function (client) {
			client.query(totalRegs, function(err, result) {
		    if(err) {
		      return console.error('error running query2', err);
		    } else {
		    	client.end();
		    	cb (err,result.rows[0]);
		    }
		  }); 
		});
	}
}