$(() => {
	$(document.body).append('<div id="overlay"></div>');
	
	let loadOverlay = () => {
		$.ajax("/assets/html/overlay.html")
		.fail((err) => {
			console.log('FAIL');
			console.log(err);
		})
		.done((data) => {
			console.log("Data:", data);
			$('#overlay').append(data);
			$('#overlay-no-btn').click(() => {
				$('#overlay').hide();
				$(document.body).removeClass('overlay-no-scroll');
			});
		});
	}

	let showOverlay = () => {
		$('#overlay').show();
		$(document.body).addClass('overlay-no-scroll');
	}
	
	loadOverlay();
	setTimeout(showOverlay, 3000);
	
});