//===========================================
//  排序   Sorter.js
//  Copyright(c) 2009-2011 xuld
//===========================================




/**
 * 提供排序算法。
 */
Py.namespace(".Sorter", {
	
	/**
	 * 默认比较的函数。
	 * @param {Object} a 比较的参数。
	 * @param {Object} b 比较的参数。
	 * @return {Boolean} 布尔。表示 a 是否比 b 大。
	 * @private
	 */
    _defaultSorter: function(a,b){return a<b;},
	
	/**
	 * 交换 2 个索引的内容。
	 * @param {Object} iterater 集合。
	 * @param {Number} a 位置1。
	 * @param {Number} b 位置2。
	 * @private
	 */
    _swap: function(iterater,a,b){
        var c = iterater[a];
        iterater[a] = iterater[b];
        iterater[b] = c;
    },
	
	/**
	 * 配置参数。
	 * @param {Object} iterater 集合。
	 * @param {Number} start 开始排序的位置。
	 * @param {Number} end 结束排序的位置。
	 * @param {Function} fn 比较函数。
	 */
	_setup: function(iterater, start,end,fn){
        assert(iterater.length != null,"用于sort的变量有length属性");
		return [
			start || 0,
			end === undefined ? iterater.length : end,
			fn || this._defaultSorter
		];
	},
	
	/**
	 * 冒泡排序。
	 * @param {Object} iterater 集合。
	 * @param {Number} start 开始排序的位置。
	 * @param {Number} end 结束排序的位置。
	 * @param {Function} fn 比较函数。
	 */
    sort : function(iterater,start,end,fn){
    
		var me = Py.Sorter, info = me._setup(iterater,start,end,fn);
		end = info[1];
		fn = info[2];
        for(var i = info[0];i < end; i++)
		    for(var k = end - 1;k >= i; k--)
			    if(!fn(iterater[i], iterater[k]))
				    me._swap(iterater, i, k) ;
					
		return iterater;
	}
	
});




