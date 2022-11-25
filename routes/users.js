var express = require('express');
var router = express.Router();
var http = require('http');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*proses authentication via web service lain*/
router.post('/masuk', function(req, res, next) {
  var nama = req.body.nama;
  var password = req.body.password;

  var dataKirim = JSON.stringify({
    nama: nama,
    password: password
  });

  var options = {
    host: 'localhost',
    path: '/users/login',
    port: '3000',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataKirim)
  }
  };

  var callback = function(response) { 
    
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      res.json(JSON.parse(str));
    });

  } 

  var req = http.request(options, callback);

  req.write(dataKirim);
  req.end();
  
});

module.exports = router;
