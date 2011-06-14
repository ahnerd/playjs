//===========================================
//  枚举   Enum.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================


	
		
/// <summary>
/// 创建一个枚举
/// <summary>
/// <params name="obj" type="Object">obj 用于创建枚举的对象 {Array} obj 用于创建枚举的数组</params>
/// <params name="flag" type="Boolean">指示该枚举是否用于标记</params>
/// <params name="reverse" type="Boolean">指示该枚举是否使用值转化为键</params>
/// <returns type="Enum">返回该类</returns>
var Enum = Py.Enum = function (obj, flag, reverse){
	assert(obj,"创建枚举使用对象{0}为空",obj);
	
	var m = flag ? .5 : 1;
	
	Array.each(obj,reverse ?
		
		function(key, value){obj[key] = typeof value != "number" ? (flag ? (m *= 2) : (m++)) : value;} :
		
		function(value, key){r[key] = typeof value != "number" ? (flag ? (m *= 2) : (m++)) : value;}
		
	);
	
	return r;
}

///	<summary>
/// 根据某个值返回枚举的大小。
///	</summary>
///	<param name="e" type="Enum" optional="false">枚举</param>
///	<param name="n" type="Number" optional="false">值</param>
///	<returns type="Object">枚举对应的值</returns>
Py.Enum.getName = function(e,n){
    for(var i in e)
        if( e[i] == n)
            return i;
    return null;
}
