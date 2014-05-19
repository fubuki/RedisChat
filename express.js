var express = require('express');
var redis = require("redis");
var app = express();

var redisClient = redis.createClient('6379', '127.0.0.1');
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


app.get('/history', function(req, res) {

	redisClient.lrange("chatting", 0, 10, function(error, history){
		if (error) throw error
		res.send(history);
  	});
 
});