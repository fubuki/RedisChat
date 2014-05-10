(function (window, undefined) {
	'use strict';

	//--------------------------------------------------------------------------
	//
	//  Private Properties
	//
	//--------------------------------------------------------------------------

	var $ = window.jQuery,
		ko = window.ko,
		viewModel;



	var init = function () {
		ko.applyBindings(viewModel, $("#main").get(0));

		var socket = io.connect('http://192.168.65.141:80',{path: '/web/socket.io' });
		socket.on('news', function(data) {
			var json = JSON.parse(data);

			viewModel.historyList.push(json);

 			//$("#content").append('<li>'+json.content+'</li>');
		});
		
		$('#text_input').keydown(function(h) {
			if(h.keyCode == 13) {
				var message = $(this).val();
				socket.emit('typing', message);
				$(this).val('');
			}
		});
	};


	viewModel = (function () {
		return {

			historyList: ko.observableArray([])

		};
	})();


	init();

})(window);