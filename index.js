var sliced = require('sliced');
module.exports = function(parent, callback) {
  var result;
  if(process.domain) {
    result = process.domain.intercept(callback || parent);
  } else if (callback) {
    result = function(err) {
      if(err) {
        parent(err);
      } else {
        callback.apply(this, sliced(arguments, 1));
      }
    };
  //single parameter with no domain
  } else {
    result = function(err) {
      if(err) throw err;
      parent.apply(this, sliced(arguments, 1));
    }
  }
  return result;
};

