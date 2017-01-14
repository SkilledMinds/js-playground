var zeromq = require('zeromq');
var source = 'tcp://localhost:12000';
var destination = 'tcp://localhost:12001';

var reciever = zeromq.socket('pull');
var sender = zeromq.socket('push');

reciever.connect(source);
sender.connect(destination);
console.log('prime-worker pid:', process.pid, 'ready');

var prime = function(_number) {
    for (var i = 2; i <= Math.sqrt(_number); i++) {
        if (_number % i === 0) {
            return false;
        }
    }
    return true;
};

reciever.on('message', function(_number) {
    var number = parseInt(_number.toString());
    if (!prime(number)) {
        return;
    }
    console.log('prime-worker pid:', process.pid, 'prime:', number);
    sender.send(number.toString());
});

process.on('SIGINT', function() {
    reciever.close();
    sender.close();
    process.exit(0);
});
