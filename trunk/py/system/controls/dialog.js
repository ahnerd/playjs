//===========================================
//  对话框                          dialog.js          A
//===========================================

imports("Resources.*.Container.Window");
using("System.Controls.ContainerControl");




/**
 * 窗口。   
 * @class Window
 * @extends Panel
 */
namespace(".Dialog", Py.ContainerControl.extend({
	
	widthFix: 22,
	
	/**
	 * xType
	 * @type String
	 */
	xType: 'dialog',
	
	/**
	 * 默认配置。
	 * @type Object
	 */
	options: {
		renderTo: true,
		layout: 'none',
		size: new Py.Point(600, 379),
		shadow: null,
		alignToCenter: true,
		draggable: true,
		resizable: true,
		bringToFront: 0,
		closable: true // true  -> close   false   -> hide     null  ->   null
	},

	/**
	 * 当被子类重写时，渲染控件。
 	 * @method init
 	 * @param {Object} [options] 配置。
 	 * @protected
	 */
	init: function(options) {
		this.baseCall('init', options);
		if (options.closable != null)
			this.addHeaderItem('x-icon-close', options.closable ? this.close : this.hide, '关闭窗口');
		delete options.closable;
		
		this.on('click', function(){
			this.dom.style.zIndex = Element.zIndex++;
		})  ;
	},
	
	showModal: function() {
		var mask = document.getElementById('py_mask');
		if(!mask){
			mask = Py.$(document.createElement('div')).setAttr('id', 'py_mask').renderTo();
			
			var closeMask = function(){
				document.getElementById('py_mask').style.display = 'none';
			};
			
			p.Class.addCallback(this, 'close', closeMask);
			p.Class.addCallback(this, 'hide', closeMask);
		}
		
		mask.show();
		
	},
	
	/**
	 * 窗口居中。
	 * @return {Window} this
	 */
	alignToCenter: function() {
		var size = this.dom.getSize(), dSize = document.getBound();
		return this.setPosition((dSize.right - size.x) / 2,  (dSize.bottom - size.y) / 2);
		
	}
	
}) )  ;
