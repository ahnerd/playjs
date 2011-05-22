

if(navigator.isOpera)
	Py.defineDomEvents('contextmenu', 'mouseup', undefined, true, true).delegate = function(e){
		if(e.button == 2)
			this.trigger('contextmenu', e);
	};



if (navigator.isIE9)
	Py.defineDomEvents('contextmenu', undefined, function(e){
		var event = window.event;
		String.map('clientX clientY screenX screenY', event, e);
		e.pageX = event.clientX + document.documentElement.scrollLeft;
		e.pageY = event.clientY + document.documentElement.scrollTop;
		e.layerX = event.x;
		e.layerY = event.y;
	});
