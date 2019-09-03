var io = require('socket.io');

exports.initialize = function(server){
	io = io.listen(server);

	io.sockets.on("connection", function(socket){
		console.log("A NEW CONNECTION WAS JUST MADE    " + socket.id);

		// socket.send(JSON.stringify({
		// 	type:'serverMessage',
		// 	message: 'Welcome to the most interesting chat room on earth!'
		// }));

		socket.on('message', function(message){
			message = JSON.parse(message);
			if(message.type == "userMessage"){
				socket.broadcast.send(JSON.stringify(message));
				message.type = "myMessage";
				socket.send(JSON.stringify(message));
			}
		});

		socket.on('message', function(likes){
			console.log('MESSAGE IN IO SERVER IS = ', likes);
			likes = JSON.parse(likes);
			console.log('Likes details = ' + likes);
			if(likes.type == "userLikes"){
				socket.broadcast.send(JSON.stringify(likes));
				socket.send(JSON.stringify(likes));
			}
		});

	});
}