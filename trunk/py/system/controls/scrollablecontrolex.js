//===========================================
//   支持折叠     scrollablecontrolex.js      A
//===========================================


using("System.Controls.ScrollableControl");

/**
 * @class ScrollableControl
 */
Py.ScrollableControl.implement({
	
	/**
	 * 切换显示 折叠/关闭 按钮。
	 * @method _toggleCollapseItem
	 * @private
	 */
	oncollapsechanged: function() {
		this.collapseItem.className =  'x-icon x-icon-' + (this.isCollapsed() ? 'expandable' : 'collapsable');
	},
	
	/**
	 * 获取目前是否折叠。
	 * @method isCollapsed
	 * @return {Boolean}
	 */
	isCollapsed: function() {
		return this.content.isHidden();
	},
	
	/**
	 * 设置用来折叠的项。
	 * @method setCollapseItem
	 */
	setCollapsable: function(value) {
		if(value === false){
			if (this.collapseItem) {
				this.collapseItem.remove();
				this.collapseItem = null;
			}
		} else if(!this.collapseItem){
			this.collapseItem = this.addHeaderItem('', this.toggleCollapse);
			this.oncollapsechanged();
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
			me.trigger('collapsechanged');
		}, 'height');
		return me;
	}
	
});
