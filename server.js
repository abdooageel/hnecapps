// require modules
var express = require('express'),
    i18n = require('i18n'),
    url = require('url'),
    hbs = require('hbs'),
    config = require('./config'),
    getMgr = require('./app/get').getMgr,
    centsGetMgr= require('./c_app/get').getMgr,
    candsGetMgr=require('./cn_app/get').getMgr,
    parlGetMgr=require('./p_app/get').getMgr,
    hbsMgr = require('./app/hbshelpers'),
    store  = new express.session.MemoryStore;
var results = express(),
    centers = express(),
    candidates = express();
express()
  .use(express.vhost(config.results,results))
  .use(express.vhost(config.centers,centers))
  .use(express.vhost(config.candidates,candidates))
  .listen(config.port)

// minimal config
i18n.configure({
  locales: ['en', 'ar'],
  cookie: 'locale',
  directory: "" + __dirname + "/locales",
});
////////////////////////////////////////////
results.configure(function () {
  // setup hbs
  results.set('views', "" + __dirname + "/r_views");
  results.set('view engine', 'hbs');
  results.use(express.static(__dirname + "/www"));
  results.engine('hbs', hbs.__express);
  // you'll need cookies
  results.use(express.cookieParser());
  results.use(express.session({ secret: 'something', store: store }));
  // init i18n module for this loop
  results.use(i18n.init);
  results.enable("jsonp callback");
});
////////////////////////////////////////////
centers.configure(function () {
  // setup hbs
  centers.set('views', "" + __dirname + "/c_views");
  centers.set('view engine', 'hbs');
  centers.use(express.static(__dirname + "/www"));
  centers.use('/list', express.static(__dirname + '/www/list'));
  centers.use('/list',express.directory(__dirname + '/www/list'));

  centers.engine('hbs', hbs.__express);
  // you'll need cookies
  centers.use(express.cookieParser());
  centers.use(express.session({ secret: 'something', store: store }));
  // init i18n module for this loop
  centers.use(i18n.init);
  centers.enable("jsonp callback");
});
////////////////////////////////////////////
candidates.configure(function () {
  // setup hbs
  candidates.set('views', "" + __dirname + "/cn_views");
  candidates.set('view engine', 'hbs');
  candidates.use(express.static(__dirname + "/www"));
  candidates.engine('hbs', hbs.__express);
  // you'll need cookies
  candidates.use(express.cookieParser());
  candidates.use(express.session({ secret: 'something', store: store }));
  // init i18n module for this loop
  candidates.use(i18n.init);
  candidates.enable("jsonp callback");
});

hbsMgr.registerAll(hbs,i18n);

//////////////////////////////////////////////////////////
results.get('/60/constituency/:id', function (req, res) {
  setlang(req,res);
  getMgr.handleGetConstit(req,res,function(res){
    res.render('constituency');
  });
});
results.get('/60/constituency/:id/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/60/constituency/"+req.params.id);
});
results.get('/60/ballot/:cid/:bid', function (req, res) {
  setlang(req,res);
  getMgr.handleGetBallot(req,res,function(res){
    
  });
});
results.get('/60/ballot/:cid/:bid/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/60/ballot/"+req.params.cid+"/"+req.params.bid);
});

results.get('/60/centers/:cid/:bid', function (req, res) {
  setlang(req,res);
  if(!url.parse(req.url, true).query.c){
    getMgr.handleGetCenters(req,res,function(res){
    });
  }
  else {
    getMgr.handleGetCenter(req,res,function(res){
    });
  }
});
results.get('/60/centers/:cid/:bid/:locale', function (req, res) {
  setlang(req,res);
  if(!url.parse(req.url, true).query.c){
    setdeflan(req,res);
    res.redirect("/60/centers/"+req.params.cid+"/"+req.params.bid);
  }
  else {
    setdeflan(req,res);
    res.redirect("/60/centers/"+req.params.cid+"/"+req.params.bid+"?c="+url.parse(req.url, true).query.c);
  }
});

// set a cookie to requested locale
results.get('/60/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/60/");
});
results.get('/60/', function (req, res) {
  setlang(req,res);
  getMgr.handleGetIndex(req.params,res,function(results){
     
  });
});

////
results.get('/cor/centers/:cid/:bid', function (req, res) {
  setlang(req,res);
  if(!url.parse(req.url, true).query.c){
    parlGetMgr.handleGetCenters(req,res,function(res){
    });
  }
  else {
    parlGetMgr.handleGetCenter(req,res,function(res){
    });
  }
});
results.get('/cor/centers/:cid/:bid/:locale', function (req, res) {
  setlang(req,res);
  if(!url.parse(req.url, true).query.c){
    setdeflan(req,res);
    res.redirect("/cor/centers/"+req.params.cid+"/"+req.params.bid);
  }
  else {
    setdeflan(req,res);
    res.redirect("/cor/centers/"+req.params.cid+"/"+req.params.bid+"?c="+url.parse(req.url, true).query.c);
  }
});
results.get('/cor/ballot/:cid/:bid', function (req, res) {
  setlang(req,res);
  parlGetMgr.handleGetBallot(req,res,function(res){
    
  });
});
results.get('/cor/ballot/:cid/:bid/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/cor/ballot/"+req.params.cid+"/"+req.params.bid);
});
results.get('/cor/constituency/:id', function (req, res) {
  setlang(req,res);
  parlGetMgr.handleGetConstit(req,res,function(res){
    res.render('pconstituency');
  });
});
results.get('/cor/constituency/:id/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/cor/constituency/"+req.params.id);
});
results.get('/cor/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/cor/");
});
results.get('/cor/', function (req, res) {
  setlang(req,res);
  parlGetMgr.handleGetIndex(req.params,res,function(results){
     
  });
});
//////////////////////////////////////////////////////////////
centers.get('/getCenters/:region', function (req, res) {
  centsGetMgr.handleGetIndex(req.params,res,function(res){
    var region = req.params.region;
    res.send(res.locals.centers[region]);
  });
});
centers.get('/getSubCons/:region/:office', function (req, res) {
  centsGetMgr.handleGetIndex(req.params,res,function(res){
    var region = req.params.region,
        office = req.params.office;
    res.send(res.locals.centers[region].offices[office]);
  });
});

centers.get('/centers1', function (req, res) {
  setlang(req,res);
  res.render('centers');
});
centers.get('/getCenters1', function (req, res) {
  centsGetMgr.handleGetAllCents(req.params,res,function(results){
    res.send(results);
  });
});


// set a cookie to requested locale
centers.get('/list', function (req, res) {
  setdeflan(req,res);
  res.redirect("/list");
});

centers.get('/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/");
});

centers.get('/', function (req, res) {
  setlang(req,res);
  centsGetMgr.handleGetIndex(req.params,res,function(results){
    res.render('index');
  });
});
///////////////////////////////////////////////////////////
candidates.get('/getCands', function (req, res) {
  candsGetMgr.handleGetAllCands(req.params,res,function(results){
    res.send(results);
  });
});

candidates.get('/candidate/:id', function (req, res) {
  setlang(req,res);
  candsGetMgr.handleGetCand(req.params,res,function(results){
    res.render('candidate');
  });
});
candidates.get('/candidate/:id/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/candidate/"+req.params.id);
});

candidates.get('/', function (req, res) {
  setlang(req,res);
  candsGetMgr.handleGetIndex(req.params,res,function(results){
    res.render('index');
  });
});

candidates.get('/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/");
});




//////////////////////////////////////////////////////////////
function setlang(req,res){
  if(!req.cookies.locale)
    req.cookies.locale ="ar";
  i18n.setLocale(req.cookies.locale);
  res.cookie('locale', req.cookies.locale);
}
function setdeflan(req,res){
  i18n.setLocale(req.params.locale);
  req.session.language = req.params.locale;
  res.cookie('locale', req.params.locale);
}

// startup
//app.listen(3002);
