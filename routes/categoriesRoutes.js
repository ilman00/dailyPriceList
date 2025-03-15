const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { addCategory, getCategories, updateCategory, getCategoryById, deleteCategory } = require('../controllers/categoriesController');
const { isAuthenticated } = require('../controllers/authController');



router.get('/add-category', (req, res) => {
    res.render('categories/addCategory');
});

router.post('/add-category', isAuthenticated ,addCategory);

router.get('/categories', isAuthenticated ,getCategories);

router.get('/edit-category/:id', isAuthenticated, getCategoryById);

router.post('/update-category/:id', isAuthenticated, updateCategory);

router.post('/delete-category/:id', isAuthenticated, deleteCategory);



module.exports = router;