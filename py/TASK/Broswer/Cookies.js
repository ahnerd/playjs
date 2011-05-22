//===========================================
//  Cookie辅助   Cookies.js
//  Copyright(c) 2009-2010 xuld
//===========================================



Py.namespace("System.Broswer.Cookies");


/**
 * 浏览器 Cookies 处理。
 * @param {Object} name 名字。
 */
Py.namespace("Py.Broswer", "Cookies", {
	
	/**
	 * 获取 Cookies 。
	 * @param {String} name 名字。
	 * @param {String} 值。
	 */
	get: function(name){
		var c = document.cookie;
		var matches = c.match(new RegExp("(?:^|; )" + Regexp.create(name, true) + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},
	
	/**
	 * 设置 Cookies 。
	 * @param {String} name 名字。
	 * @param {String} value 值。
	 * @param {Number} expires 有效天数。天。-1表示无限。
	 * @param {Object} props 其它属性。
	 */
	set: function(name, value, expires, props){
		if(expires == undefined)
			expires = 1000;
		
		var d = new Date();
		d.setHours(d.getHours() + expires * 24);
		expires = d.toUTCString();

		var e = encodeURIComponent,
		    updatedCookie = name + "=" + e(value);
		if(props)
		    for(var propName in props){
			    updatedCookie = String.concat(updatedCookie, "; " + propName, "=",  e(props[propName])) ;
		    }
		document.cookie = updatedCookie;
	}
});
