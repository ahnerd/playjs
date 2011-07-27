//===========================================
// 简单的 JSON         A
//===========================================
	
namespace("JSON.", {
	
	specialChars: {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	replaceChars: function(chr){
		return JSON.specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	},

	encode: function(obj){
		switch (Object.type(obj)){
			case 'string':
				return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.replaceChars) + '"';
			case 'array':
				return '[' + String(Object.update(obj, JSON.encode, [])) + ']';
			case 'object':
				var string = [];
				for(var key in obj) {
					string.push(JSON.encode(key) + ':' + obj[key]);
				}
				return '{' + string + '}';
			default:
				return String(obj);
		}
	},

	decode: function(string, secure){
		if (typeof string != 'string' || !string.length) return null;
		if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
		return eval('(' + string + ')');
	}

});

