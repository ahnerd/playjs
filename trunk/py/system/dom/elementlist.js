//===========================================
//  元素集合   elementlist.js  A
//===========================================


ElementList.implement({
	
		/**
		 * 从当前集合选择满足条件的节点，并作为新集合返回。
		 * @method filter
		 * @param {Object} fn 函数。参数 value, index, this。
		 * @param {Object} bind (默认 this)绑定的对象。
		 * @return {ElementList} 新列表。
		 */
		filter: function(fn, bind) {
			return new ElementList(ap.filter.call(this.doms, fn, bind));
		}
		


});