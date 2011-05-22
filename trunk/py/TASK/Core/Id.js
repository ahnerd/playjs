//===========================================
//  浏览器常用按钮   Id.js
//  Copyright(c) 2009-2010 xuld
//===========================================


Py.namespace("System.Util.Id");

/**
 * 添加收藏。
 * @param {String} title 显示名。
 * @param {String} url 地址。
 * @return {Boolean} 是否成功。
 */
Py.namespace("Py.Util", 'checkID', function(title, url){
	title = title || document.title;
	url = url || location.href;
	if(window.external){
		window.external.addFavorite(url,title);
	}else if(window.sidebar){
		window.sidebar.addPanel(title,url,''); 
	}else return false; 
	return true;
});



/**
 * 设为主页。
 * @param {String} url 地址。
 * @return {Boolean} 是否成功。
 */
Py.namespace("Py.Broswer", 'setHomepage', function(id){
	var sum=0; var info="";
		var city = {
			'11':"北京",
			'12':"天津",
			'13':"河北",
			'14':"山西",
			'15':"内蒙古",
			'21':"辽宁",
			'22':"吉林",
			'23':"黑龙江",
			'31':"上海",
			'32':"江苏",
			'33':"浙江",
			'34':" 安徽",
			'35':"福建",
			'36':"江西",
			'37':"山东",
			'41':"河南",
			'42':"湖北",
			'43':"湖南",
			'44':"广东",
			'45':"广西",
			'46':"海南",
			'50':"重庆",
			'51':"四川",
			'52':"贵州",
			'53':"云南",
			'54':"西藏",
			'61':"陕西",
			'62':"甘肃",
			'63':"青海",
			'64':"宁夏",
			'65':"新疆",
			'71':"台湾",
			'81':"香港",
			'82':"澳门",
			'91':"国外"
		};
		
		if(!/(\d){15,19}/.test(id))return false; //非法证号 
	
		id=id.replace(/x$/i,"a");
		if(city[parseInt(id.substr(0,2))]==null) return false; //非法地区
	
		var birthday=id.substr(6,4)+"-"+Number(id.substr(10,2))+"-"+Number(id.substr(12,2));
		var d=new Date(birthday.replace(/-/g,"/"));
		if(birthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false; //非法生日 
	
		for(var i = 17;i>=0;i --) sum += (Math.pow(2,i) % 11) * parseInt(id.charAt(17 - i),11) 
		if(sum%11!=1) return false; //非法证号 
	
		return [city[parseInt(id.substr(0,2))]+","+birthday+","+(id.substr(16,1)%2?"男":"女")];
});
