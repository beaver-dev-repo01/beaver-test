/*jshint esversion: 6*/

var debug = require('debug')(__filename.substring(__dirname.indexOf("beaver-test")).replace(".js", "").replace(/\\/gi, ":"));

var mysql = require('mysql');
var config = require('./db-info').moca;

var connection;

function mysqlConnect() {
  connection = mysql.createConnection(config);    // Recreate the connection, since
                                                  // the old one cannot be reused.
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      debug('error when connecting to mysql:', err);
      setTimeout(mysqlConnect, 2000);     // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    debug('mysql error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      mysqlConnect();                             // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

mysqlConnect();

module.exports = (() => {
  return {
    query: (query, next) => {
      connection.query(query, (err, result) => {
        if(err) {
          debug('Query error : ' + query);
          debug('err : ' + JSON.stringify(err));
        } else {
          debug('Query : ' + query);
          debug('result : ' + JSON.stringify(result));
        }

        next(err, result);
      });
    },

    close: () => {
      debug('Closed');
      connection.destroy();
    },

    beginTransaction : connection.beginTransaction,
    commit : connection.commit,
    rollback : connection.rollback
  };
})();
