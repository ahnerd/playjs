





Py.using("System.Controls.ContentControl");
Py.using("System.Controls.IFormControl");


Py.namespace(".ToolTip", Py.ContentControl.extend({
	
	tpl: '<div class="x-tooltip">\
			<span class="x-container-contetnt"></span>\
		</div>',
	
	init: function(){
		this.content = this.find('.x-container-contetnt');
	}
	
}));
