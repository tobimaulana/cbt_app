var express = require('express');
var router = express.Router();
var http = require('http');

// Panggil Model Soal
var Soal = require('../models/soal');

/* TAMPIL DATA */
router.get('/', function(req, res, next) {
       Soal.findAll().then( data => {
              res.json({
                     status:true,
                     pesan:"Data BERHASIL Tampil",
                     data:data
              });
       }).catch(err => {
              res.json({
                     status:false,
              });
       });
});

/* SINKRONISASI DATA */
router.post('/sync', function(req, res, next) {
       var options = {
              host : 'localhost',
              port : '3002', //port cbt_app_server
              path : '/soal',
              method : 'GET',
              headers : {
                     app_token : "token_cbt_server",
              }
       };

       var callback = function(response) {
              var str = ''
              response.on('data', function(chunk) {
                     str += chunk;
              });
              
              response.on('end', function(){
                     // convert respon ke object json
                     var objectJson = JSON.parse(str);

                     // insert secara masal ke tabel soal
                     // jika primaryKey duplikat, maka update datanya
                     Soal.bulkCreate(objectJson.data, {
                            updateOnDuplicate: [
                                   'soal',
                                   'pilihan_a',
                                   'pilihan_b',
                                   'pilihan_c',
                                   'pilihan_d',
                                   'pilihan_e',
                                   'updatedAt'
                            ],
                     }).then(data => {
                            res.json({
                                   status:true,
                                   pesan:"Berhasil Tersinkronisasi",
                                   data:data
                            });
                     })
                     .catch(err => {
                            res.json({
                                   status:false,
                                   pesan:"Gagal Tersinkronisasi : " + err.message,
                                   data:[]
                            });
                     });
              });
       }

       var req = http.request(options, callback);
       req.end();


       
});

module.exports = router;