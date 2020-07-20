const express = require('express');
const router = express.Router();

const {getUserById, getUser, getAllUsers, updateUser, userPurchaseList} = require("../controllers/user");

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/authentication");

router.param("userId", getUserById); // populates the req.profile with all necessary information

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

router.get("/users", getAllUsers); // assignment

router.put("/user/:userId",isSignedIn, isAuthenticated, updateUser); // fires the request to line 8 to fill the req.profile

router.put("/order/user/:userId",isSignedIn, isAuthenticated, userPurchaseList); // fires the request to line 8


module.exports = router;
