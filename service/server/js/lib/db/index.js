var dbCon = require('./lib/db-con');

module.exports = (function() {
  return {
    connect : dbCon.connect,
    query : dbCon.query,
    close : dbCon.close,
    beaver : require('./lib/beaver')
  };
})();
