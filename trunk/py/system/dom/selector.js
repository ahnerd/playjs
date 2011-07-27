//===========================================
//  选择器            A
//===========================================

using("System.Dom.Query");
using("System.Dom.Element");


(function(){
		
	/**
	 * Css 选择器。
	 * @param {String} selector Css3查询选择器。
	 * @param {Boolean} quick 是否快速查找。
	 * @return {Py.ElementList} 元素集合。
	 * @memberOf Element
	 * @alias window.$$
	 */
	function query(selector, quick){
		return new Py.ElementList(document.queryDom(selector, this, false, quick));
	}
	
	/**
	 * @namespace Element
	 */
	Element.implement({
		query: query
	}, 4)
	
	.implementIf({
		
		/**
	 	 * Css 选择器。
	 	 * @param {String} selector Css3查询选择器。
	 	 * @return {Array} 数组。
	 	 */
		querySelectorAll: function(selector){
			return document.queryDom(selector, this);
		}
		
	}, 4)
		
	.implementIf({
		
		/**
		 * Css 选择器。
		 * @param {String} selector 选择器。
		 * CSS3  查询的选择器。
		 * @return {Element} 元素。
		 */
		querySelector: function(selector){
			var result = document.queryDom(selector, this)  ;
			return result.length ? result[0] : null;
		}
	}, 3);
	
	this.$$ = function $$(selector, quick){
		return new Py.ElementList(document.queryDom(selector, document, false, quick));
	};
	
})();