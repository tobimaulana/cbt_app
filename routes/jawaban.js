var express = require('express');
var router = express.Router();
var http = require('http');
const { v4 : uuidv4} = require('uuid');

// Panggil Model Jawaban
var Jawaban = require('../models/jawaban');

/* TAMPIL DATA */
router.get('/', function(req, res, next) {
       Jawaban.findAll().then( data => {
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

/* SIMPAN DATA */
router.post('/', function(req, res, next){
       // jika data baru tanpa id (id=undefined)
       if(typeof req.body.id === 'undefined') {
              req.body.id = uuidv4(); //membuat id dengan UUID
       }

       Jawaban.upsert(req.body).then (data => {
              res.json({
                     status:true,
                     pesan:"Data Berhasil Disimpan",
                     data:data
              });
       })
       .catch(err => {
              res.json({
                     status:false,
                     pesan:"Data Gagal Disimpan : " + err.message,
                     data:[]
              });
       });
});


/* SINKRONISASI DATA */
// 1. Ambil Jawaban
router.post('/sync', function(req, res, next) {
       Jawaban.findAll().then( data => {
              // convert object menjadi string json
              // dan simpan di req.dataKirim
              req.dataKirim = JSON.stringify(data);

              // lanjut ke route berikutnya
              next();
       }).catch(err => {
              res.json({
                     status:false,
                     pesan:"Gagal Ambil Jawaban : " + err.message,
                     data:[]
              });
       });
});

// 2. Sync ke Server
router.post('/sync', function(req, res, next) {
       // ambil dataKirim
       var dataKirim = req.dataKirim;
       console.log(dataKirim);
       var options = {
              host : 'localhost',
              port : '3002', //port cbt_app_server
              path : '/jawaban/sync',
              method : 'POST',
              headers : {
                     app_token : "token_cbt_server", //sementara belum digunakan
                     'Content-Type' : 'application/json',
                     'Content-Length' : Buffer.byteLength(dataKirim)
              }
       };

       var callback = function(response) {
              var str = ''
              response.on('data', function(chunk){
                     str += chunk;
              });

              response.on('end', function(){
                     console.log(str);
                     var objectJson = JSON.parse(str);
                     req.hasil = objectJson.data;
                     next();
              });
       }

       var reqCbtServer = http.request(options, callback);

       // tulis string json ke body request
       reqCbtServer.write(dataKirim);
       reqCbtServer.end();
});



// 3. Update Koreksi di Jawaban
router.post('/sync', function(req, res, next) {
       var hasil = req.hasil;

       // menambahkan nilai syncAt
       // untuk setiap item data
       var dataHasil = hasil.map(function(item) {
              item.syncAt = Date.now();
              return item;
       });

       // update jawaban hanya kolom koreksi dan syncAt
       Jawaban.bulkCreate(dataHasil, {
              updateOnDuplicate:[
                     'koreksi',
                     'syncAt'
              ],
       }).then(data => {
              res.json({
                     status:true,
                     pesan : "Berhasil Tersinkronisasi",
                     data : data
              });
       })
       .catch(err => {
              res.json({
                     status:false,
                     pesan : "Gagal Tersinkronisasi : " + err.message,
                     data : []
              });
       });
});

module.exports = router;