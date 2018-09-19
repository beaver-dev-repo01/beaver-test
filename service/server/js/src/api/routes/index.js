/*jshint esversion: 6*/

var router = __require('express').Router();
router.use('/beaver-test', require('./beaver-test'));
module.exports = router;
