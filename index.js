var sliced = require('sliced');
module.exports = function(parent, callback) {
  return function(err) {
    if(err) {
      parent(err);
    } else {
      callback.apply(this, sliced(arguments, 1));
    }
  };
};

