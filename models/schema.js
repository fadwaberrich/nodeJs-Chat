var mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
    pseudo: String,
    message: String,
    creation_time: { type: Date, default: Date.now }
  });
  
  const Chat = mongoose.model('Chat', chatSchema);
  
  module.exports=Chat;