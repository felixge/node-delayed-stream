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

### API
