/**
 * @author fubuki
 */
(function($) {
	$('#text_input').keydown(function(h) {
		if(h.keyCode == 13) {
			var message=$(this).val();
			console.log($(this).val());
			socket.emit('message', { msg: message });
			$(this).val('');

		}
	});
	
})(jQuery)