//===========================================
//  元素   element.js    A
//===========================================


using("System.Ajax.Ajax");

/**
 * 通过 Ajax 动态更新一个节点
 */
Element.implement({

	/**
	 * 从一个地址，载入到本元素， 并使用 setHtml 设置内容。
	 *
	 */
	load: function(url, data, type, initMsg, failMsg){
		
		return this;
	}

}, 2);