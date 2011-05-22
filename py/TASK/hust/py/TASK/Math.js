//===========================================
//  数学公式   Math.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================


/// <summary>
/// 数字
/// </summary>
/// <class name="Number">
Py.Native(Number, {

	/// <summary>
	/// 在min和max之间取最接近的值
	/// </summary>
	/// <params name="min" type="Number"> 值 </params>
	/// <params name="max" type="Number"> 值 </params>
	/// <returns type="Number" />
	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},
	
	/// <summary>
	/// 四舍五入
	/// </summary>
	/// <params name="precision" type="Number"> 有效数字 </params>
	/// <params name="max" type="Number"> 值 </params>
	/// <returns type="Number" />
	round: function(precision){
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	},

	/// <summary>
	/// 转为小数
	/// </summary>
	/// <returns type="Number" />
	toFloat: function(){
		return parseFloat(this);
	},

	/// <summary>
	/// 转为整数
	/// </summary>
	/// <params name="base" type="Number" default="10">数字进制</params>
	/// <returns type="Number" />
	toInt: function(base){
		return parseInt(this, base || 10);
	}

});



Object.extendIf(Math,{
	
	/// <summary>
	/// 在min和max之间取一个伪随机数
	/// </summary>
	/// <params name="min" type="Number"> 值 </params>
	/// <params name="max" type="Number"> 值 </params>
	/// <returns type="Number" />
	rand: function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	
	
});