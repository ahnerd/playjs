





Py.using("System.Controls.ContentControl");
Py.using("System.Controls.IFormControl");


Py.namespace(".RadioButton", Py.ContentControl.extend({
	
	tpl: '<label><input type="radio" class="x-radiobutton"><span></span></label>',
	
	init: function(){
		this.content = this.find('span').setUnselectable();
	}
	
}).implement(Py.IFormControl));
