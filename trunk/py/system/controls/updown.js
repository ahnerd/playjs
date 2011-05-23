





Py.using("System.Controls.CombinedTextBox");
Py.imports("Resources.*.Form.UpDown");


Py.UpDown = Py.CombinedTextBox.extend({
	
	tpl: '<div><input type="text" class="x-textbox"><span class="x-menu-button x-menu-button-updown"><a href="#" class="x-menu-button-updown-up" draggable="false"></a><a href="#" class="x-menu-button-updown-down" draggable="false"></a></span></div>',
	
	init: function(options){
		this.baseCall('init', options);
		this._bindEvent('up', 'onUp');
		this._bindEvent('down', 'onDown');
	},
	
	speed: 90,
	
	duration: 600,
	
	_bindEvent: function(d, fn){
		var me = this;
		d = this.find('.x-menu-button-updown-' + d);
		
		d.onmousedown = function(){
			me[fn]();
			if(me.timer)
				clearInterval(me.timer);
			me.timer = setTimeout(function(){
				me.timer = setInterval(function(){me[fn]();}, me.speed);
			}, me.duration);
		};
		
		d.onmouseout = d.onmouseup = function(){
			clearTimeout(me.timer);
			clearInterval(me.timer);
			me.timer = 0;
		};
	},
	
	onUp: Function.empty,
	
	onDown: Function.empty
	
});