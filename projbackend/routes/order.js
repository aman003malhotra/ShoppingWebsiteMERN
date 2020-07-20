const express = require('express');
const router = express.Router();


const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/authentication");
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {updateStock} = require("../controllers/product");
const {getOrderById, createOrder, getAllOrders} = require("../controllers/order")

// params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// all other Routes
// create
router.post("/order/create/:userId",isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)

// read
router.get("/order/all/:userId",isSignedIn, isAuthenticated, isAdmin, getAllOrders)

//status of order
router.get('/order/status/:userId')

module.exports = router;
