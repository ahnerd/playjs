





Py.using("System.Controls.ScrollableControl");


Py.namespace(".GroupBox", Py.ScrollableControl.extend({
	
	tpl: '<fieldset class="x-groupbox">\
			<legend class="x-groupbox-header">\
				<span>面板</span>\
			</legend>\
			<div class="x-groupbox-container">\
			</div>\
		</fieldset>',
	
	init: function(){
		this.header = this.find("legend span");
		this.content = this.find('.x-groupbox-container');
	},
	
	duration: 700,
	
	collapse: function(){
		this.addClass('x-collapsed');
		this.content.hide(this.duration, null, 'height');
	},
	
	expand: function(){
		this.removeClass('x-collapsed');
		this.content.show(this.duration, null, 'height');
	}
	
}));
