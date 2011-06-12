

Py.using("System.Controls.ContextMenu");
Py.imports("Resources.*.Button.ContextMenuStrip");


Py.namespace(".ContextMenu", Py.Menu.extend({
	
	floating: true,
	
	xType: 'contextmenustrip',
	
	options: {
		renderTo: null,
		zIndex: 10000,
		shadow: true,
		width: 190,
		display: 'none'
	},
	
	setControl: function(ctrl){
		ctrl.on('contextmenu', Function.bind(this.onContextMenu, this));
		
		return this;
	},
	
	setDisbale: function(disbale){
		this.disabled = disbale;
	},
	
	onContextMenu: function(e){ 
		if(!this.disabled)
			this.show(e.pageX === undefined ? event.x : e.pageX, e.pageY === undefined ? event.y : e.pageY);
		return false;
	}
	
}));
