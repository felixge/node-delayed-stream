# delayed-stream

Buffers events from a stream until you are ready to handle them.

## Usage

The following example shows how to write a http echo server that delays its
response by 1000 ms.

``` javascript
var DelayedStream = require('delayed-stream');
var http = require('http');

http.createServer(function(req, res) {
  var delayed = DelayedStream.create(req);

  setTimeout(function() {
    res.writeHead(200);
    delayed.pipe(res);
  }, 1000);
});
```

If you are not using `Stream#pipe`, you can also manually release the buffered
events by calling `delayedStream.resume()`:

``` javascript
var delayed = DelayedStream.create(req);

setTimeout(function() {
  // Emit all buffered events and resume underlaying source
  delayed.resume();
}, 1000);
```

## Implementation

In order to use this meta stream properly, here are a few things you should
know about the implementation.

### Event Buffering / Proxying

All events of the `source` stream are hijacked by overwriting the `source.emit`
method. Until node implements a catch-all event listener, this is the only way.

However, `DelayedStream` still continues to emit all events it captures on the
`source`, regardless of whether you have released the delayed stream yet or
not.

Upon creation, `DelayedStream` captures all `source` events and stores them in
an internal event buffer. Once `DelayedStream#release()` is called, all
buffered events are emitted on the `DelayedStream`, and the event buffer is
cleared. After that, `DelayedStream` merely acts as a proxy for the underlaying
source.

### Error handling

Error events on `source` are buffered / proxied just like any other events.
However, `DelayedStream#create` attaches a no-op `'error'` listener to the
`source`. This way you only have to handle errors on the `DelayedStream`
object, rather than in two places.

### Buffer limits

`DelayedStream` provides a `maxDataSize` property that can be used to limit
the amount of data being buffered. In order to protect you from bad `source`
streams that don't react to `source.pause()`, this feature is enabled by
default.

## API

### DelayedStream.create(source, [maxDataSize])

Creates a new `DelayedStream` that will emit an error if the `maxDataSize` is
exceeded.

Upon creation, the `source.pause()` is called.

### DelayedStream#source

The `source` stream managed by this object. This is useful if you are
passing your `DelayedStream` around, and you still want to access properties
on the `source` object.

### DelayedStream#maxDataSize = 1024 * 1024;

The amount of data to buffer before emitting an `error`.

If the underlaying source is emitting `Buffer` objects, the `maxDataSize`
refers to bytes.

If the underlaying source is emitting JavaScript strings, the size refers to
characters.

If you know what you are doing, you can set this property to `Infinity` to
disable this feature.

### DelayedStream#dataSize = 0;

The amount of data buffered so far.

### DelayedStream#readable

An ECMA5 getter that returns the value of `source.readable`.

### DelayedStream#resume()

If the DelayedStream has not been released so far, `DelayedStream#release()`
is called.

In either case, `source.resume()` is called.

### DelayedStream#pause()

Calls `source.pause()`.

### DelayedStream#pipe(dest)

Calls `DelayedStream#resume()` and then proxies the arguments to `source.pipe`.

#### DelayedStream#release

Emits and clears all events that have been buffered up so far. This does not
resume the underlaying source, use `DelayedStream#resume()` instead.
