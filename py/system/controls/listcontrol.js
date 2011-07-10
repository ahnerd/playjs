//===========================================
//  列表控件   listcontrol.js         A
//===========================================


Py.using("System.Controls.Control");
Py.using("System.Controls.IContainerControl");
Py.using("System.Controls.IProxyContainer");



/**
 * 表示所有管理多个子控件的控件基类。
 * @class Py.ListControl
 * Py.ListControl 封装了使用  <ul> 创建列表控件一系列方法。
 * 子类可以重写 onControlAdded、onControlRemoved、initItem  3　个函数，实现对
 */
Py.ListControl = Py.Control.extend({
	
	create: function(){
		var dom = document.create('div', 'x-' + this.xType);
		dom.appendChild(document.create('ul', 'x-list-container x-' + this.xType + '-container'));
		return dom;
	},
	
	onControlAdded: Function.empty,
	
	onControlRemoved: Function.empty,
	
	init: function(options){
		
		this.initChildren('items');
	},
	
	initChildren: function(alternativeName){
		
		this.controls = this[ alternativeName ] = new Py.ListControl.ListItemCollection(this);
		
		this.content = this.get('first', 'ul');
		
	},
	
	wrapChild: function (childControl) {
		var li = document.create('li', 'x-list-content x-' + this.xType + '-content');
		li.appendChild(childControl.dom || childControl);
		return li;
	},
	
	unwrapChild: function (childControl) {
		return (childControl.dom || childControl).parentNode;
	},
	
	/**
	 * @protected
	 * @virtual
	 * @return {Element} 返回真实添加的子节点。
	 */
	initItem: function (childControl) {
		if(typeof childControl == 'string')
			return Py.Element.parse(childControl);
		return childControl;
	}
	
	
}).implementIf(Py.IContainerControl).implement(Py.IProxyContainer);




Py.ListControl.ListItemCollection = Py.Control.ControlCollection.extend({
	
	initItem: function (childControl) {
		
		childControl = this.owner.initItem(childControl);
		
		assert.notNull(childControl, 'Py.ListControl.ListItemCollection.initItem(childControl): 参数 {childControl} ~。');
		
		// 如原来控件已经有父节点，先删除。
		if(childControl.parent){
			childControl.parent.controls.remove(childControl);
		}
		
		return childControl;
	},

	onAdd: function(childControl){
		var me = this.owner;
		me.appendChild(childControl);
		childControl.parent = me;
		me.onControlAdded(childControl, this.length);
	},
	
	onInsert: function(childControl, index){
		var me = this.owner,
			dom = this[index];  
		me.insertBefore(childControl, dom);
		childControl.parent = me;
		me.onControlAdded(childControl, index);
	},
	
	onRemove: function(childControl, index){
		var me = this.owner;
		me.onControlRemoved(childControl);
		me.removeChild(childControl);
		childControl.parent = null;
	}
	
});
