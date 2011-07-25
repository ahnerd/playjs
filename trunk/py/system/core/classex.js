//===========================================
//  类的扩展   classex.js  A
//===========================================




/**
 * 
 * @param {Boolean} quick=true 如果 true 那么这个类不解除成员对象的引用 。
 */
Py.Object.extend = function(members) {

	// 未指定函数   使用默认构造函数(Object.prototype.constructor);
	
	var constructorDefined = hasOwnProperty.call(members =  members instanceof Function ? {
			constructor: members
		} : (members || {}), "constructor"),
	
		// 如果是快速模式且已经存在类构造函数，使用类的构造函数，否则，使用函数作为类。
		useDefinedConstructor = (members.$unlink) && constructorDefined,
	
		// 生成子类
		subClass = useDefinedConstructor ? members.constructor : function(){
			
			// 去除闭包
	 		var me = this, c = me.constructor;
	 		
			// 重写构造函数
			me.constructor = arguments.callee;
			
			// 重新调用构造函数
			c.apply(me, arguments);
			
		},
		
		// 基类( this )
		baseClass = this,
		
		// 强制复制构造函数。  FIX  6
		constructor = constructorDefined ? members.constructor : baseClass.prototype.constructor;
	
	// 代理类
	emptyFn.prototype = baseClass.prototype;
	
	// 指定成员
	Class(subClass).prototype = apply(new emptyFn, members);
	
	/// #ifdef SupportIE6
	
	// 强制复制构造函数。  FIX  6
	// 是否需复制成员。
	subClass.prototype.constructor = !useDefinedConstructor && members.$unlink ?  function(){
			
			// 解除引用。
			o.update(this, o.clone);
			
			// 重新调用构造函数
			constructor.apply(this, arguments);
			
		} : constructor;
	
	/// #else
	
	/// if (!useDefinedConstructor) {
	///
	/// 	if(quick)
	///			subClass.cloneMembers = true;
	/// 
	///		// 强制复制构造函数。
	/// 	subClass.prototype.constructor = quick ?  function(){
	/// 			
	/// 		// 解除引用。
	/// 		o.update(this, o.clone);
	/// 			
	/// 		// 重新调用构造函数
	/// 		constructor.apply(this, arguments);
	/// 		
	/// 	} : constructorDefined ? members.constructor : baseClass.prototype.constructor;
	/// }
	
	/// #endif
	
	// 指定父类
	subClass.base = baseClass;
    
	// 指定Class内容
	return subClass;

};
}