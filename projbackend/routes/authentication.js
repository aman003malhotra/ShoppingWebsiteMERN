var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator"); // express-validator
const {signout, signin, signup, isSignedIn} = require('../controllers/authentication');

router.post("/signup",[
  check("name", "name should be atleast 3 characters").isLength({min: 3}),
  check("email", "email is required").isEmail(),
  check("password", "password should be atleast 3 character").isLength({min:3})
],
 signup);


router.post("/signin",[
  check("email", "email is required").isEmail(),
  check("password", "password field is required").isLength({ min:3 })
], signin);

router.get("/signout",signout); //  sugnout in controller

router.get("/testroute",isSignedIn, (req,res)=>{
  res.json(req.auth);
});

module.exports = router;
