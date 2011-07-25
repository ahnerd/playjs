//===========================================
//  表单元素   numericupdown.js         A
//===========================================





using("System.Controls.UpDown");
using("System.Dom.Mark");


namespace('.NumericUpDown', Py.UpDown.extend({
	
	value: 0,
	
	init: function(options){
		this.base('init',  options);
		
		Element.markNumber(this.textBox.dom, Function.bind(this.onInvalid, this));
		
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