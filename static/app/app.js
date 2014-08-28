var ERROR_TIME = 5000;

var socket = io('http://' + config.hostname + ':' + config.port);

var oldData;

var showAlert = function (message) {
  appViewModel.error(message);
  appViewModel.shouldShowMessage(true);
  setTimeout(function(){
    appViewModel.shouldShowMessage(false);
    appViewModel.error('');
  }, ERROR_TIME)
}

function AppViewModel () {
  var self = this;

  self.history = ko.observableArray([]);
  self.shouldShowMessage = ko.observable(false);
  self.error = ko.observable('');

  self.find = function() {
    var model = new Model(document.getElementById('IATA').value);
    var errors = model.validate();
    if(errors.length === 0){
      self.shouldShowMessage(false);
      socket.emit('find', model.IATA);
    }else{
      showAlert(errors.join(', '));
    }
  }

  self.itemChanged  = function(model) {
    var errors = model.validate();
    if(errors.length === 0){
      var data = {};
      for(var i in model){
        if(model.hasOwnProperty(i)){
          if(typeof model[i] === 'function'){
            data[i] = model[i]();
          }else{
            data[i] = model[i];
          }
        }
      }
      socket.emit('change', data);
    }else{
      var item = oldData.filter(function(el){
        return el.id === model.id;
      }).pop();

      model.set(item);

      showAlert(errors.join(', '));
    }
  };

  self.remove = function() {
    socket.emit('remove', this.id);
  }
}

var appViewModel = new AppViewModel();

ko.applyBindings(appViewModel);

socket.on('history', function (data) {
  oldData = data;
  while(appViewModel.history().length > 0) {
    appViewModel.history.pop();
  }
  data.forEach(function(el){
    appViewModel.history.push(new Model(el));  
  });
});
socket.on('findError', function (data) {
  showAlert('Finding error!');
});