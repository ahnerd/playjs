//===========================================
//   工具条     toolbar.js      A
//===========================================





imports("Resources.*.Button.ToolBar");
using("System.Controls.ListControl");


namespace(".ToolBar", Py.ListControl.extend({
	
	xType: 'toolbar',
	
	initItem: function (value) {
		 if(value === '-')
		 	return new Py.ToolBar.Seperator();
		 
		 return this.baseCall('initItem', value);
	}



})).Seperator = Py.Control.extend({
	create: function () {
		return document.create('span', 'x-split').setHtml('&nbsp;');
	}
});