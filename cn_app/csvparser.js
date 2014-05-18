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

      var region = row[49],
          mainDist = row[6],
          mainDistAr = trim(row[43]),
          mainDistEn = trim(row[44]),
          office = row[3],
          officeNameAr = trim(row[45]),
          officeNameEn = trim(row[46]),
          subconsId = row[7],
          subconsNameAr = trim(row[47]),
          subconsNameEn = trim(row[48]),
          fullName = trim(row[15]),
          id = row[35];
      
      if((!candidates[region]) ){
        fillRegion(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id);
      } else if (!candidates[region].mainDists[mainDist]){
        fillMainDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id);
      } else if (!candidates[region].mainDists[mainDist].subDists[subconsId]){
        fillSubDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id);
      } else if (!candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id]){
        fillCandidate(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id);
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
function fillRegion(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id){
  candidates[region]={};
  candidates[region].region = region;
  candidates[region].mainDists = {};
  fillMainDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id);
}
function fillMainDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id){
  candidates[region].mainDists[mainDist]={};
  candidates[region].mainDists[mainDist].id = mainDist;
  candidates[region].mainDists[mainDist].nameAr = mainDistAr;
  candidates[region].mainDists[mainDist].nameEn = mainDistEn;
  candidates[region].mainDists[mainDist].subDists = {};
  fillSubDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id);
}
function fillSubDist(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id){
  candidates[region].mainDists[mainDist].subDists[subconsId]={};
  candidates[region].mainDists[mainDist].subDists[subconsId].nameEn=subconsNameEn;
  candidates[region].mainDists[mainDist].subDists[subconsId].nameAr=subconsNameAr;
  candidates[region].mainDists[mainDist].subDists[subconsId].id=subconsId;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates={};
  fillCandidate(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id);
}

function fillCandidate(region,mainDist,mainDistEn,mainDistAr,office,officeNameAr,officeNameEn,subconsId,subconsNameAr,subconsNameEn,fullName,id){

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
    region : region
  }
  allCands[id]=obj;
  allList.push(obj);
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id]={};
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].name= fullName;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].id = id;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].region = region;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].mainDist = mainDist;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].mainDistEn = mainDistEn;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].mainDistAr = mainDistAr;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].subconsId = subconsId;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].subconsNameAr = subconsNameAr;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].subconsNameEn = subconsNameEn;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].office = office;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].officeNameEn = officeNameEn;
  candidates[region].mainDists[mainDist].subDists[subconsId].candidates[id].officeNameAr = officeNameAr;

}
