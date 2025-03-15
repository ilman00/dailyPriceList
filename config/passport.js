const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../config/db');
const bcrypt = require("bcryptjs");


passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);

        if (rows.length === 0) return done(null, false, { message: 'User not found' });

        const user = rows[0];
        if (user.status === "not approved") {
            return done(null, false, { message: 'User not approved yet' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return done(null, false, { message: 'Invalid credentials' });
        console.log(isMatch);
        return done(null, user); // Success: Return user
    } catch (error) {
        return done(error);
    }
}));

// 🔹 Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id); // Store only the user ID in session
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM admin WHERE id = ?', [id]);
        if (rows.length === 0) return done(null, false);
        done(null, rows[0]); // Attach user to `req.user`
    } catch (error) {
        done(error);
    }
});


module.exports = passport;