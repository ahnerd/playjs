//===========================================
//  BoxLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

using("System.Controls.Layout.LayoutEngine");





Py.Layout.register(Py.Layout.MenuLayout = Py.Layout.LayoutEngine.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'menu',
		
	/**
	 * 处理新加的节点。
	 * @method onAdd
	 * @param {Control} item 项。
	 * @param {Control} container 容器的控件。
	 */
	onAdd: function(item, container){
		item.parent = container;
	},
	
	/**
	 * 处理移的节点。
	 * @method onRemove
	 * @param {Control} item 项。
	 * @param {Control} container 容器的控件。
	 */
	onRemove: function(item, container){
		item.parent = null;
	},

	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	initLayout: function(container){
		this.baseCall('initLayout', container);
		container.dom.innerHTML = '<ul class="x-menu-content"></ul>';
		container.content = container.find(".x-menu-content");
	},
	
	/**
	 * 取消和容器的关联。
	 * @method uninitLayout
	 * @param {Control} container 容器的控件。
	 */
	uninitLayout: function(container){
		container.dom.innerHTML = '';
		container.layout = Py.Layout.none;
	}
	
	
}));





