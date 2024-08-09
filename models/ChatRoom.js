const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
  ],
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
