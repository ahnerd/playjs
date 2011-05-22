//===========================================
//  函数库   Ultity.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================


Object.extend(Py,{
	//交换2个值
	swap : function (a,b){
		var c=a;
		b = a;
		a = c;
	},
	
	//获取第一个不为undefined的值
	pick : function(){ 
		for (var i = 0, l = arguments.length; i < l; i++){
			if (arguments[i] != undefined) return arguments[i];
		}
		return null;
	}
		
});