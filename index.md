---
layout: default
---

# What is Chaperone?

Chaperone is a simple jQuery plugin for doing guided tours through a website.
Inspired by [Joyride](http://www.zurb.com/playground/jquery-joyride-feature-tour-plugin),
Chaperone takes a list of items and uses them as a guide to show messages on targetted elements.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/darkliquid/chaperone/master/dist/chaperone.min.js
[max]: https://raw.github.com/darkliquid/chaperone/master/dist/chaperone.js

In your web page:

{% highlight html %}
<script src="jquery.min.js"></script>
<script src="chaperone.min.js"></script>
<script>
jQuery(function($) {
  $('#my-tour').chaperone(); // Set up a default tour for #my-tour
  $('#my-tour').chaperone('start'); // Start the tour
});
</script>
{% endhighlight %}

## Documentation

Check out [the documention page](docs)

## Examples

Check out [the examples page](examples)

## Release History
__0.3.0__ - First release

## License
Copyright (c) 2012 Andrew Montgomery-Hurrell  
Licensed under the MIT, GPL licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.

### Installing PhantomJS

In order for the qunit task to work properly, [PhantomJS](http://www.phantomjs.org/) must be installed and in the system PATH (if you can run "phantomjs" at the command line, this task should work).

Unfortunately, PhantomJS cannot be installed automatically via npm or grunt, so you need to install it yourself. There are a number of ways to install PhantomJS.

* [PhantomJS and Mac OS X](http://ariya.ofilabs.com/2012/02/phantomjs-and-mac-os-x.html)
* [PhantomJS Installation](http://code.google.com/p/phantomjs/wiki/Installation) (PhantomJS wiki)

Note that the `phantomjs` executable needs to be in the system `PATH` for grunt to see it.

* [How to set the path and environment variables in Windows](http://www.computerhope.com/issues/ch000549.htm)
* [Where does $PATH get set in OS X 10.6 Snow Leopard?](http://superuser.com/questions/69130/where-does-path-get-set-in-os-x-10-6-snow-leopard)
* [How do I change the PATH variable in Linux](https://www.google.com/search?q=How+do+I+change+the+PATH+variable+in+Linux)