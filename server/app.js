var vm = require('vm');
var fs = require('fs');
var Q  = require('q');
var db = require('./db.js');
var parser = require('./parser.js');
var io;
var Model = require('./model.js');
var cfg = require('./config.js');

var err = function(err){console.log(4 ,err)
  throw err;
}

var updateHistory = function () {
  db.getHistoty()
      .then(function(rows) {
        io.emit('history', rows);
      });
}

var main = function(){
  io.on('connection', function(socket){
    db.getHistoty()
      .then(function(rows) {
        socket.emit('history', rows);
      })
      .catch(err);

    socket.on('find', function(name) {
      var model = new Model(name);
      var errors = model.validate();
      if(errors.length === 0){
        parser(name)
          .then(function(data){

            for(var i in data){
              model[i] = data[i];
            }

            db.add(model).then(updateHistory).catch(err);
          })
          .catch(function(){
            socket.emit('findError');
          });
      }
    });

    socket.on('remove', function(id) {
      db.remove(id).then(updateHistory).catch(err);
    });
    socket.on('change', function(model) {
      db.change(model).then(updateHistory).catch(err);
    });
  });
}

io = require('socket.io')(cfg.port);
db.promise.then(main).catch(err);

