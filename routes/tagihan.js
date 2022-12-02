var express = require('express');
var router = express.Router();
var http = require('http');

router.get('/:no_pend/:jenis_biaya/:id_biaya', function(req, res, next) {
       var no_pend = req.params.no_pend;
       var jenis_biaya = req.params.jenis_biaya; 
       var id_biaya = req.params.id_biaya;

       var options = {
              host : 'localhost',
              port : '3000',
              path : '/transaksi/validasi/'+no_pend+"/"+jenis_biaya+"/"+id_biaya,
              method: 'GET',
              headers:{
                     app_token:"73b2b671acddbcc3c2d9b309d8ccd6618a96fea4",
                     authorization : req.session.jwt
              }
       };

       var callback = function(response) {
    
              var str = ''
              response.on('data', function (chunk) {
                str += chunk;
              });
          
              response.on('end', function () {
                var objectJson = JSON.parse(str);
                res.json(objectJson);
              });
          
            }

            var req = http.request(options, callback);
            req.end();
});

module.exports = router;