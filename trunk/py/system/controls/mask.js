




Py.using("System.Controls.Control");
Py.imports("Resources.Share.Control.Mask");

Py.namespace('Py', 'Mask', Py.Control.extend({
	
	tpl: '<div class="x-mask"><div class="x-mask-container"></div></div>',
	
	xType: 'mask',
	
	options: {
		renderTo: true
	},
	
	setTarget: function(elem){
		this.target = Py.$(elem);
		this.update();
		return this;
	},
	
	getTarget: function(){
		return this.target;
	},
	
	update: function(){
		this.setSize(this.target.getSize());
		this.setPosition(this.target.getOffsets());
	}
	
}));
