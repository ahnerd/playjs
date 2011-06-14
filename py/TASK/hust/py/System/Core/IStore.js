


/**
 * 使类具有存储的方法。
 * @class Py.IStore
 */
Py.namespace('.IStore', {
	
	/**
	 * 获取属于一个元素的数据。
	 * @method data
	 * @param {String} type 类型。
	 * @return {Object} 值。
	 */
	getData: function(type){
		return Py.data(this, type);
	},
	
	/**
	 * 如果存在，获取属于一个元素的数据。
	 * @method dataIf
	 * @param {String} type 类型。
	 * @return {Object} 值。
	 */
	getDataIf: function(type){
		return Py.dataIf(this, type);
	},
	
	/**
	 * 设置属于一个元素的数据。
	 * @method setData
	 * @param {Object} obj 元素。
	 * @param {Number/String} type 类型。
	 * @param {mixed} data 内容。
	 */
	setData: function(type, data){
		return Py.setData(this, type, data);
	},
	
	/**
	 * 删除属于一个元素的数据。
	 * @param {String} [type] 类型。
	 */
	clearData: function(type) {
		if(this.data) {
			if(type)
				delete this.data[type];
			else
				delete this.data;
		}
	}
	
});