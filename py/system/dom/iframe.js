//===========================================
//  元素   Dom.js
//  Copyright(c) 2009-2010 xuld
//===========================================
Py.using("System.Dom.Element");

/**
 * IFrame
 * @class IFrame
 */
Py.namespace(".IFrame", Py.Control.extend({
	
	xType: 'iframe',
	
	tpl: '<iframe src="about:blank"></iframe>',
	
	onReady: function(){
		var me = this;
		me.update();
		me.isReady = true;
		me.trigger('ready');
	},
	
	init: function(){
		var elem = this;
		this.dom.renderTo(true);
		if(navigator.isStd){
			setTimeout(function(){
				if (elem.dom.contentWindow.document.URL != 'about:blank')
					elem.onReady();
				else
					setTimeout(arguments.callee, 10);
			}, 20);
		} else {
				elem.on('load', elem.onReady);
		}
	},
	
	getDom: function(){
		return this.dom.contentWindow.document;
	},
	
	update: function(){
		var me = this;
		Py.setupWindow(me.window = me.dom.contentWindow);
		
		if(!navigator.isStd){
			me.window.document.getDom = function(){
				return this.body;
			};
		}
		return me;
	},
	
	ready: function(fn){
		this.on('ready', fn);
	}

}).addEvents({
	
	ready: {
		
		add: function(elem, type, fn){
			if(elem.isReady) fn.call(elem);
		},
		
		trigger: Py.Events.element.ready.trigger
	}
	
}));
	
	
