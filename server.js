// require modules
var express = require('express'),
    i18n = require('i18n'),
    url = require('url'),
    hbs = require('hbs'),
    getMgr = require('./app/get').getMgr,
    centsGetMgr= require('./c_app/get').getMgr,
    hbsMgr = require('./app/hbshelpers'),
    store  = new express.session.MemoryStore;
var results = express(),
    centers = express();
express()
  .use(express.vhost('results',results))
  .use(express.vhost('centers',centers))
  .listen(3002)

// minimal config
i18n.configure({
  locales: ['en', 'ar'],
  cookie: 'locale',
  directory: "" + __dirname + "/locales",
});

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

hbsMgr.registerAll(hbs,i18n);


results.get('/constituency/:id', function (req, res) {
  setlang(req,res);
  getMgr.handleGetConstit(req,res,function(res){
    res.render('constituency');
  });
});
results.get('/constituency/:id/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/constituency/"+req.params.id);
});
results.get('/ballot/:cid/:bid', function (req, res) {
  setlang(req,res);
  getMgr.handleGetBallot(req,res,function(res){
    
  });
});

results.get('/ballot/:cid/:bid/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/ballot/"+req.params.cid+"/"+req.params.bid);
});

results.get('/centers/:cid/:bid', function (req, res) {
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
results.get('/centers/:cid/:bid/:locale', function (req, res) {
  setlang(req,res);
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
results.get('/:locale', function (req, res) {
  setdeflan(req,res);
  res.redirect("/");
});
results.get('/', function (req, res) {
  setlang(req,res);
  getMgr.handleGetIndex(req.params,res,function(results){
     
  });
});

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

/*centers.get('/centers1', function (req, res) {
  setlang(req,res);
  res.render('centers');
});*/
centers.get('/getCenters1', function (req, res) {
  centsGetMgr.handleGetAllCents(req.params,res,function(results){
    res.send(results);
  });
});


// set a cookie to requested locale
/*centers.get('/list', function (req, res) {
  setdeflan(req,res);
  res.redirect("/list");
});*/

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
