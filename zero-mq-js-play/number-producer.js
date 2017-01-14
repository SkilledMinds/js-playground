var zeromq = require('zeromq');
var producer = zeromq.socket('push');
var address = 'tcp://*:12000';

producer.bind(address, function(_error) {
    if (_error) {
        console.log('cannot bind to:', address);
        process.exit(0);
    }
    console.log('ready at :', address);
});

var runner = 9999999999;
while (runner > 999999999) {
    console.log('sending:', runner);
    producer.send(runner.toString());
    runner--;
}

process.on('SIGINT', function() {
    producer.close();
    process.exit(0);
});
