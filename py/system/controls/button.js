//===========================================
//  按钮   button.js         A
//===========================================





using("System.Controls.ContentControl");
imports("Resources.*.Button.Button");




namespace(".Button", Py.ContentControl.extend({
	
	options: {
		type: 'button'
	},
	
	tpl: '<a class="x-button">\
				<span class="x-button-container">\
					<span class="x-button-content">\
						<button type="{type}"><span class="x-button-label"></span></button>\
					</span>\
				</span>\
			</a>',
	
	create: function(options){
		var type = options.type;
		delete options.type;
		return Element.parse(this.tpl.replace('{type}', type));
	},
	
	addEventListener: function(obj, type, fn){
		this.button.addEventListener(obj, type, fn);
	},
	
	removeEventListener: function(obj, type, fn){
		this.button.removeEventListener(obj, type, fn);
	},
	
	init: function(options){
		this.button = this.find('button');
		this.content = this.find('.x-button-label');
	},
	
	setWidth: function(value){
		this.button.setWidth(value);
		return this;
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
		return this.button.disabled ;
	},
	
	setDisabled: function(value){ 
		this.toggleClass('x-disabled', this.button.disabled = value !== false);
	}
	
}));
	


/// #ifdef SupportIE6

if(navigator.isQuirks){
	
	// IE 下 <button> 出现多边距。
	Py.ContentControl.registerSizeTriggerForIE(Py.Button, 'button', function () {
		return this.content.offsetWidth  + (this.icon ? 31 : 12);
	});
	
	
	
}

/// #endif
