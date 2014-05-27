(function (window, undefined) {
	'use strict';

	//--------------------------------------------------------------------------
	//
	//  Private Properties
	//
	//--------------------------------------------------------------------------

	var $ = window.jQuery,
		ko = window.ko,
		socket,
		viewModel;

	var socketHost = 'http://192.168.65.141:80';

	var socketPath = '/web/socket.io';

	var init = function () {
		ko.applyBindings(viewModel, $("#main").get(0));

		socket = io.connect(socketHost,{path: socketPath });
		socket.on('news', function(data) {
			var json = JSON.parse(data);
		
			viewModel.historyList.push(json.content);

			//$("#content").scroll();

			$(".nano").nanoScroller();
			$(".nano").nanoScroller({ scroll: 'bottom' });
		
		});

		$(".nano").nanoScroller();
		getHistory();	
	};

	var getHistory = function() {
		$.ajax({
			url: "history",
			type: "GET",
			datatype: "json",
			data: {},
			success: function(history){
         
             	viewModel.historyList(history);
            
        	}
		});

	}



	viewModel = (function () {
		return {

			historyList: ko.observableArray([]),

			inputMessage: function (element, event) {

				if(event.keyCode == 13) {
					var message = $(event.currentTarget).val();
					socket.emit('typing', message);
					$(event.currentTarget).val('');
				}

				return true;
			}

		};
	})();


	init();

})(window);