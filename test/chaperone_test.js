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

	QUnit.config.testTimeout = 500;
	QUnit.jsDump.HTML = false;


	module('jQuery#chaperone', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone();
		},
		teardown: function() {
			this.elems.chaperone('destroy');
			$('.chaperone-steps').remove();
		}
	});

	test('is chainable', 1, function() {
		// Not a bad test to run on collection methods.
		strictEqual(this.elems.chaperone(), this.elems, 'should be chainable');
	});

	test('reuses existing steps', 1, function() {
		this.elems.chaperone().chaperone().chaperone();
		strictEqual($('.chaperone-steps').length, 1, 'should have only one set of steps');
	});

	test('creates steps from tour', 4, function() {
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

	test('marks element/tour as chaperoned', 1, function() {
		ok(this.elems.hasClass('chaperoned'), 'should have chaperoned class');
	});

	test('hides tour', 1, function() {
		ok(this.elems.is(':hidden'), 'should have hidden tour base element');
	});

	test('start', 2, function() {
		this.elems.chaperone('start');
		var tour2 = $('ol.another-tour');
		tour2.chaperone().chaperone('start');
		ok(this.elems.data('chaperone').container.is(':hidden'), 'should hide other active chaperones');
		ok(tour2.data('chaperone').container.children().eq(0).is(':visible'), 'first step should be visible');
	});

	test('stop', 1, function() {
		this.elems.chaperone('start').chaperone('stop');
		ok(this.elems.data('chaperone').container.is(':hidden'), 'should hide chaperone');
	});

	test('destroy', 4, function() {
		this.elems.chaperone('start');
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

	test('prev', 3, function() {
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

	test('settings', 4, function() {
		var elems = this.elems;
		deepEqual(this.elems.chaperone('settings'), this.elems.data('chaperone'), 'should return the settings for the chaperoned element');
		this.elems2 = $('#qunit-fixture ol.another-tour');
		this.elems2.chaperone();
		equal($('#qunit-fixture ol.tour, #qunit-fixture ol.another-tour').chaperone('settings').length, 2, 'should have 2 elements');
		deepEqual($('#qunit-fixture ol.tour, #qunit-fixture ol.another-tour').chaperone('settings')[0], this.elems.data('chaperone'), 'first element should have first settings');
		deepEqual($('#qunit-fixture ol.tour, #qunit-fixture ol.another-tour').chaperone('settings')[1], this.elems2.data('chaperone'), 'second element should have second settings');
		this.elems2.chaperone('destroy');
	});


	module('jQuery#chaperone placements', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone();
			this.elems.chaperone('start');
		},
		teardown: function() {
			this.elems.chaperone('destroy');
			$('.chaperone-steps').remove();
		}
	});

	test('placement = left', 1, function() {
		var chaperone = this.elems.data('chaperone').container.children().first();
		ok(chaperone.width() + chaperone.offset().left < $('#target1').offset().left, 'should be positioned left of target');
	});

	test('placement = top', 1, function() {
		this.elems.chaperone('next');
		var chaperone = this.elems.data('chaperone').container.children().eq(1);
		ok(chaperone.height() + chaperone.offset().top < $('#target2').offset().top, 'should be positioned above target');
	});

	test('placement = right', 1, function() {
		this.elems.chaperone('next');
		this.elems.chaperone('next');
		var chaperone = this.elems.data('chaperone').container.children().eq(1);
		ok(chaperone.offset().left > $('#target3').offset().left + $('#target3').width(), 'should be positioned right of target');
	});

	test('placement = bottom', 1, function() {
		this.elems.chaperone('next');
		this.elems.chaperone('next');
		this.elems.chaperone('next');
		var chaperone = this.elems.data('chaperone').container.children().eq(1);
		ok(chaperone.offset().top > $('#target3').offset().top + $('#target3').height(), 'should be positioned below target');
	});


	module('jQuery#chaperone events', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone();
		},
		teardown: function() {
			this.elems.chaperone('destroy');
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

	test('repositioned', 1, function() {
		this.elems.on('repositioned.chaperone', function() {
			ok(true, 'should fire repositioned event on reposition');
		});
		this.elems.chaperone('reposition');
	});


	module('jQuery#chaperone steps', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.tour');
			this.elems.chaperone().chaperone('start');
		},
		teardown: function() {
			this.elems.chaperone('destroy');
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


	module('jQuery#chaperone boundary contraints/auto positioning', {
		setup: function() {
			this.elems = $('#qunit-fixture ol.another-tour');
			$('.targets').css('padding', 0);
			this.elems.chaperone({ keepInsideBoundary: '.targets' });
			this.elems.chaperone('start');
		},
		teardown: function() {
			this.elems.chaperone('destroy');
			$('.chaperone-steps').remove();
		}
	});

	test('auto-positioning in contrained box', 4, function() {
		var step = this.elems.data('chaperone').container.children().eq(0);
		ok(!step.hasClass('left'), 'should not have left class');
		ok(!step.hasClass('right'), 'should not have right class');
		ok(!step.hasClass('top'), 'should not have top class');
		ok(!step.hasClass('bottom'), 'should not have bottom class');
	});

	test('auto-positioning with free space above', 1, function() {
		var step = this.elems.data('chaperone').container.children().eq(0);
		$('.targets').css('padding-top', 500);
		this.elems.chaperone('reposition');
		ok(step.hasClass('top'), 'should have top class');
	});

	test('auto-positioning with free space left', 1, function() {
		var step = this.elems.data('chaperone').container.children().eq(0);
		$('.targets').css({ 'padding-left': 500, 'width': 1000 });
		this.elems.chaperone('reposition');
		ok(step.hasClass('left'), 'should have left class');
	});


	test('auto-positioning with free space right', 1, function() {
		var step = this.elems.data('chaperone').container.children().eq(0);
		$('.targets').css({ 'padding-right': 500, 'width': 1000 });
		this.elems.chaperone('reposition');
		ok(step.hasClass('right'), 'should have right class');
	});

	test('auto-positioning with free space below', 1, function() {
		var step = this.elems.data('chaperone').container.children().eq(0);
		$('.targets').css('height', 500);
		this.elems.chaperone('reposition');
		ok(step.hasClass('bottom'), 'should have bottom class');
	});

	// Hack to add in 'test' for actually running tests that require child windows, such as the resize event.
	if ( !window.opener ) {
		QUnit.done(function() {
			$('#qunit-tests')
			.append('<li class="fail"><strong><span class="module-name">jQuery#chaperone window resize</span>: <b class="failed">This module can only work in a child window.</b></strong><a id="external-tests">Click to run tests</a></li>')
			.find('a#external-tests')
			.click(function(){
				window.open( location.href, 'win', 'width=800,height=600,scrollbars=1,resizable=1' );
				return false;
			});
		});
	} else {
		$('#qunit-header a').attr( 'target', '_blank' );

		module('jQuery#chaperone window resize', {
			setup: function() {
				this.elems = $('#qunit-fixture ol.tour');
				this.elems.chaperone();
			},
			teardown: function() {
				// Cleaning up the steps created in the body tag
				$('.chaperone-steps').remove();
			}
		});

		// For some reason this isn't working, but the code __does__ work, so it's something in qunit I guess?
		asyncTest('on resize event should reposition steps', 1, function() {
			this.elems.on('repositioned.chaperone', function() {
				ok(true, 'should fire get repositioned on window resize');
				start();
			});
			$(window).trigger('resize');
		});

	}

}(jQuery));
