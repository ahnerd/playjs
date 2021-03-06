﻿//===========================================
//  布局引擎    layoutEngine.js         A
//===========================================


using("System.Controls.Control");



/**
 * @namespace Py.Layout
 */
namespace(".Layout", {

	/**
	 * 表示布局引擎。
	 * @class LayoutEngine
	 * 任何一个控件都可以作为布局容器。控件的 content 属性被作为布局节点容器。
	 * 如果控件不存在 content 属性， 布局器自动创建这个变量。所有的布局器共分
	 * 为2种，1是依靠css实现的自动化布局，这类布局一般是直接继承 LayoutEngine
	 * 的布局器， 2是依靠js实现的手动的布局，这类布局一般继承于 AdvanceLayout。
	 * 一个布局的使用分为三阶段。
	 * 1. 初始化容器。
	 * 2. 布局。
	 * 3. 撤销布局。
	 * 
	 * 初始化容器一般是同时对所有子控件调用 onControlAdded 实现对子控件的初始化。
	 * 撤销布局则相反。
	 * 
	 * onControlAdded 实现的是添加一个子控件。 而真正的布局在 layout 完成。
	 * 
	 * LayoutEngine 的子类重写 layout 方法 和 onControlAdded 方法实现对容器
	 * 的布局。
	 * 
	 * 布局器的 xType 属性被作为布局的名字。 name 属性被作为布局的css样式。
	 */
	LayoutEngine: Py.Class({
		
		/**
		 * xType
		 * @type String
		 * @property xType
		 */
		xType: 'none',
		
		name: 'none',
	
		/**
		 * 容器添加一个子控件后执行。
		 * @method onControlAdded
		 * @param {Control} container 容器的控件。
		 * @param {Control} item 项。
		 * @param {Number} index 位置。
		 */
		onControlAdded: function(container, item, index)  {
			
			item.addClass('x-layout-' + this.name);
			
			// 获取引用位置。
			var ref = container.controls[index];
			
			container.content.insertBefore(item.dom || item, ref ? ref.dom || ref : null);
		},
		
		/**
		 * 容器删除一个子控件后执行。
		 * @method onControlRemoved
		 * @param {Control} container 容器的控件。
		 * @param {Control} item 项。
		 * @param {Number} index 位置。
		 */
		onControlRemoved: function(container, item, index){
			
			container.content.removeChild(item.dom || item);
			
			item.removeClass('x-layout-' + this.name);
		},
		
		/**
		 * 当被子类重写时，实现布局。
		 * @method layout
		 * @param {Control} container 容器的控件。
		 * @virtual
		 */
		layout: Function.empty,
		
		initLayoutCore: Function.empty,
		
		uninitLayoutCore: Function.empty,
		
		doInitLayout: function(container, layout, eventName){
			container.layout = layout;
			
			var i = 0, item;
			
			while(item = container.controls[i++]){
				this[eventName](container, item);
			}
			
		},
		
		/**
		 * 初始化布局。
		 * @method initLayout
		 * @param {Control} container 容器的控件。
		 */
		initLayout: function(container){
			
			// 初始化用于布局的容器。
			if(!container.content)
				container.content = container.dom || container;
				
			this.initLayoutCore(container);
			this.doInitLayout(container, this, 'onControlAdded');
		},
		
		/**
		 * 取消和容器的关联。
		 * @method uninitLayout
		 * @param {Control} container 容器的控件。
		 */
		uninitLayout: function(container){
			this.doInitLayout(container, Py.Layout.none, 'onControlRemoved');
			this.uninitLayoutCore(container);
		}
	}),
	
	/**
	 * 注册一个布局。
	 * @param {Class} type 注册的布局。
	 */
	register: function(layoutType){
		this[layoutType.prototype.xType] = new layoutType();
	}
	
	
});

// 注册布局。
Py.Layout.register(Py.Layout.LayoutEngine);




