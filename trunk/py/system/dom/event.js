
using("common");

if(namespace("playEvent")){
	
	playEvent = function(){
		var Event = {
				
				//---------------------------------------
				//��
				//---------------------------------------
				
				//����¼�
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
				//����
				//---------------------------------------	
				
				//���λ��
				mouseX : function(e){
					if(browser.isIE || browser.isOpera){
						return event.clientX+(document.documentElement&&document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
					}else{
						e = playEvent.getEvent();
						return e.pageX;
					}
				},
				
				//���λ��
				mouseY : function(e){
					if(browser.isIE || browser.isOpera){
						return event.clientY+(document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
					}else{
						e = playEvent.getEvent();
						return e.pageY;
					}
				},
		
				//���λ��
				mouseXY : function(e){
					if(browser.isIE || browser.isOpera){
						return [event.clientX+(document.documentElement&&document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft),event.clientY+(document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)];
					}else{
						e = playEvent.getEvent();
						return {x:e.pageX,y:e.pageY};
					}
				},
				
				//������λ��
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
	
				//�ж��Ƿ��Ҽ�
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
				
				//��ü�
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
							return "δָ��";
					}
					
				},
	
				//---------------------------------------
				//����
				//---------------------------------------	
				//���һ���¼�
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
							
				//ֹͣ�¼�����
				stopon : function(){
					playEvent.getEvent().cancelBubble = true;
				},
				
				//ֹͣ��ʾ����
				stopError : function() {
					 window.onerror = ignoreError = function(){return true}
				},
				
				//ֹͣһ���¼�
				stopEvent : function(o,a,f){
					if(f===undefined){
						f = a;a = o;o = document;
					}
					o = typeof o=="string"?document.getElementById(o):(o?o:document);
					eval("o.on" + a +" = function(){}");
				},
				
				//ִ��һ���¼�
				onEvent : function(o,a,f){
					if(f===undefined){
						f = a;a = o;o = document;
					}
					o = typeof o=="string"?document.getElementById(o):(o?o:document);
					eval("o.on" + a +"()");
				},
				
				//ɾ��һ���¼�
				un : function(o,a,f){
					if(f===undefined){
						f = a;a = o;o = document;
					}
					o = typeof o=="string"?document.getElementById(o):(o?o:document);
					eval("o.on" + a +" = undefined;");
				},

				//---------------------------------------
				//����
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
			
			//����Ѽ���  common.js  ���������Բ���
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









var Event = new Type('Event', function(event, win){
	if (!win) win = window;
	var doc = win.document;
	event = event || win.event;
	if (event.$extended) return event;
	this.$extended = true;
	var type = event.type,
		target = event.target || event.srcElement,
		page = {},
		client = {};
	while (target && target.nodeType == 3) target = target.parentNode;

	if (type.indexOf('key') != -1){
		var code = event.which || event.keyCode;
		var key = Object.keyOf(Event.Keys, code);
		if (type == 'keydown'){
			var fKey = code - 111;
			if (fKey > 0 && fKey < 13) key = 'f' + fKey;
		}
		if (!key) key = String.fromCharCode(code).toLowerCase();
	} else if (type.test(/click|mouse|menu/i)){
		doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
		page = {
			x: (event.pageX != null) ? event.pageX : event.clientX + doc.scrollLeft,
			y: (event.pageY != null) ? event.pageY : event.clientY + doc.scrollTop
		};
		client = {
			x: (event.pageX != null) ? event.pageX - win.pageXOffset : event.clientX,
			y: (event.pageY != null) ? event.pageY - win.pageYOffset : event.clientY
		};
		if (type.test(/DOMMouseScroll|mousewheel/)){
			var wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
		}
		var rightClick = (event.which == 3) || (event.button == 2),
			related = null;
		if (type.test(/over|out/)){
			related = event.relatedTarget || event[(type == 'mouseover' ? 'from' : 'to') + 'Element'];
			var testRelated = function(){
				while (related && related.nodeType == 3) related = related.parentNode;
				return true;
			};
			var hasRelated = (Browser.firefox2) ? testRelated.attempt() : testRelated();
			related = (hasRelated) ? related : null;
		}
	} else if (type.test(/gesture|touch/i)){
		this.rotation = event.rotation;
		this.scale = event.scale;
		this.targetTouches = event.targetTouches;
		this.changedTouches = event.changedTouches;
		var touches = this.touches = event.touches;
		if (touches && touches[0]){
			var touch = touches[0];
			page = {x: touch.pageX, y: touch.pageY};
			client = {x: touch.clientX, y: touch.clientY};
		}
	}

	return Object.append(this, {
		event: event,
		type: type,

		page: page,
		client: client,
		rightClick: rightClick,

		wheel: wheel,

		relatedTarget: document.id(related),
		target: document.id(target),

		code: code,
		key: key,

		shift: event.shiftKey,
		control: event.ctrlKey,
		alt: event.altKey,
		meta: event.metaKey
	});
});

Event.Keys = {
	'enter': 13,
	'up': 38,
	'down': 40,
	'left': 37,
	'right': 39,
	'esc': 27,
	'space': 32,
	'backspace': 8,
	'tab': 9,
	'delete': 46
};





    
    /**
     * 获取事件的合法键。
     */
    function getKey(){
        var e = this, code = e.which || e.keyCode;
        var key = Object.keyOf(Event.Keys, code);
        if (!key) 
            key = String.fromCharCode(code).toLowerCase();
        return key;
    }
    
    
    function getPageX(){
        var e = this, doc = document.documentElement, body = document.body;
        return e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
    }
    
    function getPageY(){
        var e = this, doc = document.documentElement, body = document.body;
        return e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }
    
    function getMetaKey(){
        return this.ctrlKey;
    }
    
    function srcElement(){
        var target = this.target;
        if (target.nodeType === 3) {
            target = target.parentNode;
        }
        return target;
    }
    
    /**
     * 获得当前事件按键。
     * @return 1 ： 单击  2 ：  中键点击 3 ： 右击
     */
    function getWhich(){
        var button = this.button;
        return (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
    }
    

	 
	
	



         function createEventArgs(e){
         if ( !e.relatedTarget && e.fromElement ) {
         e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
         }
         if (e.pageX == null && e.clientX != null) {
         e.pageX = e.clientX + (d.documentElement.scrollLeft || d.body.scrollLeft);
         e.pageY = e.clientY + (d.documentElement.scrollTop || d.body.scrollTop);
         }
         //  1 ： 单击  2 ：  中键点击 3 ： 右击
         if (!e.which && e.button !== undefined) {
         e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
         }
         }
         
         
        
         
         Dom.addListener = function(type, fn){
	         var me = this, d = p.data(me, 0), evt = d[type];
	         if (!evt) {
	        	evt = d[type] = true;
	         	me.addEvent(type, fn, p.Events[type] || createEventArgs);
	         }
	         me.addEvent(type, fn);
         }; 
		   