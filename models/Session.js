const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  chatRoomId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: Date,
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatMessage",
  }],
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;



