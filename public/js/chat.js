var socket = io.connect('/');

socket.on('message', function (data) {

	data = JSON.parse(data);

	$('#messages').append('<div class="'+data.type+'">' + data.message + '</div>');
	
});

socket.on('message', function (data) {

	data = JSON.parse(data);

	$('.likes-count').text(data.likes);
	
});

$(function(){

	$('#send').click(function(){

		var data = {
			message: $('#message').val(),
			type:'userMessage'
		};

		socket.send(JSON.stringify(data));
		$('#message').val('');

	});


	$('#btn-like').click(function(event){
		event.preventDefault();

		let imgId = $(this).data('id');

		$.post('/image/' + imgId + '/like').done(function(data){
			
			var likes = {
				likes: data.likes,
				type:'userLikes'
			};

			socket.send(JSON.stringify(likes));
			
		});
	});
	
});