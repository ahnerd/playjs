





using("System.Controls.ContentControl");
using("System.Controls.IFormControl");
imports("Resources.*.Viewer.ToolTip");


namespace(".ToolTip", Py.ContentControl.extend({
	
	tpl: '<div class="x-tooltip">\
			<span class="x-container-contetnt"></span>\
		</div>',
	
	init: function(){
		this.content = this.find('.x-container-contetnt');
	}
	
}));
