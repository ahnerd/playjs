//===========================================
//  右键菜单   contextmenu.js       C
//===========================================


Py.using("System.Dom.Element");




if(navigator.isOpera && parseFloat(navigator.version) <= 10)
	Py.Element.defineEvents('contextmenu', 'mouseup', function(e){
		return e.button === 2;
	});


/*

if (navigator.isIE9)
	Py.Element.defineEvents('contextmenu', function(e){
		if(!('pageX' in e)){
			var event = window.event;
			String.map('clientX clientY screenX screenY', event, e);
			e.pageX = event.clientX + document.documentElement.scrollLeft;
			e.pageY = event.clientY + document.documentElement.scrollTop;
			e.layerX = event.x;
			e.layerY = event.y;
		}
	});

*/