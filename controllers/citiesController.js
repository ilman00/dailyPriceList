const db = require('../config/db'); 


const getCities = async (req, res) => {
    try {
        const sql = 'SELECT * FROM cities';
        const cities = await db.query(sql);
        const user = req.user;
        res.render('cities', { cities, user: user.email }); // Pass 'cities' to EJS view
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Add a new city
const addCity = async (req, res) => {
    try {
        const { cityEnglish, cityUrdu } = req.body;

        if (!cityEnglish || !cityUrdu) {
            return res.status(400).json({ error: "Both city names (English & Urdu) are required" });
        }

        const sql = 'INSERT INTO cities (cityEnglish, cityUrdu) VALUES (?, ?)';
        await db.query(sql, [cityEnglish, cityUrdu]);

        res.redirect('/cities'); // Redirect to cities page after adding city
    } catch (error) {
        console.error("Error inserting city:", error);
        res.status(500).json({ error: "Database error" });
    }
};

// Delete a city
const deleteCity = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "City ID is required" });
        }

        const cityId = parseInt(id, 10);
        if (isNaN(cityId)) {
            return res.status(400).json({ error: "Invalid City ID" });
        }

        const sql = "DELETE FROM cities WHERE id = ?";
        await db.query(sql, [cityId]); // Using promisified query

        res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
        console.error("Error deleting city:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a city
const updateCity = async (req, res) => {
    try {
        const { cityEnglish, cityUrdu } = req.body;
        const cityId = req.params.id; // Get the city ID from the URL parameter
        console.log(req.body);  // Check if data is coming properly from the frontend


        // SQL query to update the city
        const sql = `
            UPDATE cities
            SET cityEnglish = ?, cityUrdu = ?
            WHERE id = ?
        `;

        // Execute the query with the provided values
        await db.query(sql, [cityEnglish, cityUrdu, cityId]);


        res.redirect('/cities'); // Redirect to cities page after adding city


    } catch (error) {
        console.error("Error updating city:", error);
        res.status(500).json({ error: 'Failed to update city' });
    }
};

const getCityById = async (req, res) => {
    const cityId = req.params.id;  // Get the cityId from the URL parameters

    try {
        // SQL query to fetch the city by its ID
        const query = 'SELECT * FROM cities WHERE id = ?';
        const user = req.user;
        // Query the database
        db.query(query, [cityId], (err, result) => {
            if (err) {
                console.error('Error fetching city:', err);
                return res.status(500).json({ error: 'Failed to fetch city' });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: 'City not found' });
            }

            // Pass the city data to the EJS template for rendering
            res.render('editCity', { city: result[0], user: user.email });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};







module.exports = { getCities, addCity, deleteCity, updateCity, getCityById };
