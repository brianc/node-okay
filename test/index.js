var assert = require('assert');

var ok = require(__dirname + '/../');

describe('ok', function() {
  it('returns a function', function() {
    var cb = ok(cb, function(result) {
    });
    assert.equal('function', typeof cb);
  });

  it('calls parent callback on error', function(done) {
    var parent = function(err) {
      assert(err instanceof Error);
      assert.equal(err.message, "OH NO");
      done();
    };
    var cb = ok(parent, function(res) {
      done("This should not have been called")
    });
    cb(new Error("OH NO"));
  });

  it('calls child if there is no error', function(done) {
    var cb = ok(done, function(one, two, three) {
      assert.equal(one, true);
      assert.equal(two, 2);
      assert.equal(three, "three");
      done();
    });
    cb(null, true, 2, "three");
  });
});
