//===========================================
//  容器         containercontrol.js         A
//===========================================


Py.using("System.Controls.ScrollableControl");

/**
 * 内容显示面板。
 * @class ContainerControl
 * @abstract
 * ContainerControl 控件提供了由 header - container - footer 三部分组成的容器。
 * 在未实现 HTML5 的浏览器中， ContainerControl 将使用图片实现圆角。
 */
Py.namespace(".ContainerControl", Py.ScrollableControl.extend({
	
	heightFix: 33,
	
	widthFix: 2,
	
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
                <div class="x-container">\
                    \
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
		var ctrl = this,
			xType =  'x-' + ctrl.xType;
		ctrl.dom.className = xType;
		ctrl.header = ctrl.get(0).addClass(xType + '-header').find('h3');
		ctrl.content = ctrl.get(1).addClass(xType + '-container');
		ctrl.get(2).addClass(xType + '-footer');
		ctrl.initChildren();
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