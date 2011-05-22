//===========================================
//  AbsoluteLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.ContainerControl");



Py.Layout.register(Py.Layout.AbsoluteLayout = Py.Layout.extend({
	
	xType: 'absolute',
		
	className: 'x-block',
	
	setContainer: function(ct){
		Py.Element.setMovable(ct.dom);
	},
	
	doLayout: function(ct){
		
	},
	
	_toPoint: function(anchor){
		if(!anchor) return {x:0, y:0};
		anchor = anchor.split(' ');
		if(anchor.length == 1)
			anchor[1] = anchor[0];
		return {
			x: parseFloat(anchor[0]),
			y: parseFloat(anchor[1])
		}
	},
	
	onControlAdded: function(ct, index, item){
		item.addClass(this.className);
	},
		
	onControlRemoved: function(ct, index, item){
		item.removeClass(this.layout.className);
	}
	
	
}));





