var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io")(server); //socket instance  attached to  express http server
var Chat = require("./models/schema");
var mongoose = require("mongoose");
app.use(express.static(__dirname+'/public'));

mongoose.connect("mongodb://127.0.0.1:27017/socket")
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(27017, () => console.log(`Server running on port ${27017}`));
  })
  .catch(err => console.log(err));

//once you  enter  the url connection will be established
io.on('connection', socket => {
    //console.log('connected.');
    socket.broadcast.emit('user connected');
  
    //listening to event  disconnect
    socket.on('disconnect', () => {
        //console.log('disconnected.');
        socket.broadcast.emit('user disconnected');
      });
       //listening to event  message sent (  yab9a yestana fi action  d ajout mta3 un message mel index )
    socket.on("message sent", async data => {
      const message = new Chat({ pseudo: data.pseudo, message: data.message });
      await message.save();
      //broadcast received  message to all connected users ( chyab3eth lel  connected users el kol  w y9olhom   eli fama message jdid w 3adina variable fih el message m3a el event )
      socket.broadcast.emit("received message", { data: message });
      
    });
  //listening to event  typing 
    socket.on('typing', data => {
      //broadcast  typing event
      socket.broadcast.emit('typing', { author: data.author });
    });

   
  });
app.get('/',async function(req,res,next){
    res.sendFile(__dirname+'/index.html');
});
//used   inside html  to  retrieve  previous message   once connected  (  check implementation inside index.html) 
app.get('/messages', async function(req, res, next) {
  try {
    const messages = await Chat.find({});
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

server.listen(3200);