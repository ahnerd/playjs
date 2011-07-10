//===========================================
// 自动布局       flowlayout.js         A
//===========================================

Py.using("System.Controls.Layout.LayoutEngine");
Py.imports("Resources.~.Layout.Flow");



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




