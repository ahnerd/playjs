//===========================================
//  AbsoluteLayout.js
//  Copyright(c) 2009-2011 xuld
//============================================

Py.using("System.Controls.Layout.LayoutEngine");
Py.imports("Resources.share.Layout.Absolute");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.AbsoluteLayout = Py.Layout.LayoutEngine.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'absolute',
	
	name: 'absolute',
	
	initLayoutCore: function(container){
		Py.Element.setMovable(container.content);
	}
	
}));



