//===========================================
//  PanelEx.js
//  Copyright(c) 2009-2011 xuld
//===========================================


Py.using("System.Controls.Panel");


/**
 * @class Panel
 */
Py.Panel.implement({
	
	/**
	 * 切换显示 折叠/关闭 按钮。
	 * @method _toggleCollapseItem
	 * @private
	 */
	_toggleCollapseItem: function() {
		this.collapseItem.className =  'x-icon ' + (!this.isCollapsed() ? 'x-icon-collapsable' : 'x-icon-expandable');
	},
	
	/**
	 * 获取目前是否折叠。
	 * @method isCollapsed
	 * @return {Boolean}
	 */
	isCollapsed: function() {
		return Py.Element.isHidden(this.content);
	},
	
	/**
	 * 设置用来折叠的项。
	 * @method setCollapseItem
	 */
	setCollapseItem: function() {
		if(!this.collapseItem){
			this.collapseItem = this.addHeaderItem('', this.toggleCollapse);
			this.on('toggleCollapse', this._toggleCollapseItem);
			this._toggleCollapseItem();
		}
	},
	
	duration: -1,
	
	collapse: function(){
		if(!this.isCollapsed())  
			this.toggleCollapse();
	},
	
	expand: function(){
		if(this.isCollapsed())
			this.toggleCollapse();
	},
	
	/**
	 * 切换面板的折叠。
	 * @method toggleCollapse
	 * @param {Number} duration 时间。
	 */
	toggleCollapse: function() {
		var me = this;
		me.content.toggle(this.duration, function(){
			me.trigger('toggleCollapse');
		}, 'height');
		return me;
	}
	
});
