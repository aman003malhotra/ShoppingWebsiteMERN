const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true,
    maxlength: 32,
    unique:true
  }
},{timestamps: true} // make sure to record the time of data entry
)

module.exports = mongoose.model("Category", categorySchema);
