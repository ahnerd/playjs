//===========================================
//  PanelEx.js
//  Copyright(c) 2009-2011 xuld
//===========================================



namespace("System.Controls.PanelEx");
using("System.Controls.Panel");


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
		var data = Py.getData(this, 'state');
		if(!data) return;
		this.setSize(data.right - data.left, data.bottom - data.top);
		this.setPosition(data.left, data.top);
	}
	
	
	sendToBack
	
	
	acceptButton
	
	
	cancelButton
});
