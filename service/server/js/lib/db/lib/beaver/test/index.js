module.exports = {
  find: (param, next) => {
    var q = "select *, TIMESTAMPDIFF(SECOND,'1970-01-01 09:00:00',cts) as cutc, TIMESTAMPDIFF(SECOND,'1970-01-01 09:00:00',uts) as uutc";
    db.query(q, (err, result) => {
      if (err) {
        next({ result: 'FAILED', message: 'System' });
        return;
      }
      var l = [];
      result.forEach((o, i) => {
        l.push({ id: o.id, name: o.id, message: o.id, cts: cutc, uts: uutc });
      });
      next(null, l);
    });
  }
};
