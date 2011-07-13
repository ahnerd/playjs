//===========================================
//  RelativeLayout.js
//  Copyright(c) 2009-2011 xuld
//============================================

using("System.Controls.Layout.AdvanceLayout");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.RelativeLayout = Py.Layout.AdvanceLayout.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'relative',
		
	name: 'none',
	
	/**
	 * 返回参数。
	 * @type Function
	 */
	_self: function(val){
		return val;
	},
	
	layoutX: function(container){
		this.layoutCore(container, 'x', container.content.getWidth());
	},
	
	layoutY: function(container){
		this.layoutCore(container, 'y', container.content.getHeight());
	},
	
	/**
	 * 改变大小执行。
	 * @param {Control} container 容器的控件。
	 * @param {String} type height 或 width 。
	 * @param {mixed} value 目标。
	 */
	layoutCore: function(container, type, value){
		var fn = type + 'Anchor';
		container.controls.forEach(function(c){
			if(c[fn])
				this._calcAnchor(c, type, c[fn], value);
		}, this);
	},
	
	/**
	 * 计算一个 anchor 实际大小。
	 * @param {String} type 名字。
	 * @param {String} anchor 节点。
	 * @param {mixed} value 目标。
	 * @private
	 */
	_calcAnchor: function(c, type, anchor, value){
		var obj = {};
		obj[type] = anchor(value);
		c.setOuterSize(obj);
	},
	
	/**
	 * 转换节点。
	 * @param {Control} tg 节点。
	 * @param {Control} container 父元素。 
	 * @param {String} type 名字。
	 * @param {String} anchor 节点。
	 * @private
	 */
	_parseAnchor: function(tg, container, type, anchor){
		var value = parseFloat(anchor);
		if(anchor && anchor.indexOf('%') > 0)
			value /= 100;
			
			
		anchor = value == 1 ? this._self :
			value < 0 ? function(val){
				return val + value;
			} : value < 1 ? function(val){
				return val * value;
			} : value;
		if(typeof anchor == 'number'){
			if(!isNaN(anchor))
				tg[type === 'x' ? 'setWidth' : 'setHeight'](value);
		} else{
			tg[type + 'Anchor'] = anchor;
		}
	},
	
	/**
	 * 处理新加的节点。
	 * @method onAdd
	 * @param {Control} item 项。
	 * @param {Control} container 容器的控件。
	 */
	onControlAdded: function(container, item, index){
		this.baseCall('onControlAdded', arguments);
		
		if (container.layoutDirection !== 'horizonal') {
			item.removeClass('x-layout-flow');
		}
		var anchor = item.anchor || container.anchor || '100%';
		
		// 先编译 anchor
		anchor = anchor.toString().split(' ');
		this._parseAnchor(item, container, 'x', anchor[0]);
			
		this._parseAnchor(item, container, 'y', anchor[1]);
	}
	
	
}));



