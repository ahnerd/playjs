//===========================================
//  事件监听器   Listener.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================
using("System.Delegate");
using("System.EventArgs");


/// <summary>
/// 事件句柄
/// </summary>
/// <class name="Listener" extend="Delegate" />
/// <example>
/// elem.onclick = new Listener(handler1,handler2...);
/// elem.onclick.add(handler);
/// elem.onclick.remove(handler);
/// elem.onclick.removeAt(0);
/// elem.onclick.clear();
/// elem.onclick(); //触发Listener。
/// </example>
var Listener = Py.Listener = Delegate.extend({

	/// <constructor name="Listener" />
	constructor :  function(){
		var notIE = !navigator.isIE,
            fn = function(event){
    			var target = fn.target || this, e = EventArgs.create(event, arguments, fn.type, target), r, t = e.currentTarget;
    			if(e.cancel !== true)
                    fn.handlers.each(function(handler){
    					r = handler.call(t, e);
    					
    					return (e.returnValue = e.returnValue !== false && r !== false) && e.cancel !== true;
    					
    				});
    			
    			
    			r = !e.returnValue;
                
                
    			if(r){
    				if(notIE || e.cancelBubble === true)e.stopPropagation();
    				if(notIE && e.canStop !== false && e.returnValue === false)e.preventDefault();
    				if(!notIE) e.returnValue = e.canStop === false || !(e.cancelBubble = r);
    			}
    			return e.returnValue;
    		};
    	
    	var handlers = fn.handlers = Array.create(arguments);
		while(handlers.length && typeof handlers[0] != "function")
			handlers.shift();
		return fn;
	},
	
	/// <summary>
	/// xType
	/// </summary>
	/// <type name="String" />
	/// <const />
	xType : "Listener"
	
			
});



