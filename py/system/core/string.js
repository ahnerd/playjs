/**
 * @author hust_小C
 * email:hustcoolboy@gmail.com
 */
String.implement({
	
	/**
	 * 去除字符串两边空格。
	 * @param none。
	 * @return {String} 格式化后的字符串。
	 */
	trim:function(){
		return this.replace(/^\s+|\s+$/g,'');
	},
	
	/**
	 * 去除字符串左边空格。
	 * @param none。
	 * @return {String} 格式化后的字符串。
	 */
	trimStart:function(){
		return this.replace(/^\s+/,'');
	},
	
	/**
	 * 去除字符串右边空格。
	 * @param none。
	 * @return {String} 格式化后的字符串。
	 */
	trimEnd:function(){
		return this.replace(/\s+$/,'')
	},
	
	/**
	 * 去除字符串所有空格。
	 * @param none。
	 * @return {String} 格式化后的字符串。
	 */
	clean:function(){
		return this.replace(/\s+/g,'');
	},
	
	encodeJs : function () {
		
		// TODO  效率不高
		
	    return this.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"").replace(/\'/,"\\'");
	},
	
	encodeHtml : function () {
	    var t = document.createElement("div");
	    t.appendChild(document.createTextNode(this.toString()));
	    return t.innerHTML.replace(/\'/g,"&#39;").replace(/\"/g,"&quote;").replace(/\%/g,"&#37;").replace(/\?/g,"&#63;").replace(/\s+/g,"&nbsp;");
    },
	/**
	 * 字符串正则测试。
	 * @param {RegExp,params}RegExp:正则，params：i,g,m匹配方式。
	 * @return {String} 返回是否匹配结果 true or false。
	 */
	test: function(regex, params){
		return ((typeof(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
	},
	
	/**
	 * 判断是否是合法的json字符串。
	 * @param {json}。
	 * @return {Boolean} 。
	 */
	isJSONText:function(json){  
        return /^[\],:{}\s]*$/.test(json.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")  

        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")  

        .replace(/(?:^|:|,)(?:\s*\[)+/g, ""));  

    }, 
	
	toObject:function(){
		return this.isJSONText?eval('('+this+')'):null;
	},

	/**
	 * 字符串是否以某个特定字符串开头。
	 * @param {String}开头的字符串。
	 * @return {String} 返回是否匹配结果 true or false。
	 */
	startWith:function(str){
		return this.test('^'+str);
	},
	
	/**
	 * 字符串是否以某个特定字符串结尾。
	 * @param {String}结尾的字符串。
	 * @return {String} 返回是否匹配结果 true or false。
	 */
	endWith:function(str){
		return this.test(str+'$');
	},
	
	/**
	 * 字符串是否包含某个特定字符串。
	 * @param {String}要包含的字符串。
	 * @return {String} 返回是否匹配结果 true or false。
	 */
	contains:function(str,separator){
		return (separator?(separator+this+separator):this).indexOf(str)>-1;
	},
	
	/**
	 * 以驼峰方式格式化字符串。
	 * @param {}。
	 * @return {String} 返回驼峰式字符串。
	 */
	toCamelCase:function(){
		return this.replace(/[-_]\D/g,function(a,b){
			return a.charAt(1).toUpperCase();
		})
	},
	
	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},
	/**
	 * 将字符串全部转为大写。
	 * @param {}。
	 * @return {String} 返回全部转为大写后字符串。
	 */
	uppercase:function(){
		return this.replace(/[a-z]/g,function(match){
			return match.toUpperCase();
		});
	},
	
	/**
	 * 将字符串全部转为小写。
	 * @param {}。
	 * @return {String} 返回全部转为小写后字符串。
	 */
	lowercase:function(){
		return this.replace(/[A-Z]/g,function(match){
			return match.toLowerCase();
		})
	},
	
	quote:function(){
		var  metaObject = {
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '\\': '\\\\'
                },
		str = this.replace(/[\x00-\x1f\\]/g, function (chr) {
                            var special = metaObject[chr];
                            return special ? special : '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4)
                        });
        return '"' + str.replace(/"/g, '\\"') + '"';
	},
	/**
	 * 将字符串中的重复单词去掉。
	 * @param {}。
	 * @return {String} 返回重复单词去掉后的字符串。
	 */
	unique:function(){
		return this.replace(/(^|\s)(\S+)(?=\s(?:\S+\s)*\2(?:\s|$))/g,'');
	},
	toInt:function(base){
		return parseInt(this,base||10);
	},
	toFloat:function(){
		return parseFloat(this);
	},
	lambda:function(){
		var sections=this.split(/\s*->\s*/m),params=[],body='';
		if(sections.length>1){
			while(sections.length){
			body=sections.pop()
			params = sections.pop().split(/\s*,\s*|\s+/m);
			sections.length && sections.push('(function('+params+'){return ('+body+')})');
		}
		}
		return new Function(params,'return ('+body+')');
	},
	toFunction:function(){
		if(/\breturn\b/){
			return new Function(this);
		}
		return this.lambda();
	},
	execute:function(){
		(window.execScript||window.eval)(this);
	},
	times:function(n){
		return new Array(n+1).join(this);
	} 
});


//  TODO

/// <reference href="../Py.js" />


			if (byWord) {
				var p = value.indexOf(' ', len);
				if(p !== -1 && p - len > 15)
					len = p;
            }

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
	
	
	
	
	
	

//===========================================
//  字符串   Stringx.js  MIT LICENCE
//===========================================

Py.implementIf({

    left : function(length) {
        ///<summary>获取字符串左边 length 长度的子字符串。语法：left(length)</summary>
        ///<param name="length" type="int">要获取的子字符串长度。</param>
        ///<returns type="string">返回字符串左边 length 长度的子字符串。</returns>
            return this.substr(0, length);
        },


    right : function(length) {
        ///<summary>获取字符串右边 length 长度的子字符串。语法：right(length)</summary>
        ///<param name="length" type="int">要获取的子字符串长度。</param>
        ///<returns type="string">返回字符串右边 length 长度的子字符串。</returns>
            return this.substr(this.length - length, length);
        },


    trimLeft : function() {
        ///<summary>获取去除了字符串左端的半角和全角空格之后的字符串。语法：trimLeft()</summary>
        ///<returns type="string">返回去除了字符串左端的半角和全角空格之后的字符串。</returns>
            return this.replace(/^[ 　]+/gi, "");
    },


    trimRight : function() {
    ///<summary>获取去除了字符串右端的半角和全角空格之后的字符串。语法：trimRight()</summary>
    ///<returns type="string">返回去除了字符串右端的半角和全角空格之后的字符串。</returns>
        return this.replace(/[ 　]+$/gi, "");
    },


    padLeft : function(totalWidth, chr) {
        ///<summary>向字符串左端追加一定数量的字符并返回。语法：padLeft(totalWidth, chr)</summary>
        ///<param name="totalWidth" type="int">追加字符后要达到的总长度。</param>
        ///<param name="chr" type="char">要追加的字符。</param>
        ///<returns type="string">返回追加字符后的字符串。</returns>
        var str = "";
        for (var i = 0; i < totalWidth - this.length; i++) {
            str += chr;
        }

        return str + this;
    },


    padRight : function(totalWidth, chr) {
        ///<summary>向字符串右端追加一定数量的字符并返回。语法：padRight(totalWidth, chr)</summary>
        ///<param name="totalWidth" type="int">追加字符后要达到的总长度。</param>
        ///<param name="chr" type="char">要追加的字符。</param>
        ///<returns type="string">返回追加字符后的字符串。</returns>
        var str = "";
        for (var i = 0; i < totalWidth - this.length; i++) {
            str += chr;
        }

        return this + str;
    },


    removeHtml : function() {
        ///<summary>去除字符串中的 HTML 标签并返回。语法：removeHtml()</summary>
        ///<returns type="string">返回去除了 HTML 标签的字符串。</returns>
        return this.replace(/<(.|\n)+?>/gi, "");
    }


});
	
	
	
	
Ext.util.Format = function(){
    var trimRe = /^\s+|\s+$/g;
    return {
        
        ellipsis : function(value, len){
            if(value && value.length > len){
                return value.substr(0, len-3)+"...";
            }
            return value;
        },

        
        undef : function(value){
            return typeof value != "undefined" ? value : "";
        },

        
        htmlEncode : function(value){
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        },

        
        trim : function(value){
            return String(value).replace(trimRe, "");
        },

        
        substr : function(value, start, length){
            return String(value).substr(start, length);
        },

        
        lowercase : function(value){
            return String(value).toLowerCase();
        },

        
        uppercase : function(value){
            return String(value).toUpperCase();
        },

        
        capitalize : function(value){
            return !value ? value : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
        },

        
        call : function(value, fn){
            if(arguments.length > 2){
                var args = Array.prototype.slice.call(arguments, 2);
                args.unshift(value);
                return eval(fn).apply(window, args);
            }else{
                return eval(fn).call(window, value);
            }
        },

        
        usMoney : function(v){
            v = (Math.round((v-0)*100))/100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
            return "$" + v ;
        },

        
        date : function(v, format){
            if(!v){
                return "";
            }
            if(!(v instanceof Date)){
                v = new Date(Date.parse(v));
            }
            return v.dateFormat(format || "m/d/Y");
        },

        
        dateRenderer : function(format){
            return function(v){
                return Ext.util.Format.date(v, format);  
            };
        },

        
        stripTagsRE : /<\/?[^>]+>/gi,
        
        
        stripTags : function(v){
            return !v ? v : String(v).replace(this.stripTagsRE, "");
        }
    };
}();







//String


String.prototype.left = function(length) {
///<summary>获取字符串左边 length 长度的子字符串。语法：left(length)</summary>
///<param name="length" type="int">要获取的子字符串长度。</param>
///<returns type="string">返回字符串左边 length 长度的子字符串。</returns>
    return this.substr(0, length);
}


String.prototype.right = function(length) {
///<summary>获取字符串右边 length 长度的子字符串。语法：right(length)</summary>
///<param name="length" type="int">要获取的子字符串长度。</param>
///<returns type="string">返回字符串右边 length 长度的子字符串。</returns>
    return this.substr(this.length - length, length);
}


String.prototype.trimLeft = function() {
///<summary>获取去除了字符串左端的半角和全角空格之后的字符串。语法：trimLeft()</summary>
///<returns type="string">返回去除了字符串左端的半角和全角空格之后的字符串。</returns>
    return this.replace(/^[ 　]+/gi, "");
}


String.prototype.trimRight = function() {
///<summary>获取去除了字符串右端的半角和全角空格之后的字符串。语法：trimRight()</summary>
///<returns type="string">返回去除了字符串右端的半角和全角空格之后的字符串。</returns>
    return this.replace(/[ 　]+$/gi, "");
}


String.prototype.trim = function() {
///<summary>获取去除了字符串两端的半角和全角空格之后的字符串。语法：trim()</summary>
///<returns type="string">返回去除了字符串两端的半角和全角空格之后的字符串。</returns>
    return this.trimLeft().trimRight();
}


String.prototype.padLeft = function(totalWidth, chr) {
///<summary>向字符串左端追加一定数量的字符并返回。语法：padLeft(totalWidth, chr)</summary>
///<param name="totalWidth" type="int">追加字符后要达到的总长度。</param>
///<param name="chr" type="char">要追加的字符。</param>
///<returns type="string">返回追加字符后的字符串。</returns>
    var str = "";
    for (var i = 0; i < totalWidth - this.length; i++) {
        str += chr;
    }

    return str + this;
}


String.prototype.padRight = function(totalWidth, chr) {
///<summary>向字符串右端追加一定数量的字符并返回。语法：padRight(totalWidth, chr)</summary>
///<param name="totalWidth" type="int">追加字符后要达到的总长度。</param>
///<param name="chr" type="char">要追加的字符。</param>
///<returns type="string">返回追加字符后的字符串。</returns>
    var str = "";
    for (var i = 0; i < totalWidth - this.length; i++) {
        str += chr;
    }

    return this + str;
}


String.prototype.removeHtml = function() {
///<summary>去除字符串中的 HTML 标签并返回。语法：removeHtml()</summary>
///<returns type="string">返回去除了 HTML 标签的字符串。</returns>
    return this.replace(/<(.|\n)+?>/gi, "");
}


/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.String
 *
 * A collection of useful static methods to deal with strings
 * @singleton
 */

Ext.String = {
    trimRegex: /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
    escapeRe: /('|\\)/g,
    formatRe: /\{(\d+)\}/g,
    escapeRegexRe: /([-.*+?^${}()|[\]\/\\])/g,

    /**
     * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
     * @param {String} value The string to encode
     * @return {String} The encoded text
     * @method
     */
    htmlEncode: (function() {
        var entities = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;'
        }, keys = [], p, regex;
        
        for (p in entities) {
            keys.push(p);
        }
        
        regex = new RegExp('(' + keys.join('|') + ')', 'g');
        
        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                return entities[capture];    
            });
        };
    })(),

    /**
     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
     * @param {String} value The string to decode
     * @return {String} The decoded text
     * @method
     */
    htmlDecode: (function() {
        var entities = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"'
        }, keys = [], p, regex;
        
        for (p in entities) {
            keys.push(p);
        }
        
        regex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
        
        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                if (capture in entities) {
                    return entities[capture];
                } else {
                    return String.fromCharCode(parseInt(capture.substr(2), 10));
                }
            });
        };
    })(),

    /**
     * Appends content to the query string of a URL, handling logic for whether to place
     * a question mark or ampersand.
     * @param {String} url The URL to append to.
     * @param {String} string The content to append to the URL.
     * @return (String) The resulting URL
     */
    urlAppend : function(url, string) {
        if (!Ext.isEmpty(string)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
        }

        return url;
    },

    /**
     * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
     * @example
var s = '  foo bar  ';
alert('-' + s + '-');         //alerts "- foo bar -"
alert('-' + Ext.String.trim(s) + '-');  //alerts "-foo bar-"

     * @param {String} string The string to escape
     * @return {String} The trimmed string
     */
    trim: function(string) {
        return string.replace(Ext.String.trimRegex, "");
    },

    /**
     * Capitalize the given string
     * @param {String} string
     * @return {String}
     */
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substr(1);
    },

    /**
     * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length
     * @param {String} value The string to truncate
     * @param {Number} length The maximum length to allow before truncating
     * @param {Boolean} word True to try to find a common word break
     * @return {String} The converted text
     */
    ellipsis: function(value, len, word) {
        if (value && value.length > len) {
            if (word) {
                var vs = value.substr(0, len - 2),
                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                if (index !== -1 && index >= (len - 15)) {
                    return vs.substr(0, index) + "...";
                }
            }
            return value.substr(0, len - 3) + "...";
        }
        return value;
    },

    /**
     * Escapes the passed string for use in a regular expression
     * @param {String} string
     * @return {String}
     */
    escapeRegex: function(string) {
        return string.replace(Ext.String.escapeRegexRe, "\\$1");
    },

    /**
     * Escapes the passed string for ' and \
     * @param {String} string The string to escape
     * @return {String} The escaped string
     */
    escape: function(string) {
        return string.replace(Ext.String.escapeRe, "\\$1");
    },

    /**
     * Utility function that allows you to easily switch a string between two alternating values.  The passed value
     * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
     * they are already different, the first value passed in is returned.  Note that this method returns the new value
     * but does not change the current string.
     * <pre><code>
    // alternate sort directions
    sort = Ext.String.toggle(sort, 'ASC', 'DESC');

    // instead of conditional logic:
    sort = (sort == 'ASC' ? 'DESC' : 'ASC');
       </code></pre>
     * @param {String} string The current string
     * @param {String} value The value to compare to the current string
     * @param {String} other The new value to use if the string already equals the first value passed in
     * @return {String} The new value
     */
    toggle: function(string, value, other) {
        return string === value ? other : value;
    },

    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     *
     * <pre><code>
var s = Ext.String.leftPad('123', 5, '0');
// s now contains the string: '00123'
       </code></pre>
     * @param {String} string The original string
     * @param {Number} size The total length of the output string
     * @param {String} character (optional) The character with which to pad the original string (defaults to empty string " ")
     * @return {String} The padded string
     */
    leftPad: function(string, size, character) {
        var result = String(string);
        character = character || " ";
        while (result.length < size) {
            result = character + result;
        }
        return result;
    },

    /**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = Ext.String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
// s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
       </code></pre>
     * @param {String} string The tokenized string to be formatted
     * @param {String} value1 The value to replace token {0}
     * @param {String} value2 Etc...
     * @return {String} The formatted string
     */
    format: function(format) {
        var args = Ext.Array.toArray(arguments, 1);
        return format.replace(Ext.String.formatRe, function(m, i) {
            return args[i];
        });
    }
};


