const express = require('express');
const router = express.Router();
const {AddProductCart,getCartDetails,updateCartItem ,removeCartItem ,clearCart} = require('../controllers/cartController');
const {createProduct} = require('../controllers/productController');


router.post('/cart/items', AddProductCart);
router.get('/cart', getCartDetails);
router.put('/cart/items/:productId', updateCartItem);
router.delete('/cart/items/:productId', removeCartItem);
router.delete('/cart/',clearCart);

router.post('/product', createProduct);

module.exports = router;