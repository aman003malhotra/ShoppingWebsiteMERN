const User = require("../models/user"); // same as model name at export
const Order = require("../models/order"); // importing order model from models folder

exports.getUserById = (req, res, next, id)=>{
  User.findById(id).exec((err,user)=>{
    if (err || !user){
      return res.status(400).json({
        error:"No User was found in DB"
      });
    };
    req.profile = user
    next();
  });
}; // MIddleware for filling the req.profile

exports.getUser = (req, res)=>{
  // req.profile.salt = ""
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.getAllUsers = (req, res, next)=>{
  User.find({}).exec((err, users)=>{
    if(err || !users){
      return res.status(400).json({
        error:"No Users Present"
      });
    };
    return res.json(users);
    next();
  });
}

exports.updateUser = (req, res)=>{
  User.findByIdAndUpdate(
    {_id:req.profile._id},
    {$set: req.body},
    {new: true, useFindAndModify: false},
  ).exec((err, user)=>{
    if (err){
      return res.status(400).json({
        error:"You are not authorized to update this user"
      })
    };
    user.salt = undefined;
    user.encry_password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    res.json(user)
  })
}

exports.userPurchaseList = (req,res) =>{ // firing a callback
  Order.find({user : req.profile._id}) // find the order which have the user as the current user and then populate the user
  // details into the user column only add the _id and name fields of the user table into the user column of the purchase list
  .popluate("user", "_id name") // when referencing to another collection
  .exec((err, order)=>{
    if (err){
      return res.status(400).json({
        error: "No order in this Account"
      });
    };
    return res.json(order);
  });
}

exports.pushOrderInPurchaseList = (req,res, next) =>{ // since it is a middleware so next is being used
  let purchases = []
  req.body.order.products.forEach(product =>{
    purchases.push({
      _id:product._id,
      name:product.name,
      description:product.description,
      category:product.category,
      quantity:product.quantity,
      amount:req.body.order.amount,
      transaction_id:req.body.order.transaction_id
    });
  });
  // store this in DataBase
  User.findOneAndUpdate(
    {_id:req.profile._id},
    {$push: {purchases:purchases}}, // push the purchase list into the list of the purchase in the user array
    {new:true}, // the data in the callback should contain the updated one
    (err,purchases) => {
        if(err){
          return res.status(400).json({
            error:"Unable to save purchase List"
          });
        }
    next();
  });
}
