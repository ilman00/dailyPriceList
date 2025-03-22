const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {login, register, isAuthenticated} = require("../controllers/authController")


router.get("/register", isAuthenticated ,(req, res)=>{
    console.log(req.user);
    if(req.user.email !== "admin@edp.com") return res.redirect("/login")
    res.render("register")
});

router.post("/register", isAuthenticated,register);

router.get("/login",(req, res)=>{
    res.render("login")
});

router.post("/login",login);

router.get("/unauthorize",(req, res)=>{
    res.render("Error")
})

router.get('/logout', (req, res) => {
    req.logout(function(err) {  // Passport's logout function
        if (err) { return next(err); }
        
        req.session.destroy((err) => {  // Destroy session
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).send("Failed to logout");
            }
            res.clearCookie('connect.sid'); // Clear session cookie (default name)
            res.redirect('/login');  // Redirect user after logout
        });
    });
});


module.exports = router;