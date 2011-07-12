//===========================================
//  文本框   textbox.js       A
//===========================================


Py.using("System.Controls.Control");
Py.using("System.Controls.IFormControl");
Py.imports("Resources.*.Form.TextBox");


Py.namespace(".TextBox", Py.Control.extend({
	
	tpl: '<input type="text" class="x-textbox">',
	
	setRequested: function(v){
		this.setState('request', v);
	}
	
}).implement(Py.IFormControl));




