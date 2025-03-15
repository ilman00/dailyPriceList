const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {login, register, isAuthenticated} = require("../controllers/authController")
const { approveUser, getApproveUser } = require('../controllers/approveUser');

router.get("/approve-new-user", isAuthenticated, getApproveUser);

router.post("/admin/approve/:id", isAuthenticated, approveUser);

module.exports = router;    