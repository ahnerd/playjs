





Py.using("System.Controls.Control");
Py.imports("Resources.*.Button.Button");




Py.namespace(".Button", Py.ContentControl.extend({
	
	options: {
		type: 'button'
	},
	
	tpl: '<a class="x-button">\
				<span class="x-button-container">\
					<button type="{type}"><span class="x-button-label"></span></button>\
				</span>\
			</a>',
	
	create: function(options){
		return Py.Element.parse(this.tpl.replace('{type}', options.type));
	},
	
	addEventListener: function(obj, type, fn){
		this.button.addEventListener(obj, type, fn);
	},
	
	removeEventListener: function(obj, type, fn){
		this.button.removeEventListener(obj, type, fn);
	},
	
	onActive: function(){
		this.addClass('x-active');
		document.one('mouseup', Function.bind(this.onDeactive, this));
	},
	
	onDeactive: function(){
		this.removeClass('x-active');
	},
	
	init: function(options){
		this.button = this.find('button');
		this.content = this.find('.x-button-label');
		this.button.on('mousedown', Function.bind(this.onActive, this));
	},
	
	setState: function(state, toggle){
		this.toggleClass('x-' + state, this[state] = toggle !== false);
	},

	setChecked: function(value){
		return this.setState('checked', value);
	},

	getChecked: function(){
		return this.checked;
	},
	
	getDisabled: function(){
		return this.content.disabled ;
	},
	
	setDisabled: function(value){ 
	
		this.button.disabled = value !== false ? 'disbaled' : '';
		this.setState('disabled', value);
	},
	
	setWidth: function(value){
		this.button.setWidth(value);
		this.onResizeX();
		return this;
	},
	
	doAutoSize: function(){
		var me = this;
		if(me.isAutoSize(me.button))
			me.button.runtimeStyle.width = me.content.offsetWidth + (me.icon ? 31 : 8);
		else
			me.button.runtimeStyle.width = '';
	}
	
}));