


Py.using("System.Controls.TextBox");
Py.imports("Resources.*.Form.Menubuttons");


Py.namespace(".CombinedTextBox", Py.TextBox.extend({
	
	tpl: '<div><input type="text" class="x-textbox"><input type="button" value="工具按钮" class="x-menu-button"></div>',
	
	setDisabled: function(value){ 
	
		this.dom.disabled = value !== false ? 'disbaled' : '';
		this.find('.x-menu-button').disabled = value !== false ? 'disbaled' : '';
		this.setState('disabled', value);
	},
	
	init: function(){
		this.addClass('x-' + this.xType);
		this.textBox = this.find('.x-textbox');
	},
	
	bindMenuButton: function(type, fn){
		this.find('.x-menu-button').on(type, Function.bind(fn), this);
	},
	
	setMenuButton: function(type){
		this.find('.x-menu-button').className = 'x-menu-button x-menu-button-' + type;
	}
}));




Py.Control.delegate(Py.CombinedTextBox, 'textBox', 'setRequested setText setState setReadOnly setName', 2, 'getDisabled getReadOnly getName getText', 1);
