//===========================================
//  正则   RegExp.js
//  Copyright(c) 2009-2010
//===========================================
Object.extendIf(RegExp,{
	
	
	
	
	
	
	
})




	
		
		

	/**
	 * 从字符串创建正则式。
	 * @param {Object} regexp 字符串。
	 * @param {Boolean/String} flag (默认 true)标记，如果标记为 false 则返回字符串。
	 * @return {RegExp/String}  正则表达式。
	 * @memberOf RegExp
	 */
	RegExp.create = function(regexp, flag) {
		
		// 正则替换。
		var str = regexp.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\p1');
		
		// 返回。
		return flag === false ? str: new RegExp(str, flag);
	} 