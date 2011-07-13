//===========================================
//  BoxLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

using("System.Controls.Layout.AdvanceLayout");





Py.Layout.register(Py.Layout.LineLayout = Py.Layout.AdvanceLayout.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'line',
	
	/**
	 * 当被子类重写时，实现布局。
	 * @method layoutCore
	 * @param {Control} container 容器的控件。
	 * @protected
	 */
	layout: function(container){
		
		var data = {
			x: Element.styleNumber(container.content, 'paddingLeft'),
			y: Element.styleNumber(container.content, 'paddingTop'),
			direction: container.layoutDirection == 'vertical' ? 'y' : 'x'
		};
		
		container.controls.forEach(function(item, index){
			this.onControlAdded(container, item, index);
			
			item.setOffset(data);
			this.fixOffset(item, data);
		}, this);
		
	},
	
	/**
	 * 修正当前大小。
	 * @param {Control} item 节点。
	 * @param {Object} p 数据。
	 * @protected
	 */
	fixOffset: function(item, p) {
		p[p.direction] += item.getOuterSize()[p.direction];
	}
	
}));





