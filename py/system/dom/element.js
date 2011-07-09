//===========================================
//  元素   element.js       C
//===========================================

(function(w) {

	/// #region 核心

	/**
	 * Py 简写。
	 * @type Py
	 */
	var p = w.Py,
	
		/**
		 * document 简写。
		 * @type Document
		 */
		document = w.document,
	
		/**
		 * Object  简写。
		 * @type Object
		 */
		o = Object,
	
		/**
		 * 空函数。
		 * @type Function
		 */
		emptyFn = Function.empty,
	
		/**
		 * Object.extend
		 * @type Function
		 */
		apply = o.extend,
	
		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,
	
		/**
		 * 被测元素。
		 * @type Element
		 */
		div = document.createElement('DIV'),
	
		/// #ifdef SupportIE6
	
		/**
		 * 元素。
		 * @type Function
		 */
		e = w.Element || (w.Element = function() {}),
	
		/// #else
	
		/// e = w.Element,
	
		/// #endif
	
		/**
		 * 元素原型。
		 * @type Object
		 */
		ep = e.prototype,
	
		/**
		 * 元素。
		 * @type Object
		 */
		cache = {},
	
		/**
		 * 是否为标签。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	
		/**
		 * 无法复制的标签。
		 * @type RegExp
		 */
		rNoClone = /<(?:script|object|embed|option|style)|\schecked/i,
	
		/**
		 * 是否为标签名。
		 * @type RegExp
		 */
		rTagName = /<([\w:]+)/,
	
		/**
		 * 包装。
		 * @type Object
		 */
		wrapMap = {
			option: [ 1, "<select multiple='multiple'>", "</select>" ],
			legend: [ 1, "<fieldset>", "</fieldset>" ],
			thead: [ 1, "<table>", "</table>" ],
			tr: [ 2, "<table><tbody>", "</tbody></table>" ],
			td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
			col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
			area: [ 1, "<map>", "</map>" ]
		};

	/// #ifdef SupportIE6

	if (navigator.isQuirks) {


		// 避免 getElementById 函数返回错误的函数。
		ep.domVersion = 1;

	}

	/// #endif

	/**
	 * @namespace Py
	 */
	apply(p, {

		/**
		 * 元素。
		 * @class Element
		 * @ignore
		 */
		Element: e,

		/**
		 * 将窗口对象本地化。
		 * @param {Window} w 窗口。
		 */
		bindWindow: function(w) {

			assert(w.setInterval, 'Py.setupWindow(w): 参数 {w} 必须是一个 Window 对象。', w);

			/**
			 * 本地化 Element 。
			 * @class Element
			 */

			/// #ifndef SupportIE6

			if (!w.Element)
				w.Element = e;

			/// #endif

			// 对非     IE6/7 ,手动复制 Element.prototype
			if (w.Element !== e) {

				copyIf(Element.prototype, w.Element.prototype);

				o.extendIf(w.Element, e);
			}

			// 复制 document 变量。
			var wd = apply(w.document, p.IEvent);

			if(!wd.id)
				copyIf(document, wd);

			/// #ifndef SupportIE8

			// 修正 IE 不支持     defaultView
			if (!('defaultView' in wd))
				wd.defaultView = wd.parentWindow;

			/// #endif


			function copyIf(from, to) {
				for (var item in from) {
					if(!(item in to) && (item in from))
						to[item] = from[item];
				}
			}

		}

	});

	/// #ifdef SupportIE6
	
	/**
	 * 根据一个 id 或 对象获取节点。
	 * @param {String/Element} id 对象的 id 或对象。
	 * @memberOf Py
	 */
	p.namespace(".$", navigator.isQuirks ? function(id) {
		var dom = getElementById(id);

		if(dom && dom.domVersion !== ep.domVersion) {
			o.extendIf(dom, e.prototype);
		}

		return dom;


	} : getElementById);

	/// #else

	/// p.namespace(".$", getElementById);

	/// #endif

	///   #region ElementList

	/**
	 * @class Element
	 * @implements Py.IEvent
	 */

	/**
	 * 节点集合。
	 * @class ElementList
	 * @extends Element
	 */
	p.namespace(".ElementList", p.Class({

		/**
		 * xType
		 */
		xType: "elementlist",

		/**
		 * 初始化 ElementList  实例。
		 * @param {Array/ElementList} doms 节点集合。
		 * @constructor
		 */
		constructor: function(doms) {

			assert(doms && doms.length !== undefined, 'ElementList.prototype.constructor(doms): 参数 {doms} 必须是一个 NodeList 或 Array 类型的变量。', doms);

			this.doms = doms;

			if(doms[0] && !doms[0].xType) {
				o.update(doms, p.$);
			}

		},

		/**
		 * 对集合每个元素执行一次函数。
		 * @param {Function} fn 参数。
		 * @param {Array} args/... 参数。
		 * @return {Array} 结果集。
		 */
		each: function(fn, args) {

			// 防止 doms 为 ElementList
			return ap.invoke.call(this.doms, fn, args);
		}

	}));

	/// #endregion
	
	/**
	 * @class Element
	 * @implements Py.IEvent
	 */
	apply(e, {

		/**
		 * 转换一个HTML字符串到节点。
		 * @param {String/Element} html 字符。
		 * @param {Document} context=document 内容。
		 * @param {Boolean} cachable=true 是否缓存。
		 * @return {Element/TextNode/DocumentFragment} 元素。
		 * @static
		 */
		parse: function(html, context, cachable) {

			assert.isString(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');

			context = context || document;

			assert(context.createElement, 'Element.parse(html, context, cachable): 参数 {context} 必须是一个 Document 对象。', context);

			var div = cache[html];

			if (!div || div.ownerDocument !== context) {

				// 过滤空格  // 修正   XHTML
				var h = html.trim().replace(rXhtmlTag, "<$1></$2>"),
				tag = rTagName.exec(h),
				notSaveInCache = cachable !== false && rNoClone.test(html);


				if (tag) {

					div = context.createElement("div", true);

					var wrap = wrapMap[tag[1].toLowerCase()];

					if (wrap) {
						div.innerHTML = wrap[1] + h + wrap[2];
						wrap = wrap[0];

						// 转到正确的深度
						while (wrap--)
							div = div.lastChild;

					} else
						div.innerHTML = h;

					// 一般使用最好的节点， 如果存在最后的节点，使用父节点。
					div = div.firstChild;

					// 如果有多节点，则复制到片段对象。
					if(div.nextSibling) {
						var fragment = context.createDocumentFragment();

						var newS = div.nextSibling;
						while(newS) {
							fragment.appendChild(div);
							div = newS;
							newS = newS.nextSibling;
						}


						fragment.appendChild(div);

						div = fragment;
					} else {

						/// #ifdef SupportIE6

						p.$(div);

						/// #endif

					}

				} else {

					// 创建文本节点。
					div = context.createTextNode(html);
				}

			}

			if(!notSaveInCache)
				cache[html] = div.clone ? div.clone(false, true) : div.cloneNode(true);

			return div;

		},

		/**
		 * 实现了 Element 实现的处理函数。
		 * @private
		 */
		implementListeners: [  function(obj, listType, copyIf) {

			Object.each(obj, function(value, key) {

				var value = obj[key];

				//  复制到  Element.prototype
				if(!copyIf || !(key in ep))
					ep[key] = value;

				//  复制到 Document
				if (!copyIf || !(key in document))
					document[key] = value;

				if(copyIf && p.ElementList.prototype[key])
					return ;

				var fn;

				// 复制到  ElementList
				switch (listType) {
					case 2:
						fn = function() {
							var doms = this.doms, l = doms.length, i = -1;
							while (++i < l)
								doms[i][key].apply(doms[i], arguments);
							return this;
						};

						break;
					case 3:
						fn = function() {
							return new p.ElementList(this.each(key, arguments));
						};

						break;
					case 4:
						fn = function() {
							var args = arguments;
							return new p.ElementList(Array.plain.apply(Array, this.each( function(elem, index) {
								var r = this[index][key].apply(this[index], args);
								return r && r.doms || r;
							}, this.doms)));

						};

						break;
					case 5:
						fn = function() {
							var result = true, args = arguments;
							this.each( function(node) {
								return  result = node[key].apply(node[key], args);
							});

							return result;
						};

						break;
					default:
						fn = function() {
							return this.each(key, arguments);
						};

						break;
				}

				p.ElementList.prototype[key] = fn;


			});

		}],

		/**
		 * 将一个成员附加到 Element 对象和相关类。
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。
		 * @return {Element} this
		 * @static
		 * 对 Element 扩展，内部对 Element ElementList document Control 皆扩展。
		 * 这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。
		 * 所谓的扩展，即一个类含需要的函数。
		 *
		 *
		 * DOM 方法 有 以下种
		 *
		 *  1  getText - 返回结果
		 *  2  setText - 返回 this
		 *  3  getElementById - 返回 DOM
		 *  4  getElementsByTagName - 返回  DOM 数组
		 *  5  appendChild  - 参数 DOM
		 *
		 *  对 Element ，
		 *     如果 copyIf 是 false 或不存在复制。
		 *
		 *  对 ElementList ，按 listType，
		 *      1, 其它 - 执行结果是数据，返回结果数组。 (默认)
		 *  	2 - 执行结果返回 this， 返回 this 。
		 * 		3 - 执行结果是DOM，返回 ElementList 包装。
		 * 		4 - 执行结果是DOM数组，返回 ElementList 包装。
		 * 		5 - 如果每个返回值都是 true， 则返回 true， 否则返回 false。
		 *
		 *  对 document ，
		 *  	如果不存在则复制。
		 *
		 *
		 *  参数 copyIf 仅内部使用。
		 */
		implement: function (obj, listType, copyIf) {

			assert.notNull(obj, "Element.implement(obj, listType): 参数 {obj} ~。");

			this.implementListeners.forEach( function(fn) {
				fn(obj, listType, copyIf);
			});

			/// #ifdef SupportIE6

			if(ep.domVersion) {
				ep.domVersion++;
			}

			/// #endif

			return this;
		},

		/**
		 * 若不存在，则将一个对象附加到 Element 对象。
		 * @static
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType 说明如何复制到 ElementList 实例。
		 * @param {Number} docType 说明如何复制到 Document 实例。
		 * @return {Element} this
		 */
		implementIf: function (obj, listType) {
			return this.implement(obj, listType, true);
		},

		/**
		 * 获取一个元素的文档。
		 * @static
		 * @param {Element/Document/Window} elem 元素。
		 * @return {Document} 当前节点所在文档。
		 */
		getDocument: getDoc

	})
	
	.implementIf({

		/**
		 * 获取节点本身。
		 * @return {Element}
		 */
		getDom: function() {
			return this;
		},

		/// #ifndef SupportIE8

		/**
		 * 绑定一个监听器。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		addEventListener: p.addEventListener,

		/**
		 * 移除一个监听着。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		removeEventListener: p.removeEventListener,

		/// #endif

		/**
		 * xType
		 */
		xType: "element"

	}, 2);

	/**
	 * @namespace document
	 */
	apply(document, {

		/**
		 * 生成一个层。
		 * @param {String} className 类。
		 * @return {Element} 节点。
		 */
		createDiv: function(className) {

			return document.create("div", className);
		},

		/**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function(tagName, className) {

			/// #ifdef SupportIE6

			var div = p.$(document.createElement(tagName));

			/// #else

			/// var div = document.createElement(tagName);

			/// #endif

			div.className = className;

			return div;
		},

		/**
		 * 根据元素返回节点。
		 * @param {String/Element} ... 对象的 id 或对象。
		 */
		id: function() {
			return arguments.length === 1 ? p.$(arguments[0]) : new p.ElementList(o.update(arguments, p.$, []));

			/*
			 return new p.ElementList(o.update(arguments, function(id){
			 return typeof id == 'string' ? this.getElementById(id) : id;
			 }, [], this));
			 */
		},

		/// #ifdef SupportIE6

		/**
		 * 获取节点本身。
		 * @return {Element}
		 */
		getDom: navigator.isQuirks ? function() {

			// 这里直接使用 documentElement ，故不支持 QUIRKS ，如果 html = wd.body 则为 QUIRKS 模式。
			return p.$(this.documentElement);
		} : function() {

			// 这里直接使用 documentElement ，故不支持 QUIRKS ，如果 html = wd.body 则为 QUIRKS 模式。
			return this.documentElement;
		}

		/// #else

		/// getDom: function(){
		///
		///		return this.documentElement;
		/// }

		///#endif
	});

	p.bindWindow(w);

	/**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
	 * @return {Document} 文档。
	 */
	function getDoc(elem) {
		return elem.ownerDocument || elem.document || elem;
	}

	/**
	 * 根据一个 id 或 对象获取节点。
	 * @param {String/Element} id 对象的 id 或对象。
	 * @return {Element} 元素。
	 */
	function getElementById(id) {
		return typeof id == "string" ? document.getElementById(id) : id;
	}

	/// #endregion

	/// #region IEvent

	/**
	 * 默认事件。
	 * @type Object
	 */
	p.namespace(".Events.element.$default", {

		/**
		 * 创建当前事件可用的参数。
		 * @param {Event} e 事件参数。
		 * @param {Object} target 事件目标。
		 * @return {Event} e 事件参数。
		 */
		trigger: function(elem, type, fn, e) {
			e = new p.Event(elem, type, e);
			return fn(e) || (elem[type = 'on' + type] && elem[type](e) !== false);
		},

		/**
		 * 事件触发后对参数进行处理。
		 * @param {Event} e 事件参数。
		 */
		initEvent: emptyFn,

		/**
		 * 添加绑定事件。
		 * @param {Object} obj 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		add: function(obj, type, fn) {
			obj.addEventListener(type, fn, false);
		},

		/**
		 * 删除事件。
		 *@param {Object} obj 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		remove: function(obj, type, fn) {
			obj.removeEventListener(type, fn, false);
		}

	});

	/**
	 * 定义事件。
	 * @param {String} 事件名。
	 * @param {Function} trigger 触发器。
	 * @return {Function} 函数本身
	 * @method Element.defineEvents
	 * 原则 Element.addEvents 可以解决问题。 但由于 DOM 的特殊性，额外提供 defineEvents 方便定义适合 DOM 的事件。
	 * defineEvents 主要解决 3 个问题:
	 * <ol>
	 * <li> 多个事件使用一个事件信息。
	 *      <p>
	 * 	 	 	所有的 DOM 事件的  add 等 是一样的，因此这个函数提供一键定义: Py.defineEvents('e1 e2 e3')
	 * 		</p>
	 * </li>
	 *
	 * <li> 事件别名。
	 *      <p>
	 * 	 	 	一个自定义 DOM 事件是另外一个事件的别名。
	 * 			这个函数提供一键定义依赖: Py.defineEvents('mousewheel', 'DOMMouseScroll')
	 * 		</p>
	 * </li>
	 *
	 * <li> 事件委托。
	 *      <p>
	 * 	 	 	一个自定义 DOM 事件经常依赖已有的事件。一个事件由另外一个事件触发， 比如 ctrlenter 是在 keyup 基础上加工的。
	 * 			这个函数提供一键定义依赖: Py.defineEvents('ctrlenter', 'keyup', function(e){ (判断事件) })
	 * 		</p>
	 * </li>
	 *
	 * @example
	 * <code>
	 *
	 * Element.defineEvents('mousewheel', 'DOMMouseScroll')  //  在 FF 下用   mousewheel
	 * 替换   DOMMouseScroll 。
	 *
	 * Element.defineEvents('mouseenter', 'mouseover', function(e){
	 * 	  if( !isMouseEnter(e) )   // mouseenter  是基于 mouseover 实现的事件，  因此在 不是
	 * mouseenter 时候 取消事件。
	 *        e.returnValue = false;
	 * });
	 *
	 * </code>
	 */
	e.defineEvents = function(events, baseEvent, initEvent) {

		var ee = p.Events.element;

		// 删除已经创建的事件。
		delete ee[events];

		// 对每个事件执行定义。
		String.map(events, Function.from(!o.isFunction(baseEvent) ? {

			initEvent: initEvent ? function(e) {
				return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
			} : ee[baseEvent].initEvent,

			//  如果存在 baseEvent，定义别名， 否则使用默认函数。
			add: function(elem, type, fn) {
				elem.addEventListener(baseEvent, fn, false);
			},

			remove: function(elem, type, fn) {
				elem.removeEventListener(baseEvent, fn, false);
			}

		} : o.extendIf({

			initEvent: baseEvent

		}, ee.$default)), ee);

		return arguments.callee;
	};

	/**
	 * 表示事件的参数。
	 * @class Py.Event
	 */

	var pep = p.namespace(".Event", Class({
		
		/**
		 * 表示当前是否取消冒泡。
		 */
		cancelBubble: false,
		
		/**
		 * 表示当前是否阻止默认事件。
		 */
		returnValue: true,

		/**
		 * 构造函数。
		 * @param {Object} target
		 * @constructor
		 */
		constructor: function(target, type, e) {
			var me = this;
			me.target = target;
			me.srcElement = target.getDom();
			me.type = type;

			if(e)
				apply(me, e);
		},

		/**
		 * 阻止事件的冒泡。
		 */
		stopPropagation : function() {
			this.cancelBubble = true;
		},

		/**
		 * 取消默认事件发生。
		 */
		preventDefault : function() {
			this.returnValue = false;
		},
		
		/**
		 * 停止默认事件和冒泡。
		 */
		stop: function(){
			this.stopPropagation();
			this.preventDefault();
		}

	})).prototype,
	
		/**
		 * @class
		 */
	
		/**
		 * @type Function
		 */
		initUIEvent,
	
		/**
		 * @type Function
		 */
		initMouseEvent,
	
		/**
		 * @type Function
		 */
		initKeyboardEvent;

	/// #ifdef SupportIE6

	if (navigator.isStd) {

	/// #endif
		Event.prototype.stop = pep.stop;

		initMouseEvent = initKeyboardEvent = initUIEvent = function(e) {

			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

		};

	/// #ifdef SupportIE6

	} else {   //  for IE6/IE7/IE8

		initUIEvent = function(e) {
			if(!e.preventDefault){
				e.target = e.srcElement || document;
				e.stopPropagation = pep.stopPropagation;
				e.preventDefault = pep.preventDefault;
				e.stop = pep.stop;
			}
		};

		// mouseEvent
		initMouseEvent = function(e) {
			if(!e.preventDefault){
				initUIEvent(e);
				e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
				var dom = getDoc(e.target).getDom();
				e.pageX = e.clientX + dom.scrollLeft;
				e.pageY = e.clientY + dom.scrollTop;
				e.layerX = e.x;
				e.layerY = e.y;
				//  1 ： 单击  2 ：  中键点击 3 ： 右击
				e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
			
			}
		};

		// keyEvents
		initKeyboardEvent = function(e) {
			if(!e.preventDefault){
				initUIEvent(e);
				e.which = e.keyCode;
			}
		};

	}

	/// #endif

	e.defineEvents
		("click dblclick mouseup mousedown contextmenu mouseover mouseout mousemove selectstart selectend mouseenter mouseleave", initMouseEvent)
		("mousewheel DOMMouseScroll blur focus focusin focusout scroll change select submit error", initUIEvent)
		("keydown keypress keyup", initKeyboardEvent)
		("load unload", function(e) {
			this.un(e.type);
		});

	if(navigator.isFirefox)
		e.defineEvents('mousewheel', 'DOMMouseScroll');
	if (!navigator.isIE) {
		var checkMouseEnter = function(e) {

			var parent = e.relatedTarget;
			while (parent && parent != this) {
				parent = parent.parentNode;
			}

			return this != parent;
		};

		e.defineEvents
			('mouseenter', 'mouseover', checkMouseEnter)
			('mouseleave', 'mouseout', checkMouseEnter);
	}

	e.implement(p.IEvent, 2);

	/// #endregion

	/// #region Attributons

	/**
	 * 透明度的正则表达式。
	 * @type RegExp
	 * @private
	 */
	var rOpacity = /opacity=([^)]*)/,
	
		/**
		 * 是否为像素的正则表达式。
		 * @type RegExp
		 * @private
		 */
		rNumPx = /^-?\document+(?:px)?$/i,
	
		/**
		 * 是否为数字的正则表达式。
		 * @type RegExp
		 * @private
		 */
		rNum = /^-?\document/,
	
		/**
		 * 事件名。
		 * @type RegExp
		 */
		rEventName = /^on([a-z0-9$_]+)/,
	
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 * @private
		 */
		rStyle = /\-|float/,
	
		/**
		 * borderTopWidth 简写。
		 * @type String
		 */
		borderTopWidth = 'borderTopWidth',
	
		/**
		 * borderLeftWidth 简写。
		 * @type String
		 */
		borderLeftWidth = 'borderLeftWidth',
		
		/**
		 * 特殊边框。
		 */
		styleMaps = {},
	
		/// #ifdef SupportIE6
	
		/**
		 * 特殊属性的正则表达式。
		 * @type RegExp
		 * @private
		 */
		rSpecilAttr = /^(?:href|src|usemap)$/i,
	
		/// #endif
	
	
		/// #ifdef SupportIE8
	
		/**
		 * 是否使用方法 getComputedStyle。
		 * @type Boolean
		 * @private
		 */
		defaultView = document.defaultView.getComputedStyle,
	
		/**
		 * 获取元素的计算样式。
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 * @private
		 */
		getStyle = defaultView ? function(elem, name) {
	
			assert.isElement(elem , "Element.getStyle(elem, name): 参数 {elem} ~。");
	
			// 获取样式
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
	
			// 返回 , 在 火狐如果存在 IFrame， 则  computedStyle == null
			//    http://drupal.org/node/182569
			return computedStyle ? computedStyle[ name ] : null;
	
		} : function(elem, name) {
	
			assert.isElement(elem , "Element.getStyle(elem, name): 参数 {elem} ~。");
	
			if(name in attributes) {
				switch(name) {
					case 'height':
						return elem.offsetHeight - e.getSizes(elem, name, 'pb') + 'px';
					case 'width':
						return elem.offsetWidth - e.getSizes(elem, name, 'pb') + 'px';
					case 'opacity':
						return elem.getOpacity().toString();
	
				}
			}
	
			var r = elem.currentStyle[ name ];
	
			// 来自 jQuery
	
			// 如果返回值不是一个带px的 数字。 转换为像素单位
			if (!rNumPx.test(r) && rNum.test(r)) {
	
				// 保存初始值
				var style = elem.style,  left = style.left, rsLeft = elem.runtimeStyle.left;
	
				// 放入值来计算
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = name === "fontSize" ? "1em" : (r || 0);
				r = style.pixelLeft + "px";
	
				// 回到初始值
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
	
			}
	
			return r;
		},
	
		/// #else
	
		/// getStyle = function(elem, name) {
		///
		/// 	// 获取样式
		/// 	var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		///
		/// 	// 返回
		/// 	return computedStyle ? computedStyle[ name ] : null;
		///
		/// },
	
		/// #endif
	
		/**
		 * 特殊属性集合。
		 * @type Object
		 */
		attributes = {
			'float': 'styleFloat' in div ? 'styleFloat' : 'cssFloat',
			"for": "htmlFor",
			"class": "className",
			innerText: 'innerText' in div ? 'innerText' : 'textContent'
		};
	
	String.map('width height', function(c, i){
		c = styleMaps[c] = {};
		var tx = i ? ['Top', 'Bottom'] : ['Left', 'Right'];
		c.d = tx.invoke('toLowerCase', []);
		String.map('padding~ margin~ border~Width', function(v){
			c[v.charAt(0)] = [v.replace('~', tx[0]), v.replace('~', tx[1])];
		});
	});
	
		
	/**
	 * @class Element
	 */
	apply(e, {

		/**
		 * 获取元素的计算样式。
		 * @method getStyle
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 * @static
		 * @private
		 */
		getStyle: getStyle,

		/**
		 * 读取样式字符串。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。
		 * @return {String} 字符串。
		 * @static
		 */
		styleString:  styleString,

		/**
		 * 读取样式数字。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。
		 * @return {String} 字符串。
		 * @static
		 */
		styleNumber: styleNumber,

		/**
		 * 将 offsetWidth 转为 style.width。
		 * @private
		 * @param {Element} elem 元素。
		 * @param {Number} width 输入。
		 * @return {Number} 转换后的大小。
		 * @static
		 */
		getSizes: defaultView ? function (elem, type, names) {

			assert.isElement(elem, "Element.getSizes(elem, type, names): 参数 {elem} ~。");
			assert(type in styleMaps, "Element.getSizes(elem, type, names): 参数 {type} 必须是 \"width\" 或 \"height\"。", type);
			assert.isString(names, "Element.getSizes(elem, type, names): 参数 {names} ~。");


			var value = 0, map = styleMaps[type], i = names.length, val, currentStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(currentStyle[val[0]]) || 0) + (parseFloat(currentStyle[val[1]]) || 0);
			}

			return value;
		} : function (elem, type, names) {


			assert.isElement(elem, "Element.getSizes(elem, type, names): 参数 {elem} ~。");
			assert(type in styleMaps, "Element.getSizes(elem, type, names): 参数 {type} 必须是 \"width\" 或 \"height\"。", type);
			assert.isString(names, "Element.getSizes(elem, type, names): 参数 {names} ~。");

			var value = 0, map = styleMaps[type], i = names.length, val;
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(getStyle(elem, val[0])) || 0) + (parseFloat(getStyle(elem, val[1])) || 0);
			}

			return value;
		},

		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attributes: attributes,

		/**
		 * 样式表。
		 * @static
		 */
		styleMaps: styleMaps,

		/**
		 * 特殊属性。
		 * @property
		 * @type Object
		 * @private
		 * @static
		 */
		specialAttr: {},

		/**
		 * 默认最大的 z-index 。
		 * @property
		 * @type Number
		 * @private
		 * @static
		 */
		zIndex: 10000,

		/**
		 * 判断一个节点是否隐藏。
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 * @static
		 */
		isHidden: function(elem) {

			assert.isElement(elem, "Element.isHidden(elem): 参数 {elem} ~。");

			return elem.style.display === 'none';
		},

		/**
		 * 获取一个节点属性。
		 * @method getAttr
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function(elem, name) {

			assert.isNode(elem, "Element.getAttr(elem, name): 参数 {elem} ~。");

			/// #ifdef SupportIE6

			//简写
			var special = navigator.isQuirks && rSpecilAttr.test(name);

			//属性
			name = attributes[name] || name;

			// 如果是节点具有的属性
			if (name in elem && !special) {

				// 表单上的元素，返回节点属性值
				if (elem.nodeName === "FORM" && (special = elem.getAttributeNode(name)))
					return special.nodeValue;

				return elem[name];
			}

			return special ? elem.getAttribute(name, 2) : elem.getAttribute(name); // 有些属性在 IE 需要参数获取

			/// #else
			///
			/// //属性
			/// name = attributes[name] || name;
			///
			/// // 如果是节点具有的属性
			/// if (name in elem) {
			///
			/// 	// 表单上的元素，返回节点属性值
			/// 	if (elem.nodeName == "FORM" && e.getAttributeNode(name))
			/// 		return e.getAttributeNode(name).nodeValue;
			///
			/// 	return elem[name];
			/// }
			///
			/// return elem.getAttribute(name);

			/// #endif

		},

		/**
		 * 检查是否含指定类名。
		 * @method hasClass
		 * @param {String} className
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function(elem, className) {
			assert.isNode(elem, "Element.hasClass(elem, className): 参数 {elem} ~。");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		}

	})

	.implement({

		/**
		 * 获取节点样式。
		 * @param {String} key 键。
		 * @param {String} value 值。
		 * @return {String} 样式。
		 */
		getStyle: function(name) {

			assert.isString(name, "Element.prototype.getStyle(name): 参数 {name} ~。");

			var me = this.getDom(), css = name.toCamelCase();

			assert.isElement(me, "Element.prototype.getStyle(name): {this.getDom()} 必须返回 DOM 节点。");

			return me.style[css] || getStyle(me, css);

		},

		/**
		 * 获取一个节点属性。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function(name) {
			return e.getAttr(this.getDom(), name);
		},

		/**
		 * 检查是否含指定类名。
		 * @param {String} className
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function(className) {
			return e.hasClass(this.getDom(), className);
		},

		/**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
		getText: function() {
			var me = this.getDom();

			assert.isNode(me, "Element.prototype.getText(): {this.getDom()} 必须返回 DOM 节点。");

			switch(me.tagName) {
				case "SELECT":
					if(me.type != 'select-one') {
						var r = [];
						o.each(me.options, function(s) {
							if(s.selected)
								r.push(s.value)
						});

						return r.join(',');
					}

				//  继续执行
				case "INPUT":
				case "TEXTAREA":
					return me.value;
				default:
					return me[attributes.innerText];
			}
		},

		/**
		 * 获取值。
		 * @return {String} 值。
		 */
		getHtml: function() {

			assert.isNode(this.getDom(), "Element.prototype.getHtml(): {this.getDom()} 必须返回 DOM 节点。");

			return this.getDom().innerHTML;
		},

		/// #ifdef SupportIE8

		/**
		 * 获取透明度。
		 * @method getOpacity
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
		getOpacity: !('opacity' in div.style) ? function() {

			return rOpacity.test(styleString(this.getDom(), 'filter')) ? parseInt(RegExp.$1) / 100 : 1;

		} : function() {

			return parseFloat(styleString(this, 'opacity')) || 0;

		}

		/// #else
		///
		/// getOpacity: function() {
		///
		///    return parseFloat(styleString(this, 'opacity')) || 0;
		///
		/// }

		/// #endif

	})

	.implement({

		/**
		 * 设置内容样式。
		 * @param {String} name 键。
		 * @param {String/Number} value 值。
		 * @return {Element} this
		 */
		setStyle: function(name, value) {

			assert.isString(name, "Element.prototype.setStyle(name, value): 参数 {name} ~。");

			// 获取样式
			var me = this, style = me.getDom().style;

			assert.isElement(me.getDom(), "Element.prototype.setStyle(name, value): {this.getDom()} 必须返回 DOM 节点。");

			//没有键  返回  cssText
			if (arguments.length == 1) {
				style.cssText = name;
			} else {

				if(name in attributes) {
					name = attributes[name];

					/// #ifdef SupportIE8

					if(name == 'opacity') {
						return me.setOpacity( value);
					}

					/// #endif
				} else
					name = name.toCamelCase();

				//如果值是函数，运行。
				if (typeof value === "number")
					value += "px";

				// 指定值
				style[name] = value;
			}

			return me;
		},

		/**
		 * 设置节点属性。
		 * @param {String} name 名字。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setAttr: function(name, value) {

			//简写
			var me = this.getDom();

			assert.isNode(me, "Element.prototype.setAttr(name, value): {this.getDom()} 必须返回 DOM 节点。");

			//属性
			name = attributes[name] || name;

			// 如果是节点具有的属性
			if (name in me) {


				/// #ifdef SupportIE6

				assert(name != 'type' || me.nodeName != "INPUT" || !me.parentNode, "此元素 type 属性不能修改");

				/// #endif

				me[name] = value;
			} else {
				if (value === null)
					me.removeAttribute(name);
				else
					// 使用DOM设置属性
					me.setAttribute(name, value);
			}

			return this;

		},

		/**
		 * 快速设置节点全部属性和样式。
		 * @param {String/Object} name 名字。
		 * @param {Object} [value] 值。
		 * @return {Element} this
		 */
		set: function(name, value) {

			var me = this;

			if (typeof name === "string") {

				// 允许 this 为 Element 或 Control
				var dom = me.getDom();

				assert.isNode(dom, "Element.prototype.set(name, value): {this.getDom()} 必须返回 DOM 节点。");

				// 特殊属性。
				if(name in e.specialAttr)
					me['set' + e.specialAttr[name]](value);

				// event 。
				else if(name.match(rEventName))
					me.on(RegExp.$1, value);

				// css 。
				else if(dom.style && (name in dom.style || rStyle.test(name)))
					me.setStyle(name, value);

				// attr 。
				else if(name in dom)
					dom[name] = value;

				// Object 。
				else
					me[name] = value;

			} else if(o.isObject(name)) {

				for(value in name)
					me.set(value, name[value]);

			}

			return me;


		},

		/**
		 * 增加类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		addClass: function(className) {
			var me = this.getDom();

			assert.isNode(me, "Element.prototype.addClass(className): {this.getDom()} 必须返回 DOM 节点。");

			if(!me.className)
				me.className = className;
			else
				me.className += ' ' + className;
			return this;
		},

		/**
		 * 删除类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		removeClass: function(className) {

			assert.isNode(this.getDom(), "Element.prototype.removeClass(className): {this.getDom()} 必须返回 DOM 节点。");

			this.getDom().className = className ? this.getDom().className.replace(new RegExp('\\b' + className + '\\b\\s*', "g"), '') : '';
			return this;
		},

		/**
		 * 切换类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		toggleClass: function(className, toggle) {
			return (toggle !== undefined ? !toggle : this.hasClass(className)) ? this.removeClass(className) : this.addClass(  className  );
		},

		/**
		 * 设置值。
		 * @param {String/Boolean} 值。
		 * @return {Element} this
		 */
		setText: function(value) {
			var me = this.getDom();

			assert(!value || typeof value === 'string', "Element.prototype.setText(value): {value} 必须是字符串。", value );
			assert.isNode(me, "Element.prototype.setText(value): {this.getDom()} 必须返回 DOM 节点。");

			switch(me.tagName) {
				case "SELECT":
					if(me.type === 'select-multiple') {
						value = value.split(',');
						o.each(me.options, function(e) {
							e.selected = value.indexOf(e.value) > -1;
						});

					}

				//  继续执行
				case "INPUT":
				case "TEXTAREA":
					me.value = value;
					break;
				default:
					me[attributes.innerText] = value;
			}
			return  this;
		},

		/**
		 * 设置 HTML 。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setHtml: function(value) {

			assert.isNode(this.getDom(), "Element.prototype.setHtml(value): {this.getDom()} 必须返回 DOM 节点。");

			this.getDom().innerHTML = value;
			return this;
		},

		/// #ifdef SupportIE8

		/**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
		setOpacity: !('opacity' in div.style) ? function(value) {

			assert.isElement(this.getDom(), "Element.prototype.setOpacity(value): {this.getDom()} 必须返回 DOM 节点。");

			var style = this.getDom().style;

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

			// 当元素未布局，IE会设置失败，强制使生效
			style.zoom = 1;

			// 设置值
			style.filter = (style.filter || 'alpha(opacity=?)').replace(rOpacity, "opacity=" + value * 100);

			//返回值， 保证是字符串  值为  0 - 100
			return this;

		} : function(value) {

			assert.isElement(this.getDom(), "Element.prototype.setOpacity(value): {this.getDom()} 必须返回 DOM 节点。");

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

			//  标准浏览器使用   opacity
			this.getDom().style.opacity = value;
			return this;

		},

		/// #else

		/// function(value) {

		///     //  标准浏览器使用   opacity
		///     this.getDom().style.opacity = value;
		///     return this;
		///
		/// },

		/// #endif

		/**
		 * 显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack) {

			assert.isElement(this.getDom(), "Element.prototype.show(duration, callBack, type): {this.getDom()} 必须返回 DOM 节点。");

			this.getDom().style.display = '';
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},

		/**
		 * 隐藏当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function(duration, callBack) {

			assert.isElement(this.getDom(), "Element.prototype.hide(duration, callBack, type): {this.getDom()} 必须返回 DOM 节点。");

			this.getDom().style.display = 'none';
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},

		/**
		 * 设置元素不可选。
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function(value) {

			assert.isElement(this.getDom(), "Element.prototype.setUnselectable(value): {this.getDom()} 必须返回 DOM 节点。");

			this.getDom().unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function(value) {

			assert.isElement(this.getDom(), "Element.prototype.setUnselectable(value): {this.getDom()} 必须返回 DOM 节点。");

			this.getDom().onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function(value) {

			assert.isElement(this.getDom(), "Element.prototype.setUnselectable(value): {this.getDom()} 必须返回 DOM 节点。");

			this.getDom().style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},

		/**
		 * 切换显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		toggle: function(duration, callBack, type, flag) {
			return this[(flag === undefined ? e.isHidden(this.getDom()) : flag) ? 'show' : 'hide']  (duration, callBack, type);
		},

		/// #ifdef Compact

		/**
		 * 变化到某值。
		 * @param {String} value 变化的值。可以为 height opacity width all size position left top
		 * right bottom。
		 * @param {Function} [callBack] 回调。
		 * @param {Number} duration=500 时间。
		 * @param {String} [type] 类型。
		 * @return this
		 */
		animate: function () {
			var args = arguments, name = args[0], value = args[1];
			if(typeof name === 'string') {
				(args[1] = {})[name] = value;
				args[0] = null;
			} else if(typeof value !== 'object') {
				Array.prototype.unshift.call(args, null);
			}

			this.set(args[1]);
			if(args[3])
				setTimeout(args[3], 0);

			return  this;
		},

		/// #endif

		/**
		 * 将元素引到最前。
		 * @param {Element} [elem] 参考元素。
		 * @return this
		 */
		bringToFront: function(elem) {

			assert.isElement(this.getDom(), "Element.prototype.bringToFront(elem): {this.getDom()} 必须返回 DOM 节点。");

			this.getDom().style.zIndex = Math.max(parseInt(styleString(this.getDom(), 'zIndex')) || 0, elem && elem.nodeType && (parseInt(styleString(elem, 'zIndex')) + 1) || e.zIndex++);
			return this;
		}

	}, 2);
	
	updateToObj("opacity height width defaultValue accessKey cellPadding cellSpacing colSpan frameBorder maxLength readOnly rowSpan tabIndex useMap", attributes);

	updateToObj("Size Position Opacity Offset Scroll Offsets Style Text", e.specialAttr);

	/**
	 * 读取样式字符串。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。
	 * @return {String} 字符串。
	 * @ignore
	 */
	function styleString(elem, name) {

		return elem.style[name] || getStyle(elem, name);
	}

	/**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 * @ignore
	 */
	function styleNumber(elem, name) {
		return parseFloat(getStyle(elem, name)) || 0;
	}

	/**
	 * 将属性拷贝到目标。
	 * @param {String} props 属性字符串。
	 * @param {Object} target 目标。
	 * @ignore
	 */
	function updateToObj(props, target) {
		props.split(' ').forEach( function(value) {
			target[value.toLowerCase()] = value;
		});

	}
	
	/**
	 * 设置元素的宽或高。
	 * @param {Element/Control} me 元素。
	 * @param {String} fix 修正的边框。
	 * @param {Number} x 宽。
	 * @param {Number} y 宽。
	 */
	function setSize(elem, fix, x ,y) {
		var p = getXY(x,y);

		if(p.x != null)
			elem.setWidth(p.x - e.getSizes(elem.getDom(), 'width', fix));

		if (p.y != null)
			elem.setHeight(p.y - e.getSizes(elem.getDom(), 'height', fix));

		return elem;
	}

	/// #endif

	/// #region 位置

	var rBody = /^(?:body|html)$/i,
	
		/**
		 * 表示一个点。
		 * @class Point
		 */
		Point = p.namespace(".Point", p.Class({
	
			/**
			 * 初始化 Point 的实例。
			 * @param {Number} x X 坐标。
			 * @param {Number} y Y 坐标。
			 * @constructor Point
			 */
			constructor: function(x, y) {
				this.set(x, y);
			},
	
			/**
			 * 设置当前点位置。
			 * @method set
			 * @param {Number} x X 坐标。
			 * @param {Number} y Y 坐标。
			 * @return {Point} this
			 */
			set: function(x, y) {
	
				this.x = x;
				this.y = y;
				return this;
			},
	
			/**
			 * 将 (x, y) 增值。
			 * @method add
			 * @param {Number} value 值。
			 * @return {Point} this
			 */
			add: function(x, y) {
	
				assert(typeof x == 'number' && typeof y == 'number', "Point.prototype.add(x, y): 参数 x 和 参数 y 必须是数字。");
				this.x += x;
				this.y += y;
				return this;
			},
	
			/**
			 * 复制当前对象。
			 * @method clone
			 * @return {Point} 坐标。
			 */
			clone: function() {
				return new Point(this.x, this.y);
			},
	
			/**
			 * 将一个点坐标减到当前值。
			 * @method minus
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			minus: function(p) {
	
				assert(p && 'x' in p && 'y' in p, "Point.prototype.minus(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
				this.x -= p.x;
				this.y -= p.y;
				return this;
			}
	
		})),
	
		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getWindowScroll = 'pageXOffset' in w ? function() {
			var win = getWindow(this);
			return new Point(win.pageXOffset, win.pageYOffset);
		} : getScroll;

	//   来自  Mootools (MIT license)
	/**
	 * @class Element
	 */

	apply(e, {

		/**
		 * 设置一个元素可拖动。
		 * @method setMovable
		 * @param {Element} elem 要设置的节点。
		 * @static
		 */
		setMovable: function(elem) {
			assert.isElement(elem, "Element.setMovable(elem): 参数 elem ~。");
			if(!checkPosition(elem, "absolute"))
				elem.style.position = "relative";
		},

		/**
		 * 检查元素的 position 是否和指定的一致。
		 * @param {Element} elem 元素。
		 * @param {String} position 方式。
		 * @return {Boolean} 一致，返回 true 。
		 * @static
		 */
		checkPosition: checkPosition,

		/**
		 * 根据 x, y 获取 {x: x y: y} 对象
		 * @param {Number/Point} x
		 * @param {Number} y
		 * @static
		 * @private
		 */
		getXY: getXY

	})

	.implement({

		/**
		 * 获取滚动区域大小。
		 * @method getScrollSize
		 * @return {Point} 位置。
		 */
		getScrollSize: function() {
			var me = this.getDom();

			assert.isNode(me, "Element.prototype.getScrollSize(): {this.getDom()} 必须返回 DOM 节点。");
			return new Point(me.scrollWidth, me.scrollHeight);
		},

		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var me = this.getDom();

			assert.isNode(me, "Element.prototype.getSize(): {this.getDom()} 必须返回 DOM 节点。");
			return new Point(me.offsetWidth, me.offsetHeight);
		},

		/**
		 * 获取元素可视区域大小。包括 margin 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getOuterSize: function() {
			var me = this.getDom();

			return this.getSize().add(e.getSizes(me, 'width', 'm'), e.getSizes(me, 'height', 'm'));
		},

		/**
		 * 获取元素的相对位置。
		 * @method getOffset
		 * @return {Point} 位置。
		 */
		getOffset: function() {

			assert.isElement(this.getDom(), "Element.prototype.getOffset(): {this.getDom()} 必须返回 DOM 节点。");

			// 如果设置过 left top ，这是非常轻松的事。
			var me = this.getDom(),
			left = me.style.left,
			top = me.style.top;

			// 如果未设置过。
			if (!left || !top) {

				// 绝对定位需要返回绝对位置。
				if(checkPosition(me, 'absolute'))
					return this.getOffsets(this.getOffsetParent());

				// 非绝对的只需检查 css 的style。
				left = getStyle(me, 'left');
				top = getStyle(me, 'top');
			}

			// 碰到 auto ， 空 变为 0 。
			return new Point(parseFloat(left) || 0, parseFloat(top) || 0);
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @method getWidth
		 * @return {Point} 位置。
		 */
		getWidth: function() {

			assert.isElement(this.getDom(), "Element.prototype.getWidth(): {this.getDom()} 必须返回 DOM 节点。");
			var me = this.getDom(), width = parseFloat(me.style.width);
			return isNaN(width) ? styleNumber(me, 'width') : width;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @method getWidth
		 * @return {Point} 位置。
		 */
		getHeight: function() {

			assert.isElement(this.getDom(), "Element.prototype.getWidth(): {this.getDom()} 必须返回 DOM 节点。");
			var me = this.getDom(), height = parseFloat(me.style.height);
			return isNaN(height) ? styleNumber(me, 'height') : height;
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @method getScroll
		 * @return {Point} 位置。
		 */
		getScroll: getScroll,

		/**
		 * 获取元素的上下左右大小。
		 * @method getBound
		 * @return {Rectange} 大小。
		 */
		getBound: function() {
			var p = this.getPosition(), s = this.getSize();
			return {
				left: p.x,
				top: p.y,
				width: s.x,
				height: s.y,
				right: p.x + s.x,
				bottom: p.y + s.y
			};
		},

		/**
		 * 获取距父元素的偏差。
		 * @method getPosition
		 * @return {Point} 位置。
		 */
		getPosition: div.getBoundingClientRect   ? function() {

			assert.isNode(this.getDom(), "Element.prototype.getPosition(): {this.getDom()} 必须返回 DOM 节点。");

			var me = this.getDom(),
			bound = me.getBoundingClientRect(),
			doc = getDoc(me),
			html = doc.getDom(),
			htmlScroll = checkPosition(me, 'fixed') ? {
				x:0,
				y:0
			} : doc.getScroll();

			return new Point(
			bound.left+ htmlScroll.x - html.clientLeft,
			bound.top + htmlScroll.y - html.clientTop
			);
		} : function() {

			var me = this.getDom(),
			elem = me,
			p = getScrolls(elem);

			while (elem && !isBody(elem)) {
				p.add(elem.offsetLeft, elem.offsetTop);
				if (navigator.isFirefox) {
					if (nborderBox(elem)) {
						p.add(styleNumber(elem, borderLeftWidth), styleNumber(elem, borderTopWidth));
					}
					var parent = elem.parentNode;
					if (parent && styleString(parent, 'overflow') != 'visible') {
						p.add( styleNumber(parent, borderLeftWidth), styleNumber(parent, borderTopWidth));
					}
				} else if (elem != me && navigator.isSafari) {
					p.add(styleNumber(elem, borderLeftWidth),  styleNumber(elem, borderTopWidth));
				}

				elem = elem.offsetParent;
			}
			if (navigator.isFirefox && nborderBox(me)) {
				p.add(-styleNumber(me, borderLeftWidth), -styleNumber(me, borderTopWidth));
			}
			return p;
		},

		/**
		 * 获取包括滚动位置的位置。
		 * @method getOffsets
		 * @param {Element/String/Boolean} relative 相对的节点。
		 * @return {Point} 位置。
		 */
		getOffsets: function( relative) {
			if (isBody(this.getDom()))
				return new Point(0, 0);
			var me = this.getDom(), pos = this.getPosition().minus(getScrolls(me));
			if(relative) {

				assert.isElement(relative, "Element.prototype.getOffsets(relative): 参数 {relative} ~。");

				pos.minus(p.$(relative).getOffsets()).add( -styleNumber(me, 'marginLeft') - styleNumber(relative, borderLeftWidth) ,-styleNumber(me, 'marginTop') - styleNumber(relative,  borderTopWidth) );
			}
			return pos;
		},

		/**
		 * 获取用于作为父元素的节点。
		 * @method getOffsetParent
		 * @return {Element} 元素。
		 */
		getOffsetParent: function() {

			assert.isNode(this.getDom(), "Element.prototype.getOffsetParent(): {this.getDom()} 必须返回 DOM 节点。");
			var elem = this.getDom().offsetParent || getDoc(this.getDom()).body;
			while ( elem && !isBody(elem) && checkPosition(elem, "static") ) {
				elem = elem.offsetParent;
			}
			return elem;
		}

	})

	.implement({

		/**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setSize: function(x, y) {
			return setSize(this, 'pb', x, y);
		},

		/**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setOuterSize: function(x, y) {
			return setSize(this, 'mpb', x, y);
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Element} this
		 */
		setWidth: function(value) {

			assert.isElement(this.getDom(), "Element.prototype.setWidth(value): {this.getDom()} 必须返回 DOM 节点。");
			this.getDom().style.width = (value > 0 ? value : 0) + 'px';
			return this;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Element} this
		 */
		setHeight: function(value) {

			assert.isElement(this.getDom(), "Element.prototype.setWidth(value): this.getDom(){this.getDom()} 必须返回 DOM 节点。");
			this.getDom().style.height = (value > 0 ? value : 0) + 'px';
			return this;
		},

		/**
		 * 滚到。
		 * @param {Element} dom
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setScroll: function(x, y) {
			var me = this.getDom(), p = getXY(x,y);

			assert.isNode(me, "Element.prototype.setScro{this.getDom()} 必须返回 DOM 节点。返回 DOM 节点。");
			if(p.x != null)
				me.scrollLeft = p.x;
			if(p.y != null)
				me.scrollTop = p.y;
			return this;

		},

		/**
		 * 设置元素的相对位置。
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function(p) {

			assert.isElement(this.getDom(), "Element.prototype.setOffset(p): {this.getDom()} 必须返回 DOM 节点。");
			assert(p && 'x' in p && 'y' in p, "Element.prototype.setOffset(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
			var s = this.getDom().style;
			s.top = p.y + 'px';
			s.left = p.x + 'px';
			return this;
		},

		/**
		 * 设置元素的固定位置。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setPosition: function(x, y) {
			var me = this, offset = me.getOffset().minus(me.getPosition()), p = getXY(x,y);

			if (p.x)
				offset.x += p.x;

			if (p.y)
				offset.y += p.y;

			e.setMovable(me.getDom());

			return me.setOffset(offset);
		}

	} ,2);

	/**
	 * @namespace document
	 */
	apply(document, {

		/**
		 * 获取元素可视区域大小。
		 * @method getWindowSize
		 * @return {Point} 位置。
		 */
		getWindowSize: function() {
			var dom = this.getDom(),
			win = getWindow(this);
			return new Point(win.outerWidth || dom.clientWidth, win.outerHeight || dom.clientHeight);
		},

		/**
		 * 设置元素可视区域大小。
		 * @method setWindowSize
		 * @param {Number} x 大小。
		 * @param {Number} y 大小。
		 * @return {Document} this 。
		 */
		setWindowSize: function(x, y) {
			var p = adaptXY(x,y, this.getDom(), 'getWindowSize');
			getWindow(this).resizeTo(p.x, p.y);
			return this;
		},

		/**
		 * 获取元素可视区域大小。包括 margin 和 border 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var doc = this.getDom();

			assert.isNode(doc, "document.getSize(): document.getDom() 必须返回 DOM 节点。");
			return new Point(doc.clientWidth, doc.clientHeight);
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @method getScroll
		 * @return {Point} 位置。
		 */
		getScroll: getWindowScroll,

		/**
		 * 获取距父元素的偏差。
		 * @method getOffsets
		 * @return {Point} 位置。
		 */
		getPosition: getWindowScroll,

		/**
		 * 获取滚动区域大小。
		 * @method getScrollSize
		 * @return {Point} 位置。
		 */
		getScrollSize: function() {
			var html = this.getDom(),
			min = this.getSize(),
			max = Math.max,
			body = html.ownerDocument.body;


			return new Point(max(html.scrollWidth, body.scrollWidth, min.x), max(html.scrollHeight, body.scrollHeight, min.y));
		},

		/**
		 * 滚到。
		 * @method setScroll
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Document} this 。
		 */
		setScroll: function(x, y) {
			var p = adaptXY(x,y, this, 'getScroll');

			getWindow(this).scrollTo(p.x, p.y);

			return this;
		}

	});
	
	/**
	 * @namespace
	 */

	/**
	 * 检查元素的 position 是否和指定的一致。
	 * @param {Element} elem 元素。
	 * @param {String} position 方式。
	 * @return {Boolean} 一致，返回 true 。
	 */
	function checkPosition(elem, position) {
		return styleString(elem, "position") === position;
	}

	/**
	 * 获取一个节点的所在的窗口。
	 * @param {Object} elem
	 */
	function getWindow(elem) {
		return (elem.ownerDocument || elem).defaultView;
	}

	/**
	 * 获取一个元素滚动。
	 * @return {Point} 大小。
	 */
	function getScroll() {
		var doc = this.getDom();
		assert.isNode(doc, "Element.prototype.getScroll(): {this.getDom()} 必须返回 DOM 节点。返回 DOM 节点。");
		return new Point(doc.scrollLeft, doc.scrollTop);
	}

	/**
	 * 检查是否为 body 。
	 * @param {Element} elem 内容。
	 * @return {Boolean} 是否为文档或文档跟节点。
	 */
	function isBody(elem) {
		return rBody.test(elem.nodeName);
	}

	/**
	 * 未使用盒子边框
	 * @param {Element} elem 元素。
	 * @return {Boolean} 是否使用。
	 */
	function nborderBox(elem) {
		return getStyle(elem, 'MozBoxSizing') != 'border-box';
	}

	/**
	 * 转换参数为标准点。
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	function getXY(x, y) {
		return o.isObject(x) ? x : {
			x:x,
			y:y
		};
	}

	/**
	 * 获取默认的位置。
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} obj
	 * @param {Object} method
	 */
	function adaptXY(x, y, obj, method) {
		var p = getXY(x, y);
		if(p.x == null)
			p.x = obj[method]().x;
		if(p.y == null)
			p.x = obj[method]().y;
		assert(!isNaN(p.x) && !isNaN(p.y), "adaptXY(x, y, obj, method): 参数 {x}或{y} 不是合法的数字。(method = {method})", x, y, method);
		return p;
	}

	/**
	 * 获取一个元素的所有滚动大小。
	 * @param {Element} elem 元素。
	 * @return {Point} 偏差。
	 */
	function getScrolls(elem) {
		var p = new Point(0, 0);
		elem = elem.parentNode;
		while (elem && !isBody(elem)) {
			p.add(-elem.scrollLeft, -elem.scrollTop);
			elem = elem.parentNode;
		}
		return p;
	}

	/// #endif

	/// #ifdef 节点

	/**
	 * 属性。
	 * @type RegExp
	 */
	var rAttr = /\[([^=]*)(=(.*))?\]/,
	
		/**
		 * 点。
		 * @type RegExp
		 */
		rPoint = /\./g,
	
		/**
		 * 特殊属性集合。
		 * @type Object
		 */
		properties = {
			INPUT: 'checked',
			OPTION: 'selected',
			TEXTAREA: 'value'
		},
	
		/**
		 * @type Object
		 */
		childMap = 'firstElementChild' in div ?
		[walk, 'nextElementSibling', 'firstElementChild', 'parentNode', 'previousElementSibling', 'lastElementChild'] :
		[walk, 'nextSibling', 'firstChild', 'parentNode', 'previousSibling', 'lastChild'],
	
		/**
		 * 用于 get 的名词对象。
		 * @type String
		 */
		nodeMaps = e.nodeMaps = {
	
			// 全部上级节点。
			parents: [dir, childMap[3]],
	
			// 前面的节点。
			previouses: [dir, childMap[4]],
	
			// 后面的节点。
			nexts: [dir, childMap[1]],
	
			// 后面的节点。
			next: [walk, childMap[1], childMap[1]],
	
			// 第一个节点。
			first: childMap,
	
			// 最后的节点。
			last: [walk, childMap[4], childMap[5]],
	
			// 前面的节点。
			previous: [walk, childMap[4], childMap[4]],
	
			// 上级节点。
			parent: [walk, childMap[3], childMap[3]],
	
			// 直接的子节点。
			child: [dir, childMap[1], childMap[2]],
	
			// 奇数或偶数个。
			odd: [
			function(elem, fn) {
				return dir(elem, function() {
					return fn = fn === false;
				}, childMap[1], childMap[2]);
	
			}],
	
			// 全部子节点。
			children: [
			function(elem, fn) {
				return new ElementList(find(elem,  fn));
			}],
	
			// 兄弟节点。
			siblings: [
			function(elem, fn) {
				return dir(elem, function(node) {
					return node != elem && fn(el);
				});
	
			}]
	
		},
	
		/**
		 * 查找一个节点。
		 * @param {Element} elem 父节点。
		 * @param {undefined/String/Function} fn 查找函数。
		 * @param {Boolean} childOnly 是否只搜索相邻的节点。
		 * @return {Array/Element} 节点。
		 */
		find = 'all' in document ? function(elem, fn) { // 返回数组
			assert.isFunction(fn, "Element.prototype.find(elem, fn): 参数 {fn} ~。");
			return  Array.prototype.filter.call(elem.all, fn);
		} : function(elem, fn) {
			assert.isFunction(fn, "Element.prototype.find(elem, fn): 参数 {fn} ~。");
			var ds = [], document = [elem], p, nx;
			while (document.length) {
				p = document.pop();
				for (nx = p.firstChild; nx; nx = nx.nextSibling) {
					if (nx.nodeType != 1)
						continue;
					if (fn(nx)) {
						ds.push(nx);
					}
	
					document.push(nx);
				}
			}
	
			return ds;
		};

	/**
	 * @class Element
	 */
	apply(e, {

		hasChild: !div.compareDocumentPosition ? function(elem, child) {
			while(child = child.parentNode) {
				if(elem === child)
					return true;
			};
			return false;
		} : function(elem, child) {
			return !!(elem.compareDocumentPosition(child) & 16);
		},

		/**
		 * 删除一个节点的所有子节点。
		 * @param {Element} elem 节点。
		 * @private
		 */
		empty: function (elem) {
			while(elem.lastChild)
				e.dispose(elem.lastChild);
		},

		/**
		 * 释放节点所有资源。
		 * @param {Element} elem 节点。
		 * @private
		 */
		dispose: function (elem) {

			//删除事件
			if (navigator.isIE) {
				if (elem.clearAttributes) {
					elem.clearAttributes();
				}

				p.IEvent.un.call(elem);

				if (elem.nodeName === "OBJECT") {
					for (var p in elem) {
						if (typeof elem[p] === 'function')
							elem[p] = emptyFn;
					}
				}
			}

			e.empty(elem);

			elem.parentNode && elem.parentNode.removeChild(elem);

		}

	})

	.implementIf({

		/**
		 * 根据属性获得元素内容。
		 * @method getElementsByAttribute
		 * @param {Strung} name 属性名。
		 * @param {Strung} value 属性值。
		 * @return {Array} 节点集合。
		 */
		getElementsByAttribute: function(name, value) {
			return find(this.getDom(), function(elem) {

				// 或者属性值 == value 且 value 非空
				// 或者 value空， 属性值非空
				return (value === undefined) !== (e.getAttr(elem, name) == value);
			});

		},

		/// #ifdef SupportIE6

		/**
		 * 根据类名返回子节点。
		 * @method getElementsByClassName
		 * @param {Strung} classname 类名。
		 * @return {Array} 节点集合。
		 */
		getElementsByClassName: function(classname) {
			assert.isString(classname, "Element.prototype.getElementsByClassName(classname): 参数 {classname} ~。");
			classname = classname.split(/\s/);
			return find(this.getDom(), function(elem) {
				var i = classname.length;
				while(i--)
					if(!e.hasClass(elem, classname[i]))
						return false;
				return true;
			});

		},

		/// #else

		/// getElementsByClassName:  function(name) {
		/// 	return this.getElementsByClassName(name);
		/// },

		/// #endif

		// 使     ElementList 支持此函数
		getElementsByTagName: function(name) {
			return this.getElementsByTagName(name);
		},

		getElementsByName: function(name) {
			return this.getElementsByAttribute('name', name);
		},

		/// #ifdef SupportIE6

		/**
		 * 执行一个简单的选择器。
		 * @method find
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		findAll: div.querySelectorAll ? function(selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
			return new p.ElementList(this.getDom().querySelectorAll(selecter));
		} : function(selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
			var current = new p.ElementList([this.getDom()]);
			selecter.split(' ').forEach( function(v) {
				current = findBy(current, v);
			});

			return current;
		},

		/// #else

		/// findAll: div.querySelectorAll,

		/// #endif

		/**
		 * 获得相匹配的节点。
		 * @method get
		 * @param {String} type 类型。
		 * @param {Function/Number} fn 过滤函数或索引或标签。
		 * @return {Element} 元素。
		 */
		get: function(type, fn) {

			// 如果 type 为函数， 表示 默认所有子节点。
			switch (typeof type) {
				case 'string':
					fn = getFilter(fn);
					break;
				case 'function':
					fn = type;
					type = "children";
					break;
				case 'number':
					fn = getFilter(type);
					type = 'first';
					break;
			}

			var n = nodeMaps[type];
			assert(n, 'Element.prototype.get(type, fn): 函数不支持 {0}类型 的节点关联。', type);
			return n[0](this.getDom(), fn, n[1], n[2]);
		}

	}, 4)

	.implement({

		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @method contains
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function(child) {
			var me = this.getDom();
			assert.isNode(me, "Element.prototype.contains(child): this.getDom() 返回的必须是 DOM 节点。");
			return child == me || e.hasChild(me, child);
		},

		/**
		 * 判断一个节点是否有子节点。
		 * @method contains
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		hasChild: function(child) {
			var me = this.getDom();
			return arguments.length ? e.hasChild(me, child) : me.firstChild !== null;
		}

	}, 5)

	.implement({

		/// #ifdef SupportIE6

		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: div.querySelector ? function(selecter) {
			assert.isString(selecter, "Element.prototype.find(selecter): 参数 {selecter} ~。");
			return this.getDom().querySelector(selecter);
		} : function(selecter) {
			var current = this.getDom();
			assert.isString(selecter, "Element.prototype.find(selecter): 参数 {selecter} ~。");
			if(selecter.split(' ').each(function(v) {
			return !!(current = findBy(current, v)[0]);
			}))
				return p.$(current);
		},

		/// #else

		/// find: div.querySelector,

		/// #endif

		/**
		 * 复制节点。
		 * @param {Boolean} copyDataAndEvent=false 是否复制事件。
		 * @param {Boolean} contents=true 是否复制子元素。
		 * @param {Boolean} keepid=false 是否复制 id 。
		 * @return {Element} 元素。copyListener, contents, keepid
		 */
		clone: function(copyDataAndEvent, contents, keepid) {

			assert.isNode(this.getDom(), "Element.prototype.clone(copyDataAndEvent, contents, keepid): this.getDom() 返回的必须是 DOM 节点。");

			var elem = this.getDom(),
			clone = elem.cloneNode(contents = contents !== false);

			if (contents) {
				for (var ce = clone.getElementsByTagName('*'), te = elem.getElementsByTagName('*'), i = ce.length; i--;)
					clean(ce[i], te[i], copyDataAndEvent, keepid);
			}

			clean(elem, clone, copyDataAndEvent, keepid);

			/// #ifdef SupportIE6

			if (navigator.isQuirks) {
				o.update(elem.getElementsByTagName('object'), 'outerHTML', clone.getElementsByTagName('object'), true);
			}

			/// #endif

			return clone;
		},

		/**
		 * 在某个位置插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {String} [swhere] 插入地点。 beforeBegin   节点外    beforeEnd   节点里
		 * afterBegin    节点外  afterEnd     节点里
		 * @return {Element} 插入的节点。
		 */
		insert: 'insertAdjacentElement' in div ? function(html, swhere) {
			var me = this.getDom();
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.getDom() 返回的必须是 DOM 节点。");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): 参数 swhere 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。");
			me[typeof html === 'string' ? 'insertAdjacentHTML' : 'insertAdjacentElement'](swhere, html);
			switch (swhere) {
				case "afterEnd":
					html = me.nextSibling;
					break;
				case "beforeBegin":
					html = me.previousSibling;
					break;
				case "afterBegin":
					html = me.firstChild;
					break;
				default:
					html = me.lastChild;
					break;
			}

			return p.$(html);
		} : function(html, swhere) {

			var me = this.getDom();

			assert.notNull(html, "Element.prototype.insert(html, swhere): 参数 {html} ~。");
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.getDom() 返回的必须是 DOM 节点。");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): 参数 {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", swhere);
			if (!html.nodeType) {
				html = e.parse(html);
			}

			switch (swhere) {
				case "afterEnd":
					if(!me.nextSibling) {

						assert(me.parentNode != null, "Element.prototype.insert(html, swhere): 节点无父节点时无法插入 {this}", me);

						me.parentNode.appendChild(html);
						break;
					}

					me = me.nextSibling;
				case "beforeBegin":
					assert(me.parentNode != null, "Element.prototype.insert(html, swhere): 节点无父节点时无法插入 {this}", me);
					me.parentNode.insertBefore(html, me);
					break;
				case "afterBegin":
					if (me.firstChild) {
						me.insertBefore(html, me.firstChild);
						break;
					}
				default:
					assert(arguments.length == 1 || !swhere || swhere == 'beforeEnd', 'Element.prototype.insert(html, swhere): 参数 {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。', swhere);
					me.appendChild(html);
					break;
			}

			return html;
		},

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {Boolean} escape 是否转义 HTML 代码，这样插入的为文本。
		 * @return {Element} 元素。
		 */
		append: function(html, escape) {
			var me = this;


			assert.notNull(html, "Element.prototype.append(html, escape): 参数 {html} ~。");

			if(!html.nodeType) {
				html = escape ? getDoc(me.getDom()).createTextNode(html) : e.parse(html);
			}

			assert.isNode(html, "Element.prototype.append(html, escape): 参数 {html} 不是合法的 节点或 HTML 片段。");
			return me.appendChild(html);
		},

		/**
		 * 将一个节点用html包围。
		 * @param {String} html 内容。
		 * @return {Element} 元素。
		 */
		wrapWith: function(html) {
			html = this.replaceWith(html);
			while(html.lastChild)
				html = html.lastChild;
			html.appendChild(this.getDom());
			return html;
		},

		/**
		 * 将一个节点用另一个节点替换。
		 * @param {String} html 内容。
		 * @return {Element} 元素。
		 */
		replaceWith: function(html) {


			assert.notNull(html, "Element.prototype.replaceWith(html): 参数 {html} ~。");
			if (!html.nodeType) {
				html = e.parse(html);
			}

			var me = this.getDom();

			assert(me.parentNode, 'Element.prototype.replaceWith(html): 当前节点无父节点，不能执行此方法 {this}', me);
			assert.isNode(html, "Element.prototype.replaceWith(html, escape): 参数 {html} ~或 HTM 片段。");
			me.parentNode.replaceChild(html, me);
			return html;
		}

	}, 3)

	.implement({

		/**
		 * 设置节点的父节点。
		 * @method renderTo
		 * @param {Element} elem 节点。
		 * @return {Element} this
		 */
		renderTo: function(elem) {

			elem = elem && elem !== true ? p.$(elem) : document.body;

			assert.isNode(elem, 'Element.prototype.renderTo(elem): 参数 {elem} ~。');
			assert.isNode(this.getDom(), "Element.prototype.render{this.getDom()} 必须返回 DOM 节点。返回 DOM 节点。");

			if (this.getDom().parentNode !== elem) {

				// 插入节点
				elem.appendChild(this.getDom());
			}

			// 返回
			return this;
		},

		/**
		 * 删除元素子节点或本身。
		 * @param {Object/undefined} child 子节点。
		 * @return {Element} this
		 */
		remove: function(child) {
			var me = this.getDom();
			assert(child && this.hasChild(child), 'Element.prototype.remove(child): 参数 {child} 不是当前节点的子节点', child);
			child ? this.removeChild(child) : ( me.parentNode && me.parentNode.removeChild(me) );
			return this;
		},

		/**
		 * 删除一个节点的所有子节点。
		 * @return {Element} this
		 */
		empty: function() {
			assert.isNode(this.getDom(), "Element.prototype.empty(): {this.getDom()} 必须返回 DOM 节点。");
			e.empty(this.getDom());
			return this;
		},

		/**
		 * 释放节点所有资源。
		 * @method dispose
		 */
		dispose: function() {
			assert.isNode(this.getDom(), "Element.prototype.dispose(): {this.getDom()} 必须返回 DOM 节点。");
			e.dispose(this.getDom());
		}

	}, 2);

	/**
	 * 返回元素指定节点。
	 * @param {Element} elem 节点。
	 * @param {Number/Function/undefined/undefined} fn 过滤函数。
	 * @param {String} walk 路径。
	 * @param {String} first 第一个节点。
	 * @return {Element} 节点。
	 * @ignore
	 */
	function walk(elem, fn, walk, first) {
		elem = elem[first];
		while (elem) {
			if (elem.nodeType == 1 && fn(elem)) {
				return p.$(elem);
			}
			elem = elem[walk];
		}
		return null;
	}

	/**
	 * 返回元素满足条件的节点的列表。
	 * @param {Element} elem 节点。
	 * @param {Number/Function/undefined} fn 过滤函数。
	 * @param {String} walk 路径。
	 * @param {String} first 第一个节点。
	 * @return {ElementList} 集合。
	 * @ignore
	 */
	function dir(elem, fn, walk, first) {
		elem = elem[first || walk];
		var es = [];
		while (elem) {
			if (elem.nodeType == 1 && fn(elem)) {
				es.push(elem);
			}
			elem = elem[walk];
		}
		return new ElementList(es);
	}

	/**
	 * 删除由于拷贝导致的杂项。
	 */
	function clean(srcElem, destElem, copyDataAndEvent, keepid) {
		if (!keepid)
			destElem.removeAttribute('id');

		/// #ifdef SupportIE8

		if( destElem.mergeAttributes) {

			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			destElem.removeAttribute("data");
			// 在 IE delete destElem.data  出现异常。
			//if(srcElem.data)
			//	destElem.data = null;   // IE  将复制 node.data


			if (srcElem.options) {
				o.update(srcElem.options, 'selected', destElem.options, true);
			}
		}

		/// #endif

		if (copyDataAndEvent) {
			p.cloneData(srcElem,  destElem);
		}


		var prop = properties[srcElem.tagName];
		if (prop)
			destElem[prop] = srcElem[prop];
	}

	/**
	 * 执行简单的选择器。
	 * @param {Element} elem 元素。
	 * @param {String} selector 选择器。
	 * @return {ElementList} 元素集合。
	 * @ignore
	 */
	function findBy(elem, selector) {
		switch(selector.charAt(0)) {
			case '.':
				elem = elem.getElementsByClassName(selector.replace(rPoint, ' '));
				break;
			case '[':
				var s = rAttr.exec(selector);
				elem = elem.getElementsByAttribute(s[1], s[3]);
				break;
			default:
				elem = elem.getElementsByTagName(selector);
				break;
		}

		return elem;
	}

	/**
	 * 获取一个选择器。
	 * @param {Number/Function/undefined} fn
	 * @return {Funtion} 函数。
	 * @ignore
	 */
	function getFilter(fn) {
		switch (typeof fn) {
			case "undefined":
				fn = Function.returnTrue;
				break;
			case "string":
				var tagName = fn.toUpperCase();
				fn = function(elem) {
					return elem.tagName == tagName;
				};

				break;
			case "number":
				var i = fn;
				fn = function(elem) {
					return --i < 0;
				};

				break;
		}

		assert.isFunction(fn, "getFilter(fn): {fn} 必须是一个函数。", fn);
		return fn;
	}

	/// #endif

	/// #region 核心

	/// #ifdef SupportIE6

	try {

		//  修复IE6 因 css 改变背景图出现的闪烁。
		document.execCommand("BackgroundImageCache", false, true);
	} catch(e) {

	}

	/// #endif

	div = null;

	/// #endregion

})(this);