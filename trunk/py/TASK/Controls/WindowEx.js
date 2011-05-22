//===========================================
//  PanelEx.js
//  Copyright(c) 2009-2011 xuld
//===========================================



Py.namespace("System.Controls.PanelEx");
Py.using("System.Controls.Panel");


/**
 * @class Panel
 */
Py.Window.implement({
	
	minimize: function(){
		
	},
	
	maxsize: function(){
		
	},
	
	
	
	_saveState: function(){
		Py.setData(this, 'state', this.getBound());
	},
	
	restore: function(){
		var data = Py.dataIf(this, 'state');
		if(!data) return;
		this.setSize(data.right - data.left, data.bottom - data.top);
		this.setPosition(data.left, data.top);
	}
	
	
	sendToBack
	
	
	acceptButton
	
	
	cancelButton
});
