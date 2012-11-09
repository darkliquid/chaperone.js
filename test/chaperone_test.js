/*global console:false, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

	/*
		======== A Handy Little QUnit Reference ========
		http://docs.jquery.com/QUnit

		Test methods:
			expect(numAssertions)
			stop(increment)
			start(decrement)
		Test assertions:
			ok(value, [message])
			equal(actual, expected, [message])
			notEqual(actual, expected, [message])
			deepEqual(actual, expected, [message])
			notDeepEqual(actual, expected, [message])
			strictEqual(actual, expected, [message])
			notStrictEqual(actual, expected, [message])
			raises(block, [expected], [message])
	*/

	module('jQuery#chaperone', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone();
		},
		teardown: function() {
			// Cleaning up the steps created in the body tag
			$('.chaperone-steps').remove();
		}
	});

	test('is chainable', function() {
		// Not a bad test to run on collection methods.
		strictEqual(this.elems.chaperone(), this.elems, 'should be chainable');
	});

	test('reuses existing steps', function() {
		this.elems.chaperone().chaperone().chaperone();
		strictEqual($('.chaperone-steps').length, 1, 'should have only one set of steps');
	});

	test('creates steps from tour', function() {
		strictEqual(
			$('.chaperone-steps').children().length,
			this.elems.children().length,
			'should have created the right number of steps'
		);
		strictEqual(
			this.elems.find('li:first').data('title'),
			$('.chaperone-steps').children().eq(0).find('.title').text(),
			'should have the right step title set'
		);
		strictEqual(
			this.elems.find('li:first').html(),
			$('.chaperone-steps').children().eq(0).find('.content').html(),
			'should have the right step content set'
		);
		strictEqual(
			$('.chaperone-steps').children().eq(1).find('.title').length,
			0,
			'should have no title block when no title set'
		);
	});

	test('marks element/tour as chaperoned', function() {
		ok(this.elems.hasClass('chaperoned'), 'should have chaperoned class');
	});

	test('hides tour', function() {
		ok(this.elems.is(':hidden'), 'should have hidden tour base element');
	});

	test('start', function() {
		this.elems.chaperone('start');
		var tour2 = $('ol.another-tour');
		tour2.chaperone().chaperone('start');
		ok(this.elems.data('chaperone').container.is(':hidden'), 'should hide other active chaperones');
		ok(tour2.data('chaperone').container.children().eq(0).is(':visible'), 'first step should be visible');
	});

	test('stop', function() {
		this.elems.chaperone('start').chaperone('stop');
		ok(this.elems.data('chaperone').container.is(':hidden'), 'should hide chaperone');
	});

	test('destroy', function() {
		this.elems.chaperone('destroy');
		strictEqual($('.chaperone-steps').length, 0, 'should remove associated steps');
		strictEqual(this.elems.data('chaperone'), undefined, 'should remove data from chaperoned element');
		ok(!this.elems.hasClass('chaperoned'), 'chaperoned element should not have chaperoned class');
		ok(this.elems.is(':visible'), 'chaperoned element should be visible');
	});

	test('next', 3, function() {
		var elems = this.elems;
		this.elems.chaperone('start');
		this.elems.one('showstep.chaperone', function(event, step) {
			strictEqual(step, elems.data('chaperone').container.children().get(1), 'should fire showstep for the next step');
		});
		this.elems.one('hidestep.chaperone', function(event, step) {
			strictEqual(step, elems.data('chaperone').container.children().get(0), 'should fire hidestep for the current step');
		});
		this.elems.chaperone('next');
		ok(this.elems.data('chaperone').container.children().eq(1).is(':visible'), 'second step should be visible');
	});

	test('prev', function() {
		var elems = this.elems;
		this.elems.chaperone('start');
		this.elems.one('showstep.chaperone', function(event, step) {
			strictEqual(step, elems.data('chaperone').container.children().get(3), 'should fire showstep for the prev step');
		});
		this.elems.one('hidestep.chaperone', function(event, step) {
			strictEqual(step, elems.data('chaperone').container.children().get(0), 'should fire hidestep for the current step');
		});
		this.elems.chaperone('prev');
		ok(this.elems.data('chaperone').container.children().eq(3).is(':visible'), 'last step should be visible');
	});

	
	module('jQuery#chaperone positioning', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone();
			this.elems.chaperone('start');
		},
		teardown: function() {
			// Cleaning up the steps created in the body tag
			//$('.chaperone-steps').remove();
		}
	});

	test('start', function() {
		deepEqual(
			this.elems.data('chaperone').container.children().first().offset(),
			{},
			'should position first step by it\'s target'
		);
	});

	test('on resize', function() {
		var width = $(window).width(),
			height = $(window).height(),
			offset = this.elems.data('chaperone').container.children().first().offset();

		window.resizeTo(300, 300);

		var newOffset = this.elems.data('chaperone').container.children().first().offset();

		window.resizeTo(width, height);

		notDeepEqual(newOffset, offset, 'position should be changed');
	});
	

	module('jQuery#chaperone events', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone();
		},
		teardown: function() {
			// Cleaning up the steps created in the body tag
			$('.chaperone-steps').remove();
		}
	});

	test('started', 1, function() {
		this.elems.one('started.chaperone', function() {
			ok(true, 'should fire started event on start');
		});
		this.elems.chaperone('start');
	});

	test('showstep', 4, function() {
		var elems = this.elems;
		this.elems.one('showstep.chaperone', function(event, step) {
			ok(true, 'should fire showstep event on start');
			strictEqual(step, elems.data('chaperone').container.children().get(0), 'should pass step element as second argument');
		});
		this.elems.chaperone('start');
		this.elems.one('showstep.chaperone', function(event, step) {
			ok(true, 'should fire showstep event on next');
			strictEqual(step, elems.data('chaperone').container.children().get(1), 'should pass next step element as second argument');
		});
		this.elems.chaperone('next');
	});

	test('hidestep', 2, function() {
		var elems = this.elems;
		this.elems.one('hidestep.chaperone', function(event, step) {
			ok(true, 'should fire hidestep event on prev');
			strictEqual(step, elems.data('chaperone').container.children().get(0), 'should pass current step element as second argument');
		});
		this.elems.chaperone('start').chaperone('prev');
	});

	test('destroyed', 1, function() {
		this.elems.on('destroyed.chaperone', function() {
			ok(true, 'should fire destroyed event on destroy');
		});
		this.elems.chaperone('destroy');
	});

	module('jQuery#chaperone steps', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone().chaperone('start');
		},
		teardown: function() {
			// Cleaning up the steps created in the body tag
			$('.chaperone-steps').remove();
		}
	});

	test('clicking next', 2, function() {
		var elems = this.elems,
			step = elems.data('chaperone').container.children().eq(0),
			next = elems.data('chaperone').container.children().get(1);
		elems.one('hidestep.chaperone', function(event, el) {
			ok(el === step.get(0), 'should hide current chaperone');
		});
		elems.one('showstep.chaperone', function(event, el) {
			ok(el === next, 'should show next chaperone');
		});
		step.find('.next-chaperone').click();
	});

	test('clicking prev', 2, function() {
		var elems = this.elems,
			step = elems.data('chaperone').container.children().eq(0),
			prev = elems.data('chaperone').container.children().get(3);
		elems.one('hidestep.chaperone', function(event, el) {
			ok(el === step.get(0), 'should hide current chaperone');
		});
		elems.one('showstep.chaperone', function(event, el) {
			ok(el === prev, 'should show next chaperone');
		});
		step.find('.prev-chaperone').click();
	});

	test('clicking close', 2, function() {
		var elems = this.elems,
			step = elems.data('chaperone').container.children().eq(0);
		elems.one('hidestep.chaperone', function(event, el) {
			ok(el === step.get(0), 'should hide current chaperone');
		});
		elems.one('stopped.chaperone', function(event, el) {
			ok(true, 'should stop chaperone');
		});
		step.find('.close-chaperone').click();
	});

	module('jQuery#chaperone options', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone();
		},
		teardown: function() {
			// Cleaning up the steps created in the body tag
			$('.chaperone-steps').remove();
		}
	});

}(jQuery));
