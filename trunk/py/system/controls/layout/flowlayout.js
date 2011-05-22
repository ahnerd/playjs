//===========================================
//  FlowLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.Layout.LayoutEngine");



/**
 * @class Py.Layout.FlowLayout
 */
Py.Layout.register(Py.Layout.FlowLayout = Py.Layout.LayoutEngine.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'flow',
	
	name: 'flow',
	
	/**
	 * 初始化布局。
	 * @method initLayout
	 * @param {Control} container 容器的控件。
	 */
	initLayoutCore: function(container){
		
		if(navigator.isIE8){
			
			
			// xuld: It's awfull that IE8 hides empty text nodes between two
			// elements but displays them using a font-size-px space. 
			// We can't access to those text nodes in javascript , at least ,
			// I have not found.
			// Only in Element outerHTML property can we know their exists.
			// e.g. A div.outerHTML can be '\r\n<DIV></DIV>';
			// In standand broswer, we can iterate the child nodes and remove
			// child node if its node type equals 3 (TextNode).
			// But in IE8, whiltespace text nodes are ignored when iterating.
			// (Are they parsed as text node?)
			// finnaly, I have to use this css hack to hide whitespace by 
			// setting their letter space to -9px (font-size / 2) and reset
			// child nodes' letter space to normal value.
			
			container.content.runtimeStyle.letterSpacing = - Py.Element.styleNumber(container.content, 'fontSize') / 2;
		
			return;  
		}
		
		// 删除容器的 text
		for(var node = container.content.firstChild, next; node; node = next){
			next = node.nextSibling;
			if(node.nodeType == 3)
				container.removeChild(node);
		}
	}
	
})  );




