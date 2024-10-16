const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  _io.once("connection", (socket) => {
    // Người dùng gửi tin nhắn lên server
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const dataChat = {
        userId: res.locals.user.id,
        // roomChatId: String,
        content: data.content,
        // images: Array,
      };

      // Lưu tin nhắn vào database
      const chat = new Chat(dataChat);
      await chat.save();
    })
  });

  // Lấy tin nhắn mặc định
  const chats = await Chat.find({
    deleted: false
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.userId
    });

    chat.fullName = infoUser.fullName;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  });
};