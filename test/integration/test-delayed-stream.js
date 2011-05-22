var common = require('../common');
var assert = common.assert;
var fake = common.fake.create();
var DelayedStream = common.DelayedStream;
var Stream = require('stream').Stream;

(function testDelayEventsUntilResume() {
  var source = new Stream();

  // DelayedStream.create pauses underlaying source
  fake.expect(source, 'pause');
  var delayedStream = DelayedStream.create(source);
  fake.verify();

  // delayedStream must not emit until we resume
  fake.expect(delayedStream, 'emit', 0);

  // but our original source must emit
  var params = [];
  source.on('foo', function(param) {
    params.push(param);
  });

  source.emit('foo', 1);
  source.emit('foo', 2);

  // Make sure delayedStream did not emit, and source did
  assert.deepEqual(params, [1, 2]);
  fake.verify();

  // After resume, delayedStream must playback all events
  fake
    .expect(delayedStream, 'emit')
    .withArg(1, 'newListener');
  fake.expect(delayedStream, 'emit', ['foo', 1]);
  fake.expect(delayedStream, 'emit', ['foo', 2]);
  fake.expect(source, 'resume');

  delayedStream.resume();
  fake.verify();

  // Calling resume again will delegate to source
  fake.expect(source, 'resume');
  delayedStream.resume();
  fake.verify();
})();
