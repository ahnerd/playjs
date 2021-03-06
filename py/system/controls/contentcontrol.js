//===========================================
//  包含内容的控件   contentcontrol.js         A
//===========================================


using("System.Controls.Control");

/**
 * 表示一个有内置呈现的控件。
 * @abstract
 * @class ContentControl
 * @extends Control
 * <p>
 * ContentControl 控件把 content 属性作为自己的内容主体。
 * ContentControl 控件的大小将由 content 决定。
 * 当执行 appendChild/setWidth/setHtml 等操作时，都转到对 content 的操作。 
 * 这个类的应用如: dom 是用于显示视觉效果的辅助层， content 是实际内容的控件。
 * 默认 content 和  dom 相同。子类应该重写 init ，并重新赋值  content 。
 * </p>
 * 
 * <p>
 * 这个控件同时允许在子控件上显示一个图标。
 * </p>
 * 
 * <p>
 * ContentControl 的外元素是一个根据内容自动改变大小的元素。它自身没有设置大小，全部的大小依赖子元素而自动决定。
 * 因此，外元素必须满足下列条件的任何一个:
 *  <ul>
 * 		<li>外元素的 position 是 absolute<li>
 * 		<li>外元素的 float 是 left或 right <li>
 * 		<li>外元素的 display 是  inline-block (在 IE6 下，使用 inline + zoom模拟) <li>
 *  </ul>
 * </p>
 */
namespace(".ContentControl", Py.Control.extend({
	
	/**
	 * 当前正文。
	 * @type Element/Control
	 * @proected
	 */
	content: null,
	
	init: function(){
		this.content = this.dom;
	},
	
	/**
	 * 当被子类改写时，实现创建添加和返回一个图标节点。
	 * @protected
	 * @virtual
	 */
	createIcon: function(){
		return  this.content.insert(document.createElement("span"), 'beforeBegin');
	},
	
	/**
	 * 获取当前显示的图标。
	 * @name icon
	 * @type {Element}
	 */
	
	/**
	 * 设置图标。
	 * @param {String} icon 图标。
	 * @return {Panel} this
	 */
	setIcon: function(icon) {
		
		if(!this.icon) {
			
			this.icon = this.createIcon();
		}
		
		this.icon.className = "x-icon x-icon-" + icon;
		
		return this;
	}
	
}));


Py.Control.delegate(Py.ContentControl, 'content', 'setWidth setHeight setText setHtml', 2, 'appendChild insertBefore removeChild replaceChild contains append empty', 3, 'getHtml getText getWidth getHeight', 1);

/// #ifdef SupportIE6


// IE 6/7 无法处理外容器自动适应内容器的大小。
// 所以为 IE 6/7 手动设置 width 。


/* 最新消息: IE6 即将退出历史舞台。退出的还有这一堆的代码,一 */

if(navigator.isQuirks){
	
	/**
	 * @internal
	 * @param {Class} control 控件类。
	 * @param {String} containerName 用于包装 content 的属性，这个属性将会自动调整大小为子元素的大小。
	 * @param {Function} getWidthForResize 需要自动调整大小时，调用此函数计算新的大小，并设置containerName 指定的 元素大小为该大小。
	 */
	Py.ContentControl.registerSizeTriggerForIE = function (control,  containerName, getWidthForResizing) {
		
		var p = control.prototype;
		
		Object.extend(p, {
			
			setWidthWithoutResizing: p.setWidth,
			
			getWidthForResizing: getWidthForResizing,
			
			setWidth: function (value) {
				var me = this;
				me[containerName].runtimeStyle.width = '';
				if(isNaN(value)){
					// 如果 是 NaN， 说明重新设置为自定义的大小。
					me[containerName].runtimeStyle.width = getWidthForResizingAndTestMinMaxWidth(me,  me[containerName]);
				}
				return me.setWidthWithoutResizing(value);
			}
			
		}) ;
		
		// 当执行 setText/setHtml 后 ， 重新更新容器 (containerName) 宽度。
		String.map('setText setHtml', function (method) {
			p[method] = function (value) {
				var me = this, styleWidth;
				me.content[method](value);
				styleWidth = me[containerName].style.width;
				if(!styleWidth ||  styleWidth === 'auto') {
					setTimeout(function(){
						var style = me[containerName].runtimeStyle;
						style.width = '';
						style.width = getWidthForResizingAndTestMinMaxWidth(me, me[containerName]);
					}, 0);
				}
				return me;
			};
		});
		
		function getWidthForResizingAndTestMinMaxWidth(target, elem){
			return Math.max(Math.min(target.getWidthForResizing(), Element.styleNumber(elem, 'maxWidth') || Infinity), Element.styleNumber(elem, 'minWidth'));
		}
	};
	
	Py.ContentControl.registerSizeTriggerForIE(Py.ContentControl, 'dom', function () {
		return this.content.offsetWidth;
	});
}




/// #endif

