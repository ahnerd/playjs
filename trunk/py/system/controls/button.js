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
	Py.Button.implement({
		
		setText: function (value) {
			this.content.setText(value);
			this.onAutoSizeForIE();
			return this;
		},
		
		setHtml: function (value) {
			this.content.setHtml(value);
			this.onAutoSizeForIE();
			return this;
		},
		
		setWidth: function (value) {
			this.button.runtimeStyle.width = '';
			this.button.setWidth(value);
			return this;
		},
	
		doAutoSizeForIE: function(){
			var me = this, styleWidth = me.button.style.width;
			if(!styleWidth ||  styleWidth === 'auto')
				me.button.runtimeStyle.width = me.content.offsetWidth + (me.icon ? 31 : 8);
		},
		
		onAutoSizeForIE: function(){
			setTimeout(Function.bind(this.doAutoSizeForIE, this), 0);
		}
		
	});
	
	
	
}

/// #endif
