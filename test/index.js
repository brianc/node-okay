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

  describe('single parameter', function() {
    describe('with error', function() {
      it('throws error', function(done) {
        assert(!process.domain, 'should not be in a domain');
        var cb = function() {
          assert.fail('should not get here');
        };
        var action = ok(cb);
        try{
          action(new Error('expected'));
        } catch(e) {
          assert.equal(e.message, 'expected');
          done();
        }
      });
    });
    describe('with no error', function() {
      assert(!process.domain, 'should not be in a domain');
      it('calls callback', function(done) {
        var cb = function(var1, var2) {
          assert.equal(var1, 'test');
          assert.equal(var2, 1);
          done();
        };
        var action = ok(cb);
        action(null, 'test', 1);
      });
    });
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

    describe('two callbacks', function() {
      describe('with error', function() {
        it('calls error callback on domain', function(done) {
          var domain = require('domain').create();
          domain.on('error', function(e) {
            console.log(e);
            done(new Error("Should not send error to domain error handler"));
          });
          var errorCb = function(err) {
            assert.equal(process.domain, domain);
            assert(err);
            assert(err instanceof Error);
            done();
          };
          var successCb = function() {
            done(new Error("With error callback provided, success callback should not be called"));
          }
          domain.run(function() {
            bcrypt.hash('1', '2', ok(errorCb, successCb));
          });
        });
      });

      describe('success', function() {
        it('calls success callback', function(done) {
          var domain = require('domain').create();
          domain.on('error', function(e) {
            done(new Error("Should not send error to domain error handler"));
          });
          var errorCb = function(err) {
            done(new Error("Should not call error callback"));
          };
          var successCb = function(salt) {
            assert(salt, 'should have called success callback with salt');
            assert(typeof salt == 'string');
            done();
          }
          domain.run(function() {
            bcrypt.genSalt(1, ok(errorCb, successCb));
          });
        });
      });
    });

    describe('single callback', function() {
      describe('with error', function(done) {
        it('pushes error to domain', function(done) {
          var domain = require('domain').create();
          domain.on('error', function(e) {
            assert.equal(e.message, 'expected');
            done();
          });
          domain.run(function() {
            var cb = function() {
              assert.fail('should not have called callback');
            };
            var action = ok(cb);
            action(new Error('expected'));
          });
        });
      });
      describe('without error', function() {
        it('calls callback and does not raise domain error', function(done) {
          var domain = require('domain').create();
          domain.on('error', done);
          domain.run(function() {
            var cb = function(var1, var2) {
              assert.equal(var1, 'test');
              assert.equal(var2, 1);
              done();
            };
            var action = ok(cb);
            action(null, 'test', 1);
          });
        });
      });
    });
  });
});
