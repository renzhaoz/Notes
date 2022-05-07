const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
  res.successHandle(200,{a:1,b:2});
});

// data有多级别 /data/city data/count
router.use('/city',(req,res)=>{
  res.send('cityList');
}); 
router.use('/count',require('./count'))

module.exports = router;