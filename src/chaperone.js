(function($, undefined) {

	var count = 0;

	var methods = {

		init: function(options) {
			options = $.extend({}, $.fn.chaperone.defaults, options);

			return this.each(function(){
				var elem = $(this),
					body = $('body'),
					settings = elem.data('chaperone');

				// If we haven't built the step markup yet
				if(typeof(settings) === 'undefined') {
					settings = $.extend({}, options);
					// Setup the markup container and store it in the elements data
					settings.container = $('<div class="chaperone-steps" count="'+(count++)+'"></div>');
					body.append(settings.container);
					elem.data('chaperone', settings);

					// Make markup for each step
					elem.find(settings.step).each(function(index, el) {
						var code = $(settings.template),
							step = $(el),
							title = step.attr('data-title'),
							content = step.html();
						if(title) {
							code.find('.title').html(title);
						} else {
							code.find('.title').remove();
						}
						code.find('.content').html(content);
						code.hide();
						settings.container.append(code);
					});
				}
			});
		},

		// Start a chaperone
		start: function() {
			return this.each(function() {
				var elem = $(this),
					settings = elem.data('chaperone'),
					container = settings.container;

				// Hide any existing chaperones
				$('.chaperone-steps').hide();
				// Show the current one, but only it's first step
				container.show().children().hide().eq(0).show();
			});
		}

	};

	// # Chaperone.js
	//
	// A jQuery plugin for doing simple guided tours of websites
	$.fn.chaperone = function(method) {
		if(methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if(typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.chaperone' );
		}
	};

	$.fn.chaperone.defaults = {
		step: 'li',
		animate: true,
		template: [
			'<div class="chaperone">',
				'<a class="close">&times;</a>',
				'<div class="content-wrapper">',
					'<h4 class="title">Title</h4>',
					'<div class="content">Content</div>',
				'</div>',
			'</div>'
		].join(''),
		keyboard: true,
		nextKey: [39, 40, 13, 32],	// Right arrow | Down arrow | Enter | Space
		prevKey: [37, 38, 8],		// Left arrow | Up arrow | Backspace
		closeKey: 27,				// Escape
		keepInsideBoundary: document
	};

}(jQuery));