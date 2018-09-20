
var db = require('../../db-con');

module.exports = {
  find: (param, next) => {
    var q = "SELECT *, TIMESTAMPDIFF(SECOND,'1970-01-01 09:00:00',cts) AS cutc, TIMESTAMPDIFF(SECOND,'1970-01-01 09:00:00',uts) AS uutc FROM test";
    db.query(q, (err, result) => {
      if (err) {
        next({ result: 'FAILED', message: 'System' });
        return;
      }
      var l = [];
      result.forEach((o, i) => {
        l.push({ id: o.id, name: o.name, message: o.message, cts: o.cutc, uts: o.uutc });
      });
      next(null, l);
    });
  }
};
