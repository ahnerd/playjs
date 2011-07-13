//===========================================
//  选择框   checkbox.js         A
//===========================================





using("System.Controls.ContentControl");
using("System.Controls.IFormControl");


namespace(".CheckBox", Py.ContentControl.extend({
	
	tpl: '<label><input type="checkbox" class="x-checkbox"><span></span></label>',
	
	init: function(){
		this.content = this.find('span').setUnselectable();
	}
	
}).implement(Py.IFormControl));
