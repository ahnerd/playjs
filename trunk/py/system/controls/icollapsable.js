//===========================================
//  可折叠的控件                        A
//===========================================


using("System.Dom.Element");


/**
 * 表示一个可折叠的控件。
 * @interface ICollapsable
 */
namespace(".ICollapsable", {
	
	/**
	 * 获取目前是否折叠。
	 * @virtual
	 * @return {Boolean} 获取一个值，该值指示当前面板是否折叠。
	 */
	isCollapsed: function() {
		return this.content.isHidden();
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
	
});
