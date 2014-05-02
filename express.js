var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.listen(4730);
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname+'/public'));
app.get('/', function(req, res) {
  res.render('index');
});