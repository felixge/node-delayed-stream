var common = require('../common');
var assert = common.assert;
var fake = common.fake.create();
var DelayedStream = common.DelayedStream;
var Stream = require('stream').Stream;

(function testMaxDataSize() {
  var source = new Stream();

  fake.stub(source, 'pause');
  var delayedStream = DelayedStream.create(source, 1024);

  source.emit('data', new Buffer(1024));

  fake
    .expect(delayedStream, 'emit')
    .withArg(1, 'error');
  source.emit('data', new Buffer(1));
  fake.verify();
})();
