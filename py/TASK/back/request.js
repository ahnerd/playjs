//===============================================
// class - request
// by xuld
// 使用方法:
// Request.QueryString()   //   参数  可用名  xuld=x&xuld2=x    request.QueryString("xuld2") =x    request.QueryString(1) =x
// Request.Cookies(cookieName, dfltValue)     //    cookieName  cookie名     dfltValue 读不到
// Request.count       //  参数个数
// Response.Cookies(cookieName, cookieValue, expires)    //   保存 cookie   expires  保存时间 月单位
//===============================================
try{
	var Request=new clsRequest();
	var Response=new clsResponse();
	
}catch(e){}

function clsRequest(){
	var url=document.location.href.toString();
	var po=url.lastIndexOf('?'),c="",arrqs="";
	if(po>=0) c=url.substr(po+1);
	this.QueryString=function(x){
		if(c=="") return "";
		if(isNaN(x)){
			tc="__xuld=&"+c+"&__xuld=__xuld__";
			tc=tc.substr(tc.lastIndexOf("&"+x+"=")+1);
			tc=tc.substring(tc.indexOf("=")+1,tc.indexOf("&"));
			return tc;
		}else{
			if(arrqs==""){
			arrqs=c.split("&");
			}
			if(!x) return arrqs.length;
			else{
				try{
					tc=arrqs[x-1];
				}catch(e){
					return "";
				}
				tc=tc.substr(tc.indexOf("=")+1);
				return tc  ;
			}
			
		}		
	}	
	this.count=c==""?0:(arrqs==""?(arrqs=c.split("&")).length:arrqs.length);	
	this.Cookies=function(cookieName, dfltValue){
			  var cookieStr = document.cookie; 
			  if (!cookieName) return cookieStr;
			  if(typeof dfltValue=="undefined") dfltValue="";
			  var lowerCookieName = cookieName.toLowerCase();
			  if (cookieStr == ""){
	 			 return dfltValue;
  			  }
    
			  var cookieArr = cookieStr.split("; ");
			  var pos = -1;
			  for (var i=0; i<cookieArr.length; i++)
			  {
				  pos = cookieArr[i].indexOf("=");
				  if (pos > 0)
				  {
					  if (cookieArr[i].substring(0, pos).toLowerCase() == lowerCookieName)
					  {
						  return unescape(cookieArr[i].substring(pos+1, cookieArr[i].length));
					  }
				  }
			  }			  
			  return dfltValue;		
		};

}
function clsResponse(){
	 this.Cookies=function(cookieName, cookieValue, expires){
		  if (expires){
			   //指定了 expires
				var d=new Date();
				d.setMonth(d.getMonth()+expires);
				expires = d.toGMTString();
		       document.cookie = this.eCookies(cookieName) + "=" + escape(cookieValue) + "; expires=" + expires;
		  }else{
			  document.cookie = this.eCookies(cookieName) + "=" + escape(cookieValue);
		  }
	  }
	  
	  
	  this.eCookies=function(cookieName){
		  
		  var lowerCookieName = cookieName.toLowerCase();
		  var cookieStr = document.cookie;
		  
		  if (cookieStr == ""){
			  return cookieName;
		  }
		  
		  var cookieArr = cookieStr.split("; ");
		  var pos = -1;
		  for (var i=0; i<cookieArr.length; i++)
		  {
			  pos = cookieArr[i].indexOf("=");
			  if (pos > 0)
			  {
				  if (cookieArr[i].substring(0, pos).toLowerCase() == lowerCookieName)
				  {
					  return cookieArr[i].substring(0, pos);
				  }
			  }
		  }
		  
		  return cookieName;
	  }
	  this.Redirect=function(url){document.location=url;}
	  this.write=function(x){document.writeln(x+"<br>");}
}