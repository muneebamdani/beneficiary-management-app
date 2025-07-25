// routes/beneficiaryRoutes.js
const express = require("express");
const router = express.Router();
const { registerBeneficiary, getAllBeneficiaries } = require("../controllers/beneficiaryController");
const { authenticateJWT } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authenticateJWT, roleMiddleware("receptionist"), registerBeneficiary);
router.get("/", authenticateJWT, getAllBeneficiaries);

module.exports = router;
