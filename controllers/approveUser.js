const db = require('../config/db');

// Approve a user
const approveUser = async (req, res) => {
    try {
        const id = req.params.id;
        const [result] = await db.query("UPDATE admin SET status = 'approved' WHERE id = ?", [id]);

        console.log(result); // Debugging

        res.redirect("/approve-new-user");
    } catch (error) {
        console.error("Error approving user:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Fetch unapproved users
const getApproveUser = async (req, res) => {
    try {
        const [candidates] = await db.query("SELECT * FROM admin WHERE status = 'not approved'");

        const user = req.user;        
        res.render("approveUser", { users: candidates, user: user.email });
    } catch (error) {
        console.error("Error fetching unapproved users:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { approveUser, getApproveUser };
