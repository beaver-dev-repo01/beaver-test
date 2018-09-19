/*jshint esversion: 6 */

var debug = __require('debug')(__filename.substring(__dirname.indexOf(__projectRootName)).replace(".js", "").replace(/\\/gi, ":"));

module.exports.getList = (req, res) => {
  res.beaver.db.test.find({}, (err, data) => {
    if (err) {
      debug('getList() - Failed');
      return;
    }

    var l = [];
    data.forEach((o, i) => {
      l.push({ id: o.id, name: o.name, message: o.message, cts: o.cts, uts: o.uts });
    });

    return l;
  });
};