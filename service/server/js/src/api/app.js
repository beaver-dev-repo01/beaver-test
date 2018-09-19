/*jshint esversion: 6 */

global.__projectRootName = 'beaver';

var debug = require('debug')(__filename.substring(__dirname.indexOf(__projectRootName)).replace(".js", "").replace(/\\/gi, ":"));
var path = require("path");

global.__path_storage = path.join(__dirname, '../../../storage');

var libs = {
  'lib': path.join(__dirname, '../../lib'),
  'api/lib': path.join(__dirname, 'lib')
};

global.__require = (name1, name2) => {
  if (name2 !== undefined) {
    if (Object.keys(libs).indexOf(name1) > -1) {
      return require(path.join(libs[name1], name2));
    }

    throw new Error('Could not found library : ' + name1 + '/' + name2);
  } else {
    return require(name1);
  }
};

var express = __require('express');
var bodyParser = __require('body-parser');
var multiparty = __require('connect-multiparty');
var json = __require('express-json');
var logger = __require('morgan');
var fs = __require("fs");

var app = express();
app.use(logger('dev'));

app.use(multiparty({ uploadDir: __path_storage }));
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(json());

var db = __require('lib', 'db');
var redis = __require('redis').createClient(6379, 'beaver-test-redis.m7haae.ng.0001.apn2.cache.amazonaws.com', { no_ready_check: true });

redis.on('connect', () => {
  debug('Redis connected');
});
redis.on('error', (err) => {
  debug('Redis connect error ' + err);
});

var fcmPush = __require('fcm-push');
var FCM_SERVER_KEY = 'AAAA5H-GYoI:APA91bFE-hUsWxTJNpx3gvZ6lY15w63apjRyX_7uN7nT0XTBN9D6p160t961PHhku3-h0kRGzdAWZ7qlP0i1lVGMIMHWKAy1GM0Do_TA0PoI18mIniOXPl86YPAemEluEjkbQQdqX6g-';
var fcm = new fcmPush(FCM_SERVER_KEY);

var fcmSend = (message) => {
  fcm.send(message, (err, response) => {
    if (err) {
      console.log("FCM Messages has gone wrong!");
    } else {
      console.log("FCM Successfully sent with response: ", response);
    }
  });
};

app.use((req, res, next) => {
  console.log(req.method + ' ' + req.path + ' begin');
  next();
});

app.use((req, res, next) => {
  res.db = db;
  res.beaver = {
    db: db.beaver,
    cache: redis,
    fcm: {
      send: fcmSend
    }
  };
  next();
});

//for AJAX
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(require('./routes'));

app.use('/images/:filename', (req, res) => {
  res.download(path.join(__path_storage, 'beaver/' + req.params.filename));
});

//app.use('/html', express.static(__path_storage));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
