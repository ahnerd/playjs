//===========================================
//  Cookie辅助   Cookies.js     A
//===========================================


/**
 * 浏览器 Cookies 处理。
 * @param {Object} name 名字。
 */
Py.namespace(".Cookies.", {
	
	/**
	 * 获取 Cookies 。
	 * @param {String} name 名字。
	 * @param {String} 值。
	 */
	get: function(name){
		
		assert.isString(name, "Cookies.get(name): 参数 name ~。");
		
		name = encodeURIComponent(name);
		
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},
	
	/**
	 * 设置 Cookies 。
	 * @param {String} name 名字。
	 * @param {String} value 值。
	 * @param {Number} expires 有效天数。天。-1表示无限。
	 * @param {Object} props 其它属性。如 domain, path, secure    。
	 */
	set: function(name, value, expires, props){
		if(expires == undefined)
			expires = 1000;
		
		var d = new Date();
		d.setHours(d.getHours() + expires * 24);
		expires = d.toUTCString();

		var e = encodeURIComponent,
		    updatedCookie = e(name) + "=" + e(value);
		
		if(props)
		    for(var propName in props){
			    updatedCookie = String.concat(updatedCookie, "; " + propName, "=",  e(props[propName])) ;
		    }
		document.cookie = updatedCookie;
	}
});


