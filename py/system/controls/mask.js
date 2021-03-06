//===========================================
//  阴影                         mask.js          A
//===========================================




using("System.Controls.Control");
imports("Resources.Share.Control.Mask");

namespace('.Mask', Py.Control.extend({
	
	tpl: '<div class="x-mask"><div class="x-mask-container"></div></div>',
	
	xType: 'mask',
	
	renderTo: function(elem){
		elem = Py.$(elem);
		Element.setMovable(elem.dom || elem);
		elem.appendChild(this.dom);
		this.bringToFront(elem);
		return this;
	}
	
}));
