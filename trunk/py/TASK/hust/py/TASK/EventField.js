//===========================================
//  事件字段   EventField.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================

using("System.Listener") ;




/// <summary>
/// 事件字段
/// </summary>
/// <class name="EventField"/>
Py.Class.EventField = function(name, newFunction){
	var f = function(fn){
		
		//如果传入函数，舔到函数列表
		if (typeof fn == "function") {
			f.handlers.push(fn);
		} else {
			
			//执行函数
			var e = arguments, r, t = this, name = f.name;
			if (!this["_" + name] || this["_" + name].apply(t, e) !== false){
				e = e.arguments || e;
				e.name = name;
				f.handlers.each(function(handler){
					return r = handler.call(t, e);
				});
			} 
			return r && (!this["on" + name] || this["on" + name].call(t, e) !== false);
		}
	};

	f.handlers = newFunction ? [newFunction] : [];
	return fn;
};


Py.Class.EventField.create = function(type){
	var ptp = "_" + type, otp = "on" + type;
	return function(fn){
		if(typeof fn == "function"){
			this[type] = new Py.Class.EventField(type, fn)) {
				oninit = this[ptp];
				oncallback = this[otp];
				name = type;
				createEventArgs = true;
			}
		}else if(this[ptp])
			return (!this[ptp] || false !== this[ptp](fn)) && (!this[otp] || false !== this[otp](fn));
	};
};