const express = require('express');
const mongoose = require('mongoose');
let app = express();
let configure = require('./server/configure');

app.set('port', process.env.PORT || 7600);

app = configure(app);

mongoose.connect('mongodb://localhost:27017/klusters', {useNewUrlParser: true});

mongoose.connection.on('error', console.error.bind(console, 'Connection Error'));

mongoose.connection.once('open', function(){
	console.log('Connected to Database');
});

let server = app.listen(app.get('port'), function(){
	console.log("Server listening at localhost:" + app.get('port'));
});

require('./server/chat_server.js').initialize(server);