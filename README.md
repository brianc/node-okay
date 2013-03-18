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
  fs.readDir(ok(callback, function(files)){
    async.map(files, fs.ReadFile, ok(callback, function(contents) {
      return callback(null, contents.join('\n'));
    }));
  });
};
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
