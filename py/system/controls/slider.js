





Py.using("System.Dom.Element");
Py.using("System.Dom.Drag");
Py.imports("Resources.*.Form.Slider");


Py.namespace(".Slider", Py.Control.extend({
	
	xType: 'slider',
	
	tpl: '<div style="width: 100px; " class="x-slider">\
        <div class="x-slider-left">\
            <div class="x-slider-right">\
                <div class="x-slider-center">\
                    <a class="x-slider-handle">\
                    </a>\
                </div>\
            </div>\
        </div>\
    </div>\
',
	
	_type: 0,
	
	marginFix: 14,

	setWidth: function(value){
		this.handle.get('parent').setWidth(value - this.marginFix);
		this.onResizeX();
		return this;
	},

	setHeight: function(value){
		this.handle.get('parent').setHeight(value - this.marginFix);
		this.onResizeY();
		return this;
	},
	
	init: function(options){
		var me = this;
		this.handle = this.find('.x-' + this.xType + '-handle').setDraggable(true);
		if (options.direction === 'horizonal') {
			this.addClass('x-' + this.xType + '-horizonal');
			this._type = 1;
			this.handle.on('drag', function(e){
				e.data.to.x = Math.min(Math.max(e.data.to.x, me.valueFix), me.getWidth() - m.getWidth() -  me.valueFix - 1);
				e.data.to.y = e.data.from.y;
				me.onChange(e.data.delta);
			});
		}else {
			this.addClass('x-' + this.xType + '-vertial');
			this.handle.on('drag', function(e){
				e.data.to.y = Math.min(Math.max(e.data.to.y,  me.valueFix), me.getHeight() - this.getHeight() -  me.valueFix - 1);
				e.data.to.x = e.data.from.x;
				
				me.onChange(e.data.delta);
			});
			
		}
		
		
		this.setValueInternal(0);
	},
	
	setBarSize: function(value){
		this[Py.Slider.names[this._type][0]](value);
	},
	
	getBarSize: function(value){
		return this[Py.Slider.names[this._type][1]]();
	},
	
	setHandleSize: function(value){
		this.handle[Py.Slider.names[this._type][0]](value);
	},
	
	getHandleSize: function(){
		return this.handle[Py.Slider.names[this._type][1]]();
	},
	
	getMinValue: function(){
		return 0;
	},
	
	setDisbaled: function(value){
		this.disabled = value;
		
		this.setDraggable(value);
	},
	
	getMaxValue: function(){
		return this.getBarSize() - this.getHandleSize() + 1;
	},
	
	setValueInternal: function(value){
		this.handle.style[Py.Slider.names[this._type][2]] = value + 'px';
	},
	
	setValue: function(value){
		value = Math.min(Math.max(this.getMinValue(), value), this.getMaxValue());
		this.setValueInternal(value);
	},
	
	getValue: function(value){
		return parseInt(this.handle.style[Py.Slider.names[this._type][2]]) -  this.valueFix;
	},
	
	onChange: function(delta){
		this.trigger('change', delta);
	}
	
}));


Py.Slider.names = [
	['setHeight', 'getHeight', 'y', 'top'],
	['setWidth', 'getWidth', 'x',  'left'],
]
