const Sequelize = require('sequelize');

var koneksi = require("../koneksi");

var Jawaban = koneksi.define('jawaban', {
       id           : { type: Sequelize.STRING, primaryKey:true },
       soal_id      : Sequelize.STRING,
       nis          : Sequelize.STRING,
       jawaban      : Sequelize.STRING,
       koreksi      : Sequelize.INTEGER,
       syncAt       : Sequelize.DATE,
}, {
       timestamps:true,
       tableName:"jawaban"
});

module.exports=Jawaban;