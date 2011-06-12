





Py.using("System.Controls.CombinedTextBox");
Py.imports("Resources.*.Form.FileUpload");


Py.namespace(".FileUpload", Py.CombinedTextBox.extend({
	
	tpl: '<div class="x-fileupload"><input type="text" class="x-textbox"><span class="x-menubutton-fileupload"><input type="file" size="1"> <a class="x-button"><span class="x-button-container"><button class="x-button-content x-menu-button" type="button"><span class="x-button-label"> 浏览... </span></button></span></a>\</span></div>',
			
	init: function(){
		var textBox = this.textBox = this.find('.x-textbox');
		this.find('.x-menubutton-fileupload [type=file]').on('change', function(){
			textBox.value = this.value;
		});
	}
	
	
}));