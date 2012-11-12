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

### keepInsideBoundary

> __Default:__ document

This defines the boundaries that the chaperone will try and keep the step within. By default this is the entire document
but you can limit the area in which a step is allowed to be placed to any given element or jQuery selector.

### repositionOnResize

> __Default:__ true

This defines whether or not the chaperone will try and reposition it's steps after the window is resized.

## The Cue Card

The cue card is the list of instructions the chaperone follows that tells him where to lead the user and what to tell them when they get there.

## Instructing the Chaperone

The chaperone will accept a number of instructions to control it's actions or ask it's status.

You can send the chaperone an instruction like so:

{% highlight javascript %}
$('#my-tour').chaperone('my_command')
{% endhighlight %}

### start

> Fires the _started_ andm _showstep_ events

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