var common = require('../common');
var assert = common.assert;
var fake = common.fake.create();
var DelayedStream = common.DelayedStream;
var Stream = require('stream').Stream;

(function testPipeReleases() {
  var source = new Stream();

  fake.stub(source, 'pause');
  var delayedStream = DelayedStream.create(source);

  fake.expect(delayedStream, 'resume');
  delayedStream.pipe(new Stream());
})();
