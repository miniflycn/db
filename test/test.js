var requireModify = require('require-modify')
  , DB = requireModify('../../src/db.feeder', function (src) {
    return src.replace("require('jquery')", "require('../test/mock/jquery')");
  });

describe('core', function () {
  it('should able to extend itself', function () {
    DB.extend({
      test1: DB.httpMethod({
        res: {
          retcode: 0,
          msg: 'hello'
        },
        succHandles: [function (res) {
          return res.msg;
        }],
        errHandles: [function (res) {
          return res.msg;
        }]
      })
    });

    (typeof DB.test1 === 'function').should.be.ok;
  })

  it('should able to filter the success\'s result', function (done) {
    DB.test1({
      succ: function (res) {
        res.should.equal('hello');
        done();
      }
    });
  });

  it('should able to filter the error\'s result', function (done) {
    DB.test1({
      res: {
        retcode: 1,
        msg: 'hello world'
      },
      err: function (res) {
        res.should.equal('hello world');
        done();
      }
    })
  });
});

describe('feeder', function () {
  it('should able to use a feeder', function (done) {
    DB.extend({
      test2: DB.getFeeder({
        succHandles: [function (res) {
          return res.msg;
        }],
        errHandles: [function (res) {
          return res.text;
        }]
      })
    });

    DB.test2({
      succ: function (res) {
        res.should.equal('hello');
        done();
      }
    });

    DB.test2.feed({
      retcode: 0,
      msg: 'hello'
    });
  });

  it('should able use the cache data again', function (done) {
    DB.test2({
      succ: function (res) {
        res.should.equal('hello');
        done();
      }
    })
  });

  it('should able change the data again', function (done) {
    DB.test2.feed({
      retcode: 1,
      text: 'hello world'
    });

    DB.test2({
      err: function (res) {
        res.should.equal('hello world');
        done();
      },
      succ: function () {
        throw new Error('should not success');
      }
    });
  });
})
