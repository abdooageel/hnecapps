var pg = require('pg'); 
//or native libpq bindings
//var pg = require('pg').native

var conString = "postgres://postgres:dunstuff@localhost/postgres";

exports.postgMgr = {
  connect : function(callback){
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      callback(client);
      
    });
  },
}





/*
client.query(query, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
  });*/