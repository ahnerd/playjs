

/**
 * 使类具有扩展自身的方法。
 * @class Py.IOptions
 */
Py.namespace('Py', 'IOptions', {
	
	/**
	 * 对当前类扩展属性。
	 * @param {Object} options 配置。
	 */
	extend: function(options){
		return Py.Class.extend(this, options);
	}
	
});
