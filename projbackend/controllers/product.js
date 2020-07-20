const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


exports.getProductById = (req, res, next, id) =>{
  Product.findById(id)
  .populate("category")
  .exec((err, product)=>{
    if(err){
      res.status(400).json({
        error:"Product Does not Exists"
      });
    }
    req.product = product;
    next();
  })
};

exports.createProduct = (req,res)=>{
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file)=>{
    if (err){
      return res.state(400).json({
        error:"Problem with Image"
      });
    }

    // Destructuring the fields
    const {name, description, price, category, stock} = fields;

    if(
      !name ||
      !description ||
      !price ||
      !category ||
      !stock
    ){
      return res.status(400).json({
        error:"Please include all fields"
      });
    }

    // TODO Restrictions on fields
    let product = new Product(fields)

    // handle file here
    if(file.photo){
      if(file.photo.size > 3000000){
        return res.status(400).json({
          error:"File size is too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to the DB
    product.save((err,product) =>{
      if(err){
        res.status(400).json({
          error:"Product not added to the Database"
        });
      }
      res.json(product)
    });
  });
};

exports.getProduct = (req, res) =>{
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.removeProduct = (req,res) =>{
  let product = req.product;
  product.remove((err, deletedProduct)=>{
    if(err){
      return res.status(400).json({
        error:"Failed to Delete the product"
      });
    }
    res.json({
      message:"product Deleted",
      deletedProduct
    });
  });
};

exports.updateProduct = (req,res) =>{
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file)=>{
    if (err){
      return res.state(400).json({
        error:"Problem with Image"
      });
    }

    // updation code
    let product = req.product;
    product = _.extend(product, fields)

    // handle file here
    if(file.photo){
      if(file.photo.size > 3000000){
        return res.status(400).json({
          error:"File size is too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // save to the DB
    product.save((err,product) =>{
      if(err){
        return res.status(400).json({
          error:"Updation of Product failed"
        });
      }
      res.json(product)
    });
  });
};

// listing products
exports.getAllProducts = (req,res) =>{
  let limit = req.query.limit ? parseInt(req.query.limit) : 8 ;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
  .select("-photo") // else than photo send all information of the product
  .populate('category')
  .sort([[sortBy, "asc"]])
  .limit(limit)
  .exec((err,products) =>{
    if(err){
      return res.status(400).json({
        error:"No Product Found"
      });
    }
    res.json(products)
  })
}

exports.getAllUniqueCategories = (req,res) => {
  Product.distinct("category", {}, (err, category) =>{
    if (err){
      return res.status(400).json({
        error:"No Category found"
      });
    }
    res.json(category);
  })
}

// middleware
exports.photo = (req, res, next) =>{
  if(req.product.photo.data){
    res.set("Content-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next();
  console.log(req.product.photo.data)
};

exports.updateStock = (req, res, next) =>{
  let myOperations = req.body.order.products.map(product =>{
    return {
      updateOne: {
        filter: {_id: product._id},
        update: {$inc: {stock: -product.count, sold: +product.count}}
      }
    }
  });

  Product.bulkWrite(myOperations, {}, (err,products) => {
    if(err){
      return res.status(400).json({
        error:"Bulk Operations failed"
      });
    }
    next();
  })

}
