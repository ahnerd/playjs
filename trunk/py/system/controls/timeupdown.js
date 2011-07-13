//===========================================
//  表单元素   timeupdown.js         A
//===========================================





using("System.Controls.UpDown");
using("System.Dom.Mark");


namespace('.TimeUpDown', Py.UpDown.extend({
	
	hour: new Date().getHours(),
	
	minus: 0,
	
	init: function(options){
		this.baseCall('init',  options);
		
      Element.mark(this.textBox.dom, /\d{0, 2}:\d{0, 2}/, Function.bind(this.onInvalid, this));
		
		this._update();
		
	},
	
	_update: function () {
		this.setText(this.hour + (this.minus < 10 ? ":0" : ":") + this.minus);
	},
	
	onInvalid: function (value) {

	},
	
	onUp: function(){
		if(++this.hour == 25)
			this.hour = 0;
		this._update();
	},
	
	onDown: function(){
		if(--this.hour < 0)
			this.hour = 24;
		this._update();
	}
	
}));