//===========================================
//  PanelEx.js
//  Copyright(c) 2009-2011 xuld
//===========================================


Py.using("System.Dom.Element");


/**
 * @class Panel
 */
Py.ICollapsable = {
	
	/**
	 * 获取目前是否折叠。
	 * @method isCollapsed
	 * @return {Boolean}
	 */
	isCollapsed: function() {
		return Py.Element.isHidden(this.content);
	},
	
	duration: -1,
	
	onToggleCollapse: function(value){
		
	},
	
	onCollapse: function(){
		this.trigger('collapse');
		this.onToggleCollapse(true);
	},
	
	onExpand: function(){
		this.trigger('expand');
		this.onToggleCollapse(false);
	},
	
	collapse: function(){
		this.content.hide(this.duration, Function.bind(this.onCollapse, this), 'height');
	},
	
	expand: function(){
		this.content.show(this.duration, Function.bind(this.onExpand, this), 'height');
	},
	
	/**
	 * 切换面板的折叠。
	 * @method toggleCollapse
	 * @param {Number} duration 时间。
	 */
	toggleCollapse: function() {
		return this.isCollapsed() ? this.expand() : this.collapse();
	}
	
};
