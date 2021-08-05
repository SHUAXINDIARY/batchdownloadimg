var express = require('express');
var router = express.Router();
const multiparty = require('multiparty')
const csvtojson = require('csvtojson');
const http =require('http')
const ctj = csvtojson()
const axios = require('axios')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/sendFile', async (req, res, next) => {
  try {
    console.log(req.files)
    let data = await ctj.fromFile(req.files[0].path)
    res.send({
      data,
      total: data.length
    })
  } catch (error) {
    res.send({
      message:'错误'
    })
  }
  // res.send('上传成功')
})
module.exports = router;
