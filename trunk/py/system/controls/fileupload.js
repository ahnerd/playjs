//===========================================
//  文件上传           fileupload.js          A
//===========================================





using("System.Controls.CombinedTextBox");
imports("Resources.*.Form.FileUpload");


namespace(".FileUpload", Py.CombinedTextBox.extend({
	
	tpl: '<label class="x-fileupload"><input type="text" class="x-textbox"><span class="x-menubutton-fileupload"><input type="file" size="1"> <a class="x-button"><span class="x-button-container"><button class="x-button-content" type="button"><span class="x-button-label"> 浏览... </span></button></span></a>\</span></label>',
			
	init: function(){
		var textBox = this.textBox = new Py.TextBox(this.find('.x-textbox'));
		this.find('.x-menubutton-fileupload [type=file]').on('change', function(){
			textBox.value = this.value;
		});
	}
	
	
}));