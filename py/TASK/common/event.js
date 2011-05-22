/*  事件处理通用程序 

*/

using("common");

if(namespace("playEvent")){
	
	playEvent = function(){
		var Event = {
				
				//---------------------------------------
				//基本
				//---------------------------------------
				
				//获得事件
				getEvent : function(){
					if(browser.isIE || browser.isOpera)    return window.event;        
					f=playEvent.getEvent.caller;            
					while(f!=null){    
						var arg0=f.arguments[0];
						if(arg0){
							if( (arg0.constructor==Event || arg0.constructor ==MouseEvent) || (typeof arg0 =="object" && arg0.preventDefault && arg0.stopPropagation)){    
								return arg0;
							}
						}
						f=f.caller;
					}
					return null;
				}, 
				
				//---------------------------------------
				//输入
				//---------------------------------------	
				
				//鼠标位置
				mouseX : function(e){
					if(browser.isIE || browser.isOpera){
						return event.clientX+(document.documentElement&&document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
					}else{
						e = playEvent.getEvent();
						return e.pageX;
					}
				},
				
				//鼠标位置
				mouseY : function(e){
					if(browser.isIE || browser.isOpera){
						return event.clientY+(document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
					}else{
						e = playEvent.getEvent();
						return e.pageY;
					}
				},
		
				//鼠标位置
				mouseXY : function(e){
					if(browser.isIE || browser.isOpera){
						return [event.clientX+(document.documentElement&&document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft),event.clientY+(document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)];
					}else{
						e = playEvent.getEvent();
						return {x:e.pageX,y:e.pageY};
					}
				},
				
				//鼠标相对位置
				offsetX : function(e){
					return e = playEvent.getEvent().offsetX;
				},
		
				offsetY : function(e){
					return e = playEvent.getEvent().offsetY;
				},
		
				offsetXY : function(e){
					e = e = playEvent.getEvent();
					return {x:e.offsetX,y:e. offsetY};
				},
	
				//判断是否右键
				isRightClick : function(){
					if(browser.isIE || browser.isOpera){
						return event.button == 2;
					}else{
						e = playEvent.getEvent();
						return e.which == 3;
					}
					
					
				},
				
				isCtrl : function(e){
					return  (e || playEvent.getEvent()).ctrlKey;
				},
		
				isCtrlEnter : function(e){
					var E = (e || playEvent.getEvent());
					return  E.ctrlKey && E.keyCode == 13;
				},
				
				isShift : function(e){
					return  (e || playEvent.getEvent()).shiftKey;
				},			
	
				isEnter : function(e){
					return  (e || playEvent.getEvent()).keyCode == 13;
				},
				
				isAlt : function(e){
					return  (e || playEvent.getEvent()).altKey;
				},
				
				isACtrl : function(e){
					var E = (e || playEvent.getEvent());
					return  E.ctrlKey && E.altKey;
				},	
				
				isEmpty : function(e){
					var E = (e || playEvent.getEvent());
					return  E.keyCode == 32 || E.keyCode == 9;
				},
				
				isNumber : function(e){
					var E = (e || playEvent.getEvent());
					return  E.keyCode == 13;
				},
				
				//获得键
				getKey : function(e){
					var down = (e || playEvent.getEvent()).keyCode;
					if(down==91) return "Windows";
					if(down==93) return "Menu";
					if(down==222) return "\'";
					if(down >= 48 && down <=91)
						return String.fromCharCode(down);	
					if(down >= 112 && down <=135)
						return "F" + ((down-112) + 1);						
					if(down >= 188 && down <=191)
						return String.fromCharCode(down-128);	
					if(down >= 96 && down <=105)
						return String.fromCharCode(down-48);	
					if(down >= 219 && down <=229)
						return String.fromCharCode(down-128);	
					switch(down){
						case 17:
							return "Ctrl";
						case 32:
							return " ";
						case 16:
							return "Shift";	
						case 18:
							return "Alt";	
						case 19:
							return "Pause";	
						case 13:
							return "\n";	
						case 40:
							return "Down";
						case 38:
							return "Up";
						case 37:
							return "Left";
						case 39:
							return "Right";
						case 45:
							return "Insert";								
						case 46:
							return "Delete";
						case 35:
							return "End";	
						case 109:
							return "-";
						case 36:
							return "Home";	
						case 106:
							return "*";
						case 111:
							return "/";
						case 107:
							return "=";
						case 9:
							return "Tab";
						case 8:
							return "Backspace";
						case 27:
							return "ESC";
						case 144:
							return "Num_Lock";
						case 34:
							return "Page_Down";
						case 145:
							return "Scroll_Lock";		
						case 33:
							return "Page_Up";										
						case 3:
							return "Break";
						case 0:
							return "";
						case 192:
							return "'";
							
						default:
							return "未指定";
					}
					
				},
	
				//---------------------------------------
				//处理
				//---------------------------------------	
				//增加一个事件
				on : function(o,a,f){
					if(f===undefined){
						f = a;a = o;o = document;
					}
					o = typeof o=="string"?document.getElementById(o):(o?o:document);
					eval("o.on" + a +" = F(o.on" + a+ ",f);");
				},
				
				oncontextmenu : function(o,f){
					o = o?o:document;
					o.oncontextmenu = F(o.oncontextmenu,f);
				},
		
				onclick : function(o,f){
					o = o?o:document;
					o.onclick = F(o.onclick,f);
				},
							
				//停止事件传递
				stopon : function(){
					playEvent.getEvent().cancelBubble = true;
				},
				
				//停止显示错误
				stopError : function() {
					 window.onerror = ignoreError = function(){return true}
				},
				
				//停止一个事件
				stopEvent : function(o,a,f){
					if(f===undefined){
						f = a;a = o;o = document;
					}
					o = typeof o=="string"?document.getElementById(o):(o?o:document);
					eval("o.on" + a +" = function(){}");
				},
				
				//执行一个事件
				onEvent : function(o,a,f){
					if(f===undefined){
						f = a;a = o;o = document;
					}
					o = typeof o=="string"?document.getElementById(o):(o?o:document);
					eval("o.on" + a +"()");
				},
				
				//删除一个事件
				un : function(o,a,f){
					if(f===undefined){
						f = a;a = o;o = document;
					}
					o = typeof o=="string"?document.getElementById(o):(o?o:document);
					eval("o.on" + a +" = undefined;");
				},

				//---------------------------------------
				//对象
				//---------------------------------------			
				xType : "playEvent",
				
				init : function(){
					if(playEvent.ready==true) return;
					var eventcom = "contextmenu,mousedown,blur,focus,dblclick,help,scroll,change,keydown,keyup,mouseup,mouseover,submit,load,unload,resize,selece,change";
					eventcom.split(",").forEach(function(v){
						eval("Event.on{0} = function(o,f){\no = o?o:document;\no.on{0} = F(o.on{0},f);\n}".format(v,true));
					});	
					playEvent.ready = true;
				},
				
				ready : false
				
			};
			
			if(window.jsExtend) playEvent.init();
			
			//如果已加载  common.js  以下这个可以不用
			//-------------------------------------------------
			else{
							
				if(window.onload){
					
					var _onload = window.onload;
					window.onload = function(){playEvent.init();_onload();}
				}
				else
					window.onload = function(){playEvent.init();}
					
			}
						
			
			//-------------------------------------------------
			return Event;
			
		}()
	
}




function using(arg){var arg1,argx ,win = "playjs/";if(arg.indexOf(":")>0){argx = arg.split(":");arg1 = argx[1].split(",");arg1 = arg1[arg1.length-1];arg = argx[0];}else{arg1 = arg.split(".");arg1 = arg1[arg1.length-1];arg1 = arg1.indexOf("play")>0?arg1:"play" + arg1.charAt(0).toUpperCase() + arg1.substr(1);}if(arg.indexOf(".")==-1)arg = (win+arg+"/"+arg) + ".js";else arg = win+arg.replace(/\./ig,"/") +".js";if(setted(arg1)) set(arg,function(){eval("if(typeof "+ arg1 +"==\"undefined\") alert(\"本页需要文件:"+ arg.replace(win,"Pyjs/")+"\");");});	function setted(v){return eval("typeof " + v)=="undefined"} function set(arg,f){if(window.playjs){playjs.loadJs(arg,f)} else{document.write("\n<script type=\"text/javascript\" src=\"" + arg + "\"><\/script>\n");if(window.onload){var c = window.onload;window.onload = function(){c();f();}}else{window.onload = f}}}}


function namespace(arg){if(window._system)window._system.push(arg);else window._system = [arg];return eval('typeof ' + arg + '=="undefined" || ' + arg + '.xType != "' + arg + '"');}