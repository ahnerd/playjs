//===========================================
//  字符串缓存   StringBuilder.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================



namespace("System.Text");

/// <summary>
/// 缓存
/// </summary>
Py.Text.StringBuilder = new Class({
	
	/// <summary>
	/// 内容
	/// </summary>
	/// <type name="Array" />
	/// <private />
	_data : navigator.isIE ? [] : "",
	
	/// <summary>
	/// 构造函数
	/// </summary>
	/// <params name="text" type="String">字符串</params>
	/// <constructor name="Array" />
	constructor : function(text){
		this.append(text);
	},
	
	/// <summary>
	/// 构造函数
	/// </summary>
	/// <params name="text" type="String">字符串</params>
	append : navigator.isIE ? function(){
		
		assert.notNull(this._data,"当前StringBuilder肯能已释放");
		
		if(text != undefined)
			this._data.push(text);
		
		
	} : function(text){
		
		assert.notNull(this._data,"当前StringBuilder肯能已释放");
		
		this._data += text;
		
	},
	
	/// <summary>
	/// 转化成数组形式
	/// </summary>
	toString : navigator.isIE ? function(){
		return _data.join("");
	} : function(){
		return _data;
	},
	
	/// <summary>
	/// xType
	/// </summary>
	/// <type name="String" />
	/// <const />
	xType : "StringBuilder",
	
	/// <summary>
	/// 删除全部缓存
	/// </summary>
	dispose : function(){
		this._data = null;
	}
	
	
	
});