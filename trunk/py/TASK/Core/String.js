//===========================================
//  字符串   String.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================

//  TODO

/// <reference href="../Py.js" />



/// <summary>
/// 字符串
/// </summary>
/// <class name="String" />
String.implementIf({

	
	///	<summary>
	/// 获得长度,中文算2个字符。
	/// </summary>
	///	<returns type="Number" >长度值</returns>
	/// <examples>"中文".wLength();  //  4</examples>
	wLength : function(){
		
		var arr=this.match(/[^\x00-\xff]/ig);
		
		return this.length + (arr==null ? 0 : arr.length);
	},
	
	/// <summary>
	/// 判断当前字符串是否符合一个正则式。
	/// </summary>
	///	<param name="regExp" type="RegExp"> 正则表达式 </param>
	///	<param name="regExp" type="String"> 正则表达式 </param>
	///	<returns type="Boolean" >测试正确返回true</returns>
	/// <examples> "title".test(/tit(.)e/ig)  //返回   true</examples>
	test : function(regExp){
		
		return  new RegExp(regExp).test(this);
	},
	
	/// <summary>
	/// 判断当前字符串是否符合从一个字符串开始。
	/// </summary>
	///	<param name="value" type="String"> 值 </param>
	///	<returns type="Boolean" >布尔</returns>
	startWith : function(value){
		return this.substr(0,value.length) == value;
	
	},

	/// <summary>
	/// 判断当前字符串是否符合从一个字符串结束。
	/// </summary>
	///	<param name="value" type="String"> 值 </param>
	///	<returns type="Boolean" >布尔</returns>
	endWith : function(value){
		return this.substr(this.length - value.length) == value;
	},
	
	/// <summary>
	/// 判断当前字符串是否有字符串。
	/// </summary>
	///	<param name="value" type="String"> 值 </param>
	///	<param name="separator" type="String" optional="true">分隔符</param>
	///	<returns type="Boolean" >布尔</returns>
	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	/// <summary>
	/// 转成骆驼式
	/// </summary>
	///	<returns type="String" > 字符串 </returns>
	/// <example>
	///  "aaaa-cccc-aaa"  :  "aaaaCcccAaa"
	/// </example>
	toCamelCase: function(){
		return this.replace(/[-_]\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},
	
	/// <summary>
	/// 删除空白
	/// </summary>
	///	<returns type="String" > 字符串 </returns>
	clean: function(){
		return this.replace(/\s+/g, ' ').trim();
	},
	
	/// <summary>
	/// 对齐
	/// </summary>
	///	<param name="length" type="Number" > 长度 </param>
	///	<param name="sub" type="String" > 填补空白的字符 </param>
	///	<returns type="String" > 字符串 </returns>
	pad : function(length,sub){
		var f = length - this.length;
		if(f > 0){
			f = new Array(f);
			Array.update(f,function(){return sub;});
			return f + this;
		}
		return f < 0 ? this.substr(0, -f) : this;
	},
	
	/// <summary>
	/// 首字母 toLowerCase
	/// </summary>
	///	<returns type="String" > 字符串 </returns>
	firstLower : function(){
		return this.charAt(0).toLowerCase().concat(this.substr(1));
	},
	
	/// <summary>
	/// 首字母 toUpperCase
	/// </summary>
	///	<returns type="String" > 字符串 </returns>
	firstUpper : function(){
		return this.charAt(0).toUpperCase().concat(this.substr(1));
	},
		
	/// <summary>
	/// 连接符式  "backgroundImage"  :  "background-image"
	/// </summary>
	///	<param name="ch" type="Number" default="-"> 连接符 </param>
	///	<returns type="String" > 字符串 </returns>
	hyphenate: function(ch){
		ch = ch || "-";
		return this.replace(/[A-Z]/g, function(match){
			return (ch + match.charAt(0).toLowerCase());
		});
	}

});






/*
---

name: String

description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

license: MIT-style license.

requires: Type

provides: String

...
*/

String.implement({

	test: function(regex, params){
		return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
	},

	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	trim: function(){
		return this.replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return this.replace(/\s+/g, ' ').trim();
	},

	camelCase: function(){
		return this.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return this.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	hexToRgb: function(array){
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	rgbToHex: function(array){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},

	substitute: function(object, regexp){
		return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != null) ? object[name] : '';
		});
	}

});



leftPad : function (val, size, ch) {
        var result = new String(val);
        if (ch == null) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    },