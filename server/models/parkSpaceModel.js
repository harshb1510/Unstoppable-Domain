const mongoose = require("mongoose");
const parkSpaceSchema = new mongoose.Schema({
  occupied: {
    type: Boolean,
    default: false,
  },
  carOwner: {
    type: String,
    default: "",
  },
  inTime: {
    type: String,
    default: "",
  },
  outTime: {
    type: String,
    default: "",
  },
  slotNo: {
    type: Number,
  },
  amount: { 
    type: Number,
    default: 0,
  },
});

module.exports = new mongoose.model("parkSpace", parkSpaceSchema);
