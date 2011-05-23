





Py.using("System.Controls.Control");
Py.imports("Resources.*.Button.LinkButton");


Py.namespace("Py", "LinkButton", Py.Control.extend({
	
	tpl: '<a class="x-linkbutton" href="#" target="_blank"></a>',
	
	setUrl: function(value){
		this.setAttr('href', value);
	},
	
	getUrl: function(){
		return this.getAttr('href');
	}
	
}));