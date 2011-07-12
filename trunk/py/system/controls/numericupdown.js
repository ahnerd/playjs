//===========================================
//  表单元素   numericupdown.js         A
//===========================================





Py.using("System.Controls.UpDown");
Py.using("System.Dom.Mark");


Py.namespace('.NumericUpDown', Py.UpDown.extend({
	
	value: 0,
	
	init: function(options){
		this.baseCall('init',  options);
		
		Py.Element.markNumber(this.textBox.dom, Function.bind(this.onInvalid, this));
		
		this.setText(this.value);
		
	},
	
	onInvalid: function (value) {

	},
	
	onUp: function(){
		this.setText(++this.value);
	},
	
	onDown: function(){
		this.setText(--this.value);
	}
	
}));