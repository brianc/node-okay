# okay

Bubble errors back up your big ol' nested callback chain.

If domains are in use, defer the error to the domain's error handler by using `process.domain.intercept` transparently.

## without okay
```js
var doSomething = function(path, callback) {
  fs.readDir(function(err, files) {
    if(err) return callback(err);
    async.map(files, fs.readFile, function(err, contents) {
      if(err) return callback(err);
      return callback(null, contents.join('\n'));
    });
  });
};
```

## with okay
```js
var ok = require('okay');
var doSomething = function(path, callback) {
  //if path exists, bubble the error out to the 
  //callback function right away
  //if there was no error, call the new error-less callback
  fs.readDir(path, ok(callback, function(files)){
    
    //if there was an error reading any file, bubble the error out to the
    //callback function right away
    //if there was no error, call the new error-less callback
    async.map(files, fs.ReadFile, ok(callback, function(contents) {
      return callback(null, contents.join('\n'));
    }));
  });
};

//okay also supports a single callback
var doSomethingOrDie = function(path, callback) {
  //if there is an error with fs.readDir, THROW it
  //if there was no error, call the new error-less callback
  fs.readDir(path, ok(function(files) {    
    //if there was an error reading any file, THROW it
    //if there was no error, call the new error-less callback
    async.map(files, fs.ReadFile, ok(function(contents) {
      return callback(null, contents.join('\n'));
    }));
  });
};

```

## domains

Throwing errors is _probably_ not what you want to do.

`Okay` comes in __really handy__ if you are using [domains](http://nodejs.org/api/domain.html).  It transparently passes the error back into the active domain if it exists, or it calls your callback with the error parameter already removed in the happy circumstance where there is no error.  It's basically shorthand for `process.domain.intercept` but will fall back to throwing exceptions if domains are not activated or you're currently not bound to a domain.

```js
var ok = require('okay');
var domain = require('domain');
var count = 0;
var handler = function(req, res) {
  var requestDomain = domain.create();
  req.id = new Date() + (count++);
  requestDomain.add(req);
  requestDomain.add(res);
  requestDomain.on('error', function(err) {
    console.log('error handling request ' + req.id);
    console.log(err);
    try {
      res.end(500);
    } catch(e) {
      console.log('could not send response 500 code');
    }
  });
  process.nextTick(function() {
    setTimeout(function() {
      //read some missing file to cause an error
      //the error will fire on the request's domain
      //and WILL NOT crash the server
      if(count % 2) {
        fs.readFile('omsdflksjdflsk', ok(function(contents) {
          res.writeHead(200);
          res.end('ok');
        }));
      } else {
        //this exception will fire on the request's domain
        //as well and will also NOT crash the server
        process.nextTick(ok(function() {
          throw new Error("I Broke it.")
        }));
      }
    }, 1000);
  })
}

var serverDomain = domain.create();
serverDomain.on('error', function(e) {
  console.log('something happened with the server!')
  console.log(e);
});
serverDomain.run(function() {
  var http = require('http');
  var server = http.createServer(handler);
  server.listen(80);
});
```

## express + okay
```js
var ok = require('okay');
get('/', function(req, res, next) {
  fs.readFile('file.txt', 'utf8', ok(next, function(contents)) {
    res.send(contents);
  });
});
```

## coffee-script + express + okay
```coffee-script
ok = require "okay"
app.get "/", (req, res, next) ->
  fs.readFile "file.txt", "utf8", ok next, (contents) ->
    res.send(contents)
```

## mocha + okay
```js
var ok = require('okay');
describe('a directory', function() {
  it('exists', function(done) {
    fs.readdir(__dirname, ok(done, function(files){
      assert.equal(1, files.length);
      done();
    }));
  });
});
```

code golf, baby.

## license
MIT
