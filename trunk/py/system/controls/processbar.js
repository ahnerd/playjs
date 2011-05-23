





Py.using("System.Controls.Control");
Py.imports("Resources.*.Viewer.ProcessBar");


Py.namespace("Py", "ProcessBar", Py.Control.extend({
	tpl: '<div class="x-processbar">\
		<div class="x-processbar-fore"> \
			<div class="x-processbar-label"></div>\
		</div>\
		<div class="x-processbar-back"></div>\
	</div>',
	
	options: {
		width: 400,
		value: 0
	} ,
	
	init: function(){
		this.content = this.find('.x-processbar-fore');
	},
	
	setText: function(text){
		this.find('.x-processbar-label').setText(text);
		this.find('.x-processbar-back').setText(text);
	},
	
	setWidth: function(value){
		this.dom.setWidth(value);
		this.find('.x-processbar-label').setWidth(value);
		this.find('.x-processbar-back').setWidth(value);
	},
	
	setValue: function(value){
		this.content.style.width = value + '%';
	},
	
	getValue: function(){
		return parseInt(this.content.style.width);
	}
	
}));