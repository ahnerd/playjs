





Py.using("System.Controls.ContentControl");
Py.using("System.Controls.IFormControl");


Py.namespace("Py", "CheckBox", Py.ContentControl.extend({
	
	tpl: '<label><input type="checkbox" class="x-checkbox"><span></span></label>',
	
	init: function(){
		this.content = this.find('span').setUnselectable();
	}
	
}).implement(Py.IFormControl));
