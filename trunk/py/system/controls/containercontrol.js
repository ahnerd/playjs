//===========================================
//  容器         containercontrol.js         A
//===========================================


using("System.Controls.ScrollableControl");

/**
 * 内容显示面板。
 * @class ContainerControl
 * @abstract
 * ContainerControl 控件提供了由 header - container - footer 三部分组成的容器。
 * 在未实现 HTML5 的浏览器中， ContainerControl 将使用图片实现圆角。
 */
namespace(".ContainerControl", Py.ScrollableControl.extend({
	
	heightFix: 43,
	
	widthFix: navigator.isIE6 ? 12 : 10,
	
	/**
	 * 模板。
	 * @type String
	 */
	tpl: '<div>\
                <div class="x-header">\
                    <div class="x-header-container">\
                    	<div class="x-header-content">\
                    		<h3>&nbsp;</h3>\
						</div>\
                    </div>\
                </div>\
                <div class="x-body">\
                    <div class="x-body-container">\
	                    <div class="x-body-content">\
		                    \
		                </div>\
	                </div>\
                </div>\
                <div class="x-footer">\
                    <div class="x-footer-container">\
                        <div class="x-footer-content"></div>\
                    </div>\
                </div>\
            </div>\
            ',
	
	/**
	 * 当被子类重写时，渲染控件。
 	 * @method init
 	 * @param {Object} [options] 配置。
 	 * @protected
	 */
	init: function(options) {
		var me = this,
			xType =  'x-' + me.xType,
			footer = me.get(2);
		me.dom.className = xType;
		me.header = me.get(0).addClass(xType + '-header').find('h3');
		me.content = me.get(1).addClass(xType + '-body').get(0).addClass(xType + '-container').get(0).addClass(xType + '-content');
		footer.addClass(xType + '-footer');
		
		if(me.content.style.width)
			me.dom.setWidth(me.getWidth() + this.widthFix);
// 		
		// // 如果小于 0， 说明 当前组件的 height/widthFix  未初始化。
		// if(me.heightFix < 0) {
			// me.constructor.prototype.heightFix = Element.getSizes(me.header, "y", "mbp") + Element.styleNumber(me.header, "height")
				// + Element.getSizes(footer, "y", "mbp") + Element.styleNumber(footer, "height");
// 			
		// }
		
		me.initChildren();
	},
	
	/**
	 * 重写以实现子控件管理。
	 * @protected 
	 */
	initChildren: Function.empty,
	
	/**
	 * 关闭当前 Panel， 并释放资源。
	 * @method close
	 * @return {Panel} this
	 */
	close: function() {
		return this.dispose();
	}


}) );