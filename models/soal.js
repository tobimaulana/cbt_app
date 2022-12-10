const Sequelize = require('sequelize');

var koneksi = require("../koneksi");

var Soal = koneksi.define('soal', {
       id                 : { type: Sequelize.STRING, primaryKey:true },
       soal               : Sequelize.STRING,
       pilihan_a          : Sequelize.STRING,
       pilihan_b          : Sequelize.STRING,
       pilihan_c          : Sequelize.STRING,
       pilihan_d          : Sequelize.STRING,
       pilihan_e          : Sequelize.STRING,

}, {
       timestamps:true,
       tableName:"soal"
});

module.exports=Soal;