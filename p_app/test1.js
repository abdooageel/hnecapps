var csv = require("csv"),
    fs = require('fs'),
    ballots3={},
    ballots2={},
    centers={},
    count1=0,
    ballot=69;

csv()
  .from.path(__dirname+'/results-formresults.csv', { delimiter: ',', escape: '"' })
  .to.stream(fs.createWriteStream(__dirname+'/sample1.out'))
  .transform( function(row){
    row.unshift(row.pop());
    return row;
  })
  .on('record', function(row,index){
    if(row[2]==ballot){
      count1+=parseInt(row[11]);
    }
    
      var li = [];

      if(!ballots3[row[2]]){
        li = [];
        ballots3[row[2]]={};
        ballots3[row[2]][row[3]]={};
        ballots3[row[2]][row[3]].stations={};
        ballots3[row[2]][row[3]].center_id =row[3];
       // ballots3[row[2]][row[3]].center_name = centers[row[3]].name;
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
        //ballots3[row[2]][row[3]].center_name = centers[row[3]].name;
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
  })
  .on('close', function(count){
    console.log(count1);
  })
  .on('error', function(error){
    console.log(error.message);
  });

csv()
  .from.path(__dirname+'/results-all-candidates.csv', { delimiter: ',', escape: '"' })
  .to.stream(fs.createWriteStream(__dirname+'/sample2.out'))
  .transform( function(row){
    row.unshift(row.pop());
    return row;
  })
  .on('record', function(row,index){

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
  })
  .on('close', function(count){

    console.log(ballots2[ballot].votes);
    //console.log(ballots2[75]);
    //doForms(blocked);
  })
  .on('error', function(error){
    console.log(error.message);
  });