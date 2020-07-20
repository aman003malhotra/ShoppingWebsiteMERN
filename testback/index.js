const express = require('express');

const app =  express();
const port = 8000;

const admin = (req,res) =>{
  return res.send("Home Dashboard");
}

// Middleware
const isAdmin = (req,res, next) =>{
  console.log("isAdmin is runnning");
  next();
}

const isLoggedin = (req,res,next)=>{
  console.log("User is Logged In");
  next();
}

app.get('/', function(req,res){
  return res.send('Please login to continue');
})

app.get('/login', function(req,res){
  return res.send('You are logged In');
})

app.get('/admin',isLoggedin ,isAdmin, admin);

app.get('/signout', function(req,res){
  return res.send('You are Signed Out');
});

app.get('/hitesh', function(req,res){
  return res.send('He uses Instagram!``');
});

app.get('/signup', function(req,res){
  return res.send("You are visiting signup route");
})
app.listen(port, ()=>{console.log(`App listening on port ${port}`)});
