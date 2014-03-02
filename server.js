
// require modules
var express = require('express'),
    i18n = require('i18n'),
    url = require('url'),
    hbs = require('hbs'),
    numeral = require('numeral'),
    mathjs = require('mathjs'),
    candidatesMgr=require('./app/candidates').candidatesMgr,
    getMgr = require('./app/get').getMgr,
    hbsMgr = require('./app/hbshelpers'),
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

hbsMgr.registerAll(hbs,i18n);


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
