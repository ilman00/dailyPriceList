const express = require('express');
const app = express();
const foodRoutes = require('./routes/foodRoute');
const categoriesRoutes = require('./routes/categoriesRoutes')
const complaintsRoutes = require('./routes/complaintsRoutes');
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('./config/passport');
const approveUser = require('./routes/approveUserRoute');
const db = require('./config/db');

dotenv.config();


const sessionStore = new MySQLStore({}, db)

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Allows Express to parse JSON requests
app.use('/public', express.static('public'));




app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: false,  // Set to true if using HTTPS
        httpOnly: true, // Helps prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());


port = process.env.PORT;

app.use((req, res, next) => {
    console.log("checking user in the req object",req.user);
    res.locals.user = req.user.email || null; // Assuming user data is stored in req.user after authentication
    next();
});


app.use(foodRoutes);
app.use(categoriesRoutes);
app.use(complaintsRoutes);
app.use(productRoutes);
app.use(authRoutes)
app.use(approveUser)

app.listen(port || 3000, () => console.log(`Server running on port ${port}`));
