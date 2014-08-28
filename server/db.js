var Q = require('q');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/db.sqlite3');

//constants
var KEYS_TO_CHANGE = ['Name', 'Latitude', 'Longitude', 'TimeZone', 'id'];
db.HISTORY_TABLE_NAME = "history";
var checkSQL = "SELECT name FROM sqlite_master WHERE type='table' AND name = ?";
var createSQL = "CREATE TABLE " + db.HISTORY_TABLE_NAME + " ('id' INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , 'IATA' TEXT, 'Name' TEXT, 'Latitude' TEXT, 'Longitude' TEXT, 'TimeZone' TEXT)";
var allSQL = "SELECT * FROM " + db.HISTORY_TABLE_NAME;
var addSQL = "INSERT INTO " + db.HISTORY_TABLE_NAME + " ('IATA', 'Name', 'Latitude', 'Longitude', 'TimeZone') VALUES ($IATA, $Name, $Latitude, $Longitude, $TimeZone)";
var removeSQL = "DELETE FROM " + db.HISTORY_TABLE_NAME + " WHERE id = ?";
var updateSQL = "UPDATE " + db.HISTORY_TABLE_NAME + " SET Name = $Name, Latitude = $Latitude, Longitude = $Longitude, TimeZone = $TimeZone WHERE id = $id";

var deferred = Q.defer();

db.promise = deferred.promise;

db.get(checkSQL, db.HISTORY_TABLE_NAME, function(err, res) {
  if(err){
    deferred.reject(err);
  }
  if(!res){
    db.run(createSQL, function (err, res){
      if(err){
        deferred.reject(err);
      }else{
        deferred.resolve();
      }
    });
  }else{
    deferred.resolve();
  }
});

db.getHistoty = function() {
  var deferred = Q.defer();

  db.all(allSQL, function(err, res) {
    if(err){
      deferred.reject(err);
    }else{
      deferred.resolve(res);
    }
  });

  return deferred.promise;
}

db.add = function (model) {
  var deferred = Q.defer();

  var params = {};
  Object.keys(model)
    .forEach(function(key){
      params['$' + key] = model[key];
    });

  db.run(addSQL, params, function(err, res) {
    if(err){
      deferred.reject(err);
    }else{
      deferred.resolve(res);
    }
  });

  return deferred.promise;
}

db.remove = function (id) {
  var deferred = Q.defer();

  db.run(removeSQL, id, function(err, res) {
    if(err){
      deferred.reject(err);
    }else{
      deferred.resolve(res);
    }
  });

  return deferred.promise;
}

db.change = function (model) {
  var deferred = Q.defer();

  var params = {};
  Object.keys(model)
   .filter(function(key){
      return ~KEYS_TO_CHANGE.indexOf(key);
    })
    .forEach(function(key){
      params['$' + key] = model[key];
    });

  db.run(updateSQL, params, function(err, res) {
    if(err){
      deferred.reject(err);
    }else{
      deferred.resolve(res);
    }
  });

  return deferred.promise;
}

module.exports = exports = db;