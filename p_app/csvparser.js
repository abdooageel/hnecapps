var csv = require("csv"),
    fs = require('fs'),
    ballots3={},
    ballots2={},
    centers={};
module.exports = {
    parseAll : function(blocked){
      csv()
      .from.path(__dirname+'/stations.csv', { delimiter: ',', escape: '"' })
      .to.stream(fs.createWriteStream(__dirname+'/sample.out'))
      .transform( function(row){
        row.unshift(row.pop());
        return row;
      })
      .on('record', function(row,index){
        if(!centers[row[1]]){
          centers[row[1]]={};
          centers[row[1]] = {
            center_id : row[1],
            name : row[2].trim()
          }
        }
      })
      .on('close', function(count){
        //console.log(centers);
        doCandidates(blocked);
      })
      .on('error', function(error){
        console.log(error.message);
      });
    return all = {
      centers : centers,
      ballots2 : ballots2,
      ballots3 : ballots3
    }
  }
}

/////////////////////////////
function doCandidates(blocked){
  csv()
  .from.path(__dirname+'/results-all-candidates.csv', { delimiter: ',', escape: '"' })
  .to.stream(fs.createWriteStream(__dirname+'/sample2.out'))
  .transform( function(row){
    row.unshift(row.pop());
    return row;
  })
  .on('record', function(row,index){
    if(!include(blocked,row[1])){

      var li = [],
          total_votes=0;
      for (var i = 5 ; i < row.length;i+=3){
        if(!row[i+1])
          break;
        var obj = {
          name : row[i],
          votes : row[i+1],
          ballot : row[1]
        }
        total_votes+=parseInt(row[i+1]);
        li.push(obj);
      }
      ballots2[row[1]]= {
        stations : row[2],
        completed : row[3],
        votes : total_votes,
        candidates : li
      }
    }
  })
  .on('close', function(count){
    //console.log(ballots2[75]);
    doForms(blocked);
  })
  .on('error', function(error){
    console.log(error.message);
  });
}

function doForms(blocked){
  csv()
  .from.path(__dirname+'/results-formresults.csv', { delimiter: ',', escape: '"' })
  .to.stream(fs.createWriteStream(__dirname+'/sample1.out'))
  .transform( function(row){
    row.unshift(row.pop());
    return row;
  })
  .on('record', function(row,index){
    
    if(!include(blocked,row[2])){
      var li = [];

      if(!ballots3[row[2]]){
        li = [];
        ballots3[row[2]]={};
        ballots3[row[2]][row[3]]={};
        ballots3[row[2]][row[3]].stations={};
        ballots3[row[2]][row[3]].center_id =row[3];
        ballots3[row[2]][row[3]].center_name = centers[row[3]].name;
        ballots3[row[2]][row[3]].votes=parseInt(row[11]);
        ballots3[row[2]][row[3]].candidates={};
        var obj = {
          number : row[9],
          name : row[10],
          cvotes : parseInt(row[11])
        }
        li.push(obj);
        ballots3[row[2]][row[3]].candidates[row[9]]={};
        ballots3[row[2]][row[3]].candidates[row[9]]={
            number : obj.number,
            name :obj.name,
            votes:obj.cvotes
          };;
        ballots3[row[2]][row[3]].stations[row[4]]={
          votes : parseInt(row[19]),
          candidates : li
        };
        ballots3[row[2]][row[3]].center_id =row[3];

      } else if(!ballots3[row[2]][row[3]]){
        li = [];
        ballots3[row[2]][row[3]]={};
        ballots3[row[2]][row[3]].stations={};
        ballots3[row[2]][row[3]].center_id =row[3];
        ballots3[row[2]][row[3]].center_name = centers[row[3]].name;
        ballots3[row[2]][row[3]].votes=parseInt(row[11]); 
        ballots3[row[2]][row[3]].candidates={};
        var obj = {
          number : row[9],
          name : row[10],
          cvotes : parseInt(row[11])
        }
        li.push(obj);
        ballots3[row[2]][row[3]].candidates[row[9]]={};
        ballots3[row[2]][row[3]].candidates[row[9]]={
            number : obj.number,
            name :obj.name,
            votes:obj.cvotes
          };//center candidates
        ballots3[row[2]][row[3]].stations[row[4]]={
          station : row[4],
          votes : row[19],
          candidates : li
        };

      } else if (!ballots3[row[2]][row[3]].stations[row[4]]){
        ballots3[row[2]][row[3]].votes+=parseInt(row[11]);
        li = [];
        var obj = {
          number : row[9],
          name : row[10],
          cvotes : parseInt(row[11])
        }
        li.push(obj);
        ballots3[row[2]][row[3]].stations[row[4]]={
          station : row[4],
          votes : row[19],
          candidates : li
        };
        if(!ballots3[row[2]][row[3]].candidates[row[9]]){
          ballots3[row[2]][row[3]].candidates[row[9]]={};
          ballots3[row[2]][row[3]].candidates[row[9]]={
            number : obj.number,
            name :obj.name,
            votes:obj.cvotes
          };
        } else {
          ballots3[row[2]][row[3]].candidates[row[9]].votes+=obj.cvotes;
        }
      } else {
        ballots3[row[2]][row[3]].votes+=parseInt(row[11]);
        li = ballots3[row[2]][row[3]].stations[row[4]].candidates;
        var obj = {
          number : row[9],
          name : row[10],
          cvotes : parseInt(row[11])
        }
        li.push(obj);
        ballots3[row[2]][row[3]].stations[row[4]].candidates=li;
        if(!ballots3[row[2]][row[3]].candidates[row[9]]){
          ballots3[row[2]][row[3]].candidates[row[9]]={};
          ballots3[row[2]][row[3]].candidates[row[9]]={
            number:obj.number,
            name :obj.name,
            votes:obj.cvotes
          };
        } else {
          ballots3[row[2]][row[3]].candidates[row[9]].votes+=obj.cvotes;
        }
      }
    }
  })
  .on('close', function(count){
  })
  .on('error', function(error){
    console.log(error.message);
  });
}

function include(arr,obj) {
  return (arr.indexOf(obj) != -1);
}

