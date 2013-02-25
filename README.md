# okay

automatically return the error to the previous callback

## without okay
```js
var doSomething = function(path, callback) {
  fs.readDir(function(err, files) {
    if(err) return callback(err);
    async.forEach(files, fs.readFile, function(err, contents) {
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
    async.forEach(files, fs.ReadFile, ok(callback, function(contents) {
      return callback(null, contents.join('\n'));
    }));
  });
};
```

## express + okay
```js
var ok = require('okay');
get('/', function(req, res, next) {
  fs.readFile('file.txt', 'utf', ok(next, function(contents)) {
    res.send contents;
  });
});
```

code golf, baby.

## license
MIT
