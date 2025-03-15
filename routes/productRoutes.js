const express = require('express');
const { getCitiesAndCatgeories, addProduct, getProducts, updatePrice, deleteProduct, getProductsByCity, fetchProductHistory, getOldHistoryProducts } = require('../controllers/productController');
const router = express.Router();



router.get('/add-product', getCitiesAndCatgeories);

router.post('/add-product', addProduct);

router.get("/products", getProducts);

router.post("/products/update-price/:id", updatePrice);

router.post("/products/delete/:id", deleteProduct);

// Route to fetch old product history
router.get("/products/old-history", getOldHistoryProducts);


module.exports = router;