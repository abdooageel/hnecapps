var csv = require("csv"),
fs = require('fs'),
trim = require('trim'),
candidates={},
allCands={},
allList=[];

module.exports = {
  parseCandidates : function(cb){
    csv()
    .from.path(__dirname+'/../data/candidates.csv', { delimiter: ',', escape: '"' })
    .to.stream(fs.createWriteStream(__dirname+'/sample1.out'))
    .transform( function(row){
      row.unshift(row.pop());
      return row;
    })
    .on('record', function(row,index){
      var region = row[12],
          mainDist = row[5],
          mainDistAr = trim(row[6]),
          mainDistEn = trim(row[6]),
          office = row[3],
          officeNameAr = trim(row[4]),
          officeNameEn = trim(row[4]),
          subconsId = row[7],
          subconsNameAr = trim(row[8]),
          subconsNameEn = trim(row[8]),
          fullName = trim(row[9]),
          ballot = row[13],
          ballotNameAr = row[14],
          type=trim(row[11]),
          id = row[1];

        if((!candidates[region])){
          fillRegion(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type);
        } else if (!candidates[region].mainDists[mainDist]){
          fillMainDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type);
        } else if (!candidates[region].mainDists[mainDist].ballots[ballot]){
          fillBallot(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type);
        } else if (!candidates[region].mainDists[mainDist].ballots[ballot].candidates[id]){
          fillCandidate(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type);
        }
    })
    .on('close', function(count){
      cb(null,candidates,allCands, allList);//return candidates;
    })
    .on('error', function(error){
      console.log(error.message);
    });
    //console.log(candidates);
    
  }
}

//module.exports.parseCenters();

/////////////////////////////
function fillRegion(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type){
  candidates[region]={};
  candidates[region].region = region;
  candidates[region].mainDists = {};
  fillMainDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type);
}
function fillMainDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type){
  candidates[region].mainDists[mainDist]={};
  candidates[region].mainDists[mainDist].id = mainDist;
  candidates[region].mainDists[mainDist].nameAr = mainDistAr;
  candidates[region].mainDists[mainDist].nameEn = mainDistEn;
  candidates[region].mainDists[mainDist].ballots = {};
  fillBallot(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type);
}
function fillBallot(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type){
  candidates[region].mainDists[mainDist].ballots[ballot]={};
  candidates[region].mainDists[mainDist].ballots[ballot].nameEn=ballotNameAr;
  candidates[region].mainDists[mainDist].ballots[ballot].nameAr=ballotNameAr;
  candidates[region].mainDists[mainDist].ballots[ballot].id=ballot;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates={};
  fillCandidate(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type);
}

function fillCandidate(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,ballot,ballotNameAr,id,type){

  var obj = {
    name : fullName,
    id : id,
    mainDist : mainDist,
    mainDistEn : mainDistEn,
    mainDistAr : mainDistAr,
    subconsId : subconsId,
    subconsNameEn : subconsNameEn,
    subconsNameAr : subconsNameAr,
    office : office,
    officeNameAr : officeNameAr,
    officeNameEn : officeNameEn,
    ballot : ballot,
    ballotNameAr : ballotNameAr,
    region : region,
    type : type
  }
  allCands[id]=obj;
  allList.push(obj);
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id]={};
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].name= fullName;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].id = id;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].region = region;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].mainDist = mainDist;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].mainDistEn = mainDistEn;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].mainDistAr = mainDistAr;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].subconsId = subconsId;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].subconsNameAr = subconsNameAr;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].subconsNameEn = subconsNameEn;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].office = office;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].officeNameEn = officeNameEn;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].officeNameAr = officeNameAr;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].ballot = ballot;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].ballotNameAr = ballotNameAr;
  candidates[region].mainDists[mainDist].ballots[ballot].candidates[id].type = type;

}
