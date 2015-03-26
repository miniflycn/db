var $ = require('jquery');

/**
 * DB
 * @class
 * @param {Object} options this is just a $.ajax setting
 *      @param {Array} options.errHandles
 *      @param {Array} options.succHandles
 *      @param {Function} options.succ
 *      @param {Function} options.err
 */
function DB(options) {
    this._init(options);
}
$.extend(DB.prototype, {
    _init: function (options) {
        this.errHandles = options.errHandles || [];
        this.succHandles = options.succHandles || [];
        this.errHandles.unshift.apply(this.errHandles, DB.options.errHandles || []);
        this.succHandles.unshift.apply(this.succHandles, DB.options.succHandles || []);
        options = $.extend({}, DB.options || {}, options);
        this.options = options;
    },
    _wrap: function (options) {
        var self = this;
        options.success = function (data) {
            // you may want to modify this line for judging error or success
            data.retcode === 0 ?
                self._apply(self.succHandles, data, options, options.succ) :
                self._apply(self.errHandles, data, options, options.err);
        };
        options.error = function (data) {
            self._apply(self.errHandles, data, options, options.err);
        };
        return options;
    },
    _apply: function (handles, data, options, cb) {
        var i = 0,
            l = handles.length,
            res = data;
        for (i; i < l; i++) {
            res = handles[i].call(this, res, options);
            // if handle return false, just break
            if (res === false) return;
        }
        cb && cb(res);
    },
    /**
     * ajax
     * @param {Object} options this is just a $.ajax setting
     *      @param {Function} options.succ
     *      @param {Function} options.err
     */
    ajax: function (options) {
        options = this._wrap($.extend({}, this.options, options));
        !options.data &&
            (options.data = options.param);
        $.ajax(options);
    }
});
$.extend(DB, {
    httpMethod: function (options) {
        var db = new DB(options);
        return function (opt) {
            db.ajax(opt);
            return this;
        };
    },
    extend: $.extend,
    // default options
    options: {}
});

module.exports = DB;
