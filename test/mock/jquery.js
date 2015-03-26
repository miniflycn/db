function _extend(target, srcs) {
  srcs = [].splice.call(arguments, 1);
  var i = 0, l = srcs.length, src, key;
  for (; i < l; i++) {
      src = srcs[i];
      for (key in src) {
          target[key] = src[key];
      }
  }
  return target;
}

var $ = {
  extend: function (target) {
    if (arguments.length === 1) return _extend(this, target);
    return _extend.apply(this, arguments);
  },
  ajax: function (opt) {
    var res = opt.res
      , success = opt.success
      , error = opt.error;
    setImmediate(function () {
      success(res);
    });
  }
}

module.exports = $;
