//===========================================
//  表单元素   dateupdown.js         A
//===========================================





Py.using("System.Controls.UpDown");
Py.using("System.Dom.Mark");
Py.using("System.Core.Date");


Py.namespace('.DateUpDown', Py.UpDown.extend({
	
	value: new Date(),
	
	format: 'yyyy/M/d',
	
	init: function(options){
		this.baseCall('init',  options);
		
		Py.Element.markDate(this.textBox.dom, Function.bind(this.onInvalid, this));
		
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