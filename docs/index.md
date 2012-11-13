---
layout: default
---
# Documentation

Chaperone is configured and controlled in 3 main ways. 
The first is the settings hash when [initialising Chaperone](#configuration). 
The second is the options on each step of [the chaperones cue card](#the_cue_card).
Lastly, the chaperone can be [given instructions directly](#instructing_the_chaperone).

As a final note, the chaperone will also emit events that you can hook into as he goes about his duties.

## Basic Usage

The bare minimum required to get a Chaperone working is the following:

{% highlight html %}
<ol id="cue-card">
  <li data-target="#item">This is an item</li>
</ol>
<div id="item">What is this?</div>
<script>
  $('#cue-card').chaperone();
</script>
{% endhighlight %}

However, this isn't very exciting and you'll also find that nothing actually shows up. 
This is because while you've configured a chaperone, you haven't started him on his journey, 
you can do this by adding the line: {% highlight javascript %}$('#cue-card').chaperone('start');{% endhighlight %}
to the end of the script tag.

## Configuration

There are a number of options with which you can configure a chaperone at initialisation. By default, these are:

{% highlight javascript %}
$.fn.chaperone.defaults = {
  step: 'li',
  steps: {
    placement: 'auto'
  },
  animate: true,
  margin: 10,
  template: [
    '<div class="chaperone">',
      '<div class="arrow"></div>',
      '<a class="close-chaperone">&times;</a>',
      '<div class="content-wrapper">',
        '<h4 class="title">Title</h4>',
        '<div class="content">Content</div>',
        '<a class="prev-chaperone">Previous</a>',
        '<a class="next-chaperone">Next</a>',
      '</div>',
    '</div>'
  ].join(''),
  keepInsideBoundary: document,
  repositionOnResize: true
};
{% endhighlight %}

### step

> __Default:__ li

This option defines the selector used to determine each step of the cue card.

### steps

> __Default:__ { placement: 'auto' }

This controls the default configuration for each step. Configuration here can be overridden on a per-step basis using _data attributes_.

### animate

> __Default:__ true

This controls whether or not the chaperone smoothly scrolls the current step into view. When disabled, no automatic scrolling occurs.

### margin

> __Default:__ 10

This defines a margin around the step when shown to ensure it is a minimum distance away from it's target.

### template

> __Default:__ _html_

The template option defines the markup that is created for each step of the chaperones tour. The mark can be anything, but certain classes 
are treated specially.

#### Template Classes

##### close-chaperone

A tag with this class will close the step when clicked.

##### title

A tag with this class will have it's content replaced with the steps title.

##### content

A tag with this class will have it's content replaced with the steps content.

##### prev-chaperone

A tag with this class will move the chaperone back a step when clicked

##### next-chaperone

A tag with this class will move the chaperone forward a step when clicked

###### Extra classes

When the tooltip/message is shown, the template's out-most element may also have a class of __left, right, top__ or __bottom__
placed on it depending on the current steps placement settings.

### keepInsideBoundary

> __Default:__ document

This defines the boundaries that the chaperone will try and keep the step within. By default this is the entire document
but you can limit the area in which a step is allowed to be placed to any given element or jQuery selector.

### repositionOnResize

> __Default:__ true

This defines whether or not the chaperone will try and reposition it's steps after the window is resized.

## The Cue Card

The cue card is the list of instructions the chaperone follows that tells him where to lead the user and what to tell them when they get there.

Typically cue cards are written using ol tags, where each li represents a step, but this can be customised to support any markup.
The cue card is hidden when the chaperone is activated and each step transformed into a tooltip/message.

__Examples__
{% highlight html %}
<ol id="example-cue-card-1">
  <li data-target="h1.something" data-placement="top"></li>
  <li data-target="#something" data-placement="left"></li>
</ol>

<div id="example-cue-card-2">
  <span data-target="h1.something" data-placement="top"></span>
  <span data-target="#something" data-placement="left"></span>
</div>
{% endhighlight %}

You'll notice on each step are a couple of options set via _data_ attributes. These define basic behaviour for the step, the most important of these
is __target__.

### Data Attributes

#### target

> This attribute is mandatory. Without it, this step will not display correctly.

Set this to a valid jQuery selector and the tooltip/message will be displayed by the matching element.

#### placement

Valid options are __left, right, top, bottom__ and __auto__. If not set, the value defaults to auto.

This controls how the placement of tooltips/messages is determined. In auto mode, the tooltip/message will get placed 
wherever there is room around the target, starting from __top center__ and then trying other combinations until one works, finally settling on 
centering over the target if nothing else works. The other options force the tooltip/message to position themselves at those offsets regardless 
of room, which can result in them appearing off-screen.

## Instructing the Chaperone

The chaperone will accept a number of instructions to control it's actions or ask it's status.

You can send the chaperone an instruction like so:

{% highlight javascript %}
$('#my-tour').chaperone('my_command')
{% endhighlight %}

### start

> Fires the _started_ and _showstep_ events

Sending this command starts the chaperone on his tour. If he is already on a tour, this will reset him to the beginning.

### stop

> Fires the _hidestep_ and _stopped_ events

Sending this command stops the tour, hiding all visible steps.

### destroy

> Fires the _stopped_ and the _destroyed_ events

Sending this command removes all traces fo the chaperone and restores the cue card to it's previous state.

### next

> Fires the _hidestep_ and _showstep_ events

Moves the chaperone to the next step, hiding the last one. Loops back to the beginning if on the last step.

### prev

> Fires the _hidestep_ and _showstep_ events

Moves the chaperone to the previous step, hiding the last one. Loops back to the end if on the first step.

### reposition

> Fires the _repositioned_ event

Forces the chaperone to recalculate the position of it's steps

### settings

Returns the settings of the selected chaperones.