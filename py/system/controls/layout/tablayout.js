//===========================================
//  AbsoluteLayout.js
//  Copyright(c) 2009-2011 xuld
//============================================

using("System.Controls.Layout.FitLayout");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.TabLayout = Py.Layout.FitLayout.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'tab',
	
	name: 'none',
	
	setItemWidth: function(container, ctrl){
		ctrl.setSize({x: container.content.getWidth()});
	},
	
	setItemHeight: function(container, ctrl){
		ctrl.setSize({y: container.content.getHeight()});
	},
	
	layoutX: function(container){
		if(container.activeControl && container.content.offsetWidth > 0){
			this.setItemWidth(container, container.activeControl.show());
		}
	},
	
	layoutY: function(container){
		if(container.activeControl && container.content.offsetHeight > 0){
			this.setItemHeight(container, container.activeControl.show());
		}
	},
	
	changeActiveControl: function(container, item){
		if(container.activeControl)
			container.activeControl.hide();
		container.activeControl = item;
	},
	
	/**
	 * 处理新加的节点。
	 * @method onAdd
	 * @param {Control} item 项。
	 * @param {Control} container 容器的控件。
	 */
	onControlAdded: function(container, item, index){
		this.base('onControlAdded', arguments);
		if(item.defaultActive)
			this.changeActiveControl(container, item);
		else if(!container.activeControl)
			container.activeControl = item;
		else
			item.hide();
	},
	
	/**
	 * 处理新加的节点。
	 * @method onAdd
	 * @param {Control} item 项。
	 * @param {Control} container 容器的控件。
	 */
	onControlRemoved: function(container, item, index){
		this.base('onControlRemoved', arguments);
		if (container.activeControl === item) {
			container.activeControl = container.controls[index];
		}
	}
	
}));



namespace(".TabPage", Py.Control.extend({
	
}));