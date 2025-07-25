const express = require('express');
const Beneficiary = require('../models/Beneficiary');

const { authenticateJWT } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');  // Import as a function

const router = express.Router();

router.get(
  '/',
  authenticateJWT,
  roleMiddleware('admin', 'receptionist', 'department staff'),  // Use like this
  async (req, res) => {
    try {
      const { q, type = 'all' } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      let searchQuery = {};

      switch (type) {
        case 'cnic':
          searchQuery.cnic = { $regex: q, $options: 'i' };
          break;
        case 'name':
          searchQuery.name = { $regex: q, $options: 'i' };
          break;
        case 'phone':
          searchQuery.phone = { $regex: q, $options: 'i' };
          break;
        default:
          searchQuery = {
            $or: [
              { cnic: { $regex: q, $options: 'i' } },
              { name: { $regex: q, $options: 'i' } },
              { phone: { $regex: q, $options: 'i' } },
            ],
          };
      }

      const beneficiaries = await Beneficiary.find(searchQuery)
        .populate('registeredBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(20);

      res.json({
        success: true,
        count: beneficiaries.length,
        data: beneficiaries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
