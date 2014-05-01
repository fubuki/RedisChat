var socketio = require('socket.io');
var RedisStore = require('socket.io-redis');
var redis = require("redis");
var port="6379";
var host="127.0.0.1"
var redisClient = redis.createClient(port, host);
var pub = redis.createClient(port, host);
var sub = redis.createClient(port, host);
var channel = 'chatting';

var cluster = require('cluster'), 
numCPUs = require('os').cpus().length;




if (cluster.isMaster) {
  console.log('master');
  var redisClient = redis.createClient(port, host);
  var pub = redis.createClient(port, host);
  var sub = redis.createClient(port, host);
  var io = socketio({ path: '/web/socket.io' });

  io.adapter(RedisStore({ host: host, port: port }));

  sub.psubscribe("chatting");

  sub.on("pmessage", function(pat, ch, msg) {
    console.log(ch);
    io.sockets. in (ch).emit('news', msg);
  });

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

} else {
  console.log('child');
  var redisClient = redis.createClient(port, host);
  var pub = redis.createClient(port, host);
  var sub = redis.createClient(port, host);
  var io = socketio(3000, {path: '/web/socket.io' });

  io.adapter(RedisStore({ host: host, port: port }));


  io.use(function(socket, next) {
    var handshakeData = socket.request;
    next();
  });

  io.sockets.on('connection', function (client) {
    client.join(channel);
    client.on("typing", function(content) {
      console.log(content);
      var msg = {
          content : content
        };
      pub.publish("chatting", JSON.stringify(msg));
    });

    client.on('disconnect', function() {

      console.log('disconnect');
      client.leave(channel);
    });
  });


}







