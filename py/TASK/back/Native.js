//===========================================
//  支持原生类   Native.js
//  Copyright(c) 2009-2010 xuld
//===========================================


(function(){
	
	/**
	 * 完成继承。
	 * @param {Object} methods 成员。
	 * @return {Class} 继承的子类。
	 * @private
	 */
	function nativeExtend(methods) {

		assert(methods, "用于继承的对象为空");

		// 基类
		var baseClass = this,

			// 复制父类到子类.直接创建父类实例，我们不需要创建桥类因为父类是本地类。
			fn = new baseClass(),
			
			/**
			 * 生成当前类的实例。
			 * 
			 * @constructor Native
			 */
			subClass = function() {

				// 返回原有类型作为实例
				var me = this, k;
				
				// 解除引用
				Object.update(methods, Object.clone, me);

				// 如果构造函数返回值，使用返回的值
				if (k = methods.constructor != opc && methods.constructor.apply(me, arguments)) {
					me = Object.extendIf(k, me);
					me.constructor = methods.constructor;
				}
				
				return me;

			};
		
		// 写入新信息
		subClass.prototype = Object.extend(fn, methods);

		// 指明父类
		subClass.base = baseClass;

		return Py.Native(subClass);
	}
	
	Py.Class.addCallback('Py', 'Native', function(nativeClass){
		nativeClass.extend = nativeExtend;
	});
	
	[String, Array, Function, Date, RegExp].forEach(Py.Native);
});



