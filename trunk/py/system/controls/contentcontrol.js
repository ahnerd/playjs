//===========================================
//  包含内容的控件   contentcontrol.js         A
//===========================================


using("System.Controls.Control");

/**
 * 表示一个有内置呈现的控件。
 * @abstract
 * @class ContentControl
 * @extends Control
 * ContentControl 拥有一个属性 content， 表示容器内存储内容的节点。默认 content 和  dom 相同。
 * 这个控件和子类实现大小自适应。修复 IE6/7 父元素不能自己调整以适应子元素大小的错误。
 * 这个控件同时允许在子控件上显示一个图标。
 * 
 * <p>
 * ContentControl 的外元素是一个 inline-block 的元素。它自身没有设置大小，全部的大小依赖子元素而自动决定。
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
	},
	
	setWidth: function(value){
		this.content.setWidth(value);
		return this;
	},
	
	setHeight: function(value){
		this.content.setHeight(value);
		return this;
	},
		
	setText: function(value){
		this.content.setText(value);
		return this;
	},
	
	setHtml: function(value){
		this.content.setHtml(value);
		return this;
	}
	
	//,
	
	/**
	 * 如果浏览器不支持自动更新大小，强制更新大小。
	 * @protected
	 */
	// onAutoResize: Function.empty
	
	
	
	
	
}));


/*

/// #ifdef SupportIE7

if(navigator.isQuirks){
	
	// IE 下 不会自动根据子元素的大小调整父元素。
	Py.ContentControl.implement({
		
		onResizeX: function(){
			this.trigger('resizex');
			this.onAutoResize();
		},
		
		isAutoSize: function(elem){
			var styleWidth = elem.style.width;  
			return !styleWidth ||  styleWidth === 'auto';
		},
		
		doAutoSize: Function.empty,
		
		onAutoResize: function(){
			setTimeout(Function.bind(this.doAutoSize, this), 0);
		}
		
	});
}


*/


/// #endif

Py.Control.delegate(Py.ContentControl, 'content', 'appendChild insertBefore removeChild replaceChild contains append empty', 3, 'getHtml getText getWidth getHeight', 1);