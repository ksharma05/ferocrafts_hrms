const mongoose = require('mongoose');

const ClientSiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a site name'],
    unique: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ClientSite', ClientSiteSchema);
