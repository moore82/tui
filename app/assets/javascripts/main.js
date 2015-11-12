var babySteps = (function($){
	var props = {
		handlers: $('aside a'),
		content: $('section article')
	};

	var init = function(){
		_setup();

		babySteps.init = null;
	};

	var goTo = function(step){
		if (step && !step.isNaN) $('a[href="#babyStep'+step+'"]').click();
	};

	var _setup = function(){
		// hide all articles and show first only
		props.content.hide();
		
		// add event handlers
		_events();

		// Which to show
		if (window.location.hash) {
			// Have we been requested to deep link? If so, select this one
			goTo( window.location.hash.replace('#babyStep','') );
		} else{
			// if not, select first in list
			goTo(1);
		}
	};

	var _events = function(){
		props.handlers.on('click',function(e){
			var $clickedElem = $(this);
			var whichToShow = (parseInt(this.hash.substr(1).replace('babyStep',''),10) - 1);
			props.handlers.removeClass('selected').eq(whichToShow).addClass('selected');
			props.content.hide().eq(whichToShow).show();
			_ajax( (whichToShow+1) );
		});
	};

	var _ajax = function(whichToShow){
		var request = $.ajax({
		  url: "assets/javascripts/baby-steps.json",
		  dataType: "json"
		});
		 
		request.done(function(data) {
			var $currentContent = props.content.filter(':visible');
			var namesArr = $.grep(data.friends, function(i) { return i.babyStep === whichToShow; });
			var friendsStr = '';
			var nameStr = '';

			if (($currentContent.find('.friends').length < 1) && namesArr.length > 0) {
				nameStr = '<em>' + namesArr[0].firstName + ' ' + namesArr[0].lastName + '</em>';
				switch(namesArr.length) {
					case 1:
						friendsStr = nameStr + ' is also in baby step ' + whichToShow;
						break;
					case 2:
						friendsStr = nameStr + ' and <em>' + namesArr[1].firstName + ' ' + namesArr[1].lastName + '</em> are also in baby step ' + whichToShow;
						break;
					case 3:
						var howManyFriends = (namesArr.length-2);
						friendsStr = nameStr + ', <em>' + namesArr[1].firstName + ' ' + namesArr[1].lastName + '</em> and '+howManyFriends+' other friend are also in baby step ' + whichToShow;
						break;
					default:
						var howManyFriends = (namesArr.length-2);
						friendsStr = nameStr + ', <em>' + namesArr[1].firstName + ' ' + namesArr[1].lastName + '</em> and '+howManyFriends+' other friends are also in baby step ' + whichToShow;
						break;
				}
				$currentContent.append('<div class="friends"><p>'+friendsStr+'</p></div>');
			}
		});
		 
		request.fail(function( jqXHR, textStatus ) {
		  if (console && console.error) console.error( "Request failed: " + textStatus );
		});
	};

	return {
		init: init,
		goTo: goTo
	};
})(window.jQuery);

babySteps.init();