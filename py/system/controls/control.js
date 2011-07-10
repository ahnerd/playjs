//===========================================
//  控件   control.js         A
//===========================================




Py.using("System.Dom.Element");
Py.imports("Resources.*.Control.Core");


(function(p) {
		
	/**
	 * 所有控件基类。
	 * @class Control
	 * @extends Element
	 * 控件的周期：
	 * constructor  -  创建控件对于的 Javascript 类。 不建议重写，除非你知道你在做什么。
	 * create - 创建本身的 dom 节点。 可重写 - 默认使用  this.tpl 创建。
	 * init - 初始化控件本身。 可重写 - 默认为无操作。
	 * renderTo - 渲染控件到文档。 不建议重写，如果你希望额外操作渲染事件，则重写。
	 * dispose - 删除控件。不建议重写，如果一个控件用到多个 dom 内容需重写。
	 */
	var Control = p.namespace(".Control", p.Class({
		
		/**
		 * 封装的节点。
		 * @type Element
		 */
		dom: null,
	
		/**
		 * 根据一个节点返回。
		 * @param {String/Element/Object} [options] 对象的 id 或对象或各个配置。
		 * @constructor Control
		 */
		constructor: function (options) {
			
			var me = this,
			
				// 复制配置对象。
				t = Object.clone.call(1, me.options) || {},
				dom;
			
			// 如果存在配置。
			if (options) {
				
				// 存在的为 Element 。
				if (typeof options == 'string' || options.nodeType) {
					dom = options;
				} else {
					
					// 保存 dom 。
					dom = options.dom;
					delete options.dom;
					Object.extend(t, options);
				}
			}
			
			// 赋值。
			me.dom = dom ? p.$(dom) : me.create(t);
			
			me.style = me.dom.style;
			
			assert(me.dom && me.dom.nodeType, "Control.prototype.constructor(options): 当前实例的 dom 属性为空，或此属性不是 DOM 对象。(检查 options.dom 是否是合法的节点或ID(options 或 options.dom 指定的ID的节点不存在?) 或当前实例的 create 方法是否正确返回一个节点)\r\n当前控件: {dom} {xType}", me.dom, me.xType);
			
			// 初始化控件。
			me.init(t);
			
			// 复制各个选项。
			Object.set(me, t);
		},
		
		/**
		 * 当被子类重写时，生成当前控件。
 		 * @method create
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
 		 * @method init
 		 * @param {Object} [options] 配置。
 		 * @protected
		 */
		init: Function.empty
		
	}));
		
	for(var key in p.ElementList.prototype){
		if(p.Element.prototype[key])
			Control.prototype[key] = p.Element.prototype[key];
	}
	
	Control.prototype.constructor = Control;
	
	/**
	 * @class Control
	 */
	Control.implement({
		
		/**
		 * xType 。
		 * @property xType
		 * @type String
		 */
		xType: "control",
		
		/**
         * 复制属性。
 		 * @method clone
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
	});

	Object.extend(Control, {
		
		/**
		 * 设置类的基类。
		 * @type Element
		 */
		base: Element,
		
		/**
		* 将指定名字的方法委托到当前对象指定的成员。
		* @method delegate
		* @param {Object} control 类。
		* @param {String} delegate 委托变量。
		* @param {String} methods 所有成员名。
		* @param {Number} type 类型。 1 - 返回委托返回 2 - 返回本身 3 - 返回自己，参数作为控件。
		* @param {String} [m2] 成员。
		* @param {String} [t2] 类型。
		* @memberOf Control
		*/
		delegate: function(control, delegate, methods, type, m2, t2) {
			
			if (m2) 
				arguments.callee(control, delegate, m2, t2);
			
			assert(control && control.prototype, "Control.delegate(control, delegate, methods, type, m2, t2): 参数 {control} 必须是一个类", control);
			assert.isNumber(type, "Control.delegate(control, delegate, methods, type, m2, t2): 参数 {type} ~。");
			
			if(type == 4){
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
		 * @param {String} className 类名。
		 * @return {Element} 元素。
		 */
		getProxy: function(className){
			var p = Control._proxy;
			if(!p){
			
				p = Control._proxy = document.create('div', 'x-proxy')
					.setStyle('display: none; position: absolute; overflow: hidden;')
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
			
			p.className = className;
			return p;
		}

	});
	
	Control.delegate
		(Control, "dom", 'addEventListener removeEventListener scrollIntoView focus blur remove', 2, 'appendChild contains insert replaceWith wrapWith removeChild', 3)
  		(Control, "dom", 'insertBefore replaceChild', 5)
		(Control, 'Move', 'setOffset', 4)
		(Control, 'ResizeX', 'setWidth', 4)
		(Control, 'ResizeY', 'setHeight', 4);


	p.Element.implementListeners.push(function (obj){
		Py.Control.implementIf(obj);
	});

	


})(Py);



