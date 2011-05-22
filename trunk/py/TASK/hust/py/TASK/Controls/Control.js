//===========================================
//  控件   Control.js
//  Copyright(c) 2009-2010 xuld
//===========================================

Py.namespace("System.Controls.Control");
Py.using("System.Dom.Element");


(function(){
	
	var ap = Array.prototype,

	cc = Py.namespace("Py.Controls", "ControlCollection", new Py.Class({
		
		length: 0,
		
		constructor: function(){
			
		},
		
		add: function(item){
			if(this.onadd(item) !== false)
				this[this.length++] = item;
		},
		
		onadd: Function.empty,
		
		remove: function(item){
			if(this.onremove(item) !== false)
				ap.remove.call(this, item);
		},
		
		onremove: Function.empty,
		
		set: function(items){
			items.forEach(this.add, this);
			return this;
		}
		
	}));

	String.map('indexOf forEach each contains', ap, cc.prototype);

});