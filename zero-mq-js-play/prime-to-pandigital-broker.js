var zeromq = require('zeromq');
var reciever = zeromq.socket('pull');
var sender = zeromq.socket('push');
var raddress = 'tcp://*:12001';
var saddress = 'tcp://*:12002';

reciever.bind(raddress, function(_error) {
    if (_error) {
        console.log('cannot bind to:', raddress);
        process.exit(0);
    }
    console.log('prime-to-pandigital-broker router ready at :', raddress);
});

sender.bind(saddress, function(_error) {
    if (_error) {
        console.log('cannot bind to:', saddress);
        process.exit(0);
    }
    console.log('prime-to-pandigital-broker dealer ready at :', saddress);
});

reciever.on('message', function(_number) {
    console.log('forward:', _number.toString());
    sender.send(_number.toString());
});

process.on('SIGINT', function() {
    reciever.close();
    sender.close();
    process.exit(0);
});
