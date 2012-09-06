/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
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

	test('start', function() {
		this.elems.chaperone('start');
		var tour2 = $('ol.another-tour');
		tour2.chaperone().chaperone('start');
		ok(tour2.data('chaperone').container.children().eq(0).is(':visible'), 'first step should be visible');
		ok(this.elems.data('chaperone').container.is(':hidden'), 'should hide other active chaperones');
	});



}(jQuery));
