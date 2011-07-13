//===========================================
//  文本框   textbox.js       A
//===========================================


using("System.Controls.Control");
using("System.Controls.IFormControl");
imports("Resources.*.Form.TextBox");


namespace(".TextBox", Py.Control.extend({
	
	tpl: '<input type="text" class="x-textbox">',
	
	setRequested: function(v){
		this.setState('request', v);
	}
	
}).implement(Py.IFormControl));




