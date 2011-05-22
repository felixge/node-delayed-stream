var Stream = require('stream').Stream;
var util = require('util');

module.exports = DelayedStream;
function DelayedStream() {
  this.source = null;

  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source) {
  var delayedStream = new this();

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  source.pause();

  return delayedStream;
};

DelayedStream.prototype.__defineGetter__('readable', function() {
  return this.source.readable;
});

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype._handleEmit = function(args) {
  this._bufferedEvents.push(args);
};
