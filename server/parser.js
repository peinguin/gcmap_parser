var http = require('http');
var Q  = require('q');
var iconv = require('iconv');

var PATTERNS = [
  {
    name: 'Name',
    pattern: /<td colspan=2\sclass="fn\sorg">([^<]*)<\/td>/
  },
  {
    name: 'Latitude',
    pattern: /<abbr class="latitude"\stitle="[^"]*"><\/abbr>([^<]*)/
  },
  {
    name: 'Longitude',
    pattern: /<abbr class="longitude"\stitle="[^"]*"><\/abbr>([^<]*)/
  },
  {
    name: 'TimeZone',
    pattern: /<abbr class="tz"\stitle="[^"]*"><\/abbr>([^<]*)/
  },
]

module.exports = exports = function (name) {
  var deferred = Q.defer();


  http.get("http://www.gcmap.com/airport/" + name, function(res) {
    if(res.statusCode === 301){
      deferred.reject();
    }else{
      var str = '';
      res.on('data', function (chunk) {

        var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
        var buf = ic.convert(chunk);
        var buffer = buf.toString('utf-8');
        
        str += buffer;
      });

      res.on('end', function () {
        var res = {};

        PATTERNS.forEach(function(p){
          var m = str.match(p.pattern);
          if(
            m !== null &&
            typeof m === 'object' &&
            m.length > 1
          ){
            res[p.name] = m[1]
          }
        });

        deferred.resolve(res);
      });
    }
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  return deferred.promise;
}