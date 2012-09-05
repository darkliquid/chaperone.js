(function($, undefined) {
	// # Chaperone.js
	//
	// A jQuery plugin for doing simple guided tours of websites
	$.fn.chaperone = function(options) {
		options = $.extend(options, $.fn.chaperone.defaults);

		return this.each(function(){
			var elem = $(this),
				body = $('body'),
				opts = $.extend(options, elem.data()),
				container = elem.data('chaperone-steps');

			if(!container) {
				container = $('<div class="chaperone-steps"></div>');
				elem.data('chaperone-steps', container);
				body.append(container);
			}

			elem.find(opts.step).each(function(index, el) {
				var code = $(opts.template),
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
				container.append(code);
			});
		});
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
		].join(),
		keyboard: true,
		nextKey: [39, 40, 13, 32],	// Right arrow | Up arrow | Enter | Space
		prevKey: [37, 38, 8],		// Left arrow | Down arrow | Backspace
		closeKey: 27,				// Escape
		keepInsideBoundary: document
	};

}(jQuery));