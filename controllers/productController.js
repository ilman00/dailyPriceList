const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Your MySQL connection

const getCitiesAndCatgeories = async (req, res) => {
    try {
        const citiesQuery = "SELECT * FROM cities";
        const categoriesQuery = "SELECT * FROM categories";
        const user = req.user;
        // Fetch data from the database
        const [cities] = await db.query(citiesQuery);
        const [categories] = await db.query(categoriesQuery);

        // Render EJS template with data
        res.render("products/addProduct", { cities, categories});
    } catch (error) {
        console.error("Error fetching cities and categories:", error);
        res.status(500).send("Server Error");
    }
};



const addProduct = async (req, res) => {
    try {
        const { city, category, productEnglish, productUrdu, price } = req.body;

        if (!city || !category || !productEnglish || !productUrdu || !price) {
            return res.status(400).send("All fields are required.");
        }

        const insertQuery = `
            INSERT INTO products (city_id, category_id, productEnglish, productUrdu, price)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.query(insertQuery, [city, category, productEnglish, productUrdu, price]);

        res.redirect("/products"); // Redirect to the form after adding
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("Server Error");
    }
};


// Get all products with city and category details
const getProducts = async (req, res) => {
    try {
        const productsQuery = `
            SELECT products.id, products.productEnglish, products.productUrdu, products.price,
                   cities.cityEnglish, cities.cityUrdu, 
                   categories.categoryEnglish, categories.categoryUrdu 
            FROM products 
            JOIN cities ON products.city_id = cities.id
            JOIN categories ON products.category_id = categories.id
        `;
        const citiesQuery = `SELECT * FROM cities`;
        const categoriesQuery = `SELECT * FROM categories`;
        const user = req.user;  
        const [products] = await db.query(productsQuery);
        const [cities] = await db.query(citiesQuery);
        const [categories] = await db.query(categoriesQuery);



        res.render("products/products", { products, cities, categories}); // Pass products, cities, and categories
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Server Error");
    }
};

const updatePrice = async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;

    try {
        // Get the current product details before updating
        const [product] = await db.promise().query(`
            SELECT products.id, products.productEnglish, products.productUrdu, products.price,
                   cities.cityEnglish, cities.cityUrdu, 
                   categories.categoryEnglish, categories.categoryUrdu 
            FROM products 
            JOIN cities ON products.city_id = cities.id
            JOIN categories ON products.category_id = categories.id
            WHERE products.id = ?
        `, [id]);

        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const oldProduct = product[0];

        // Insert old data into old product histroy table before updating
        await db.query(`
            INSERT INTO oldproducthistory 
                (product_id, productEnglish, productUrdu, old_price, cityEnglish, cityUrdu, categoryEnglish, categoryUrdu, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
            oldProduct.id,
            oldProduct.productEnglish,
            oldProduct.productUrdu,
            oldProduct.price,
            oldProduct.cityEnglish,
            oldProduct.cityUrdu,
            oldProduct.categoryEnglish,
            oldProduct.categoryUrdu
        ]);

        // Update the new price in the products table
        await db.query("UPDATE products SET price = ? WHERE id = ?", [price, id]);

        res.json({ success: true, message: "Price updated successfully" });
    } catch (error) {
        console.error("Error updating price:", error);
        res.status(500).json({ success: false, message: "Failed to update price" });
    }
};


// Delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM products WHERE id = ?", [id]);
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Failed to delete product" });
    }
};


const getOldHistoryProducts = async (req, res) => {
    try {
        // Query to fetch all old price history with product details
        const oldProductsQuery = `
        SELECT oph.id, oph.product_id, oph.productEnglish, oph.productUrdu, oph.old_price, 
               oph.cityEnglish, oph.cityUrdu, 
               oph.categoryEnglish, oph.categoryUrdu, 
           DATE_FORMAT(oph.updated_at, '%Y-%m-%d') AS old_updated_at
        FROM oldproducthistory oph
        ORDER BY oph.updated_at DESC
    `;
        const user = req.user;

        // Query to fetch all cities (for filtering)
        const citiesQuery = `SELECT * FROM cities`;

        // Query to fetch all categories (for filtering)
        const categoriesQuery = `SELECT * FROM categories`;

        // Execute queries using MySQL Promises
        const [oldProducts] = await db.query(oldProductsQuery);
        const [cities] = await db.query(citiesQuery);
        const [categories] = await db.query(categoriesQuery);

        // Render the oldProductHistory page with fetched data
        res.render("products/oldProductHistory", { oldProducts, cities, categories});

    } catch (error) {
        console.error("Error fetching old product history:", error);
        res.status(500).send("Server Error");
    }
};









module.exports = { getCitiesAndCatgeories, addProduct, getProducts, deleteProduct, updatePrice, getOldHistoryProducts };
