/*global console:false */
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
			var el = $(''+target),
				offset = $.extend(
					el.offset() || { top: 0, left: 0 },
					{
						width: el.width(),
						height: el.height()
					}
				),
				stepW = step.width(),
				stepH = step.height(),
				hCenter = ((stepW + options.margin * 2) - offset.width),
				vCenter = ((stepH + options.margin * 2) - offset.height);
				console.log('hCenter: ' + hCenter);
				console.log('vCenter: ' + vCenter);

			switch(step.data('placement')) {
				case 'top':
					step.css('top', offset.top - stepH - options.margin);
					if(offset.left - hCenter > boundary.left) {
						step.css('left', (offset.left - hCenter / 2) + options.margin);
					} else {
						step.css('left', boundary.left + options.margin);
					}
				break;

				case 'bottom':
					step.css('top', offset.top + offset.height + options.margin);
					if(offset.left - hCenter > boundary.left) {
						step.css('left', (offset.left - hCenter / 2) + options.margin);
					} else {
						step.css('left', boundary.left + options.margin);
					}
				break;

				case 'left':
					step.css('left', offset.left - stepW - options.margin);
					if(offset.top - vCenter > boundary.top) {
						step.css('top', (offset.top - vCenter / 2) + options.margin);
					} else {
						step.css('top', boundary.top + options.margin);
					}
				break;

				case 'right':
					step.css('left', offset.left + offset.width + options.margin);
					if(offset.top - vCenter > boundary.top) {
						step.css('top', (offset.top - vCenter / 2) + options.margin);
					} else {
						step.css('top', boundary.top + options.margin);
					}
				break;

				default:
					// Above
					if(offset.top - (stepH + options.margin) > boundary.top) {
						step.css('top', offset.top - (stepH + options.margin));
					// Below
					} else if(offset.top + offset.height + stepH + options.margin < boundary.top + boundary.height) {
						step.css('top', offset.top + offset.height + options.margin);
					// Centered against target
					} else if(offset.top - vCenter > boundary.top) {
						step.css('top', (offset.top - vCenter / 2) + options.margin);
					// Fallback to boundary limit
					} else {
						step.css('top', boundary.top + options.margin);
					}

					// Can we center it?
					if(stepW < offset.width || offset.left - hCenter > boundary.left) {
						step.css('left', (offset.left - hCenter / 2) + options.margin);
					// Can it go to the left?
					} else if(offset.left - (stepW + options.margin) > boundary.left) {
						step.css('left', offset.left - (stepW + options.margin));
					// To the right?
					} else if(offset.left + offset.width + stepW + options.margin < boundary.left + boundary.width) {
						step.css('left', offset.left + offset.width + options.margin);
					// Fallback to boundary limit
					} else {
						step.css('left', boundary.left + options.margin);
					}
					
				break;
			}
		}
	}

	function showStep(elem, step) {
		calculatePosition(elem, step);
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
							data = $.extend({}, settings.steps, step.data()),
							content = step.html();
						if(data.title) {
							code.find('.title').html(data.title);
						} else {
							code.find('.title').remove();
						}
						code.find('.content').html(content);
						code.hide();
						code.data(data);
						settings.container.append(code);
					});
					settings.container.on('click.chaperone', '.next-chaperone', function() { elem.chaperone('next'); });
					settings.container.on('click.chaperone', '.prev-chaperone', function() { elem.chaperone('prev'); });
					settings.container.on('click.chaperone', '.close-chaperone', function() { elem.chaperone('stop'); });
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
		steps: {
			placement: 'auto'
		},
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