'use strict';

$(function() {
	console.log('pass');
	$('input').each(function(index, key) {
		key = $(key);
		key.focusout(function() {
			verifier('#' + key.attr('id'));
			key.focus(function() {
				verifier('#' + key.attr('id'));
			});
		});	
	});
	$('form').submit(function() {

		return formState(state);
		
		
	})
})

var warnMsg = {
	name: 'Your name is too short',
	email: 'Your email is not correct',
	password: 'Your password is too short',
	confirm: 'You confirmation does not match',
	empty: 'This field is required'
}

var state = {
	name: false,
	email: false,
	password: false,
	confirm: false
};
var verifier = function(id) {
	var emptyWarn = '<span class="warning">' + warnMsg.empty + '</span>';
	var result = true;

	switch(id) {
		case '#name': {
			var nameLength = 6;

			if($(id).val().length < nameLength) {
				result = false;
			}
			state.name = result;
			break;
		}
			
		case '#email': {
			var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			if( ! reg.test($(id).val())) {
				result = false;
			}	
			state.email = result;
			break;
		}

		case '#password': {
			var passLength = 6;

			if($(id).val().length < passLength) {
				result = false;
			}
			state.password = result;
			break;
		}

		case '#confirm': {
			var passwordConf  = $('#password').val();
			
			if($(id).val() !== passwordConf ||  $(id).val() === '') {
				result = false;
			}
			state.confirm = result;
			break;
		}		
	}

	main(id, result);
	
}

var formState = function(state) {
	var status = true;
	$('#warn-div').remove();
	$.each(state, function(key, bool) {
		
		if( ! bool){
			$('form').parent().append('<div id="warn-div"><span class="warning">Please correct the mistakes</span><div>');
			$('input').each(function (index,key) {
				var emptyWarn = '<span class="warning">' + warnMsg.empty + '</span>';
				if($('#' + key.id).parent().children('span')) {
					$('#' + key.id).parent().children('span').remove();
				}
				if(key.value === ''){
					
					redBorder('#' + key.id, true);
					$('#' + key.id).parent().append(emptyWarn);
				}
			})
			status = false
			return status;
		}
	})
	console.log(state);
	return status;

} 

var main = function(id, result) {
	var warn = '<span class="warning">' + warnMsg[$(id).get(0).id] + '</span>';
	var emptyWarn = '<span class="warning">' + warnMsg.empty + '</span>';

	if($(id).parent().children('span')) {
		$(id).parent().children('span').remove();
	}
	if($(id).val() !== '') {
		if( ! result) {
			redBorder(id, true);
			$(id).parent().append(warn);
		} else {
			redBorder(id, false);
			$(id).parent().remove('span');
		}
	} else {
		redBorder(id, true);
		$(id).parent().append(emptyWarn);
	}
}

var redBorder = function(id, state) {
	if(state) {
		$(id).addClass('has-warning');
	} else {
		$(id).removeClass('has-warning');
	}
	return state;
}