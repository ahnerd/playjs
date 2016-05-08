

using("System.Controls.Menu");


namespace(".ContextMenu", Py.Menu.extend({
	
	floating: true,
	
	options: {
		renderTo: null,
		zIndex: 10000,
		shadow: 'rb',
		width: 190,
		display: 'none'
	},
	
	setControl: function(ctrl){
		ctrl.on('contextmenu', Function.bind(this.onContextMenu, this));
		
		return this;
	},
	
	setDisable: function(disable){
		this.disabled = disable;
	},
	
	onContextMenu: function(e){ 
		if(!this.disabled)
			this.show(e.pageX === undefined ? event.x : e.pageX, e.pageY === undefined ? event.y : e.pageY);
		e.stop();
	}
	
}));
