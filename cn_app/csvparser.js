var csv = require("csv"),
fs = require('fs'),
trim = require('trim'),
candidates={},
allCents={},
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
      var region = trim(row[49]),
          mainDist = trim(row[6]),
          mainDistAr = trim(row[43]),
          mainDistEn = trim(row[44]),
          office = trim(row[3]),
          officeNameAr = trim(row[45]),
          officeNameEn = trim(row[46]),
      subconsId = trim(row[8]),
      subconsName = trim(row[9]),
      centerId = trim(row[1]),
      centerName = trim(row[2]),
      mahalla = trim(row[11]),
      village = trim(row[10]),
      langtit = 0,
      longtit = 0;
      if((subconsName != "Special Voting") && subconsName !="1"){
        if((!candidates[region]) ){
          fillRegion(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!candidates[region].offices[office]){
          fillOffice(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!candidates[region].offices[office].subcons[subconsId]){
          fillSubCons(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!candidates[region].offices[office].subcons[subconsId].mahallat[mahalla]){
          fillMahalla(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village]){
          fillVillage(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].candidates[centerId]){
          fillCenter(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        }
      }
    })
    .on('close', function(count){
      cb(null,candidates,allCents,allList);//return candidates;
    })
    .on('error', function(error){
      console.log(error.message);
    });
    //console.log(candidates);
    
  }
}

//module.exports.parseCenters();

/////////////////////////////
function fillRegion(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  candidates[region]={};
  candidates[region].region = region;
  candidates[region].offices = {};
  fillOffice(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}
function fillOffice(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  candidates[region].offices[office]={};
  candidates[region].offices[office].name = officeName;
  candidates[region].offices[office].id = office;
  candidates[region].offices[office].subcons = {};
  fillSubCons(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}
function fillSubCons(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  candidates[region].offices[office].subcons[subconsId]={};
  candidates[region].offices[office].subcons[subconsId].name=subconsName;
  candidates[region].offices[office].subcons[subconsId].id=subconsId;
  candidates[region].offices[office].subcons[subconsId].mahallat={};
  fillMahalla(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}

function fillMahalla(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla]={};
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].name=mahalla;
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages={};
  fillVillage(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}

function fillVillage(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village]={};
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].name=village;
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].candidates={};
  fillCenter(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}

function fillCenter(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  var obj = {
    name : centerName,
    id : centerId,
    longtit : longtit,
    langtit : langtit,
    village : village,
    mahalla : mahalla,
    subconsId : subconsId,
    subconsName : subconsName,
    office : office,
    officeName : officeName,
    region : region
  }
  allCents[centerId]=obj;
  allList.push(obj);
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].candidates[centerId]={};
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].candidates[centerId].name= centerName;
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].candidates[centerId].id = centerId;
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].candidates[centerId].langtit = langtit;
  candidates[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].candidates[centerId].longtit = longtit;
}

function include(arr,obj) {
  return (arr.indexOf(obj) != -1);
}