const Beneficiary = require('../models/Beneficiary');
const Token = require('../models/Token');

exports.getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }
    
    // Build department filter
    const deptFilter = department ? { department } : {};
    
    // Combine filters
    const filter = { ...dateFilter, ...deptFilter };
    
    // Get beneficiary stats
    const totalBeneficiaries = await Beneficiary.countDocuments(filter);
    const newBeneficiaries = await Beneficiary.countDocuments({ ...filter, isReturning: false });
    const returningBeneficiaries = await Beneficiary.countDocuments({ ...filter, isReturning: true });
    
    // Department-wise stats
    const departmentStats = await Beneficiary.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          newCount: { $sum: { $cond: ['$isReturning', 0, 1] } },
          returningCount: { $sum: { $cond: ['$isReturning', 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Token status stats
    const tokenStats = await Token.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalBeneficiaries,
          newBeneficiaries,
          returningBeneficiaries
        },
        departmentStats,
        tokenStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};