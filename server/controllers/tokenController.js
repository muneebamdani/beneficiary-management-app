const Token = require('../models/Token');

exports.getTokenById = async (req, res) => {
  try {
    const token = await Token.findOne({ tokenId: req.params.id, isActive: true })
      .populate('beneficiary')
      .populate('processedBy', 'name email');
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    res.json({
      success: true,
      data: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateToken = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const updates = { status, remarks };
    
    if (status === 'In Progress' || status === 'Completed') {
      updates.processedBy = req.user._id;
      updates.processedAt = new Date();
    }
    
    const token = await Token.findOneAndUpdate(
      { tokenId: req.params.id, isActive: true },
      updates,
      { new: true, runValidators: true }
    ).populate('beneficiary').populate('processedBy', 'name email');
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Token updated successfully',
      data: token
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};