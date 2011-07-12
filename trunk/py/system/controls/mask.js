//===========================================
//  阴影                         mask.js          A
//===========================================




Py.using("System.Controls.Control");
Py.imports("Resources.Share.Control.Mask");

Py.namespace('.Mask', Py.Control.extend({
	
	tpl: '<div class="x-mask"><div class="x-mask-container"></div></div>',
	
	xType: 'mask',
	
	renderTo: function(elem){
		elem = Py.$(elem);
		Py.Element.setMovable(elem.dom || elem);
		elem.appendChild(this.dom);
		this.bringToFront(elem);
		return this;
	}
	
}));
