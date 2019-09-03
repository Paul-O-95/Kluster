$(document).ready(function(){
	// $('#btn-like').click(function(event){
	// 	event.preventDefault();

	// 	let imgId = $(this).data('id');

	// 	$.post('/image/' + imgId + '/like').done(function(data){
	// 		$('.likes-count').text(data.likes);
	// 	});
	// });

	let remove = false;

	$('#btn-delete').on('click',function(event){
		event.preventDefault();

		let $this = $(this);

		$('#deleteModal').modal('show');

		$('#btn-modal-yes').click(function(){
			remove = true;

			if(remove){
				let imgId = $this.data('id');

				$.ajax({
					'url':'/image/' + imgId,
					'type':'DELETE'
				}).done(function(result){
					if(result){
						$this.removeClass('btn-danger').addClass('btn-success');
						$this.find('i').remove();
						$this.append('Deleted ');
						$this.append('<i class="fa fa-check"></i>');
						setTimeout(function(){ 
							location.href = '/logged';
						}, 3000);
					}
				});
			}
		});

	});

	$('#post-comment').hide();

	$('#btn-comment').click(function(){
		$('#post-comment').slideToggle(1000);
	});

	setTimeout(function(){
		$('#success-info').fadeOut(10000);
	},5000);

	$('#btn-delete').attr('disabled', 'disabled');

	let currentUser = $('#user').data('id');
	let imgUser = $('#currentImg').data('user_id');
	console.log('User Id = ' + currentUser);
	console.log('Img Id = ' + imgUser);

	if(currentUser === imgUser){
		$('#btn-delete').removeAttr('disabled');
	}

});