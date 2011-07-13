





using("System.Controls.ContentControl");
using("System.Controls.IFormControl");


namespace(".RadioButton", Py.ContentControl.extend({
	
	tpl: '<label><input type="radio" class="x-radiobutton"><span></span></label>',
	
	init: function(){
		this.content = this.find('span').setUnselectable();
	}
	
}).implement(Py.IFormControl));
