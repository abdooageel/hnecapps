
var paginate = require('handlebars-paginate'),
    mathjs = require('mathjs'),
    math = mathjs();
module.exports = {
    registerAll : function(hbs,i18n){
      // register hbs helpers in res.locals' context which provides this.locale
    hbs.registerHelper('__', function () {
      return i18n.__.apply(this, arguments);
    });
    hbs.registerHelper('__n', function () {
      return i18n.__n.apply(this, arguments);
    });
    hbs.registerHelper('json', function(context) {
        return JSON.stringify(context);
    });

    hbs.registerHelper('turnout', function(vots,regs) {
      if(regs != null && vots != null)
        return  math.round(parseFloat(vots)*100/parseFloat(regs),2);
    });
    hbs.registerHelper('round', function(value) {
      if(value != null)
        return math.round(value,2);
    });
    hbs.registerHelper('numeral', function(value) {
      return numeral(value).format('0,0');
    });
    hbs.registerHelper('percent', function(total,sub) {
      return math.round((sub*100/total),2);
    });

    hbs.registerHelper('translate', function(en , ar) {
      if (i18n.getLocale()=="en")
        return en;
      else 
        return ar;
    });
    hbs.registerHelper('translatetype', function(str) {
      if (i18n.getLocale()=="en")
        return str;
      else 
        if(str=="General")
          return "عام";
        else
          return "نساء";
    });
    hbs.registerHelper('active', function(index) {
      if (index == 0)
        return "in active";
      else return null;
    });
    hbs.registerHelper('gentr', function(obj) {
      var tbody = '';
      for (key in obj){
        tbody += '<tr><td>'+key+'</td></tr>';
      }
      return tbody;
    });
    hbs.registerHelper('paginate',paginate);
    hbs.registerHelper('transr', function(region) {
      if (i18n.getLocale()=="en")
        switch(region){
        case "الشرقية":
          return "Eastern"
          break;
        case "الغربية":
          return "Western"
          break;
        case "الجنوبية":
          return "Southern"
          break;
        }
      else 
        return region;
    });
    hbs.registerHelper('transregion', function(region) {
      region = region.toString();
      if (i18n.getLocale()=="en")
        switch(region){
        case "3":
          return "Eastern"
          break;
        case "1":
          return "Western"
          break;
        case "2":
          return "Southern"
          break;
        }
      else {
        switch(region){
        case "3":
          return "الشرقية"
          break;
        case "1":
          return "الغربية"
          break;
        case "2":
          return "الجنوبية"
          break;
        }
      }
    });
    hbs.registerHelper('transs', function(sub) {
      if (i18n.getLocale()=="en")
        switch(sub){
        case "الأولي":
          return "First"
          break;
        case "الثانية":
          return "Second"
          break;
        case "الثالثة":
          return "Third"
          break;
        case "الرابعة":
          return "Forth"
          break;
        case "الخامسة":
          return "Fifth"
          break;
        default :
          return "-"
          break;
        }
      else 
        return sub;
    });
    hbs.registerHelper('plusone', function(value) {
        return value+1;
    });
  }
};