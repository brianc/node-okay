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

  describe('with domains', function() {
    var domain = require('domain').create();
    assert.equal(process.domain, null);
    bcrypt = require('bcrypt');
    it('looses domain without okay', function(done) {
      domain.run(function() {
        assert.equal(process.domain, domain, "should be on active domain");
        bcrypt.genSalt(1, function(err, salt) {
          if(err) return err;
          assert.equal(process.domain, null, "should have detached from domain");
          done();
        });
      });
    });

    it('remains in domain with okay', function(done) {
      domain.run(function() {
        assert(process.domain, "should be in a domain");
        bcrypt.genSalt(1, ok(done, function(salt) {
          assert(process.domain, "after callback should still be in domain");
          assert.equal(process.domain, domain, "should be in the SAME domain");
          done();
        }));
      });
    });
  });
});
