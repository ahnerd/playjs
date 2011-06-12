





Py.using("System.Controls.UpDown");


Py.namespace('.NumericUpDown', Py.UpDown.extend({
	
	value: 0,
	
	init: function(options){
		this.baseCall('init',  options);
		
		
		
	},
	
	onUp: function(){
		this.dom.value = ++this.value;
	},
	
	onDown: function(){
		this.dom.value = --this.value;
	}
	
}));