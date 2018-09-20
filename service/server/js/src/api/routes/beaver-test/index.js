/*jshint esversion: 6 */

var debug = __require('debug')(__filename.substring(__dirname.indexOf(__projectRootName)).replace(".js", "").replace(/\\/gi, ":"));
var test = __require('api/lib', 'test');

var router = __require('express').Router();
router.post('/', [
  (req, res, next) => {
    var l = test.getList(req, res, (req, res, l) => {
      res.json({ result: 'OK', message: 'New messages', data: l });
    });
  }
]);

module.exports = router;
