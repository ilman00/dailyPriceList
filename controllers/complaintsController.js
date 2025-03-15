const db = require('../config/db'); // Ensure correct DB connection import




// Add a new complaint
const addComplaint = async (req, res) => {
    try {
        const { name, email, phone_no, complaint } = req.body;

        if (!name || !email || !phone_no || !complaint) {
            return res.status(400).json({ error: "All fields are required." });
        }

        if (complaint.length > 50) {
            return res.status(400).json({ error: "Complaint field should not be exceed of 50 characters." });

        }

        // Default status is "Pending" since this is for users
        const sql = 'INSERT INTO complaints (name, email, phone_no, complaint, status) VALUES (?, ?, ?, ?, ?)';

        db.query(sql, [name, email, phone_no, complaint, "Pending"], (err, result) => {

            res.status(201).json({ message: "Complaint submitted successfully. Admin will review it.", complaintId: result.insertId });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};


const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["Pending", "Resolved"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status. Choose 'Pending' or 'Resolved'." });
        }

        const sql = 'UPDATE complaints SET status = ? WHERE id = ?';

        db.query(sql, [status, id], (err, result) => {
            if (err) {
                console.error("Error updating complaint status:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Complaint not found" });
            }

        });

        res.redirect('/complaints')


    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};






// Get all cities
const getAllComplaints = async (req, res) => {
    try {
        const sql = 'SELECT * FROM complaints';
        const complaints = await query(sql); // Await the query
        const user = req.user;
        res.render('complaints/allComplaints', { complaints, user: user.email }); // Pass 'cities' to EJS view

    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Database error' });
    }
};



// Delete a complaints
const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Complaint ID is required" });
        }

        const complaintId = parseInt(id, 10);
        if (isNaN(complaintId)) {
            return res.status(400).json({ error: "Invalid Complaint ID" });
        }

        const sql = "DELETE FROM complaints WHERE id = ?";
        await query(sql, [complaintId]); // Using promisified query

        res.redirect('/complaints')
    } catch (error) {
        console.error("Error deleting Complaint:", error);
        res.status(500).json({ error: "Server error" });
    }
};


module.exports = { getAllComplaints, deleteComplaint, addComplaint, updateComplaintStatus };
