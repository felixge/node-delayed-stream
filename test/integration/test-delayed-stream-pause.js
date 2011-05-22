var common = require('../common');
var assert = common.assert;
var fake = common.fake.create();
var DelayedStream = common.DelayedStream;
var Stream = require('stream').Stream;

(function testDelayEventsUntilResume() {
  var source = new Stream();

  fake.expect(source, 'pause');
  var delayedStream = DelayedStream.create(source);

  fake.expect(source, 'pause');
  delayedStream.pause();
  fake.verify();
})();
