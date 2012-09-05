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
			this.elems = $('#qunit-fixture #chainable').children();
		}
	});

	test('is chainable', 1, function() {
		// Not a bad test to run on collection methods.
		strictEqual(this.elems.chaperone(), this.elems, 'should be chainable');
	});

	module('jQuery#chaperone steps', {
		setup: function() {
			this.elems = $('#qunit-fixture #tour');
		}
	});

	test('creates steps from tour', 4, function() {
		this.elems.chaperone();
		strictEqual(
			$('.chaperone-steps').children().length,
			this.elems.chaperone().children().length,
			'should have created the right number of steps'
		);
		strictEqual(
			this.elems.chaperone().find('li:first').data('title'),
			$('.chaperone-steps').children().eq(0).find('.title').text(),
			'should have the right step title set'
		);
		strictEqual(
			this.elems.chaperone().find('li:first').html(),
			$('.chaperone-steps').children().eq(0).find('.content').html(),
			'should have the right step content set'
		);
		strictEqual(
			$('.chaperone-steps').children().eq(1).find('.title').length,
			0,
			'should have no title block when no title set'
		);
	});

}(jQuery));
