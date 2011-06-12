Py.using("System.Dom.Element");
Py.using("System.Controls.IFormControl");


Py.namespace(".TextBox", Py.Control.extend({
	
	tpl: '<input type="text" class="x-textbox">',
	
	setRequested: function(v){
		this.setState('request', v);
	},
	
	clear: function(){
		this.setText('');
	}
	
}).implement(Py.IFormControl));




