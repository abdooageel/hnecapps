

// require modules
var express = require('express'),
    i18n = require('i18n'),
    url = require('url'),
    hbs = require('hbs'),
    candidatesMgr=require('./app/candidates').candidatesMgr,
    app = module.exports = express();

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
  app.engine('hbs', hbs.__express);
  app.use(express.static(__dirname + '/www'));

  // you'll need cookies
  app.use(express.cookieParser());

  // init i18n module for this loop
  app.use(i18n.init);

});

// register hbs helpers in res.locals' context which provides this.locale
hbs.registerHelper('__', function () {
  return i18n.__.apply(this, arguments);
});
hbs.registerHelper('__n', function () {
  return i18n.__n.apply(this, arguments);
});

// delay a response to simulate a long running process,
// while another request comes in with altered language settings
app.get('/', function (req, res) {
  console.log(i18n.getLocale()+"index");
  res.locals={
    arUrl : "/ar",
    enUrl : "/en"
  }
  res.render('index');
});

app.get('/candidates', function(req, res){
  candidatesMgr.getCandidates(300,function(result){
    res.locals= {
      candidates : result,
      arUrl : "/candidates/ar",
      enUrl : "/candidates/en"
    }
    res.render('candidates');
  });
  
});
app.get('/candidates/:locale', function (req, res) {
  i18n.setLocale(req.params.locale);
  console.log(i18n.getLocale()+"clocale");
  res.cookie('locale', req.params.locale);
  res.redirect("/candidates");
});

// set a cookie to requested locale
app.get('/:locale', function (req, res) {
  i18n.setLocale(req.params.locale);
  console.log(i18n.getLocale()+"locale");
  res.cookie('locale', req.params.locale);
  res.redirect("/");
});

// simple param parsing
app.getDelay = function (req, res) {
  return url.parse(req.url, true).query.delay || 0;
};

// startup
app.listen(3000);
