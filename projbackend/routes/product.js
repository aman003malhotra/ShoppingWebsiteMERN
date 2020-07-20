const express = require('express');
const router = express.Router();

const {getProductById, createProduct, getProduct, photo, removeProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/authentication");
const {getUserById} = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("productId", getProductById);

// create Route
router.post("/product/create/:userId",isSignedIn, isAuthenticated, isAdmin, createProduct);

// read route
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// update route
router.put("/product/:productId/:userId",isSignedIn, isAuthenticated, isAdmin, updateProduct);

// delete route
router.delete("/product/:productId/:userId",isSignedIn, isAuthenticated, isAdmin, removeProduct);

// listing route
router.get("/products", getAllProducts);

router.get('/products/categories', getAllUniqueCategories)

module.exports = router;
