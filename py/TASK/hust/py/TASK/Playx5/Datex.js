//===========================================
//  ����   Datex.js  MIT LICENCE
//===========================================
Object.extend(Date,{

	dayInMonth : function() {
		var counts = [31,28,31,30,31,30,31,31,30,31,30,31];
		return function(year, month){
			///<summary>��ȡָ�����ָ�����ж����졣�﷨��Date.getDaysCount(year, month)</summary>
			///<param name="year" type="int">ָ������</param>
			///<param name="month" type="int">ָ�����¡�</param>
			///<returns type="int">����ָ�����ָ���µ�������</returns>
		
			assert(month>=1 && month<=12,"�·ݱ����ǺϷ�����");
			
			return month == 2 && Date.isLeapYear(year) ? 29 : counts[month];
		
		}
		
	}(),

});