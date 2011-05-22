//===========================================
//  Splitter.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Dom.Element");
Py.using("System.Controls.Resizing");
Py.imports("Resources.Share.Control.Splitter");



/**
 * 内容显示面板。
 * @class Panel
 * @extends Control
 */
Py.namespace("Py", "Splitter", Py.Control.extend({
	
	/**
	 * xType
	 * @type String
	 */
	xType: 'splitter',
	
	/**
	 * 初始化。
	 */
	constructor: function(direction, target, handle){
				
		this.dom = this.create(direction);
		if(handle)
			this.setHandle(handle);
			
			assert(direction in Py.Splitter._map, "direction 只能为 left top right bottom 之一。");
		Py.ResizeManager.install(target, this.dom, Py.Splitter.resizeOptions, Py.Splitter._map[direction] );
		Object.extendIf(target, {onSplitterAfterResize: Function.empty, onSplitterBeforeResize: Function.empty});
	},
	
	/**
	 * 当被子类重写时，生成当前控件。
     * @method create
	 * @param {Object} options 选项。
	 * @protected
	 */
	create: function(direction){
		return document.createDiv('x-splitter x-splitter-' + direction);
	},
	
	/**
	 * 启用按钮，这个按钮可以快速折叠/打开面板。
	 * @param {Boolean/null} value 是否打开此按钮。
	 */
	setHandle: function(value){
		var handle = this.handle = this.handle || Object.extend(document.createElement('a'), {
				href: 'javascript://打开/关闭面板',
				hidefocus: true,
				className: 'x-splitter-handle'
			});
		
		
		handle[value ? 'show' : 'hide'](0);
		// handle[value ? 'show' : 'hide'](undefined, null, this.isHorizontal ? 'width' : 'height');
	}

}));



/**
 * @namespace Py.Splitter
 */
Object.extend(Py.Splitter, {
	
	/**
	 * 用于找到方向的对象。
	 * @type Object
	 * @private
	 */
	_map: {
		left: 'r',
		bottom: 't',
		right: 'l',
		top: 'b'
	},
	
	/**
	 * 用于重绘的选项。
	 * @type Object
	 * @private
	 */
	resizeOptions: {
		
		/**
		 * 开始改变大小时处理函数。
		 * @param {Object} e 状态。
		 * @return {Element} 代理元素。
		 */
		start: function(e){
			e.target.onSplitterBeforeResize(e);
			return Py.Control.getProxy('x-splitter-proxy').alignTo(e.srcElement);
		},
		
		/**
		 * 正在改变大小时处理函数。
		 * @param {Object} e 状态。
		 */
		resize: function(e){
			var n = e.fromEl - e.delta * e.fix;
			if(n < e.min || n >= e.max)
				e.delta = ((n < e.min ? e.min : e.max ) -  e.fromEl)   * -e.fix;
				
				
			e.setPosition(e.srcElement, e.fromPosition + e.delta);
		},
		
		/**
		 * 结束改变大小时处理函数。
		 * @param {Object} e 状态。
		 */
		stop: function(e){
			e.setSize(e.target, e.clip(e.getSize(e.target)));
			e.target.onSplitterAfterResize(e);
			
			e.srcElement.hide();
		}
		
	}
		
});



if(navigator.isOpera || (navigator.isFirefox && navigator.version <= 2)) {
	document.addCss(".x-splitter-t, .x-splitter-b {cursor: n-resize!important;}   .x-splitter-l, .x-splitter-r {cursor: e-resize!important;} ");
}
