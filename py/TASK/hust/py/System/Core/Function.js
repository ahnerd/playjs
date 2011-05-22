//===========================================
//  函数   Function.js
//  Copyright(c) 2009-2010 xuld
//===========================================

Py.using("System.Core.Native");

/**
 * 函数。
 * @class Function
 */
Function.implementIf({
	
	/**
	 * 连接函数, 同时运行另一个, 参数为函数, 参数, 参数。
	 * @param {Function} 连接的成员。
	 * @return {Function} 连接函数。
	 */
	concat : function(){
        var s = Array.create(arguments);
		return function(){
			var a = arguments, me = this;
			Object.each(s, function(fn){
				fn.apply(me, a);
			});
		}
	},
	
	/**
	 * 延时运行某个函数。
	 * @param {Number} time 时间（毫秒）。
	 * @param {Object} bind 绑定的对象员。
	 * @return {Object} ... 参数。
	 * @return {Timer} 可用于 clearTimeout 的计时器。
	 */
	delay : function(time, bind){
		var fn = this;
		var args = Array.create(arguments, 2);
		return setTimeout(function(){fn.apply(bind, args);}, time);
	},
	
	/**
	 * 绑定一个对象和参数。
	 * @param {Object} bind 绑定的对象员。
	 * @return {Object} ... 参数。
	 * @return {Function} 函数。
	 */
	bind : function(bind){
		var fn = this;
		if (arguments.length > 1) {
            var args = Array.create(arguments, 1);
            return function(){
                return fn.apply(bind, args.concat(Array.create(arguments)))
            };
        }else
            return function(){return fn.apply(bind, arguments)};
	},
	
	/**
	 * 每隔时间执行一次函数。
	 * @param {Number} time 时间（毫秒）。
	 * @param {Number} times (默认 -1)运行次数。
	 * @param {Object} bind 绑定的对象员。
	 * @return {Object} ... 参数。
	 * @return {Timer} 可用于 clearInterval 的计时器。
	 */
	periodical : function(itime, times, bind){
		var fn = this,
			args = Array.create(arguments, 3),
			my = times == undefined ? -1 : times,
			timer;
		return timer = setInterval((function(){if(my--)fn.apply(bind, args);else clearTimeout(timer);}), itime);
	}
	
});

Object.extendIf(Function, {
	
	/**
	 * 尝试运行返回正确的才内容。
	 * @param {Funcion} 运行的函数。
	 */
	tryThese: function() {
		for (var i = 0, l = arguments.length; i < l; i++) {
			try {
				return arguments[i]();
			} catch(e) {}
		}
		return null;
	},
	
	/**
	 * 生成一个函数。
	 * @param {Function/String} statement 函数/函数的字符串形式。
	 * @param {Number} time 时间（毫秒）。
	 * @param {Number} times (默认 -1)运行次数。
	 * @return {Timer} 可用于 clearInterval 的计时器。
	 */
	create :  function (statement, time, times){
		var fn = Object.isFunction(statement) ? statement : new Function(statement);
		return (time ? (function(){ return fn[times==1 ? "delay" : "periodical"].apply(this, arguments);} ) : fn);
	}

});

