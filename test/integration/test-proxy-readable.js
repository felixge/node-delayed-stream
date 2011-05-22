var common = require('../common');
var assert = common.assert;
var fake = common.fake.create();
var DelayedStream = common.DelayedStream;
var Stream = require('stream').Stream;

(function testProxyReadableProperty() {
  var source = new Stream();

  fake.expect(source, 'pause');
  var delayedStream = DelayedStream.create(source);

  source.readable = fake.value('source.readable');
  assert.strictEqual(delayedStream.readable, source.readable);
})();
