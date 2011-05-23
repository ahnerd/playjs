





Py.using("System.Dom.Element");
Py.using("System.Dom.Drag");
Py.imports("Resources.*.Viewer.ScrollBar");


Py.namespace("Py", "ScrollBar", Py.Control.extend({
	
	tpl: '<div class="x-scrollbar">\
	    <div style="top: 0px; left: 0px;" class="x-scrollbar-handle">\
	        <div class="x-scrollbar-handle-left"></div>\
	        <div class="x-scrollbar-handle-center"></div>\
	        <div class="x-scrollbar-handle-right"></div>\
	    </div>\
	    <div class="x-scrollbar-left"></div>\
	    <div class="x-scrollbar-right"></div>\
	</div>',
	
	_type: 0,
	
	init: function(options){
		var me = this;
		this.handle = this.find('.x-scrollbar-handle').setDraggable(true);
		if (options.direction === 'horizonal') {
			this.addClass('x-scrollbar-horizonal');
			this._type = 1;
			this.handle.on('drag', function(e){
				e.data.to.x = Math.min(Math.max(e.data.to.x, 15), me.getWidth() - this.getWidth() - 16);
				e.data.to.y = e.data.from.y;
				me.onChange(e.data.delta);
			});
		}else {
			
			this.handle.on('drag', function(e){
				e.data.to.y = Math.min(Math.max(e.data.to.y, 15), me.getHeight() - this.getHeight() - 16);
				e.data.to.x = e.data.from.x;
				
				me.onChange(e.data.delta);
			});
			
		}
		
		
		this.setValueInternal(0);
	},
	
	setBarSize: function(value){
		this[Py.ScrollBar.names[this._type][0]](value);
	},
	
	getBarSize: function(value){
		return this[Py.ScrollBar.names[this._type][1]]();
	},
	
	setHandleSize: function(value){
		this.handle[Py.ScrollBar.names[this._type][0]](value);
	},
	
	getHandleSize: function(){
		return this.handle[Py.ScrollBar.names[this._type][1]]();
	},
	
	getMinValue: function(){
		return 0;
	},
	
	setDisbaled: function(value){
		this.disabled = value;
		
		this.setDraggable(value);
	},
	
	getMaxValue: function(){
		return this.getBarSize() - this.getHandleSize() - 31;
	},
	
	setValueInternal: function(value){
		this.handle.style[Py.ScrollBar.names[this._type][2]] = value + 15 + 'px';
	},
	
	setValue: function(value){
		value = Math.min(Math.max(this.getMinValue(), value), this.getMaxValue());
		this.setValueInternal(value);
	},
	
	getValue: function(value){
		return parseInt(this.handle.style[Py.ScrollBar.names[this._type][2]]) - 15;
	},
	
	onChange: function(delta){
		this.trigger('change', delta);
	}
	
}));


Py.ScrollBar.names = [
	['setHeight', 'getHeight', 'top'],
	['setWidth', 'getWidth',  'left'],
]
