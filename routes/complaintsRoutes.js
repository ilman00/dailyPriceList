const express = require('express');
const router = express.Router();
const { getAllComplaints, deleteComplaint, addComplaint, updateComplaintStatus } = require('../controllers/complaintsController');


router.post("/post-complaint", addComplaint);

router.get('/complaints', getAllComplaints);

router.post('/delete-complaint/:id', deleteComplaint);

router.post('/update-complaint-status/:id', updateComplaintStatus)




module.exports = router;