//===========================================
//  列表控件   listcontrol.js         A
//===========================================


Py.using("System.Controls.Control");
Py.using("System.Controls.IContainerControl");



/**
 * 表示所有管理多个子控件的控件基类。
 * @class Py.ListControl
 * Py.ListControl 封装了使用  <ul> 创建列表控件一系列方法。
 * 子类可以重写 onControlAdded、onControlRemoved、initItem  3　个函数，实现对
 */
Py.namespace(".ListControl", Py.Control.extend(Object.extendIf({
	
	create: function(){
		var dom = document.create('div', 'x-' + this.xType);
		dom.appendChild(document.create('ul', 'x-list-container x-' + this.xType + '-container'));
		return dom;
	},
	
	init: function(options){
		
		this.initChildren('items');
		this.content = this.get('first', 'ul');
		
	},
	
	onControlAdded: function(childControl, index){
		var li = document.create('li', 'x-list-content x-' + this.xType + '-content');
		index = this.controls[index];
		li.appendChild(childControl.dom || childControl);
		this.content.insertBefore(li, index ? (index.dom || index).parentNode : null);
	},
	
	onControlRemoved: function(childControl, index){
		this.content.removeChild((childControl.dom || childControl).parentNode);
	}
	
}, Py.IContainerControl)));

