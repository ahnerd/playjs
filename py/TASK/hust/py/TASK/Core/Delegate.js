//===========================================
//  委托   Delegate.js
//  Copyright(c) 2009-2010 xuld
//===========================================


Py.namespace("System.Delegate");
Py.using("System.Native");


/**
 * 委托。
 * @class Delegate
 */
Py.namespace("Py", "Delegate", Function.extend({
	
	/**
	 * 初始化一个委托。
	 * @param {Function} ... 创建委托的函数。
	 */
	constructor: function(){
		
		/**
		 * 执行委托。
		 * @return {Boolean} 是否成功调用所有委托成员。
		 */
		var fn = function(){
			var args = arguments, target = this.target;
			return fn.handlers.each(function(f){
				return f.apply(target, args);
			});
		};
		fn.handlers = Array.create(arguments);
		return fn;
		
	},
	
	/**
	 * xType 。
	 * @type String
	 */
	xType: "delegate",
	
	/**
	 * 增加一个函数。
	 * @param {Function} f 函数。
	 * @return {Delegate} this。
	 */
	add: function(f){
		this.handlers.push(f);
		return this;
	},

	/**
	 * 删除一个函数。
	 * @param {Function} f 函数。
	 * @return {Delegate} this。
	 */
	remove:  function(f){
		this.handlers.remove(f);
		return this;
	},
	
	/**
	 * 删除所有函数。
	 * @param {Function} f 函数。
	 * @return {Delegate} this。
	 */
	removeAll: function(){
		this.handlers.length = 0;
		return this;
	},
	
	/**
	 * 对一个对象调用委托。
	 * @param {Object} 对象。
	 * @return {Boolean} 是否成功调用所有委托成员。
	 */
	invoke: function(target){
		this.target = target;
		return this();
	}
							   
}));