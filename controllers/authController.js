
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const db = require('../config/db'); 



const register = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send("Error in Registering User");
        }

        const [existingUsers] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await db.query('INSERT INTO admin (email, password) VALUES (?, ?)', [email, hashedPassword]);

        res.redirect('/login'); 
    } catch (error) {
        console.error('Registration Error:', error);
        return res.send("Error in Registering User");
    }
};


const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            console.log("Login failed:", info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
}

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/unauthorize');
}

module.exports = {register, login, isAuthenticated};