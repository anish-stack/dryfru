const express = require('express');
const { RegisterUser, LogginUser, LogoutUser, PasswordChangeRequest, verifyOtpForSignIn, Resend_Otp, getAllUsers, findMe, addWhisList, getWishlist } = require('../controller/User.controller');
const { protect } = require('../middleware/auth');
const { createProduct, getAllProducts, deleteProductById, getProductById, updateProduct } = require('../controller/Product.controller');
const multer = require("multer");
const { createOrderOfProduct, ChangeOrderStatus, getAllOrder, getMyLastOrder, checkStatus, getOrderByOrderId, OrderProcessRating, getMyAllOrder } = require('../controller/Order_Controller');
const { addSettings, editSettings, getSettings } = require('../controller/Settings');
const storage = multer.memoryStorage()

const upload = multer({ storage });

const router = express.Router();

// Register Routes
router.post('/regsiter-user', RegisterUser);
router.post('/verify-otp', verifyOtpForSignIn);
router.post('/resend-otp', Resend_Otp);
router.post('/login', LogginUser);
router.get('/logout', LogoutUser);
router.get('/my-details', protect, findMe);
router.post('/Password-Change-Request', PasswordChangeRequest);
router.post('/add-whishlist', protect, addWhisList);
router.get('/wishlist', protect, getWishlist);
router.get('/my-last-order', protect, getMyLastOrder);
router.get('/my-recent-order/:orderId', protect, getOrderByOrderId);
router.post('/order-proccessing/:orderid', OrderProcessRating);
router.get('/my-all-order',protect, getMyAllOrder);



//Admin user routes

router.get('/admin/get-users', getAllUsers);
router.post('/admin/change-order-status', ChangeOrderStatus);
router.get('/admin/get-all-order', getAllOrder);

//Admin Settings routes

router.post('/admin/create/settings', addSettings);
router.put('/admin/settings/:id', editSettings);
router.get('/admin/settings', getSettings);


// product Routes
router.post('/add-new-product', upload.any(), createProduct);
router.post('/update-product/:productId', upload.any(), updateProduct);
router.get('/get-product', getAllProducts);
router.get('/get-product/:id', getProductById);
router.delete('/delete-product/:id', deleteProductById);

// Order Routes
router.post('/add-order', protect, createOrderOfProduct);
router.post('/verify-payment/:merchantTransactionId', checkStatus);









module.exports = router;