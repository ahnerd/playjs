//===========================================
//  日期   Datex.js  MIT LICENCE
//===========================================
Object.extend(Date,{

	dayInMonth : function() {
		var counts = [31,28,31,30,31,30,31,31,30,31,30,31];
		return function(year, month){
			///<summary>获取指定年的指定月有多少天。语法：Date.getDaysCount(year, month)</summary>
			///<param name="year" type="int">指定的年</param>
			///<param name="month" type="int">指定的月。</param>
			///<returns type="int">返回指定年的指定月的天数。</returns>
		
			assert(month>=1 && month<=12,"月份必须是合法数字");
			
			return month == 2 && Date.isLeapYear(year) ? 29 : counts[month];
		
		}
		
	}(),

});