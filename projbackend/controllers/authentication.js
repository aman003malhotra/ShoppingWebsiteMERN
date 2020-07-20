const User = require("../models/user"); // db model
const { check, validationResult } = require("express-validator"); // express-validator
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req, res)=>{

  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(422).json({ // Unprocessable Entity
      error:errors.array()[0].msg,
      param:errors.array()[0].param
    }) // 422 error is for the error from database or backend
  }

  const user = new User(req.body)
  user.save((err,user)=>{
    if(err){
      return res.status(400).json({
        err:"NOT able to save user in DB"
      })
    }
    res.json({
      name:user.name,
      email:user.email,
      id:user._id
    });
  });
};




exports.signin = (req,res)=>{
  const { email, password } = req.body;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).json({ // Unprocessable Entity
      error:errors.array()[0].msg,
      param:errors.array()[0].param
    }) // 422 error is for the error from database or backend
  }

  User.findOne({email}, (err, user)=>{
    if (err || !user){
      return res.status(400).json({
        error:"User email does not exists"
      });
    }

    if(!user.authenticate(password)){
      return res.status(401).json({  // return when you don't want further execution
        error:"Email and password does not match"
      })
    }
    // CREATE TOKEN
    const token = jwt.sign({_id: user._id}, process.env.SECRET)
    // PUT TOKEN IN cookie
    res.cookie("token", token, {expire: new Date() + 9999});

    //send response to frontend
    const {_id, name, email, role} = user;
    return res.json({token, user:{_id, name, email, role } });

  })
};



exports.signout = (req,res)=>{
  res.clearCookie("token") // cookieParser allows us these function
  res.json({
    message: "User Signout Successfully"
  })
};


// protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth" //  req.auth gives access to the information in the token
});


// Custom Middlewares
exports.isAuthenticated = (req, res, next)=>{
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!checker){
    return res.status(403).json({
      error:"ACCESS DENIED"
    })
  }
  next();
};

exports.isAdmin = (req, res, next)=>{
  if(req.profile.role === 0){
    return res.status(403).json({
      error:"You are not Admin, ACCESS DENIED"
    })
  }
  next(); // to get a response
}
