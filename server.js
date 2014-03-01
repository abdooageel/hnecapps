
// require modules
var express = require('express'),
    i18n = require('i18n'),
    url = require('url'),
    hbs = require('hbs'),
    paginate = require('handlebars-paginate'),
    numeral = require('numeral'),
    mathjs = require('mathjs'),
    candidatesMgr=require('./app/candidates').candidatesMgr,
    getMgr = require('./app/get').getMgr,
    app  = express();
    math = mathjs();
    store  = new express.session.MemoryStore;

// minimal config
i18n.configure({
  locales: ['en', 'ar'],
  cookie: 'locale',
  directory: "" + __dirname + "/locales",
});

app.configure(function () {
  // setup hbs
  app.set('views', "" + __dirname + "/views");
  app.set('view engine', 'hbs');
  app.use(express.static(__dirname + "/www"));
  app.engine('hbs', hbs.__express);
  

  // you'll need cookies
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'something', store: store }));

  // init i18n module for this loop
  app.use(i18n.init);
  app.enable("jsonp callback");

});

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
  return numeral(value).format('0,0');;
});

hbs.registerHelper('translate', function(en , ar) {
  if (i18n.getLocale()=="en")
    return en;
  else 
    return ar;
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


app.get('/constituency/:id', function (req, res) {
  setlang(req);
  getMgr.handleGetConstit(req,res,function(res){
    res.render('constituency');
  });
});
app.get('/constituency/:id/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/constituency/"+req.params.id);
});

app.get('/ballot/:cid/:bid', function (req, res) {
  setlang(req);
  getMgr.handleGetBallot(req,res,function(res){
    
  });
});

app.get('/ballot/:cid/:bid/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/ballot/"+req.params.cid+"/"+req.params.bid);
});

app.get('/centers/:cid/:bid', function (req, res) {
  setlang(req);
  if(!url.parse(req.url, true).query.c){
    getMgr.handleGetCenters(req,res,function(res){
    });
  }
  else {
    getMgr.handleGetCenter(req,res,function(res){
    });
  }
});
app.get('/centers/:cid/:bid/:locale', function (req, res) {
  setlang(req);
  if(!url.parse(req.url, true).query.c){
    setdeflan(req,res);
    res.redirect("/centers/"+req.params.cid+"/"+req.params.bid);
  }
  else {
    setdeflan(req,res);
    res.redirect("/centers/"+req.params.cid+"/"+req.params.bid+"?c="+url.parse(req.url, true).query.c);
  }
});

// set a cookie to requested locale
app.get('/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/");
});
app.get('/', function (req, res) {
  setlang(req);
  getMgr.handleGetIndex(req.params,res,function(results){
     
  });
});

app.getDelay = function (req, res) {
  return url.parse(req.url, true).query.delay || 0;
};
function setlang(req){
  if(!req.session.language)
    req.session.language ="ar";
  i18n.setLocale(req.session.language);
}
function setdeflan(req,res){
  i18n.setLocale(req.params.locale);
  req.session.language = req.params.locale;
  res.cookie('locale', req.params.locale);
}

// startup
app.listen(3002);
