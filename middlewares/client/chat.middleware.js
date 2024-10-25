const RoomChat = require("../../models/rooms-chat.model");

module.exports.isAccess = async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const roomChatId = req.params.roomChatId;
    
    const roomChat = await RoomChat.findOne({
      _id: roomChatId
    });

    if(!roomChat) {
      res.redirect("/");
      return;
    }

    const existUserInRoomChat = roomChat.users.find(item => item.userId == userId);

    if(!existUserInRoomChat) {
      res.redirect("/");
      return;
    }
    
    next();
  } catch (error) {
    res.redirect("/");
  }
}