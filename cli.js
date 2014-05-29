var mqtt = require("mqtt");
var readline = require('readline');

var client = mqtt.createClient(1883, '127.0.0.1', {clientId:"cli",clean:false});

client.subscribe("chatting", {qos: 1});

client.on("message", function(topic, message) {
	console.log("mqtt::"+message);
});


var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', function(line){
	client.publish("chatting", line);
})