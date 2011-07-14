


imports("Resources.*.Viewer.ToolTip");
using("System.Controls.ContentControl");
using("System.Controls.IToolTip");


namespace(".ToolTip", Py.ContentControl.extend({
	
	tpl: '<div class="x-tooltip">\
			<div class="x-tooltip-container">\
				<div class="x-tooltip-contetnt">\
					\
				</div>\
			</div>\
		</div>',
	
	init: function(){
		this.content = this.find('.x-tooltip-contetnt');
		this.hide().renderTo();
	}
	
}).implement(Py.IToolTip));
