//===========================================
//  AdvanceLayout.js
//  Copyright(c) 2009-2011 xuld
//============================================

using("System.Controls.Layout.LayoutEngine");


/**
 * 实现动态大小的布局。
 * @class AdvanceLayout
 */
Py.Layout.AdvanceLayout = Py.Layout.LayoutEngine.extend({
	
	name: 'absolute',
		
//	/**
//	 * 布局延时。
//	 * @type Number
//	 * @property layoutDelay
//	 */
//	layoutDelay: 100,
	
	/**
	 * 改变大小执行。
	 * @param {Control} container 容器的控件。
	 * @param {String} type height 或 width 。
	 * @param {mixed} value 目标。
	 */
	onResizeX: function(){
		if(!this.layouting)
			this.layout.layoutX(this);
	},
	
	/**
	 * 改变大小执行。
	 * @param {Control} container 容器的控件。
	 * @param {String} type height 或 width 。
	 * @param {mixed} value 目标。
	 */
	onResizeY: function(){
		if(!this.layouting)
			this.layout.layoutY(this);
	},
	
	layoutX: Function.empty,
	
	layoutY: Function.empty,
	
	/**
	 * 初始化布局。
	 * @method initLayout
	 * @param {Control} container 容器的控件。
	 */
	initLayoutCore: function(container){
		var content = container.content;
		Element.setMovable(content);
		content.setSize(content.getSize());
		if(this.layoutX !== Function.empty)
			container.on('resizex', this.onResizeX);
		if(this.layoutY !== Function.empty)
			container.on('resizey', this.onResizeY);
	},
	
	uninitLayoutCore: function(container){
		container.un('resizex', this.onResizeX);
		container.un('resizey', this.onResizeY);
	},
	
	layout: function(container){
		this.layoutY(container);
		this.layoutX(container);
	}
	
	/*
	
	
	
	
	
,
	
	delayout: function(container){
		var container = this,
			me = container.layout,
			typeName = 'layoutDelayed';
		container[typeName] = container[typeName] || setTimeout(function(){
			try {
				me.layout(container);
			} finally {
				delete container[typeName];
			}
		}, me.layoutDelay);
	}
*/
	
	
});



