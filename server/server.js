var io = require('socket.io')(3000, { /* options */ });
var redis = require("redis");
var port="6379";
var host="127.0.0.1"
var redisClient = redis.createClient(port, host);
var pub = redis.createClient(port, host);
var sub = redis.createClient(port, host);
var channel = 'chatting';

sub.psubscribe("chatting");

sub.on("pmessage", function(pat, ch, msg) {
  console.log(ch);
  io.sockets. in (ch).emit('news', msg);
});

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
