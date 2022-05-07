var express = require('express');
var routes = require('./routes');
var app  = express();

app.set('port',process.env.PORT || 3000);

// Configuration
app.connect(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.connect('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.connect('production', function () {
  app.use(express.errorHandler());
});
// Routes
app.get('/', routes.index);
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.get('port'),app.settings.env);