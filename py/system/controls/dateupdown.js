//===========================================
//  表单元素   dateupdown.js         A
//===========================================





using("System.Controls.UpDown");
using("System.Dom.Mark");
using("System.Core.Date");


namespace('.DateUpDown', Py.UpDown.extend({
	
	value: new Date(),
	
	format: 'yyyy/M/d',
	
	init: function(options){
		this.baseCall('init',  options);
		
		Element.markDate(this.textBox.dom, Function.bind(this.onInvalid, this));
		
		this.setText(this.value.toString(this.format));
	},
	
	onInvalid: function (value) {

	},
	
	onUp: function(){
		this.setText(this.value.addDay(1).toString(this.format));
	},
	
	onDown: function(){
		this.setText(this.value.addDay(-1).toString(this.format));
	}
	
}));