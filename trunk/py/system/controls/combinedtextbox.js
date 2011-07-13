//===========================================
//  组合文本框      combinedtextbox.js       A
//===========================================


using("System.Controls.TextBox");
imports("Resources.*.Form.Menubuttons");


namespace(".CombinedTextBox", Py.TextBox.extend({
	
	tpl: '<label><input type="text" class="x-textbox"><input type="button" value="工具按钮" class="x-menu-button"></label>',
	
	setDisabled: function(value){
		this.setState('disabled', this.menuButton.disabled = this.textBox.dom.disabled = value !== false);
	},
	
	init: function(){
		this.addClass('x-' + this.xType);
		this.textBox = new Py.TextBox(this.find('.x-textbox'));
		this.menuButton = this.find('.x-menu-button');
	},
	
	bindMenuButton: function(type, fn){
		this.menuButton.on(type, Function.bind(fn, this));
	},
	
	setMenuButton: function(type){
		this.menuButton.className = 'x-menu-button x-menu-button-' + type;
	}
}));



Py.Control.delegate(Py.CombinedTextBox, 'textBox', 'setRequested setText setState setReadOnly setName focus blur select', 2, 'getDisabled getReadOnly getName getText getForm', 1);
