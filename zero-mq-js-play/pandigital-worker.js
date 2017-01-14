var zeromq = require('zeromq');
var _ = require('underscore');

var source = 'tcp://localhost:12002';
var destination = 'tcp://localhost:12003';

var reciever = zeromq.socket('pull');
var sender = zeromq.socket('push');

reciever.connect(source);
sender.connect(destination);
console.log('pandigital-worker ready');

reciever.on('message', function(_number) {
    var digits = _number.toString().split('');
    var unique = _.uniq(digits);
    if (digits.length != unique.length) {
        return;
    }
    console.log('pandigital worker pid:', process.pid, 'pandigital:', _number.toString());
    sender.send(_number.toString());
});

process.on('SIGINT', function() {
    reciever.close();
    sender.close();
    process.exit(0);
});
