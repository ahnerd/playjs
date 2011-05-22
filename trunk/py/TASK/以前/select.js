//===============================================
// class - select
// copyright:xuld
// edited by xuld
// 使用方法:
// var Select=new cls_select(
//					id,     // id
//					arr,    // 列表 [array]  arr[0][0] 值 arr[0][1]  value
//					size,   // 列表 大小
//					multi,  // 多选
//					cf      //  改变列表项执行的函数名  （不含参数  默认为选择的内容)  cf=alert    可以输出选择的内容
//                          //  如果需要更新按钮  cf=state('可删','上移','下移');
//			  );
// Select.creat()           //  创建
// Select.add(o,t,i)        //  添加  o  为 文本   t 为值    i为顺序  默认最后
// Select.del(i)            //   删除  i  可以为  索引   值
// Select.dels()            //   删除选中
// Select.gets()            //  获取 多项:选中的项 列表 [array]   单项  选中的列表
// Select.state()           //  更新状态( Select.hc ; 选中?  Select.canup  :  能上移    Select.candown  :  能下移   ） 
//							    如果含有3个参数，将使这3个参数所有id的对象不可用
// Select.moveon(k,i)       // 移动 第i个 默认选中 k位  （k==0 不移动 k==1 下移一个  k==-1 上移 ）
// Select.movetop(i)        // 移动 第i个 默认选中  顶部
// Select.movedown(i)       // 移动 第i个 默认选中  最后
// Select.getall()          //  全部内容
// Select.getsall ()        //    多项:选中的项 列表 [array] 值  单项  选中的值
//===============================================
try{
	var Select=new cls_select("objselect");
}catch(e){
}
function cls_select(id,arr,size,multi,cf){
	var objselect=document.getElementById(id);
	size=size||9;
	if(typeof cf=="undefined")cf=""
	else if(cf.indexOf("state")<0)cf+="(this.value)";
	if(typeof multi=="undefined") multi=true;
	var al=!arr?0:arr.length;
	this.creat=function(){
		document.write("<select name='"+id+"' size='"+size+"'")
		if(multi) document.write(" multiple='multiple'");
		document.write(" id='"+id+"' onchange='"+cf+"'>");
		for(i=0;i<al;i++){
			document.write("<option value='"+al[i][1]+"'>"+al[i][0]+"</option>");
		}
		document.write("</select>");
		objselect=document.getElementById(id);
	}
	this.add=function(o,t,i){
		if(typeof i=="undefined") i=objselect.length;
		if (window.navigator.userAgent.indexOf("MSIE") > 0) {
				var option = document.createElement("option");
				option.innerText = o;
				option.value =t;
				objselect.insertBefore(option, objselect.options[i]);
		}else{              // for Firefox
				objselect.insertBefore(new Option(o, t), selectCtl.options[0]);
		}
	}
	
	this.del=function(i){
		if(isNaN(i)){
			for(var k=0;k<objselect.length;k++)
				if(objselect.item(i).value==i) return this.del(k);
		}else{
			objselect.remove(i);
			try{
				objselect.selectedIndex=i;
			}catch(e){
				};
		}
		return true;
	}
	this.gets=function(){
		if(multi){
			al=objselect.length;
			var arr=new Array(al);
			for(i=0;i<al;i++)
				if(objselect.item(i).selected) arr[k++]=i;
			return arr;
		}else{
			return objselect.selectedIndex;
		}
	
	}
	this.state=function(){
		this.hc=objselect.selectedIndex>=0;
		this.canup=objselect.selectedIndex>0;
		this.candown=objselect.selectedIndex>0 && objselect.selectedIndex<objselect.length;
		if(arguments.length){
			try{
				document.getElementById(arguments[0]).disabled=!this.hc;
				document.getElementById(arguments[1]).disabled=!this.canup;
				document.getElementById(arguments[2]).disabled=!this.candown;
			}catch(e){}
		}
	
	}
	
	this.dels=function(){
		if(multi){
			pc=-1;
			for(i=0;i<objselect.length;i++)
				if(objselect.item(i).selected) objselect.remove(pc=i--);
			if(pc>=0)objselect.selectedIndex=pc>=objselect.length?pc-1:pc;
		}else{
			this.del(objselect.selectedIndex);
		}
	}
	this.moveon=function(k,i){
	  if(typeof i=="undefined") i=objselect.selectedIndex;
	  if(i<0 || i+k>=objselect.length || i+k<0) return false;
	  option_value=objselect.item(i).value;
	  option_text=objselect.item(i).text;
	  objselect.item(i).value=objselect.item(i+k).value;
	  objselect.item(i).text=objselect.item(i+k).text;
	  objselect.item(i+k).value=option_value;
	  objselect.item(i+k).text=option_text;
	  objselect.selectedIndex=i+k;
    }
	this.movetop=function(i){this.moveon(-objselect.selectedIndex,i);}
	this.movetbottom=function(i){this.moveon(objselect.length-objselect.selectedIndex-1,i);}
	this.getall=function(){
		var arr=new Array(objselect.length);
		for(i=0;i<objselect.length;i++)
			 arr[i]=objselect.item(i).value;
		return arr;
	
	}
	this.getsall=function(){
		if(multi){
			var k=0;
			var arr=new Array();
			for(i=0;i<objselect.length;i++)
				if(objselect.item(i).selected) arr[k++]=objselect.item(i).value;
			return arr;
		}else{
			return objselect.item(objselect.selectedIndex) .value;
		}
	}
}
