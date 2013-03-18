var sliced = require('sliced');
module.exports = function(parent, callback) {
  var result;
  if(process.domain) {
    result = process.domain.intercept(callback);
  } else {
    result = function(err) {
      if(err) {
        parent(err);
      } else {
        callback.apply(this, sliced(arguments, 1));
      }
    };
  }
  return result;
};

