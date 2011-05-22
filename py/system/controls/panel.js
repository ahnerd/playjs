//===========================================
//  Panel.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.ContainerControl");



/**
 * 内容显示面板。
 * @class Panel
 * @extends Control
 */
Py.namespace("Py", "Panel", Py.ContainerControl.extend({
	
	/**
	 * 默认配置。
	 * @type Object
	 */
	options: {
		size: new Py.Point(200, 300)
	},
	
	/**
	 * xType
	 * @type String
	 */
	xType: 'panel'
	
}));


