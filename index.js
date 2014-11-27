var sliced = require('sliced');
function twoArgHandler(parent, callback) {
  return function(err) {
    if(err) {
      parent(err);
    } else {
      callback.apply(callback, sliced(arguments, 1));
    }
  }
}

//bind callbacks with active domains
function withDomains(parent, callback) {
  if(callback) {
    return process.domain.bind(twoArgHandler(parent, callback));
  }
  return process.domain.intercept(parent);
}

//bind callbacks without an active domain
function withoutDomains(parent, callback) {
  if(callback) {
    return twoArgHandler(parent, callback);
  }
  //single callback + no domain = throw on error
  return function(err) {
    if(err) throw err;
    parent.apply(parent, sliced(arguments, 1));
  }
}

module.exports = function(parent, callback) {
  return process.domain ? withDomains(parent, callback) : withoutDomains(parent, callback);
};
