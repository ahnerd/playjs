//===========================================
//  控件   control.js         A
//===========================================


/// #ifndef SupportUsing
/// #define imports
/// #endif
	
/// #ifdef SupportUsing

Object.extendIf(Py, {
		
	/**
	 * 如果使用了 UI 库，则 theme 表示默认皮肤。
	 * @config {String}
	 * @value 'default'
	 */
	theme: 'default',
	
	/**
	 * 如果使用了 UI 库，则  resource 表示公共的主题资源。
	 * config {String}
	 * @value 'share'
	 */
	resource: 'share',
	
	/**
	 * 导入一个名字空间的资源。
	 * @static
	 * @param {String} resource 资源地址。
	 * @param {Array} [theme] 主题。
	 * theme 定义了使用的主题， 他会替换 resource 内的 * ， 
	 * 比如 imports("Resources.*.Text", ["v", "f"]) 
	 * 实际上是  imports("Resources.v.Text")  imports("Resources.f.Text") 
	 * 如果 resource 有 * ，但用户未提供 theme ， 则使用   [Py.resource, Py.theme] 。
	 * <br>
	 * 有关名字空间的说明， 见 {@link namespace} 。
	 * @example
	 * <code>
	 * imports("Resources.*.Text");
	 * </code>
	 */
	imports: imports
	
});


function imports(resource, theme){

	assert(resource && resource.indexOf, "imports(resource, theme): 参数 {resource} 不是合法的名字空间。", resource);
	assert(!theme || Object.isArray(theme), "imports(resource, theme): 参数 {theme} 必须是数组或省略。");

	if(resource.indexOf('*') > -1) {
	 	(theme || [Py.resource, Py.theme]).forEach(function(value) {
			using(resource.replace('*', value), true);
		});
	} else {
		using(resource.replace('~', Py.resource), true);
	}
}
	
/// #endif


imports("Resources.*.Control.Core");
using("System.Dom.Element");


(function(p) {
		
	/**
	 * 所有控件基类。
	 * @class Control
	 * @abstract
	 * @extends Element
	 * 控件的周期：
	 * constructor  -  创建控件对于的 Javascript 类。 不建议重写，除非你知道你在做什么。
	 * create - 创建本身的 dom 节点。 可重写 - 默认使用  this.tpl 创建。
	 * init - 初始化控件本身。 可重写 - 默认为无操作。
	 * renderTo - 渲染控件到文档。 不建议重写，如果你希望额外操作渲染事件，则重写。
	 * dispose - 删除控件。不建议重写，如果一个控件用到多个 dom 内容需重写。
	 */
	var Control = namespace(".Control", p.Class({
		
		/**
		 * 封装的节点。
		 * @type Element
		 */
		dom: null,
	
		/**
		 * 根据一个节点返回。
		 * @param {String/Element/Object} [options] 对象的 id 或对象或各个配置。
		 */
		constructor: function (options) {
			
			// 这是所有控件共用的构造函数。
			
			var me = this,
			
				// 临时的配置对象。
				opt = Object.clone.call(1, me.options) || {},
				
				// 当前实际的节点。
				dom;
			
			// 如果存在配置。
			if (options) {
				
				// 如果参数是一个 DOM 节点或 ID 。
				if (typeof options == 'string' || options.nodeType) {
					
					// 直接赋值， 在下面用 $ 获取节点 。
					dom = options;
				} else {
					
					// 否则 options 是一个对象。
					
					// 保存 dom 。
					dom = options.dom;
					delete options.dom;
					
					// 复制成员到临时配置。
					Object.extend(opt, options);
				}
			}
			
			// 如果 dom 的确存在，使用已存在的， 否则使用 create(opt)生成节点。
			me.dom = dom ? p.$(dom) : me.create(opt);
			
			assert(me.dom && me.dom.nodeType, "Control.prototype.constructor(options): 当前实例的 dom 属性为空，或此属性不是 DOM 对象。(检查 options.dom 是否是合法的节点或ID(options 或 options.dom 指定的ID的节点不存在?) 或当前实例的 create 方法是否正确返回一个节点)\r\n当前控件: {dom} {xType}", me.dom, me.xType);
			
			// 调用 init 初始化控件。
			me.init(opt);
			
			// 复制各个选项。
			Object.set(me, opt);
		},
		
		/**
		 * 当被子类重写时，生成当前控件。
		 * @param {Object} options 选项。
		 * @protected
		 */
		create: function() {
			
			assert(this.tpl, "Control.prototype.create(): 当前类不存在 tpl 属性。Control.prototype.create 会调用 tpl 属性，根据这个属性中的 HTML 代码动态地生成节点并返回。子类必须定义 tpl 属性或重写 Control.prototype.create 方法。");
			
			// 转为对 tpl解析。
			return Element.parse(this.tpl);
		},
		
		/**
		 * 当被子类重写时，渲染控件。
 		 * @method
 		 * @param {Object} options 配置。
 		 * @protected
		 */
		init: Function.empty,
		
		/**
		 * xType 。
		 */
		xType: "control",
		
		/**
         * 复制属性。
         * @param {Boolean} copyListener (默认 false )是否复制事件。
         * @param {Boolean} contents  (默认 true )是否复制子元素。
         * @param {Boolean} keepid  (默认 false )是否复制 id 。
         * @return {Element} 元素。
         */
		clone: function(copyListener, contents, keepid) {
			
			// 创建一个控件。
			var newControl = this.memberwiseClone();

			newControl.dom = this.dom.clone(copyListener, contents, keepid);
				
			return p.cloneData(newControl, this);

		}
		
	}));
		
	for(var key in Py.ElementList.prototype){
		if(Element.prototype[key])
			Control.prototype[key] = Element.prototype[key];
	}
	
	// 在上面的循环中， Control.prototype.constructor 会被覆盖， 这里重新覆盖。
	Control.prototype.constructor = Control;

	Object.extend(Control, {
		
		/**
		 * 设置类的基类。
		 * @static
		 * @type Element
		 */
		base: Element,
		
		/**
		* 将指定名字的方法委托到当前对象指定的成员。
		* @static
		* @param {Object} control 类。
		* @param {String} delegate 委托变量。
		* @param {String} methods 所有成员名。
		* @param {Number} type 类型。 1 - 返回委托返回 2 - 返回本身 3 - 返回自己，参数作为控件。 4 - 增加事件调用。 5 - 返回参数1， 参数1和2作为控件。
		* @param {String} [m2] 成员。
		* @param {String} [t2] 类型。
		*/
		delegate: function(control, delegate, methods, type, m2, t2, m3, t3) {
			
			if (m2) 
				arguments.callee(control, delegate, m2, t2, m3, t3);
			
			assert(control && control.prototype, "Control.delegate(control, delegate, methods, type, m2, t2): 参数 {control} 必须是一个类", control);
			assert.isNumber(type, "Control.delegate(control, delegate, methods, type, m2, t2): 参数 {type} ~。");
			
			if(type === 4){
				var onName = 'on' + delegate;
				delegate = delegate.toLowerCase();
				if(!(onName in control.prototype))
					control.prototype[onName] = function(){
						this.trigger(delegate);
					}; 
			}
			
			String.map(methods, function(name) {
				switch (type) {
					case 2:
						return function() {
							var me = this[delegate];
							me[name].apply(me, arguments);
							return this;
						};
					case 3:
						return function(ctrl, args) {
							return this[delegate][name](ctrl && ctrl.dom || ctrl, args);
						};
					case 4:
						return  function(args1, args2){
							this.dom[name](args1, args2);
							this[onName]();
							return this;
						};
					case 5:
						return function(newControl, childControl) {
							return this[delegate][name](newControl && newControl.dom || newControl, childControl ? childControl.dom || childControl : null);
						};
					default:
						return function() {
							var me = this[delegate];
							return me[name].apply(me, arguments);
						};
				}
			}, control.prototype);
			
			return arguments.callee;
		},
		
		/**
		 * 获取一个唯一的用来代理元素。
		 * @static
		 * @param {String} className 类名。
		 * @return {Element} 元素。
		 */
		getProxy: function(className){
			var p = Control._proxy;
			if(!p){
			
				p = Control._proxy = document.create('div', 'x-proxy')
					.hide()
					.renderTo();
					
				/**
				 * 打开代理元素。
				 */
				p.mask = function(elem){
					
					return this.show()
							.setOffset(elem.getPosition())
							.setSize(elem.getSize());
				};
			}
			
			p.className = 'x-proxy ' + className;
			return p;
		}

	});
	
	Control.delegate(Control, "dom", 'addEventListener removeEventListener scrollIntoView focus blur remove', 2, 'appendChild contains insert replaceWith wrapWith removeChild bringToFront', 3, 'insertBefore replaceChild', 5);

	// 让 Element 扩展的时候， 自动扩展 Control 。
	Element.implementTargets.push(Control.prototype);

	


})(Py);


