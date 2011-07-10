//===========================================
//  表示子元素会被转换，对外则影藏这个实现。   iproxycontainer.js         A
//===========================================




Py.IProxyContainer = {
	
	// wrapChild: function (childControl) {
// 
	// },
// 	
	// unwrapChild: function (childControl) {
// 
	// },
	
	//       content: null,

	/**
	 * 重写 appendChild ，实现将元素包装到 <li> 内。
	 * @protected
	 * @virtual
	 */
	appendChild: function(childControl){
		this.content.appendChild(this.wrapChild(childControl));
	},
	
	removeChild: function (childControl) {
		this.content.removeChild(this.unwrapChild(childControl));
	},
	
	insertBefore: function (newControl, childControl) {
		this.content.insertBefore(this.wrapChild(newControl), childControl ? this.unwrapChild(childControl) : null);
	},
	
	replaceChild: function (newControl, childControl) {
		this.content.insertBefore(this.wrapChild(newControl), this.unwrapChild(childControl));
	}
};