//===========================================
//  元素   Element.js
//  Copyright(c) 2009-2011 xuld
//===========================================

// 如果只需要纯净的 element ，定义 NO_CONTROL 

(function(w) {
	
	/// #region Core

    /**
     * Py 简写。
     * @type Py
     */
    var p = w.Py,

	    /**
	     * document 简写。
	     * @type Document
	     */
	    d = w.document,
		
		/**
		 * 被测元素。
		 * @type Element
		 */
		div = d.createElement('div'),
		
		/**
		 * 元素。
		 * @class Element
		 */
		e = p.Element, 
		
		/**
		 * 元素原型。
		 * @type Object
		 */
		ep = e.prototype,
		
		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,
		
		/**
		 * Object  简写。
		 * @type Object
		 */
		o = Object,
		
		/**
		 * "Py" 简写。
		 * @type String
		 */
		PY = "Py",
		
		/**
		 * 空函数。
		 * @type Function
		 */
		emptyFn = Function.empty,
		
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
		 * Object.extend
		 * @type Function
		 */
		apply = o.extend,
		
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
		},
		
		/// #ifndef NO_CONTROL
		
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
		Control = p.namespace(PY, "Control", p.Class({
			
			/**
			 * 封装的节点。
			 * @property dom
			 * @type Element
			 */
			dom: null,
			
			/**
			 * xType 。
			 * @property xType
			 * @type String
			 */
			xType: "control",
			
			/**
			 * 获取当然控件对应的元素。
			 * @return {Element}
			 */
			getDom: function(){
				return this.dom;
			},
		
			/**
			 * 根据一个节点返回。
			 * @param {String/Element/Object} [options] 对象的 id 或对象或各个配置。
			 * @constructor Control
			 */
			constructor: function (options) {
				
				var me = this,
					t = o.clone.call(1, me.options) || {},
					d;
				
				// 如果存在配置。
				if (options) {
					
					// 存在的为 Element 。
					if (typeof options == 'string' || options.nodeType) {
						d = options;
					} else {
						
						// 保存 dom 。
						d = options.dom;
						delete options.dom;
						apply(t, options);
					}
				}
				
				// 赋值。
				me.dom = d ? p.$(d) : me.create(t);
				
				// 初始化控件。
				me.init(t);
				
				// 复制各个选项。
				p.Class.extend(me, t);
			},
			
			/**
			 * 当被子类重写时，生成当前控件。
     		 * @method create
			 * @param {Object} options 选项。
			 * @protected
			 */
			create: function() {
				
				// 转为对 tpl解析。
				return e.parse(this.tpl);
			},
			
			/**
			 * 当被子类重写时，渲染控件。
     		 * @method init
     		 * @param {Object} [options] 配置。
     		 * @protected
			 */
			init: emptyFn,
			
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
					
				p.cloneData(this, newControl);
					
				return newControl;

			}
			
		}));
		
		/// #else
		
		/// ;
		
		/// #endif
		
	function getDoc(elem) {
		return elem.ownerDocument || elem.document || elem;
	}
	
	/// #ifndef NO_CONTROL

	apply(Control, {
		
		/**
		 * 设置类的基类。
		 * @type Element
		 */
		base: e,
		
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
						var onName = 'on' + delegate;
						delegate = delegate.toLowerCase();
						control.prototype[onName] = function(){
							this.trigger(delegate);
						}; 
						return  function(args1, args2){
							this.getDom()[name](args1, args2);
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
		
		getProxy: function(className){
			var p = document.getElementById('py_proxy');
			if(!p){
			
				p = d.createDiv()
					.setAttr('id', 'py_proxy')
					.setStyle('display: none; position: absolute; overflow: hidden;')
					.renderTo();
					
				/**
				 * 打开代理元素。
				 */
				p.alignTo = function(elem){
					
					return this.show()
							.setOffset(elem.getOffsets())
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
		
	/// #endif
		
	///   #region ElementList

    /**
     * 节点集合。
     * @class ElementList
     */
    p.namespace(PY, "ElementList", p.Class({

        /**
         * 初始化 ElementList  实例。
         * @param {Array/ElementList} doms 节点集合。
         * @constructor ElementList
         */
        constructor: function(doms) {
			
            this.doms = doms;
			
			if(doms[0] && !doms[0].xType) {
				o.update(doms, p.$);
			}
			
        },
		
		/**
         * 对集合每个元素执行一次函数。
		 * @method each
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
	 * @namespace Element
	 */
	apply(e,  {
		 
	    /**
	     * 转换一个HTML字符串到节点。
		 * @method parse
	     * @param {String/Element} html 字符。
	     * @param {Document} context 内容。
	     * @param {Boolean} cachable=true 是否缓存。
	     * @return {Element} 元素。
	     */
	    parse: function(html, context, cachable) {
				
			var div = cache[html];
	
	        if (!div) {
			
				context = context || d;
				
				// 过滤空格  // 修正   XHTML
				var h = html.trim().replace(rXhtmlTag, "<$1></$2>"), tag = rTagName.exec(h), notSaveInCache = cachable !== false && rNoClone.test(html);
				
				
				if (tag) {
				
					div = context.createElement("div", true);
					
					var wrap = wrapMap[tag[1].toLowerCase()];
					
					if (wrap) {
						var depth = wrap[0];
						div.innerHTML = wrap[1] + h + wrap[2];
						
						// 转到正确的深度
						while (depth--) 
							div = div.lastChild;
						
					} else div.innerHTML = h;
					
					// 一般使用最好的节点， 如果存在最后的节点，使用父节点。
					div = div.firstChild;
					
					/// #ifndef Std
					
					p.$(div);
					
					/// #endif
					
				} else {
				
					// 创建文本节点。
					div = context.createTextNode(html);
				}
				
			}
			
			if(!notSaveInCache)
				cache[html] = div.clone ? div.clone(false, true) : div.cloneNode(false);
	
	        return div;
	
	    },
	
		/**
		 * 将一个成员附加到 Element 对象和相关类。
		 * @method implement
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。 
		 * @param {Number} docType = 2 说明如何复制到 Document 实例。 
		 * @return {Element} this
		 * 对 Element 扩展，内部对 Element ElementList document Control 皆扩展。
		 * 这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。
		 * 所谓的扩展，即使一个类含需要的函数。
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
		 *  对 Element , 按 docType，
		 *     其它，复制。(默认1)
		 *     0, 不复制。
		 *
		 *  对 ElementList ，按 listType，
		 *      1, 其它 - 执行结果是数据，返回结果数组。 (默认)
		 *  	2 - 执行结果返回 this， 返回 this 。
		 * 		3 - 执行结果是DOM，返回 ElementList 包装。
		 * 		4 - 执行结果是DOM数组，返回 ElementList 包装。 
		 * 		5 - 不复制。
		 * 
		 *  对 document ， 按 docType，
		 *  	0，1 - 复制。(默认1) 
		 *  	>1 - 不复制。
		 * 		
		 *  对 Control  ， 按 docType，
		 *  	1, 2 - 复制。(默认1) 
		 *  	<1 - 不复制。
		 *  
		 *  
		 *  参数 copyIf 仅内部使用。
		 */
		implement: function (obj, listType, docType, copyIf) {
			
			o.each(obj, function(value, key) {
				
				//  复制到  Element.prototype
				if(docType != 0 && (!copyIf || !(key in ep)))
					ep[key] = value;
					
				/// #ifndef NO_CONTROL
				
				//  复制到 Control.prototype
				if(!(docType < 1)  && !(key in Control.prototype))
					Control.prototype[key] = value;
					
				/// #endif
				
				//  复制到 Document
				if (!(docType > 1) && !(key in d))
					d[key] = value;
				
				// 复制到  ElementList
				switch (listType) {
					case 2:
						fn =  function() {
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
							return new p.ElementList(Array.plain.apply(Array, this.each(function(elem, index){
								var r = this[index][key].apply(this[index], args);
								return r && r.doms || r;
							}, this.doms)));
						};
						
						break;
					case 5:
						return;
					default:
						fn = function() {
							return this.each(key, arguments);
						};
						break;
				}
				
				p.ElementList.prototype[key] = fn;
					
			});
			
			/// #ifndef Std
			
			if(ep.domVersion){
				ep.domVersion++;
			}
			
			/// #endif
			
			return this;
		},
		
		/**
		 * 若不存在，则将一个对象附加到 Element 对象。
		 * @method implementIf
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType 说明如何复制到 ElementList 实例。
		 * @param {Number} docType 说明如何复制到 Document 实例。
		 * @return {Element} this
		 */
		implementIf: function (obj, listType, docType) {
			return this.implement(obj, listType, docType, true);
		},
		
		/**
		 * 获取一个元素的文档。
		 * @param {Element/Document/Window} elem 元素。
		 * @return {Document} 当前节点所在文档。
		 */
		getDocument: getDoc
		
	});
	
	apply(d, {
	   
		/**
		* 生成一个层。
		* @param {String} className 类。
		* @return {Element} 节点。
		*/
		createDiv: function(className){
			
			return d.create("div", className);
		},
		
		create: function(tagName, className){
					
			/// #ifdef Std
			
			/// var div = d.createElement(tagName);
			
			/// #else
			var div = p.$(d.createElement(tagName));
			/// #endif
			
			div.className = className;
			
			return div;
		},

	    /**
	     * 根据元素返回节点。
		 * @method getElements
	     * @param {String/Element} ... 对象的 id 或对象。
		 * @memberOf document
	     */
	    getElements: function() {
	        return new p.ElementList(o.update(arguments, this.getElement, [], this));
	    },
		
		/// #ifndef Std
		
	    /**
	     * 根据一个 id 或 对象获取节点。
		 * @method getElement
	     * @param {String/Element} id 对象的 id 或对象。
		 * @memberOf document
	     */
	    getElement: function(id) {
	        return p.$(this.id(id));
	    }
		
		/// #else
		
		///  getElement: d.id
		
		/// #endif
	});
	
	/// #endregion
	
	/// #region EventCore
	
	/**
	 * EventArgs.prototype 的简写。
	 * @type EventArgs
	 */
	var pep = p.EventArgs.prototype,
		
		/**
		 * eventArgs
		 * @type Function
		 */
		c,
	
	    /**
	     * mouseEvntArgs。
	     * @type Function
	     */
	    mc,
		
		/**
	     * keyEvntArgs。
	     * @type Function
	     */
		kc;
		
	/// #ifndef Std

    if (navigator.isStd) {
		
	/// #endif

        mc = kc = c = function(e) {
			
			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

            //重写  preventDefault
            p.Class.addCallback(e, 'preventDefault', pep.preventDefault);

        };
		
	/// #ifndef Std

    } else {   //  for IE6/IE7/IE8
		
        c = function(e) {
            e.target = e.srcElement || d;
            e.stopPropagation = pep.stopPropagation;
            e.preventDefault = pep.preventDefault;
        };
		
        // mouseEventArgs
		mc = function(e) {
			c(e);
			e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
			var dom = getDoc(e.target).getDom();
			e.pageX = e.clientX + dom.scrollLeft;
			e.pageY = e.clientY + dom.scrollTop;
			e.layerX = e.x;
			e.layerY = e.y;
			//  1 ： 单击  2 ：  中键点击 3 ： 右击
			e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));

		};

		// keyEventArgss
		kc = function(e) {
			c(e);
			e.which = e.keyCode;
		};
		
    }
		
	/// #endif

    p.defineDomEvents
		("click dblclick mouseup mousedown contextmenu mouseover mouseout mousemove selectstart selectend mouseenter mouseleave", undefined, mc)
		("mousewheel DOMMouseScroll blur focus focusin focusout scroll change select submit error", undefined,  c)
		("keydown keypress keyup", undefined, kc)
		("load unload", undefined, function(e){
			this.un(e.type);
		});

    e.implement(p.IEvent, 2);
	
    /// #endregion

    if(navigator.isFirefox)
        p.defineDomEvents('mousewheel', 'DOMMouseScroll');
    if (!navigator.isIE) {
        p.defineDomEvents('mouseenter', 'mouseover').trigger = p.defineDomEvents('mouseleave', 'mouseout').trigger = function(e) {
            p.Events.element[e.type].trigger(e);

            var parent = e.relatedTarget;
            while (parent && parent != this) {
                parent = parent.parentNode;
            }

            e.returnValue = this != parent;
        }
    }
	
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
	    rNumPx = /^-?\d+(?:px)?$/i,
	
	    /**
	     * 是否为数字的正则表达式。
	     * @type RegExp
	     * @private
	     */
	    rNum = /^-?\d/,
		
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
	
		styleMaps = {
			width: {
				b: [borderLeftWidth, 'borderRightWidth'],
				p: ['paddingLeft', 'paddingRight'],
				m: ['marginLeft', 'marginRight'],
				d: ['left', 'right']
			},
			height: {
				b: [borderTopWidth, 'borderBottomWidth'],
				p: ['paddingTop', 'paddingBottom'],
				m: ['marginTop', 'marginBottom'],
				d: ['top', 'bottom']
			}
		},
		
		/// #ifndef Std
		
		/**
		 * 特殊属性的正则表达式。
		 * @type RegExp
	     * @private
		 */
		rSpecilAttr = /^(?:href|src|usemap)$/i,
		
		/// #endif
		
		
		/// #ifndef Html
		
		/**
		 * 是否使用方法 getComputedStyle。
		 * @type Boolean
		 * @private
		 */
		defaultView = d.defaultView.getComputedStyle,
	
		/**
		 * 获取元素的计算样式。
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 * @private
		 */
		getStyle = defaultView ? function(elem, name) {

			// 获取样式
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null); 
			
			// 返回 , 在 火狐如果存在 IFrame， 则  computedStyle == null
			//    http://drupal.org/node/182569
			return computedStyle ? computedStyle[ name ] : null;

		} : function(elem, name) {
			
			if(name in attributes) {
				switch(name) {
					case 'height':
						return elem.offsetHeight - e.getSize(elem, name, 'pb') + 'px';
					case 'width':
						return elem.offsetWidth - e.getSize(elem, name, 'pb') + 'px';
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
	
	/**
	 * @namespace Element
	 */
	apply(e, {
		
		/**
		 * 获取元素的计算样式。
		 * @method getStyle
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 * @private
		 */
		getStyle: getStyle,
		
		/**
	     * 读取样式字符串。
	     * @method styleString
	     * @param {Element} elem 元素。
	     * @param {String} name 属性名。
	     * @return {String} 字符串。
	     * @private
	     */
		styleString:  styleString,
		
		/**
	     * 读取样式数字。
	     * @method styleNumber
	     * @param {Element} elem 元素。
	     * @param {String} name 属性名。
	     * @return {String} 字符串。
	     * @private
	     */
		styleNumber: styleNumber,
		
		/**
		 * 将 offsetWidth 转为 style.width。
		 * @method widthPadding
		 * @param {Element} elem 元素。
	     * @param {Number} width 输入。
	     * @return {Number} 转换后的大小。
	     * @private
		 */
		getSize: defaultView ? function (elem, type, names) {
			var value = 0, map = styleMaps[type], i = names.length, val, currentStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(currentStyle[val[0]]) || 0) + (parseFloat(currentStyle[val[1]]) || 0);
			}
			
			return value;
		} : function (elem, type, names) {
			var value = 0, map = styleMaps[type], i = names.length, val;
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(getStyle(elem, val[0])) || 0) + (parseFloat(getStyle(elem, val[1])) || 0);
			}
			
			return value;
		},
		
		/**
		 * 特殊属性集合。
		 * @property attributes
		 * @type Object
		 * @private
		 */
		attributes: attributes,
		
		styleMaps: styleMaps,
		
		/**
		 * 特殊属性。
		 * @property specialAttr
		 * @type Object
		 * @private
		 */
		specialAttr: {},
		
		/**
		 * 默认最大的 z-index 。
		 * @property zIndex
		 * @type Number
		 * @private
		 */
		zIndex: 10000,
		
		/**
		 * 判断一个节点是否隐藏。
		 * @method isHidden
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 */
		isHidden: function(elem) {
			return elem.style.display === 'none';
		}
		
	});
	
    updateToObj("opacity height width defaultValue accessKey cellPadding cellSpacing colSpan frameBorder maxLength readOnly rowSpan tabIndex useMap", attributes); 
	
	updateToObj("Size Position Opacity Offset Scroll Offsets Style Text", e.specialAttr);

	/**
     * 读取样式字符串。
     * @param {Element} elem 元素。
     * @param {String} name 属性名。
     * @return {String} 字符串。
     */
	function styleString(elem, name) {
        return elem.style[name] || getStyle(elem, name);
    }
	
	/**
     * 读取样式数字。
     * @param {Object} elem 元素。
     * @param {Object} name 属性名。
     * @return {Number} 数字。
     */
    function styleNumber(elem, name) {
        return parseFloat(getStyle(elem, name)) || 0;
    }
    
	/**
	 * 将属性拷贝到目标。
	 * @param {String} props 属性字符串。
	 * @param {Object} target 目标。
	 */
	function updateToObj(props, target) {
		props.split(' ').forEach(function(value) { target[value.toLowerCase()] = value; });
	}
		
	function setSize(me, fix, x ,y){
		var p = getXY(x,y);
		
		if(p.x != null)
			me.setWidth(p.x - e.getSize(me.getDom(), 'width', fix));
		
		if (p.y != null)
			me.setHeight(p.y - e.getSize(me.getDom(), 'height', fix));
			 
		return me;
	}
	
	e.implement( {
	
        /**
         * 获取节点样式。
		 * @method getStyle
         * @param {String} key 键。
         * @param {String} value 值。
         * @return {String} 样式。
         */
        getStyle: function(name) {

            var me = this.getDom(), css = name.toCamelCase();
			
			assert(me.style, "当前元素不存在 style 属性");

            return me.style[css] || getStyle(me, css);

        },
		
		/**
         * 获取一个节点属性。
		 * @method getAttr
         * @param {String} name 名字。
         * @return {String} 属性。
         */
        getAttr: function(name) {
			return e.getAttr(this.getDom(), name);
        },
		
        /**
         * 检查是否含指定类名。
		 * @method hasClass
         * @param {String} className
         * @return {Boolean} 如果存在返回 true。
         */
        hasClass: function(className) {
			return e.hasClass(this.getDom(), className);
		},
		
        /**
         * 获取值。
		 * @method getText
         * @return {Object} 内容。
         * @return {String} 值。对普通节点返回 text 属性。
         */
        getText: function() {
            var me = this.getDom();
            switch(me.tagName) {
                case "INPUT":
                case "TEXTAREA":
                    return me.value;
                case "SELECT":
                    if(me.type != 'select-one') {
                        var r = [];
                        o.each(me.options, function(s) {
                            if(s.selected)
                                r.push(s.value)
                        });
                        return r.join(',');
                    }
                    return me.value;
                default:
                    return me[attributes.innerText];
            }
        },
		
		getHtml: function(){
			return this.getDom().innerHTML;
		},
		
		/// #ifndef Html
		
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
	
	.implement( {
        /**
         * 设置内容样式。
		 * @method setStyle
         * @param {String} name 键。
         * @param {String/Number} value 值。
         * @return {Element} this
         */
        setStyle: function(name, value) {
			
			// 获取样式
            var me = this, style = me.getDom().style;

			assert(style, "当前元素不支持定义 css");

			//没有键  返回  cssText
			if (arguments.length == 1) {
				style.cssText = name;
			} else {
				
				if(name in attributes) {
					name = attributes[name];
					
					/// #ifndef Html
					
					if(name == 'opacity') {
						return me.setOpacity( value);
					}
					
					/// #endif
				}else
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
		 * @method setAttr
         * @param {String} name 名字。
         * @param {String} value 值。
         * @return {Element} this
         */
        setAttr: function(name, value) {

            //简写
            var me = this.getDom();

            //属性
            name = attributes[name] || name;

            // 如果是节点具有的属性
            if (name in me) {
				
				
				/// #ifndef Std
				
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
		 * @method set
		 * @param {String/Object} name 名字。
         * @param {Object} [value] 值。
         * @return {Element} this
		 */
		set: function(name, value) {
			
			var me = this;
			
			if (typeof name === "string") {
				
				// 允许 this 为 Element 或 Control
				var dom = me.getDom();
				
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
		 * @method addClass
         * @param {String} className 类名。
         * @return {Element} this
         */
        addClass: function(className) {
            var me = this.getDom();
            if(!me.className)
                me.className = className;
            else
                me.className += ' ' + className;
            return this;
        },
		
        /**
         * 删除类名。
		 * @method removeClass
         * @param {String} className 类名。
         * @return {Element} this
         */
        removeClass: function(className) {
            this.getDom().className = className ? this.getDom().className.replace(new RegExp('\\b' + className + '\\b\\s*', "g"), '') : '';
            return this;
        },
		
		 /**
         * 切换类名。
		 * @method toggleClass
         * @param {String} className 类名。
         * @return {Element} this
         */
        toggleClass: function(className, toggle) {
            return (toggle !== undefined ? !toggle : this.hasClass(className)) ? this.removeClass(className) : this.addClass(  className  );
        },
		
        /**
         * 设置值。
		 * @method setText
         * @param {String/Boolean} 值。
         * @return {Element} this
         */
        setText: function(value) {
            var me = this.getDom();
            switch(me.tagName) {
                case "INPUT":
                case "TEXTAREA":
                case "SELECT":
                    if(me.type === 'select-multiple') {
                        if(!o.isArray(value))
                            value = value.split(',');
                        o.each(me.options, function(e) {
                            e.selected = value.contains(e.value);
                        });
                    } else
                        me.value = value;
                    break;
                default:
                    me[attributes.innerText] = value;
            }
            return  this;
        },
		
		setHtml: function(value){
			this.getDom().innerHTML = value;
			return this;
		},
		
		/// #ifndef Html
		
        /**
         * 设置连接的透明度。
		 * @method setOpacity
         * @param {Number} value 透明度， 0 - 1 。
         * @return {Element} this
         */
        setOpacity: !('opacity' in div.style) ? function(value) {

            var style = this.getDom().style;

            // 当元素未布局，IE会设置失败，强制使生效
            style.zoom = 1;

            // 设置值
            style.filter = (style.filter || 'alpha(opacity=?)').replace(rOpacity, "opacity=" + value * 100);

            //返回值， 保证是字符串  值为  0 - 100
            return this;

        } : function(value) {

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
		 * @method show
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack) {
			this.getDom().style.display = '';
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},
		
		/**
		 * 隐藏当前元素。
		 * @method hide
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function(duration, callBack) {
			this.getDom().style.display = 'none';
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},
		
		/**
		 * 设置元素不可选。
		 * @method setUnselectable
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function(value) {
			this.getDom().unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function(value) {
			this.getDom().onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function(value) {
			this.getDom().style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},
		
		/**
		 * 将元素引到最前。
		 * @method bringToFront
		 * @param {Element} [elem] 参考元素。
		 * @return this
		 */
		bringToFront: function(elem) {
			this.getDom().style.zIndex = Math.max(parseInt(styleString(this.getDom(), 'zIndex')) || 0, elem && elem.nodeType && (parseInt(styleString(elem, 'zIndex')) + 1) || e.zIndex++);
			return this;
		},
		
		/**
		 * 切换显示当前元素。
		 * @method toggle
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		toggle: function(duration, callBack, type, flag) {
			return this[(flag === undefined ? e.isHidden(this.getDom()) : flag) ? 'show' : 'hide']  (duration, callBack, type);
		},
		
		/**
		 * 变化到某值。
		 * @method animate
		 * @param {String} value 变化的值。可以为 height opacity width all size position left top right bottom。
		 * @param {Function} [callBack] 回调。
		 * @param {Number} duration=500 时间。
		 * @param {String} [type] 类型。
		 * @return this
		 */
		animate: function (name, value, duration, callBack){
			if(typeof value === 'object'){
				name = value;
				value = undefined;
			} else if(typeof duration === 'function')
				callBack = duration;
			
			this.set(name, value);
			if(callBack)
				setTimeout(callBack, 0);
					
			return  this;
		}
		
	}, 2);
	
	
	/// #endif
	
	/// #ifdef Position
	
	var rBody = /^(?:body|html)$/i,
		
		/**
		 * 表示一个点。
		 * @class Point
		 * @memberOf Py.Drawing
		 */
		Point = p.namespace(PY, "Point", p.Class({
			
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
	 * @class Document
	 */
	e.implement( {
		
		/**
		 * 获取元素可视区域大小。
		 * @method getWindowSize
		 * @return {Point} 位置。
		 */
		getWindowSize:function() {
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
		getOffsets: getWindowScroll,

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
		
	}, 5, 0)
	
	.implement( {
		
		/**
		 * 获取滚动区域大小。
		 * @method getScrollSize
		 * @return {Point} 位置。
		 */
        getScrollSize: function() {
			var me = this.getDom();
			return new Point(me.scrollWidth, me.scrollHeight);
        },
		
		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var me = this.getDom();
			return new Point(me.offsetWidth, me.offsetHeight);
		},
		
		/**
		 * 获取元素可视区域大小。包括 margin 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getOuterSize: function(){
			var me = this.getDom();
			return this.getSize().add(e.getSize(me, 'width', 'm'), e.getSize(me, 'height', 'm'));
		},
		
		/**
		 * 获取元素的相对位置。
		 * @method getOffset
		 * @return {Point} 位置。
		 */
		getOffset: function() {
			
			// 如果设置过 left top ，这是非常轻松的事。
			var me = this.getDom(),
				left = me.style.left,
				top = me.style.top;
				
			// 如果未设置过。
			if (!left || !top) {
				
				// 绝对定位需要返回绝对位置。
				if(checkPosition(me, 'absolute'))
					return this.getPosition(this.getOffsetParent());
				
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
		getWidth: function(){
			var me = this.getDom(), width = parseFloat(me.style.width);
			return isNaN(width) ? styleNumber(me, 'width') : width;
		},
	
        /**
		 * 获取元素自身大小（不带滚动条）。
		 * @method getWidth
		 * @return {Point} 位置。
		 */
		getHeight: function(){
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
			var p = this.getOffsets(), s = this.getSize();
			return {
				left: p.x,
				top: p.y,
				right: p.x + s.x,
				bottom: p.y + s.y
			};
		},
		
        /**
         * 获取距父元素的偏差。
		 * @method getOffsets
         * @return {Point} 位置。
         */
        getOffsets: div.getBoundingClientRect   ? function() {

            var me = this.getDom(),
				bound = me.getBoundingClientRect(),
				doc = getDoc(me),
				html = doc.getDom(),
				htmlScroll = checkPosition(me, 'fixed') ? {x:0, y:0} : doc.getScroll();

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
		 * @method getPosition
         * @param {Element/String/Boolean} relative 相对的节点。
         * @return {Point} 位置。
         */
        getPosition: function( relative) {
			if (isBody(this.getDom())) return new Point(0, 0);
            var me = this.getDom(), pos = this.getOffsets().minus(getScrolls(me));
			if(relative)
				pos.minus(p.$(relative).getPosition()).add( -styleNumber(me, 'marginLeft') - styleNumber(relative, borderLeftWidth) ,-styleNumber(me, 'marginTop') - styleNumber(relative,  borderTopWidth) );
            return pos;
        },
		
        /**
         * 获取用于作为父元素的节点。
		 * @method getOffsetParent
         * @return {Element} 元素。
         */
        getOffsetParent: function() {
			var elem = this.getDom().offsetParent || getDoc(this.getDom()).body;
			while ( elem && !isBody(elem) && checkPosition(elem, "static") ) {
				elem = elem.offsetParent;
			}
            return elem;
        }
		
	})
	
	.implement( {
		
        /**
         * 改变大小。
		 * @method setSize
         * @param {Number} x 坐标。
         * @param {Number} y 坐标。
         * @return {Element} this
         */
        setSize: function(x, y) {
			return setSize(this, 'pb', x, y);
        },
	
		setOuterSize: function(x, y){
			return setSize(this, 'mpb', x, y);
		},
		
        /**
		 * 获取元素自身大小（不带滚动条）。
		 * @method setWidth
		 * @return {Element} this
		 */
		setWidth: function(value){
			this.getDom().style.width = (value > 0 ? value : 0) + 'px';
			return this;
		},
	
        /**
		 * 获取元素自身大小（不带滚动条）。
		 * @method setHeight
		 * @return {Element} this
		 */
		setHeight: function(value){
			this.getDom().style.height = (value > 0 ? value : 0) + 'px';
			return this;
		},
		
		/**
         * 滚到。
		 * @method setScroll
         * @param {Element} dom
         * @param {Number} x 坐标。
         * @param {Number} y 坐标。
         * @return {Element} this
         */
        setScroll: function(x, y) {
            var me = this.getDom(), p = getXY(x,y);
	        if(p.x != null)
	            me.scrollLeft = p.x;
	        if(p.y != null)
	        	me.scrollTop = p.y;
            return this;
			
        },
		
		/**
		 * 设置元素的相对位置。
		 * @method setOffset
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function(p) {
			var s = this.getDom().style;
			s.top = p.y + 'px';
			s.left = p.x + 'px';
			return this;
		},

		/**
         * 设置元素的固定位置。
		 * @method setPosition
         * @param {Number} x 坐标。
         * @param {Number} y 坐标。
         * @return {Element} this
         */
		setPosition: function(x, y) {
			var me = this, offset = me.getOffset().minus(me.getOffsets()), p = getXY(x,y);
		   
			if (p.x)
				offset.x += p.x;
			   
			if (p.y)
				offset.y += p.y;
			   
            e.setMovable(me.getDom());
			
            return me.setOffset(offset);
		}
		
    } ,2);
	
	/**
	 * @namespace Element
	 */
	apply(e, {
		
		/**
		 * 设置一个元素可拖动。
		 * @method setMovable
		 * @param {Element} elem 要设置的节点。
		 */
		setMovable: function(elem) {
		   assert(elem && elem.nodeType, "参数 elem 必须是 Element");
		   if(!checkPosition(elem, "absolute"))
			   elem.style.position = "relative";
		},
		
		/**
		 * 检查元素的 position 是否和指定的一致。
		 * @param {Element} elem 元素。
		 * @param {String} position 方式。
		 * @return {Boolean} 一致，返回 true 。
		 */
		checkPosition: checkPosition,
		
		getXY: getXY
	
	});
	
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
		return new Point(doc.scrollLeft, doc.scrollTop);
	}

    /**
     * 检查是否为 body 。
     * @param {Element} elem 内容。
     * @return {Boolean} 是否为文档或文档跟节点。
     * @private
     */
    function isBody(elem) {
        return rBody.test(elem.nodeName);
    }
	
	/**
	 * 未使用盒子边框
	 * @param {Element} elem 元素。
	 * @return {Boolean} 是否使用。
	 * @private
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
		return o.isObject(x) ? x : {x:x, y:y};
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
		if(p.x == null) p.x = obj[method]().x;
		if(p.y == null) p.x = obj[method]().y;
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

	/// #ifdef Node
	
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
			odd: [function(elem, fn) {
				return dir(elem, function() {
					return fn = fn === false;
				}, childMap[1], childMap[2]);
			}],
			
			// 全部子节点。
			children: [ function(elem, fn) {
				return new ElementList(find(elem,  fn));
			}],
			
			// 兄弟节点。
			siblings: [ function(elem, fn) {
				return dir(elem, function(node){
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
		find = 'all' in d ? function(elem, fn) { // 返回数组
			return  Array.prototype.filter.call(elem.all, fn);
        } : function(elem, fn) {
            var ds = [], d = [elem], p, nx;
            while (d.length) {
                p = d.pop();
                for (nx = p.firstChild; nx; nx = nx.nextSibling) {
                    if (nx.nodeType != 1)
                        continue;
                    if (fn(nx)) {
                        ds.push(nx);
                    }
                    
					d.push(nx);
                }
            }

            return ds;
        };
		
	apply(e, {
		
		/**
         * 检查是否含指定类名。
		 * @method hasClass
         * @param {String} className
         * @return {Boolean} 如果存在返回 true。
         */
		hasClass: function(elem, className){
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		},

		/**
         * 获取一个节点属性。
		 * @method getAttr
         * @param {String} name 名字。
         * @return {String} 属性。
         */
		getAttr: function(elem, name){
				
			/// #ifndef Std
	
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
			
		}
		
	}) ;
	
	e.implementIf( {
		
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
		
		/// #ifndef Std

        /**
         * 根据类名返回子节点。
		 * @method getElementsByClassName
         * @param {Strung} classname 类名。
         * @return {Array} 节点集合。
         */
        getElementsByClassName: function(classname) {
			classname = classname.split(/\s/);
            return find(this.getDom(), function(elem) {
				var i = classname.length;
				while(i--) if(!e.hasClass(elem, classname[i])) return false;
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
		
		getElementsByName:  function(name) {
			return this.getElementsByAttribute('name', name);
		},
		
		/// #ifndef Std
		
		/**
		 * 执行一个简单的选择器。
		 * @method find
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		findAll: div.querySelectorAll ? function(selecter) {
			return new p.ElementList(this.getDom().querySelectorAll(selecter));
		} : function(selecter){
			var current = new p.ElementList([this.getDom()]);
			selecter.split(' ').forEach(function(v) {
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
			assert(n, 'get 函数不支持 {0}类型 的节点关联。', type);
			return n[0](this.getDom(), fn, n[1], n[2]);
		}
		
	}, 4)
	
	.implement( {
			
		/**
		 * 判断一个节点是否有子节点。
		 * @method contains
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: !div.compareDocumentPosition ? function(child) {
			var me = this.getDom();
			if(!child)
				return me.firstChild !== null;
			while(child = child.parentNode)
				if(me === child)
					return true;
			return false;
		} : function(child) {
			return !child ? this.getDom().firstChild !== null : !!(this.getDom().compareDocumentPosition(child) & 16);
		}
	}, 5)
	
	.implement( {
		
		/// #ifndef Std
		
		/**
		 * 执行一个简单的选择器。
		 * @method find
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: div.querySelector ? function(selecter){
			return this.getDom().querySelector(selecter);
		} : function(selecter) {
			var current = this.getDom();
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
		 * @method clone
         * @param {Boolean} copyListener=false 是否复制事件。
         * @param {Boolean} contents=true 是否复制子元素。
         * @param {Boolean} keepid=false 是否复制 id 。
         * @return {Element} 元素。
         */
        clone: function(copyListener, contents, keepid) {
			
			
			// from Mootools
            var me = this.getDom(),
				clone = me.cloneNode(contents = contents !== false),
				clean = function(node, element) {
					if (!keepid)
						node.removeAttribute('id');
						
					/// #ifndef Html
						
					if(node.mergeAttributes) {
						
						node.clearAttributes();
						node.mergeAttributes(element);

						// 在 IE delete element.data  出现异常。
						if(element.data)
							node.data = null;   // IE  将复制 node.data
							
					}
						
					/// #endif
					
					if (copyListener) {
						p.cloneData(element, node);
					}
					if (node.options) {
						o.update(element.options, 'selected', node.options, true);
					}
					
					var prop = properties[element.tagName];
					if (prop)
						node[prop] = element[prop];
					
				};
            if (contents) {
                for (var ce = clone.getElementsByTagName('*'), te = me.getElementsByTagName('*'), i = ce.length; i--;)
                    clean(ce[i], te[i]);
            }

            clean(clone, me);
					
			/// #ifdef Std
			
			if (navigator.isQuirks) {
				o.update(me.getElementsByTagName('object'), 'outerHTML', clone.getElementsByTagName('object'), true);
			}
						
			/// #endif
			
            return clone;
        },
		
		/**
		 * 在某个位置插入一个HTML 。
		 * @method insert
		 * @param {String/Element} html 内容。
		 * @param {String} [swhere] 插入地点。 beforeBegin   节点外    beforeEnd   节点里    afterBegin    节点外  afterEnd     节点里
		 * @return {Element} 插入的节点。
		 */
		insert: 'insertAdjacentElement' in div ? function(html, swhere) {
			var me = this.getDom();
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
			 
			 return Py.$(html);
		} : function(html, swhere) {
			
			var me = this.getDom();
			
			if (typeof html === 'string') {
				return manip(this, 'insert', html, swhere);
			}

			switch (swhere) {
				case "afterEnd":
					if(!me.nextSibling) {
						
						assert(me.parentNode != null, "目标节点无父节点时无法插入 ");
						
						me.parentNode.appendChild(html);
						break;
					}
					
					me = me.nextSibling;
				case "beforeBegin":
					assert(me.parentNode != null, "目标节点无父节点时无法插入 ");
					me.parentNode.insertBefore(html, me);
					break;
				case "afterBegin":
					if (me.firstChild) {
						me.insertBefore(html, me.firstChild);
						break;
					}
				default:
					me.appendChild(html);
					break;
			 }
			 
			 return html;
		},

		/**
		 * 插入一个HTML 。
		 * @method append
		 * @param {String/Element} html 内容。
		 * @param {Boolean} escape 是否转义 HTML 代码，这样插入的为文本。
		 * @return {Element} 元素。
		 */
		append: function(html, escape) {
			var me = this;
			
			if(typeof html === 'string'){
				if(escape)
					html = getDoc(me.getDom()).createTextNode(html);
				else
					return manip(me, 'append', html);
			}
			return me.appendChild(html);
		},
		
		/**
		 * 将一个节点用html包围。
		 * @method wrapWith
		 * @param {String} html 内容。
		 * @return {Element} 元素。
		 */
		wrapWith: function(html) {
			var node = html = this.replaceWith(html);
			while(node.firstChild) node = node.firstChild;
			node.appendChild(this.getDom());
			return html;
		},
		
		/**
		 * 将一个节点用另一个节点替换。 
		 * @method replaceWith
		 * @param {String} html 内容。
		 * @return {Element} 元素。
		 */
		replaceWith: function(html) {
		
			var me = this;
			
			assert(me.parentNode, '当前节点无父节点，不能执行此方法');
			if (typeof html === 'string') {
				return manip(me, 'replaceWith', html);
			}
			
			me = me.getDom();
			return me.parentNode.replaceChild(html, me);
		}
	}, 3)
	
	.implement( {
			
		/**
		 * 设置节点的父节点。
		 * @method renderTo
		 * @param {Element} elem 节点。
		 * @return {Element} this
		 */
		renderTo: function(elem) {
			
			elem = elem && elem !== true ? p.$(elem) : d.body;
			
			assert(elem, '渲染的目的不是合法节点');
			
			if (this.getDom().parentNode !== elem) {
				
				// 插入节点
				elem.appendChild(this.getDom());
			}
			
			// 返回
			return this;
		},
		
		/**
         * 删除元素子节点或本身。
		 * @method remove
         * @param {Object/undefined} child 子节点。
         * @return {Element} this
         */
        remove: function(child) {
			var me = this.getDom();
            child ? this.removeChild(child) : ( me.parentNode && me.parentNode.removeChild(me) );
            return this;
        },
		
        /**
         * 删除一个节点的所有子节点。
		 * @method empty
         * @return {Element} this
         */
        empty: function() {
			empty(this.getDom());
            return this;
        },
		
        /**
         * 释放节点所有资源。
		 * @method dispose
         */
        dispose: function() {
			dispose(this.getDom());
        }
		
	}, 2);
	
	/**
     * 返回元素指定节点。
     * @param {Element} elem 节点。
     * @param {Number/Function/undefined/undefined} fn 过滤函数。
     * @param {String} walk 路径。
     * @param {String} first 第一个节点。
     * @return {Element} 节点。
     * @private
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
	 * @private
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
	
	function manip(elem, method, html, args){
		html = e.parse(html);
		var ls = html.nextSibling;
		elem[method](html, args);
		
		elem = html.parentNode;
		var newS = html.nextSibling, ns;
		while(ns = ls){
			ls = ns.nextSibling;
			elem.insertBefore(ns, newS);
		}
		
		return html;
	}
	
	/**
	 * 执行简单的选择器。
	 * @param {Element} elem 元素。
	 * @param {String} selector 选择器。
	 * @return {ElementList} 元素集合。
	 */
	function findBy(elem, selector){
		switch(selector.charAt(0)){
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
	 * @private
	 */
	function getFilter(fn) {
		switch (typeof fn) {
			case "undefined":
				fn = Function.returnTrue;
				break;
			case "string":
				var tagName = fn.toUpperCase();
				fn = function(elem) { return elem.tagName == tagName; };
				break;
			case "number":
				var i = fn;
				fn = function(elem) { return --i < 0; };
				break;
		}
		
		return fn;
	}
		
	/**
     * 删除一个节点的所有子节点。
	 * @param {Element} elem 节点。
	 * @private
     */
	function empty(elem) {
		while(elem.lastChild)
			dispose(elem.lastChild);
	}
	
	/**
     * 释放节点所有资源。
	 * @param {Element} elem 节点。
	 * @private
     */
	function dispose(elem) {
		
		//删除事件
		if (navigator.isIE) {
			if (elem.clearAttributes) {
				elem.clearAttributes();
			}

			Py.IEvent.un.call(elem);

			if (elem.nodeName === "OBJECT") {
				for (var p in elem) {
					if (typeof elem[p] === 'function')
						elem[p] = emptyFn;
				}
			}
		}

		empty(elem);

		elem.parentNode && elem.parentNode.removeChild(elem);
		
	}
	
	/// #endif
	
	/// #ifndef Std
	
	try{
		
		//  修复IE6 因 css 改变背景图出现的闪烁。
		d.execCommand("BackgroundImageCache", false, true);
	} catch(e) {
		
	}
	
	/// #endif
	
	/// #region Core
	
	div = null;
	
	/// #endregion

})(this);

