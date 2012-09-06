(function($, undefined) {

	function calculatePosition(elem, step) {
		var target = step.data('target') || step.prev().data('target'),
			options = elem.data('chaperone'),
			boundary = $.extend(
				$(options.keepInsideBoundary).offset() || { top: 0, left: 0 },
				{
					width: $(options.keepInsideBoundary).width(),
					height: $(options.keepInsideBoundary).height()
				}
			);

		// If no target element, display near the mouse instead
		if(target) {
			var el = $(target),
				offset = $.extend(
					el.offset() || { top: 0, left: 0 },
					{
						width: el.width(),
						height: el.height()
					}
				),
				stepW = step.width(),
				stepH = step.height();

			// We can put it above and center
			if(offset.top - stepH - options.margin > boundary.top) {
				step.css('top', offset.top - stepH - options.margin);
				
			}

			// We can put it left
			if(offset.left - stepW - options.margin > boundary.left) {
				step.css('left', offset.left - stepW - options.margin);
			}

			// Can't put right
			if(offset.left + offset.width + stepW + options.margin > boundary.left + boundary.width) {
				//horizontalMode++;
			}

			// Can't put above
			

			// Can't put below
			if(offset.top + offset.height + stepH + options.margin > boundary.top + boundary.height) {
				//verticalMode++;
			}


		}
	}

	function showStep(elem, step) {
		step.show();
		elem.trigger('showstep.chaperone', [step.get(0)]);
	}

	function hideStep(elem, step) {
		step.hide();
		elem.trigger('hidestep.chaperone', [step.get(0)]);
	}

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
					settings.container = $('<div class="chaperone-steps" style="display: none;"></div>');
					body.append(settings.container);
					elem.data('chaperone', settings);
					elem.addClass('chaperoned').hide();

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
				// Fire started event
				elem.trigger('started.chaperone');
				// Show the current one, but only the first step
				showStep(elem, container.show().children().hide().eq(0));
			});
		},

		stop: function() {
			return this.each(function() {
				var elem = $(this),
					settings = elem.data('chaperone'),
					container = settings.container,
					currentStep = container.children(':visible');

				// Hide current step
				hideStep(elem, currentStep);
				// Hide chaperone
				container.hide();
				// Fire stopped event
				elem.trigger('stopped.chaperone');
			});
		},

		destroy: function() {
			return this.each(function() {
				var elem = $(this),
					settings = elem.data('chaperone'),
					container = settings.container,
					currentStep = container.children(':visible');

				// Hide current step
				hideStep(elem, currentStep);
				// Remove the generated steps
				container.remove();
				// Fire stopped event
				elem.trigger('stopped.chaperone');
				// Remove the cached chaperone data on the element
				elem.removeData('chaperone');
				// Unmark as being chaperoned
				elem.removeClass('chaperoned');
				// Fire destroyed event
				elem.trigger('destroyed.chaperone');
				// Restore visiblity
				elem.show();
			});
		},

		next: function() {
			return this.each(function() {
				var elem = $(this),
					settings = elem.data('chaperone'),
					container = settings.container,
					currentStep = container.children(':visible'),
					nextStep = currentStep.next();

				if(nextStep.length === 0) {
					nextStep = container.children().first();
				}

				hideStep(elem, currentStep);
				showStep(elem, nextStep);
			});
		},

		prev: function() {
			return this.each(function() {
				var elem = $(this),
					settings = elem.data('chaperone'),
					container = settings.container,
					currentStep = container.children(':visible'),
					prevStep = currentStep.prev();

				if(prevStep.length === 0) {
					prevStep = container.children().last();
				}

				hideStep(elem, currentStep);
				showStep(elem, prevStep);
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
		margin: 10,
		template: [
			'<div class="chaperone">',
				'<a class="close-chaperone">&times;</a>',
				'<div class="content-wrapper">',
					'<h4 class="title">Title</h4>',
					'<div class="content">Content</div>',
					'<a class="prev-chaperone">&laquo; Previous</a>',
					'<a class="next-chaperone">Next &raquo;</a>',
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