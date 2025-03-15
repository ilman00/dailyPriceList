const db = require('../config/db'); // Ensure correct DB connection import


// Get all cities
const getCategories = async (req, res) => {
    try {
        const sql = 'SELECT * FROM categories';
        const categories = await db.query(sql); // Await the query
        const user = req.user;
        res.render('categories/categories', { categories, user:user.email }); // Pass 'cities' to EJS view
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Database error' });
    }
};



// Add a new city
const addCategory = async (req, res) => {
    try {
        const { categoryEnglish, categoryUrdu } = req.body;
        if (!categoryEnglish || !categoryUrdu) {
            return res.status(400).json({ error: "Both category names (English & Urdu) are required" });
        }

        const sql = 'INSERT INTO categories (categoryEnglish, categoryUrdu) VALUES (?, ?)';
        await db.query(sql, [categoryEnglish, categoryUrdu]);

        res.redirect('/categories'); // Redirect to cities page after adding city
    } catch (error) {
        console.error("Error inserting city:", error);
        res.status(500).json({ error: "Database error" });
    }
};


// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "City ID is required" });
        }

        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            return res.status(400).json({ error: "Invalid Category ID" });
        }

        const sql = "DELETE FROM categories WHERE id = ?";
        await db.query(sql, [categoryId]); // Using promisified query

        res.redirect('/categories')
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a city
const updateCategory = async (req, res) => {
    try {
        const { categoryEnglish, categoryUrdu } = req.body;
        const categoryId = req.params.id; // Get the category ID from the URL parameter
        console.log(req.body);  // Check if data is coming properly from the frontend


        // SQL query to update the city
        const sql = `
            UPDATE categories
            SET categoryEnglish = ?, categoryUrdu = ?
            WHERE id = ?
        `;

        // Execute the query with the provided values
        await db.query(sql, [categoryEnglish, categoryUrdu, categoryId]);


        res.redirect('/categories'); // Redirect to cities page after adding city


    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

const getCategoryById = async (req, res) => {
    const categoryId = req.params.id;  // Get the cityId from the URL parameters
    console.log(categoryId);

    try {
        // SQL query to fetch the city by its ID
        const query = 'SELECT * FROM categories WHERE id = ?';

        // Query the database
        db.query(query, [categoryId], (err, result) => {
            if (err) {
                console.error('Error fetching category:', err);
                return res.status(500).json({ error: 'Failed to fetch category' });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }

            // Pass the city data to the EJS template for rendering
            res.render('categories/editCategory', { category: result[0] });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


module.exports = { getCategories, addCategory, deleteCategory, updateCategory, getCategoryById };

