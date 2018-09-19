/*jshint esversion: 6*/
var dbInfo = require('./lib/db-info');
var dbCon = require('./lib/db-con');
var fs = require('fs');

var _module_name = 'beaver-test';

var ddls = [
  'test'
];

var dbQueue = [];
var db = {
  push: (q, f) => {
    dbQueue.push({ q: q, f: f });
  },
  run: () => {
    var o = dbQueue.shift();
    if (o) {
      //console.log(o.q);
      dbCon.query(o.q, (err, result) => {
        o.f(err, result);
        db.run();
      });
    } else {
      dbCon.close();
    }
  }
};

ddls.reverse().forEach((t, i) => {
  db.push('drop ' + (t.endsWith('_view') ? 'view' : 'table') + ' if exists ' + t + ';', (err, result) => {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    console.log(t + ' schema is dropped.');
  });
});

ddls.forEach((t, i) => {
  db.push(fs.readFileSync('../../../db/ddl/' + _module_name + '.' + t + '.sql', 'utf8'), (err, result) => {
    if (err) {
      console.log(JSON.stringify(err));
      return;
    }
    console.log(t + ' schema is created.');
  });
});

var dmls = ['test'];
dmls.forEach((t, i) => {
  var qs = fs.readFileSync('../../../db/dml/' + _module_name + '.' + t + '.sql', 'utf8').split('\n');
  qs.forEach((q, i) => {
    if (q.length > 0) {
      db.push(q, (err, result) => {
        if (err) {
          console.log(JSON.stringify(err));
          return;
        }
        console.log(t + ' table data is inserted.');
      });
    }
  });
});

db.run();
