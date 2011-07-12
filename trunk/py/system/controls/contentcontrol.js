//===========================================
//  包含内容的控件   contentcontrol.js         A
//===========================================


Py.using("System.Controls.Control");

/**
 * 表示一个有内置呈现的控件。
 * 这个控件和子类实现大小自适应。修复 IE6/7 父元素不能自己适合子元素大小错误。
 */
Py.namespace(".ContentControl", Py.Control.extend({
	
	/**
	 * 当前正文。
	 * @param {Object} value
	 */
	content: null,
	
	init: function(){
		this.content = this.dom;
	},
	
	createIcon: function(){
		return  this.content.insert(document.createElement("span"), 'beforeBegin');
	},
	
	/**
	 * 设置图标。
	 * @method setIcon
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
		this.onResizeX();
		return this;
	},
	
	setHeight: function(value){
		this.content.setHeight(value);
		this.onResizeY();
		return this;
	},
		
	setText: function(value){
		this.content.setText(value);
		this.onAutoResize();
		return this;
	},
	
	setHtml: function(value){
		this.content.setHtml(value);
		this.onAutoResize();
		return this;
	},
	
	onAutoResize: Function.empty
	
	
	
	
	
}));




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


/// #endif

Py.Control.delegate(Py.ContentControl, 'content', 'appendChild insertBefore removeChild replaceChild contains append empty', 3, 'getHtml getText getWidth getHeight', 1);