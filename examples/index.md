---
layout: default
---
# Examples

## Basic example

__Cue Card HTML__
{% highlight html %}
<ol id="cue-card">
  <li data-target="#item1">This is an item</li>
  <li data-target="#item2">This is another item</li>
</ol>
{% endhighlight %}

__Site to be toured HTML__
{% highlight html %}
<div id="item1">What is this?</div>
<div id="item2">What am I?</div>
{% endhighlight %}

__Javascript__
{% highlight javascript %}
$('#cue-card').chaperone().chaperone('start');
{% endhighlight %}

------------------------------------

__Demo__ <button id="button1">Start Demo</button>

> <ol id="cue-card">
>  <li data-target="#item1">This is an item</li>
>  <li data-target="#item2">This is another item</li>
> </ol>
> <div id="item1" style="background: #333; color: #fff; width: 100px; height: 100px; float: left;">What is this?</div>
> <div id="item2" style="background: #999; color: #000; width: 100px; height: 100px; float: right;">What am I?</div>
> <br style="clear: both;">

<script>
	$('#cue-card').chaperone();
	$('#button1').click(function() {
		$('#cue-card').chaperone('start');
		return false;
	});
</script>