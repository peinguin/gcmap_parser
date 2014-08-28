var Model = function(params){

  if(typeof params === "string"){
    this.IATA      = params;
    this.Name      = null;
    this.Latitude  = null;
    this.Longitude = null;
    this.TimeZone  = null;
  }else{
    this.IATA      = params.IATA;
    this.Name      = params.Name;
    this.Latitude  = params.Latitude;
    this.Longitude = params.Longitude;
    this.TimeZone  = params.TimeZone;
  }
}
Model.prototype.validate = function(){
  var errors = [];
  if(!this.IATA.match(/^[A-Z]{1,4}$/)
  ){
    errors.push('IATA must be 1, 2, 3, or 4 character combinations');
  }
  return errors;
}
module.exports = exports = Model;