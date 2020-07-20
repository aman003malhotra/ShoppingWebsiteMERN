const Category = require("../models/category"); // same as model name at export

exports.getCategoryById = (req, res, next, id) =>{
  Category.findById(id)
  .exec((err,category) =>{
    if(err){
      return res.status(400).json({
        error:"Category not found in Database"
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req,res) => {
  const category = new Category(req.body);
  category.save((err,newCategory) =>{
    if (err) {
      return res.status(400).json({
        error:"Not Able to save Category in Database"
      });
    }
    res.json({category});
  });
};

// as already the req.category is getting populated
// by the params router
exports.getCategory = (req,res) =>{
  return res.json(req.category);
};

exports.getAllCategory = (req,res) =>{
  Category.find()
  .exec((err,allCategory)=>{
    if(err){
      return res.status(400).json({
        error:"No Category found in the Database"
      });
    }
    res.json(allCategory);
  })
};


exports.updateCategory = (req,res) =>{
  const category = req.category; // from the middleware
  category.name = req.body.name;
  console.log(req.category);
  console.log(req.body);
  category.save((err,updatedCategory) =>{
    if (err){
      return res.status(400).json({
        error:"Failed To Update the Category"
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req,res) =>{
  const category = req.category; // from the middleware
  category.remove((err,category) =>{
    if (err){
      return res.status(400).json({
        error:"Failed To Delete the Category"
      });
    }
    res.json({
    message:"Category Removed Successfully"
    });
  });
}
