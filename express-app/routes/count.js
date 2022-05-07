const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
  console.log(req,res)
  res.send('this is count router');
})

module.exports = router;