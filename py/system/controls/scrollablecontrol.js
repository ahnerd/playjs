//===========================================
//   包含内容的可滚动控件     scrollablecontrol.js      A
//===========================================


using("System.Controls.ContentControl");

/**
 * 内容显示面板。
 * @class ContainerControl
 * @abstract
 */
namespace(".ScrollableControl", Py.ContentControl.extend({
	
	/**
	 * 外容器左右边框+边距。
	 * @param {Object} value
	 */
	widthFix: 0,
	
	/**
	 * 外容器上下边框+边距。
	 * @param {Object} value
	 */
	heightFix: 2,
	
	/**
	 * 当前正文。
	 * @param {Object} value
	 */
	header: null,
	
	/**
	 * 设置容器标题。
	 * @param {String} value 值。
	 */
	setTitle: function(value){
		this.header.innerHTML = value;
		return this;
	},
	
	/**
	 * 返回容器标题。
	 * @return {String} 值。
	 */
	getTitle: function(){
		assert(this.header, 'ScrollableControl.prototype.getTitle(): 目前控件不存在顶部');
		return this.header.innerHTML;
	},
	
	/**
	 * 在 Panel 添加一个功能按钮。
	 * @param {String} name 名字[样式]。
	 * @param {Function} onclick 处理函数。
	 * @param {String} title 鼠标悬浮的标题。
	 * @return {Element} 节点。
	 * @protected
	 */
	addHeaderItem: function(name, onclick, title) {
		assert(this.header, 'ScrollableControl.prototype.addHeaderItem(name, onclick, title): 目前控件不存在顶部');
		title = title || "";
		
		var node = this.header.insert('<a class="x-icon ' + (name || '') + '" href="javascript://' + title + '" title="' + title + '">&nbsp;</a>', "beforeBegin");
		node.onclick = Function.bind(onclick, this);
		return  node;
	},
	
	/**
	 * 设置显示内容的 HTML 字符串。
	 * @method setHtml
	 * @param {String} value 内容。
	 * @return {Panel} this。
	 */
	setHtml: function(value) {
		this.content.innerHTML = '<div class="x-content x-' + this.xType + '-content">' + value + '</div>';
		this.onAutoResize();
		return this;
	},
	
	/**
	 * 获取显示内容的 HTML 字符串。
	 * @method getHtml
	 * @return {String} 内容。
	 */
	getHtml: function() {
		return this.content.firstChild ? this.content.firstChild.innerHTML : this.content.innerHTML;
	},
	
	createIcon: function(){
		return  this.header.insert(document.createElement("span"), 'beforeBegin');
	},
	
	setContent: function(content){
		
		var cd = content.dom || content;
		
		assert(cd, "ScrollableControl.prototype.setContent(content): 参数 {content} 必须是 Element。")
		
		// 删除 content
		if(this.content != this.dom && this.content){
			this.content.remove();
		}
		
		this.heightFix = Element.getSizes(this.dom, 'y', 'bp') + Element.getSizes(cd, 'y', 'bp');
		this.widthFix = Element.getSizes(this.dom, 'x', 'bp') + Element.getSizes(cd, 'x', 'bp');
		
		this.dom.append(cd);
		
		// 设置 content
		this.content = content;
		
		// 初始化 width 。
		this.dom.setWidth(this.content.getWidth() + this.widthFix);
		
		if (this.header) {
			var h = this.header.get('parent');
		
			if ('name' in content) 
				this.setTitle(content.name);
			else if (!this.header.innerHTML.length) h.hide();
			
			this.heightFix += h.getSize().y;
			
		}
		
		return this;
	},
	
	setHeaderVisible: function(value) {
		var header = this.header.get('parent'),
			currentState = header.isHidden();
			
		value = !!value;
		if(currentState != value){
			currentState = header.getSize().y;
			if (value) {
				header.show();
				this.heightFix += currentState;
			} else {
				this.heightFix -= currentState;
				header.hide();
			}
		}
	},
		
	setWidth: function(value){
		this.dom.setWidth(value);
		if (this.content) {
			this.content.setWidth(value - this.widthFix);
			this.onResizeX();
		}
		return this;
	},
	
	getWidth: function() {
		return this.dom.getWidth();
	},
	
	setHeight: function(value){
		if (this.content) {
			this.content.setHeight(value - this.heightFix);
			this.onResizeY();
		}
		return this;
	},
	
	getHeight: function(){
		return this.content.getHeight() + this.heightFix;
	},
	
	/**
	 * 设置 Panel 可拖动。
	 * @method setDraggable
	 * @param {Boolean} enable 如果 true 允许， false 不允许。
	 * @return {Panel} this
	 */
	setDraggable: function(enable) {
		
		if (Py.DragDrop) {
		
			Py.DragDrop.Manager.set(this, enable === true ? this.header : enable, enable && this.constructor.dragOptions);
			
			this.toggleClass('x-movable', this.draggable = !!enable);
			
		}
		
		return this;
	},
	
	doAutoSize: function(){
		var me = this;
		
		me.dom.runtimeStyle.width = '';
		if (me.isAutoSize(me.dom)) {
			me.dom.runtimeStyle.width = Math.max(80, me.content.firstChild.offsetWidth + 2);
		}
	}
	

}) );

Py.Control.delegate(Py.ScrollableControl, 'header', 'getText', 1, 'setText', 2);
