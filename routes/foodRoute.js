const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getCities, addCity, deleteCity, updateCity, getCityById } = require('../controllers/citiesController');
const {register, login, isAuthenticated} = require("../controllers/authController")


// Get all approved food prices
router.get('/',isAuthenticated,(req, res) => {
    console.log(req.user);
    res.render('home', {user: req.user.email});
});


// Get Cities and Return JSON Response
router.get('/add-city', isAuthenticated ,(req, res) => {
    res.render('addCity');
});
router.get('/cities', getCities);
// POST route to insert city into the database
router.post("/add-city", addCity);
// Route to Delete City
router.delete('/delete-city/:id', deleteCity);
// Define the route for fetching city by ID
router.get('/edit-city/:id', getCityById);
router.post('/update-city/:id', updateCity);









router.get('/account-setting', (req, res) => {

    res.render('accountsetting')
});




module.exports = router;
