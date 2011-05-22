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
	ltrim:function(){
		return this.replace(/^\s+/,'');
	},
	
	/**
	 * 去除字符串右边空格。
	 * @param none。
	 * @return {String} 格式化后的字符串。
	 */
	rtrim:function(){
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
	
	addslashes : function () {
	    return this.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"").replace(/\'/,"\\'");
	},
	
	htmlEncode : function () {
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
