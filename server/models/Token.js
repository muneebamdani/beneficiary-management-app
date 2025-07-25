const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const tokenSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    unique: true,
    default: () => uuidv4().substr(0, 8).toUpperCase()
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Medical', 'Education', 'Food', 'Zakat', 'Emergency', 'General']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    default: ''
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Token', tokenSchema);