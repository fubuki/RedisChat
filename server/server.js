var io = require('socket.io').listen(3000);
var redis = require("redis");
var port="6379";
var host="192.168.84.144"
var redisClient = redis.createClient(port, host);
var redisPublishClient = redis.createClient(port, host);
var msgList='jsdc:msgs';
var channel='jsdc:jsdc';
var moment = require('moment');
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('message',function(data){
  	var err;

      try {
        if (data.msg == null) {
          return;
        }
        data.ts = moment().unix();
        console.log('[chat] ' + JSON.stringify(data));
        return redisPublishClient.rpush(msgList, JSON.stringify(data), function(err, res) {
          data.id = res;
          data.ts = moment.unix(data.ts).format('HH:mm:ss YYYY-MM-DD');
          return redisPublishClient.publish(channel, JSON.stringify({
            channel: 'chat',
            data: data
          }));
        });
      } catch (_error) {
        err = _error;
        return console.trace();
      }
  });
   socket.on("subscribe", function(data) {
      var err, n;

      try {
        console.log('[subscribe] ' + data.channel);
        if (data.channel === 'chat') {
          n = 5;
          redisPublishClient.llen(msgList, function(err, res) {
            var endIndex, startIndex;

            endIndex = res;
            startIndex = Math.max(endIndex - n, 0);
            return redisPublishClient.lrange(msgList, startIndex, endIndex, function(err, res) {
              var counter, dataToPub, json, _i, _len;

              counter = 0;
              dataToPub = [];
              for (_i = 0, _len = res.length; _i < _len; _i++) {
                json = res[_i];
                data = JSON.parse(json);
                data.id = startIndex + counter;
                if (data.ts != null) {
                  data.ts = moment.unix(data.ts).format('HH:mm:ss YYYY-MM-DD');
                }
                counter++;
                dataToPub.unshift(data);
              }
              return socket.emit("chat", dataToPub);
            });
          });
        } 
        return socket.join(data.channel);
      } catch (_error) {
        err = _error;
        return console.trace();
      }
    });
  	
  redisClient.on("ready", function() {
    return redisClient.subscribe(channel);
  });


});