const ChatRoom = require("./models/ChatRoom");
const ChatMessage = require("./models/ChatMessage");
const Session = require("./models/Session");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinRoom", async ({ roomId, userId }) => {
      try {
        // Kiểm tra và tạo phòng chat nếu chưa tồn tại
        let chatRoom = await ChatRoom.findOne({ roomId });
        if (!chatRoom) {
          chatRoom = new ChatRoom({ roomId });
          console.log("Chat room created:", chatRoom);
          await chatRoom.save();
        }

        console.log(`User ${userId} joined room ${roomId}`);

        // Tìm kiếm hoặc tạo phiên chat mới
        let session = await Session.findOne({ chatRoomId: roomId, userId });
        if (!session) {
          session = new Session({ chatRoomId: roomId, userId });
          await session.save();
        }
        console.log("Session created:", session);

        socket.join(roomId);
        socket.emit("sessionCreated", { sessionId: session._id, roomId });
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("sendMessage", async ({ roomId, message }) => {
      try {
        if (!message.sessionId) {
          console.error("Session ID is missing");
          return;
        }

        const newMessage = new ChatMessage({
          ...message,
          sessionId: message.sessionId,
        });
        console.log("Sending message:", newMessage);
        await newMessage.save();

        // Cập nhật danh sách tin nhắn trong ChatRoom
        const chatRoom = await ChatRoom.findOneAndUpdate(
          { roomId },
          { $push: { messages: newMessage._id } },
          { new: true }
        );

        console.log("Updated chat room:", chatRoom);

        io.to(roomId).emit("message", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("getRooms", async () => {
      try {
        const rooms = await ChatRoom.find().populate({
          path: "messages", // populate messages
          populate: {
            path: "sessionId", // populate sessionId từ ChatMessage
            model: "Session", // Model của Session
          },
        });
        console.log("Getting rooms:", rooms);
        socket.emit("rooms", rooms);
      } catch (error) {
        console.error("Error getting rooms:", error);
      }
    });

    socket.on("endSession", async ({ roomId, sessionId }) => {
      try {
        await Session.findByIdAndDelete(sessionId);
        io.to(roomId).emit("sessionEnded", { sessionId });
      } catch (error) {
        console.error("Error ending session:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
