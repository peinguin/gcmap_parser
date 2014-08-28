var Model = function(params){
  if(typeof params === 'string'){
    this.IATA      = params;
    this.id        = null;
    this.Name      = ko.observable(null);
    this.Latitude  = ko.observable(null);
    this.Longitude = ko.observable(null);
    this.TimeZone  = ko.observable(null);
  }else{
    this.IATA      = params.IATA;
    this.id        = params.id;
    this.Name      = ko.observable(params.Name);
    this.Latitude  = ko.observable(params.Latitude);
    this.Longitude = ko.observable(params.Longitude);
    this.TimeZone  = ko.observable(params.TimeZone);
  }
}
Model.prototype.validate = function(){
  var errors = [];
  if(!this.IATA.match(/^[A-Z]{1,4}$/)
  ){
    errors.push('IATA must be 1, 2, 3, or 4 character combinations');
  }
  if(!(~this.TimeZone().indexOf('UTC'))){
    errors.push('TimeZone must contain "UTC"');
  }
  return errors;
}
Model.prototype.set = function(data){
  this.Name(data.Name);
  this.Latitude(data.Latitude);
  this.Longitude(data.Longitude);
  this.TimeZone(data.TimeZone);
}