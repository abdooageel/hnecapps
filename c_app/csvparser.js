var csv = require("csv"),
fs = require('fs'),
trim = require('trim'),
centers={},
allCents={},
allList=[];
module.exports = {
  parseCenters : function(cb){
    csv()
    .from.path(__dirname+'/../data/centers.csv', { delimiter: ',', escape: '"' })
    .to.stream(fs.createWriteStream(__dirname+'/sample.out'))
    .transform( function(row){
      row.unshift(row.pop());
      return row;
    })
    .on('record', function(row,index){
      var region = trim(row[3]),
      office = trim(row[4]),
      officeName = trim(row[5]),
      subconsId = trim(row[8]),
      subconsName = trim(row[9]),
      centerId = trim(row[1]),
      centerName = trim(row[2]),
      mahalla = trim(row[11]),
      village = trim(row[10]),
      langtit = trim(row[13]),
      longtit = trim(row[14]);
      if((subconsName != "Special Voting") && subconsName !="1"){
        if((!centers[region]) ){
          fillRegion(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!centers[region].offices[office]){
          fillOffice(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!centers[region].offices[office].subcons[subconsId]){
          fillSubCons(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!centers[region].offices[office].subcons[subconsId].mahallat[mahalla]){
          fillMahalla(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village]){
          fillVillage(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        } else if (!centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].centers[centerId]){
          fillCenter(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
        }
      }
    })
    .on('close', function(count){
      cb(null,centers,allCents,allList);//return centers;
    })
    .on('error', function(error){
      console.log(error.message);
    });
    //console.log(centers);
    
  }
}

//module.exports.parseCenters();

/////////////////////////////
function fillRegion(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  centers[region]={};
  centers[region].region = region;
  centers[region].offices = {};
  fillOffice(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}
function fillOffice(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  centers[region].offices[office]={};
  centers[region].offices[office].name = officeName;
  centers[region].offices[office].id = office;
  centers[region].offices[office].subcons = {};
  fillSubCons(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}
function fillSubCons(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  centers[region].offices[office].subcons[subconsId]={};
  centers[region].offices[office].subcons[subconsId].name=subconsName;
  centers[region].offices[office].subcons[subconsId].id=subconsId;
  centers[region].offices[office].subcons[subconsId].mahallat={};
  fillMahalla(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}

function fillMahalla(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla]={};
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].name=mahalla;
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages={};
  fillVillage(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit);
}

function fillVillage(region,office,officeName,subconsId,subconsName,mahalla,village,centerId,centerName,langtit,longtit){
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village]={};
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].name=village;
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].centers={};
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
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].centers[centerId]={};
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].centers[centerId].name= centerName;
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].centers[centerId].id = centerId;
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].centers[centerId].langtit = langtit;
  centers[region].offices[office].subcons[subconsId].mahallat[mahalla].villages[village].centers[centerId].longtit = longtit;
}

function include(arr,obj) {
  return (arr.indexOf(obj) != -1);
}