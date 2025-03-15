const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {login, register, isAuthenticated} = require("../controllers/authController")


router.get("/register",(req, res)=>{
    // console.log(req.user);
    // if(req.user.email !== "admin@gmail.com") return res.redirect("/login")
    res.render("register")
});

router.post("/register", register);

router.get("/login", (req, res)=>{
    res.render("login")
});

router.post("/login", login);

router.get("/unauthorize", (req, res)=>{
    res.render("Error")
})

module.exports = router;