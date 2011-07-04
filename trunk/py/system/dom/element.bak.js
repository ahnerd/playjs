//===========================================
//  Ԫ��   element.js       C
//===========================================

(function(w) {
	
	/// #region ����
 
    /**
     * Py ��д��
     * @type Py
     */
    var p = w.Py,

	    /**
	     * document ��д��
	     * @type Document
	     */
	    document = w.document,
		
		/**
		 * Object  ��д��
		 * @type Object
		 */
		o = Object,
		
		/**
		 * �պ�����
		 * @type Function
		 */
		emptyFn = Function.empty,
		
		/**
		 * Object.extend
		 * @type Function
		 */
		apply = o.extend,
		
		/**
		 * ����ԭ�͡�
		 * @type Object
		 */
		ap = Array.prototype,
		
		/**
		 * ����Ԫ�ء�
		 * @type Element
		 */
		div = document.createElement('DIV'),
		
		/// #ifdef SupportIE6
		
		/**
		 * Ԫ�ء�
		 * @type Function
		 */
		e = w.Element || (w.Element = function() {}), 
		
		/// #else
		
		/// e = w.Element,
		
		/// #endif
		
		/**
		 * Ԫ��ԭ�͡�
		 * @type Object
		 */
		ep = e.prototype,
		
		/**
		 * Ԫ�ء�
		 * @type Object
		 */
		cache = {},
	
	    /**
	     * �Ƿ�Ϊ��ǩ��
	     * @type RegExp
	     */
	    rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
		
		/**
		 * �޷����Ƶı�ǩ��
		 * @type RegExp
		 */
		rNoClone = /<(?:script|object|embed|option|style)|\schecked/i,
	
	    /**
	     * �Ƿ�Ϊ��ǩ����
	     * @type RegExp
	     */
	    rTagName = /<([\w:]+)/,
		
		/**
		 * ��װ��
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
	
	
		// ���� getElementById �������ش���ĺ�����
		ep.domVersion = 1;
		
	}
	
	/// #endif
	
	apply(p, {
		
		Element: e,
			
		/// #ifdef SupportIE6

		/**
	     * ����һ�� id �� �����ȡ�ڵ㡣
		 * @method
	     * @param {String/Element} id ����� id �����
	     */
		$: navigator.isQuirks ? function(id){
			var dom = getElementById(id);
			
			if(dom && dom.domVersion !== ep.domVersion) {
				o.extendIf(dom, Element.prototype);
			}
			
			return dom;
			
			
		} : getElementById,
		
		/// #else
		
		/// $: getElementById,
		
		/// #endif
		
	    /**
	     * �����ڶ��󱾵ػ���
	     * @param {Window} w ���ڡ�
	     */
	    bindWindow: function(w) {
				
			assert(w.setInterval, 'Py.setupWindow(w): ���� {w} ������һ�� Window ����', w);
	    
	        /**
	         * ���ػ� Element ��
	         * @class Element
	         */
			
			/// #ifndef SupportIE6
			
	        if (!w.Element) w.Element = e;
			
			/// #endif
	        
	        // �Է�     IE6/7 ,�ֶ����� Element.prototype
	        if (w.Element !== e) {
				
				copyIf(Element.prototype, w.Element.prototype);
				
	            o.extendIf(w.Element, e);
	        }
			
	        // ���� document ������
	    	var wd = apply(w.document, p.IEvent);
			
			if(!wd.id)
				copyIf(document, wd);
				
			/// #ifndef SupportIE8
	        
	        // ���� IE ��֧��     defaultView
	        if (!('defaultView' in wd)) wd.defaultView = wd.parentWindow;
	        
			/// #endif
			
			w.$ = p.$;
			
			
			function copyIf(from, to){
				for (var item in from) {
					if(!(item in to) && (item in from))
						to[item] = from[item];
				}
			}
	    }
		
	});
		
	///   #region ElementList

    /**
     * �ڵ㼯�ϡ�
     * @class ElementList
     */
    p.namespace(".ElementList", p.Class({
	
		xType: "elementlist",

        /**
         * ��ʼ�� ElementList  ʵ����
         * @param {Array/ElementList} doms �ڵ㼯�ϡ�
         * @constructor ElementList
         */
        constructor: function(doms) {
			
			assert(doms && doms.length !== undefined, 'ElementList.prototype.constructor(doms): ���� {doms} ������һ�� NodeList �� Array ���͵ı�����', doms);
			
            this.doms = doms;
			
			if(doms[0] && !doms[0].xType) {
				o.update(doms, p.$);
			}
			
        },
		
		/**
         * �Լ���ÿ��Ԫ��ִ��һ�κ�����
		 * @method each
         * @param {Function} fn ������
		 * @param {Array} args/... ������
		 * @return {Array} �������
         */
		each: function(fn, args) {
		
			// ��ֹ doms Ϊ ElementList
			return ap.invoke.call(this.doms, fn, args);
		}
		
	}));

    /// #endregion
	
	/**
	 * @class Element
	 */
	apply(e,  {
		 
	    /**
	     * ת��һ��HTML�ַ������ڵ㡣
	     * @param {String/Element} html �ַ���
	     * @param {Document} context ���ݡ�
	     * @param {Boolean} cachable=true �Ƿ񻺴档
	     * @return {Element} Ԫ�ء�
	     * @static
	     */
	    parse: function(html, context, cachable) {
			
			assert.isString(html, 'Element.parse(html, context, cachable): ���� {html} ~��');
			
			assert(!context || context.createElement, 'Element.parse(html, context, cachable): ���� {context} ������һ�� Document ����', context);
				
			var div = cache[html];
	
	        if (!div) {
			
				context = context || document;
				
				// ���˿ո�  // ����   XHTML
				var h = html.trim().replace(rXhtmlTag, "<$1></$2>"),
					tag = rTagName.exec(h),
					notSaveInCache = cachable !== false && rNoClone.test(html);
				
				
				if (tag) {
				
					div = context.createElement("div", true);
					
					var wrap = wrapMap[tag[1].toLowerCase()];
					
					if (wrap) {
						var depth = wrap[0];
						div.innerHTML = wrap[1] + h + wrap[2];
						
						// ת����ȷ�����
						while (depth--) 
							div = div.lastChild;
						
					} else div.innerHTML = h;
					
					// һ��ʹ����õĽڵ㣬 ����������Ľڵ㣬ʹ�ø��ڵ㡣
					div = div.firstChild;
					
					if(div.nextSibling){
						var fragment = context.createDocumentFragment();
						
						fragment.appendChild(div.parentNode);
						
						var newS = html.nextSibling, ns;
							while(ns = ls){
								ls = ns.nextSibling;
								elem.insertBefore(ns, newS);
							}
					}
					
					/// #ifdef SupportIE6
					
					p.$(div);
					
					/// #endif
					
				} else {
				
					// �����ı��ڵ㡣
					div = context.createTextNode(html);
				}
				
			}
			
			if(!notSaveInCache)
				cache[html] = div.clone ? div.clone(false, true) : div.cloneNode(false);
	
	        return div;
	
	    },
		
		/**
		 * ʵ���� Element ʵ�ֵĴ�������
		 * @private
		 */
		implementListeners: [function(obj, listType, copyIf){
			
			Object.each(obj, function(value, key){
				
				var value = obj[key];
					
				//  ���Ƶ�  Element.prototype
				if(!copyIf || !(key in ep))
					ep[key] = value;
					
				//  ���Ƶ� Document
				if (!(key in document))
					document[key] = value;
				
				if(copyIf && p.ElementList.prototype[key])	
					return ;
				
				var fn;
						
				// ���Ƶ�  ElementList
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
							return new p.ElementList(Array.plain.apply(Array, this.each(function(elem, index) {
								var r = this[index][key].apply(this[index], args);
								return r && r.doms || r;
							}, this.doms)));
						};
						
						break;
					case 5:
						fn = function() {
							var result = true, args = arguments;
							this.each(function(node){
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
		 * ��һ����Ա���ӵ� Element ���������ࡣ
		 * @param {Object} obj Ҫ���ӵĶ���
		 * @param {Number} listType = 1 ˵����θ��Ƶ� ElementList ʵ���� 
		 * @return {Element} this
	     * @static
		 * �� Element ��չ���ڲ��� Element ElementList document Control ����չ��
		 * �������ڲ�ͬ�ĺ������ò�ͬ�ķ�����չ������ָ����չ���͡�
		 * ��ν����չ����һ���ຬ��Ҫ�ĺ�����
		 * 
		 * 
		 * DOM ���� �� ������
		 *  
		 *  1  getText - ���ؽ��  
		 *  2  setText - ���� this
		 *  3  getElementById - ���� DOM
		 *  4  getElementsByTagName - ����  DOM ����
		 *  5  appendChild  - ���� DOM
		 *  
		 *  �� Element ��
		 *     ��� copyIf �� false �򲻴��ڸ��ơ�
		 *
		 *  �� ElementList ���� listType��
		 *      1, ���� - ִ�н�������ݣ����ؽ�����顣 (Ĭ��)
		 *  	2 - ִ�н������ this�� ���� this ��
		 * 		3 - ִ�н����DOM������ ElementList ��װ��
		 * 		4 - ִ�н����DOM���飬���� ElementList ��װ�� 
		 * 		5 - ���ÿ������ֵ���� true�� �򷵻� true�� ���򷵻� false��
		 * 
		 *  �� document �� 
		 *  	������������ơ�
		 *  
		 *  
		 *  ���� copyIf ���ڲ�ʹ�á�
		 */
		implement: function (obj, listType, copyIf) {
			
			assert.notNull(obj, "Element.implement(obj, listType): ���� {obj} ~��");
		
			this.implementListeners.forEach(function(fn){
				fn(obj, listType, copyIf);
			});
			
			/// #ifdef SupportIE6
			
			if(ep.domVersion){
				ep.domVersion++;
			}
			
			/// #endif
			
			return this;
		},
		
		/**
		 * �������ڣ���һ�����󸽼ӵ� Element ����
	     * @static
		 * @param {Object} obj Ҫ���ӵĶ���
		 * @param {Number} listType ˵����θ��Ƶ� ElementList ʵ����
		 * @param {Number} docType ˵����θ��Ƶ� Document ʵ����
		 * @return {Element} this
		 */
		implementIf: function (obj, listType) {
			return this.implement(obj, listType, true);
		},
		
		/**
		 * ��ȡһ��Ԫ�ص��ĵ���
	     * @static
		 * @param {Element/Document/Window} elem Ԫ�ء�
		 * @return {Document} ��ǰ�ڵ������ĵ���
		 */
		getDocument: getDoc
		
	});
	
	/**
	 * @namespace Document
	 */
	apply(document, {
	   
		/**
		* ����һ���㡣
		* @param {String} className �ࡣ
		* @return {Element} �ڵ㡣
		*/
		createDiv: function(className){
			
			return document.create("div", className);
		},
		
		/**
		 * ����һ���ڵ㡣
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function(tagName, className){
					
			/// #ifdef SupportIE6
			
			var div = p.$(document.createElement(tagName));
			
			/// #else
			
			/// var div = document.createElement(tagName);
			
			/// #endif
			
			div.className = className;
			
			return div;
		},

	    /**
	     * ����Ԫ�ط��ؽڵ㡣
	     * @param {String/Element} ... ����� id �����
	     */
	    id: function() {
			return arguments.length < 2 ? p.$(arguments[1]) : new p.ElementList(o.update(arguments, p.$));
			
	        /*
			return new p.ElementList(o.update(arguments, function(id){
				return typeof id == 'string' ? this.getElementById(id) : id;
			}, [], this));
*/
	    },
		
		/// #ifdef SupportIE6
		
		/**
		 * ��ȡ�ڵ㱾��
		 * @return {Element}
		 */
		getDom: navigator.isQuirks ? function(){
				
			// ����ֱ��ʹ�� documentElement ���ʲ�֧�� QUIRKS ����� html = wd.body ��Ϊ QUIRKS ģʽ��
			return p.$(this.documentElement);
		} : function(){
			
			// ����ֱ��ʹ�� documentElement ���ʲ�֧�� QUIRKS ����� html = wd.body ��Ϊ QUIRKS ģʽ��
			return this.documentElement;
		}
		
		/// #else
		
		/// getDom: function(){
		///
		///		return this.documentElement;
		/// }
		
		///#endif
	});
	
	/**
	 * @class Element
	 */
	e.implementIf({
	
		/**
		 * ��ȡ�ڵ㱾��
		 * @return {Element}
		 */
		getDom: function(){
			return this;
		},
		
		/// #ifndef SupportIE8
		
		/**
		 * ��һ����������
		 * @param {String} type ���͡�
		 * @param {Function} fn ������
		 */
		addEventListener: p.addEventListener,
		
		/**
		 * �Ƴ�һ�������š�
		 * @param {String} type ���͡�
		 * @param {Function} fn ������
		 */
		removeEventListener: p.removeEventListener,
		
		/// #endif
		
		/**
		 * xType
		 */
		xType: "element"
		
	}, 2);
	
	p.bindWindow(w);
	
	/**
	 * ��ȡԪ�ص��ĵ���
	 * @param {Element} elem Ԫ�ء�
	 * @return {Document} �ĵ���
	 */
	function getDoc(elem) {
		return elem.ownerDocument || elem.document || elem;
	}

	/**
     * ����һ�� id �� �����ȡ�ڵ㡣
     * @param {String/Element} id ����� id �����
     * @return {Element} Ԫ�ء�
     */
	function getElementById(id) {  
		return typeof id == "string" ? document.getElementById(id) : id;
	}

	/// #endregion
	
	/// #region IEvent
	
	/**
	 * Ĭ���¼���
 	 * @type Object
	 */
	p.namespace(".Events.element.$default", {
			
		/**
		 * �¼���ʼ����
		 * @return {Function} ���õ�ǰ�¼��ĺ�����
		 */
		setup: function() {
			return function(e) {
			
				// �˺������洢�¼�������ݡ�
				var fn = arguments.callee, i = -1,  // ��������˵���� one �¼��������ɺ�����������ֹ��ɾ��ѭ������
				handlers = fn.handlers.slice(0), len = handlers.length, target = fn.target, F = false;
				
				// ��������
				fn.event.trigger.call(target, e);
				
				// ����ľ��
				while (++i < len) {
				
					if (e.returnValue === F) 									
						return F;
					
					// ������� false �� ����   stopPropagation/preventDefault
					if (handlers[i].call(target, e) === F) {
						e.stopPropagation();
						e.preventDefault();
					}
					
				}
				
				return e.returnValue !== F;
			}  ;
		},
	
		/**
		 * ������ǰ�¼����õĲ�����
		 * @param {Event} e �¼�������
		 * @param {Object} target �¼�Ŀ�ꡣ
		 * @return {Event} e �¼�������
		 */
		createEvent: function(e, target){
			assert(!e || ( e.stopPropagation && e.preventDefault), "IEvent.trigger(e): ���� e �����г�Ա stopPropagation �� preventDefault ����ʹ������ Py.Event ���档");
			return e || new p.Event(target);
		},
		
		/**
		 * �¼�������Բ������д���
		 * @param {Event} e �¼�������
		 */
		trigger: emptyFn,
	
		/**
		 * ��Ӱ��¼���
		 * @param {Object} obj ����
		 * @param {String} type ���͡�
		 * @param {Function} fn ������
		 */
		add: function(obj, type, fn) {
			obj.addEventListener(type, fn, false);
		},
		
		/**
		 * ɾ���¼���
		 *@param {Object} obj ����
		 * @param {String} type ���͡�
		 * @param {Function} fn ������
		 */
		remove: function(obj, type, fn) {
			obj.removeEventListener(type, fn, false);
		}
	});
	
	/**
	 * �����¼��� 
	 * @param {String} �¼�����
	 * @param {Function} trigger ��������
	 * @return {Function} Py.defineDomEvents
	 */
	e.defineEvents = function(events, baseEvent, trigger, add, remove, createEvent) {
			
		var ee = p.Events.element;
		
		// ɾ���Ѿ��������¼���
		delete ee[events];
		
		// ��ÿ���¼�ִ�ж��塣
		String.map(events, Function.from(o.extendIf({
			
			trigger: baseEvent && trigger ? function(e){
					eventMgr.element[baseEvent].trigger.call(this, e);
					trigger.call(this, e);
			} : trigger || (ee[events] || ee.$default).trigger,
			
			//  DOM ʹ��ͬ��������װ��
			add: add === true ? function(elem, type, fn) {
				elem.addEventListener(baseEvent, this.delegate, false);
			} : add || baseEvent && function(elem, type, fn) {
				elem.addEventListener(baseEvent, fn, false);
			},
			
			createEvent: createEvent,
			
			remove: remove === true ?  function(elem, type, fn) {
				elem.addEventListener(baseEvent, this.delegate, false);
			} : remove || baseEvent && function(elem, type, fn) {
				elem.removeEventListener(baseEvent, fn, false);
			}
			
		}, ee.$default)), ee);
		
		// �������ʹ�ñ�����������������������¼����󣬷��򷵻ش˺�����
		return baseEvent ? ee[events] : arguments.callee;
	};
	
	/**
	 * ��ʾ�¼��Ĳ�����
	 * @class Event
	 */
	var pep = p.namespace(".Event", Class({
			
		/**
		 * ���캯����
		 * @param {Object} target
		 * @constructor Event
		 */
		constructor: function(target){
			 this.target = target;
		},

		/**
		 * ��ֹð�ݡ�
		 * @method stopPropagation
		 */
		stopPropagation : function() {
			this.cancelBubble = true;
		},
		
		/**
		 * ֹͣĬ�ϡ�
		 * @method preventDefault
		 */
		preventDefault : function() {
			this.returnValue = false;
		}
		
	})).prototype,
		
		/**
		 * Event
		 * @type Function
		 */
		c,
	
	    /**
	     * mouseEvntArgs��
	     * @type Function
	     */
	    mc,
		
		/**
	     * keyEvntArgs��
	     * @type Function
	     */
		kc;
		
	/// #ifdef SupportIE6

    if (navigator.isStd) {
		
	/// #endif

        mc = kc = c = function(e) {
			
			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

            //��д  preventDefault
            Object.addCallback(e, 'preventDefault', pep.preventDefault);

        };
		
	/// #ifdef SupportIE6

    } else {   //  for IE6/IE7/IE8
		
        c = function(e) {
            e.target = e.srcElement || document;
            e.stopPropagation = pep.stopPropagation;
            e.preventDefault = pep.preventDefault;
        };
		
        // mouseEvent
		mc = function(e) {
			c(e);
			e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
			var dom = getDoc(e.target).getDom();
			e.pageX = e.clientX + dom.scrollLeft;
			e.pageY = e.clientY + dom.scrollTop;
			e.layerX = e.x;
			e.layerY = e.y;
			//  1 �� ����  2 ��  �м���� 3 �� �һ�
			e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));

		};

		// keyEvents
		kc = function(e) {
			c(e);
			e.which = e.keyCode;
		};
		
    }
		
	/// #endif

    e.defineEvents
		("click dblclick mouseup mousedown contextmenu mouseover mouseout mousemove selectstart selectend mouseenter mouseleave", undefined, mc)
		("mousewheel DOMMouseScroll blur focus focusin focusout scroll change select submit error", undefined,  c)
		("keydown keypress keyup", undefined, kc)
		("load unload", undefined, function(e){
			this.un(e.type);
		});

    if(navigator.isFirefox)
        e.defineEvents('mousewheel', 'DOMMouseScroll');
    if (!navigator.isIE) {
        e.defineEvents('mouseenter', 'mouseover').trigger = e.defineEvents('mouseleave', 'mouseout').trigger = function(e) {
            p.Events.element[e.type].trigger(e);

            var parent = e.relatedTarget;
            while (parent && parent != this) {
                parent = parent.parentNode;
            }

            e.returnValue = this != parent;
        }
    }
	
    e.implement(p.IEvent, 2);
	
    /// #endregion
	
	/// #region Attributons
	
	/**
	 * ͸���ȵ�������ʽ��
	 * @type RegExp
	 * @private
	 */
	var rOpacity = /opacity=([^)]*)/,
	
	    /**
	     * �Ƿ�Ϊ���ص�������ʽ��
	     * @type RegExp
	     * @private
	     */
	    rNumPx = /^-?\document+(?:px)?$/i,
	
	    /**
	     * �Ƿ�Ϊ���ֵ�������ʽ��
	     * @type RegExp
	     * @private
	     */
	    rNum = /^-?\document/,
		
		/**
		 * �¼�����
		 * @type RegExp
		 */
		rEventName = /^on([a-z0-9$_]+)/,
		
		/**
		 * �Ƿ����Ե�������ʽ��
		 * @type RegExp
	     * @private
		 */
		rStyle = /\-|float/,
		
		/**
		 * borderTopWidth ��д��
		 * @type String
		 */
		borderTopWidth = 'borderTopWidth',
		
		/**
		 * borderLeftWidth ��д��
		 * @type String
		 */
		borderLeftWidth = 'borderLeftWidth',
	
		styleMaps = {
			width: {
				b: [borderLeftWidth, 'borderRightWidth'],
				p: ['paddingLeft', 'paddingRight'],
				m: ['marginLeft', 'marginRight'],
				document: ['left', 'right']
			},
			height: {
				b: [borderTopWidth, 'borderBottomWidth'],
				p: ['paddingTop', 'paddingBottom'],
				m: ['marginTop', 'marginBottom'],
				document: ['top', 'bottom']
			}
		},
		
		/// #ifdef SupportIE6
		
		/**
		 * �������Ե�������ʽ��
		 * @type RegExp
	     * @private
		 */
		rSpecilAttr = /^(?:href|src|usemap)$/i,
		
		/// #endif
		
		
		/// #ifdef SupportIE8
		
		/**
		 * �Ƿ�ʹ�÷��� getComputedStyle��
		 * @type Boolean
		 * @private
		 */
		defaultView = document.defaultView.getComputedStyle,
	
		/**
		 * ��ȡԪ�صļ�����ʽ��
		 * @param {Element} dom �ڵ㡣
		 * @param {String} name ���֡�
		 * @return {String} ��ʽ��
		 * @private
		 */
		getStyle = defaultView ? function(elem, name) {
			
			assert.isElement(elem , "Element.getStyle(elem, name): ���� {elem} ~��");

			// ��ȡ��ʽ
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null); 
			
			// ���� , �� ���������� IFrame�� ��  computedStyle == null
			//    http://drupal.org/node/182569
			return computedStyle ? computedStyle[ name ] : null;

		} : function(elem, name) {
			
			assert.isElement(elem , "Element.getStyle(elem, name): ���� {elem} ~��");

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

			// ���� jQuery

			// �������ֵ����һ����px�� ���֡� ת��Ϊ���ص�λ
			if (!rNumPx.test(r) && rNum.test(r)) {

				// �����ʼֵ
				var style = elem.style,  left = style.left, rsLeft = elem.runtimeStyle.left;

				// ����ֵ������
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = name === "fontSize" ? "1em" : (r || 0);
				r = style.pixelLeft + "px";

				// �ص���ʼֵ
				style.left = left;
				elem.runtimeStyle.left = rsLeft;

			}

			return r;
		},
		
		/// #else
		
		/// getStyle = function(elem, name) {
		/// 
		/// 	// ��ȡ��ʽ
		/// 	var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		///	
		/// 	// ����
		/// 	return computedStyle ? computedStyle[ name ] : null;
		/// 
		/// },
		
		/// #endif
		
		/**
		 * �������Լ��ϡ�
		 * @type Object
		 */
		attributes = {
			'float': 'styleFloat' in div ? 'styleFloat' : 'cssFloat',
			"for": "htmlFor",
			"class": "className",
			innerText: 'innerText' in div ? 'innerText' : 'textContent'
		};
	
	/**
	 * @class Element
	 */
	apply(e, {
		
		/**
		 * ��ȡԪ�صļ�����ʽ��
		 * @method getStyle
		 * @param {Element} dom �ڵ㡣
		 * @param {String} name ���֡�
		 * @return {String} ��ʽ��
		 * @static
		 * @private
		 */
		getStyle: getStyle,
		
		/**
	     * ��ȡ��ʽ�ַ�����
	     * @param {Element} elem Ԫ�ء�
	     * @param {String} name ��������
	     * @return {String} �ַ�����
		 * @static
	     */
		styleString:  styleString,
		
		/**
	     * ��ȡ��ʽ���֡�
	     * @param {Element} elem Ԫ�ء�
	     * @param {String} name ��������
	     * @return {String} �ַ�����
		 * @static
	     */
		styleNumber: styleNumber,
		
		/**
		 * �� offsetWidth תΪ style.width��
		 * @private
		 * @param {Element} elem Ԫ�ء�
	     * @param {Number} width ���롣
	     * @return {Number} ת����Ĵ�С��
		 * @static
		 */
		getSize: defaultView ? function (elem, type, names) {
			
			assert.isElement(elem, "Element.getSize(elem, type, names): ���� {elem} ~��");
			assert(type in styleMaps, "Element.getSize(elem, type, names): ���� {type} ������ \"width\" �� \"height\"��", type);
			assert.isString(names, "Element.getSize(elem, type, names): ���� {names} ~��");
			
			
			var value = 0, map = styleMaps[type], i = names.length, val, currentStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(currentStyle[val[0]]) || 0) + (parseFloat(currentStyle[val[1]]) || 0);
			}
			
			return value;
		} : function (elem, type, names) {
			
			
			assert.isElement(elem, "Element.getSize(elem, type, names): ���� {elem} ~��");
			assert(type in styleMaps, "Element.getSize(elem, type, names): ���� {type} ������ \"width\" �� \"height\"��", type);
			assert.isString(names, "Element.getSize(elem, type, names): ���� {names} ~��");
			
			var value = 0, map = styleMaps[type], i = names.length, val;
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(getStyle(elem, val[0])) || 0) + (parseFloat(getStyle(elem, val[1])) || 0);
			}
			
			return value;
		},
		
		/**
		 * �������Լ��ϡ�
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attributes: attributes,
		
		/**
		 * ��ʽ��
		 * @static
		 */
		styleMaps: styleMaps,
		
		/**
		 * �������ԡ�
		 * @property
		 * @type Object
		 * @private
		 * @static
		 */
		specialAttr: {},
		
		/**
		 * Ĭ������ z-index ��
		 * @property
		 * @type Number
		 * @private
		 * @static
		 */
		zIndex: 10000,
		
		/**
		 * �ж�һ���ڵ��Ƿ����ء�
		 * @param {Element} elem Ԫ�ء�
		 * @return {Boolean} ���ط��� true ��
		 * @static
		 */
		isHidden: function(elem) {
			
			assert.isElement(elem, "Element.isHidden(elem): ���� {elem} ~��");
			
			return elem.style.display === 'none';
		},

		/**
         * ��ȡһ���ڵ����ԡ�
		 * @method getAttr
         * @param {String} name ���֡�
         * @return {String} ���ԡ�
         */
		getAttr: function(elem, name){
			
		   assert.isNode(elem, "Element.getAttr(elem, name): ���� {elem} ~��");
				
			/// #ifndef Std
	
	        //��д
	        var special = navigator.isQuirks && rSpecilAttr.test(name);
	
	        //����
	        name = attributes[name] || name;
	
	        // ����ǽڵ���е�����
	        if (name in elem && !special) {
	
	            // ���ϵ�Ԫ�أ����ؽڵ�����ֵ
	            if (elem.nodeName === "FORM" && (special = elem.getAttributeNode(name)))
	                return special.nodeValue;
	
	            return elem[name];
	        }
	
	        return special ? elem.getAttribute(name, 2) : elem.getAttribute(name); // ��Щ������ IE ��Ҫ������ȡ
			
			/// #else
			/// 
			/// //����
			/// name = attributes[name] || name;
			/// 
			/// // ����ǽڵ���е�����
			/// if (name in elem) {
			/// 
			/// 	// ���ϵ�Ԫ�أ����ؽڵ�����ֵ
			/// 	if (elem.nodeName == "FORM" && e.getAttributeNode(name))
			/// 		return e.getAttributeNode(name).nodeValue;
			/// 
			/// 	return elem[name];
			/// }
			/// 
			/// return elem.getAttribute(name);
			
			/// #endif
			
		}
		
	});
	
	
	/**
	 * @class Element
	 */
	apply(e, {
		
		/**
         * ����Ƿ�ָ��������
		 * @method hasClass
         * @param {String} className
         * @return {Boolean} ������ڷ��� true��
         */
		hasClass: function(elem, className){
			assert.isNode(elem, "Element.hasClass(elem, className): ���� {elem} ~��");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		},
		
		/**
		 * ɾ��һ���ڵ�������ӽڵ㡣
		 * @param {Element} elem �ڵ㡣
		 * @private
		 */
		empty: function (elem) {
			while(elem.lastChild)
				dispose(elem.lastChild);
		},
		
		/**
		 * �ͷŽڵ�������Դ��
		 * @param {Element} elem �ڵ㡣
		 * @private
		 */
		dispose: function (elem) {
			
			//ɾ���¼�
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

			empty(elem);

			elem.parentNode && elem.parentNode.removeChild(elem);
			
		}
		
	}) ;
	
	
    updateToObj("opacity height width defaultValue accessKey cellPadding cellSpacing colSpan frameBorder maxLength readOnly rowSpan tabIndex useMap", attributes); 
	
	updateToObj("Size Position Opacity Offset Scroll Offsets Style Text", e.specialAttr);

	/**
     * ��ȡ��ʽ�ַ�����
     * @param {Element} elem Ԫ�ء�
     * @param {String} name ��������
     * @return {String} �ַ�����
     * @ignore
     */
	function styleString(elem, name) {
			
        return elem.style[name] || getStyle(elem, name);
    }
	
	/**
     * ��ȡ��ʽ���֡�
     * @param {Object} elem Ԫ�ء�
     * @param {Object} name ��������
     * @return {Number} ���֡�
     * @ignore
     */
    function styleNumber(elem, name) {
        return parseFloat(getStyle(elem, name)) || 0;
    }
    
	/**
	 * �����Կ�����Ŀ�ꡣ
	 * @param {String} props �����ַ�����
	 * @param {Object} target Ŀ�ꡣ
     * @ignore
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
	
	/**
	 * @class Element
	 */
	
	e.implement( {
	
        /**
         * ��ȡ�ڵ���ʽ��
         * @param {String} key ����
         * @param {String} value ֵ��
         * @return {String} ��ʽ��
         */
        getStyle: function(name) {
			
			assert.isString(name, "Element.prototype.getStyle(name): ���� {name} ~��");

            var me = this.getDom(), css = name.toCamelCase();
			
		   	assert.isElement(me, "Element.prototype.getStyle(name): {this.getDom()} ���뷵�� DOM �ڵ㡣");

            return me.style[css] || getStyle(me, css);

        },
		
		/**
         * ��ȡһ���ڵ����ԡ�
         * @param {String} name ���֡�
         * @return {String} ���ԡ�
         */
        getAttr: function(name) {
			return e.getAttr(this.getDom(), name);
        },
		
        /**
         * ����Ƿ�ָ��������
         * @param {String} className
         * @return {Boolean} ������ڷ��� true��
         */
        hasClass: function(className) {
			return e.hasClass(this.getDom(), className);
		},
		
        /**
         * ��ȡֵ��
         * @return {Object/String} ֵ������ͨ�ڵ㷵�� text ���ԡ�
         */
        getText: function() {
            var me = this.getDom();
			
		   	assert.isNode(me, "Element.prototype.getText(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
		   
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
		
		/**
         * ��ȡֵ��
         * @return {String} ֵ��
         */
		getHtml: function(){
			
		   	assert.isNode(this.getDom(), "Element.prototype.getHtml(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			return this.getDom().innerHTML;
		},
		
		/// #ifndef Html
		
        /**
         * ��ȡ͸���ȡ�
		 * @method getOpacity
         * @return {Number} ͸���ȡ� 0 - 1 ��Χ��
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
         * ����������ʽ��
         * @param {String} name ����
         * @param {String/Number} value ֵ��
         * @return {Element} this
         */
        setStyle: function(name, value) {
			
		   	assert.isString(name, "Element.prototype.setStyle(name, value): ���� {name} ~��");
			
			// ��ȡ��ʽ
            var me = this, style = me.getDom().style;
			
		   	assert.isElement(me.getDom(), "Element.prototype.setStyle(name, value): {this.getDom()} ���뷵�� DOM �ڵ㡣");

			//û�м�  ����  cssText
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

				//���ֵ�Ǻ��������С�
				if (typeof value === "number")
					value += "px";

				// ָ��ֵ
				style[name] = value;
			}

            return me;
        },
		
        /**
         * ���ýڵ����ԡ�
         * @param {String} name ���֡�
         * @param {String} value ֵ��
         * @return {Element} this
         */
        setAttr: function(name, value) {

            //��д
            var me = this.getDom();
			
		   	assert.isNode(me, "Element.prototype.setAttr(name, value): {this.getDom()} ���뷵�� DOM �ڵ㡣");

            //����
            name = attributes[name] || name;

            // ����ǽڵ���е�����
            if (name in me) {
				
				
				/// #ifndef Std
				
                assert(name != 'type' || me.nodeName != "INPUT" || !me.parentNode, "��Ԫ�� type ���Բ����޸�");
                
				/// #endif
				
				me[name] = value;
            } else {
				if (value === null)
					me.removeAttribute(name);
				else
					// ʹ��DOM��������
					me.setAttribute(name, value);
			}

            return this;

        },
	
		/**
		 * �������ýڵ�ȫ�����Ժ���ʽ��
		 * @param {String/Object} name ���֡�
         * @param {Object} [value] ֵ��
         * @return {Element} this
		 */
		set: function(name, value) {
			
			var me = this;
			
			if (typeof name === "string") {
				
				// ���� this Ϊ Element �� Control
				var dom = me.getDom();
			
		   		assert.isNode(dom, "Element.prototype.set(name, value): {this.getDom()} ���뷵�� DOM �ڵ㡣");
				
				// �������ԡ�
				if(name in e.specialAttr)
					me['set' + e.specialAttr[name]](value);
					
				// event ��
				else if(name.match(rEventName))
					me.on(RegExp.$1, value);
					
				// css ��
				else if(dom.style && (name in dom.style || rStyle.test(name)))
					me.setStyle(name, value);
					
				// attr ��
				else if(name in dom)
					dom[name] = value;
					
				// Object ��
				else
					me[name] = value;
					
			} else if(o.isObject(name)) {
				
				for(value in name)
					me.set(value, name[value]);
					
			}
			
			return me;
			
			
		},
				
	    /**
         * ����������
         * @param {String} className ������
         * @return {Element} this
         */
        addClass: function(className) {
            var me = this.getDom();
			
		   	assert.isNode(me, "Element.prototype.addClass(className): {this.getDom()} ���뷵�� DOM �ڵ㡣");
				
            if(!me.className)
                me.className = className;
            else
                me.className += ' ' + className;
            return this;
        },
		
        /**
         * ɾ��������
         * @param {String} className ������
         * @return {Element} this
         */
        removeClass: function(className) {
			
		   	assert.isNode(this.getDom(), "Element.prototype.removeClass(className): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
            this.getDom().className = className ? this.getDom().className.replace(new RegExp('\\b' + className + '\\b\\s*', "g"), '') : '';
            return this;
        },
		
		 /**
         * �л�������
         * @param {String} className ������
         * @return {Element} this
         */
        toggleClass: function(className, toggle) {
            return (toggle !== undefined ? !toggle : this.hasClass(className)) ? this.removeClass(className) : this.addClass(  className  );
        },
		
        /**
         * ����ֵ��
         * @param {String/Boolean} ֵ��
         * @return {Element} this
         */
        setText: function(value) {
            var me = this.getDom();
			
		   	assert.isNode(me, "Element.prototype.setText(value): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
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
		
		/**
         * ���� HTML ��
         * @param {String} value ֵ��
         * @return {Element} this
         */
		setHtml: function(value){
			
		   	assert.isNode(this.getDom(), "Element.prototype.setHtml(value): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			this.getDom().innerHTML = value;
			return this;
		},
		
		/// #ifndef Html
		
        /**
         * �������ӵ�͸���ȡ�
         * @param {Number} value ͸���ȣ� 0 - 1 ��
         * @return {Element} this
         */
        setOpacity: !('opacity' in div.style) ? function(value) {
			
		   	assert.isElement(this.getDom(), "Element.prototype.setOpacity(value): {this.getDom()} ���뷵�� DOM �ڵ㡣");

            var style = this.getDom().style;
			
			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): ���� {value} ������ 0~1 �䡣', value);

            // ��Ԫ��δ���֣�IE������ʧ�ܣ�ǿ��ʹ��Ч
            style.zoom = 1;

            // ����ֵ
            style.filter = (style.filter || 'alpha(opacity=?)').replace(rOpacity, "opacity=" + value * 100);

            //����ֵ�� ��֤���ַ���  ֵΪ  0 - 100
            return this;

        } : function(value) {
			
		   	assert.isElement(this.getDom(), "Element.prototype.setOpacity(value): {this.getDom()} ���뷵�� DOM �ڵ㡣");

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): ���� {value} ������ 0~1 �䡣', value);

            //  ��׼�����ʹ��   opacity   
            this.getDom().style.opacity = value;
            return this;

        },
		
		/// #else
		
		/// function(value) {

		///     //  ��׼�����ʹ��   opacity   
		///     this.getDom().style.opacity = value;
		///     return this;
		/// 
		/// },
		
		/// #endif
		
		/**
		 * ��ʾ��ǰԪ�ء�
		 * @param {Number} duration=500 ʱ�䡣
		 * @param {Function} [callBack] �ص���
		 * @param {String} [type] ��ʽ��
		 * @return {Element} this
		 */
		show: function(duration, callBack) {
			
		   	assert.isElement(this.getDom(), "Element.prototype.show(duration, callBack, type): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			this.getDom().style.display = '';
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},
		
		/**
		 * ���ص�ǰԪ�ء�
		 * @param {Number} duration=500 ʱ�䡣
		 * @param {Function} [callBack] �ص���
		 * @param {String} [type] ��ʽ��
		 * @return {Element} this
		 */
		hide: function(duration, callBack) {
			
		   	assert.isElement(this.getDom(), "Element.prototype.hide(duration, callBack, type): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			this.getDom().style.display = 'none';
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},
		
		/**
		 * ����Ԫ�ز���ѡ��
		 * @param {Boolean} value �Ƿ��ѡ��
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function(value) {
			
		   	assert.isElement(this.getDom(), "Element.prototype.setUnselectable(value): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			this.getDom().unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function(value) {
			
		   	assert.isElement(this.getDom(), "Element.prototype.setUnselectable(value): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			this.getDom().onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function(value) {
			
		   	assert.isElement(this.getDom(), "Element.prototype.setUnselectable(value): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			this.getDom().style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},
		
		/**
		 * ��Ԫ��������ǰ��
		 * @param {Element} [elem] �ο�Ԫ�ء�
		 * @return this
		 */
		bringToFront: function(elem) {
			
		   	assert.isElement(this.getDom(), "Element.prototype.bringToFront(elem): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			this.getDom().style.zIndex = Math.max(parseInt(styleString(this.getDom(), 'zIndex')) || 0, elem && elem.nodeType && (parseInt(styleString(elem, 'zIndex')) + 1) || e.zIndex++);
			return this;
		},
		
		/**
		 * �л���ʾ��ǰԪ�ء�
		 * @param {Number} duration=500 ʱ�䡣
		 * @param {Function} [callBack] �ص���
		 * @param {String} [type] ��ʽ��
		 * @return {Element} this
		 */
		toggle: function(duration, callBack, type, flag) {
			return this[(flag === undefined ? e.isHidden(this.getDom()) : flag) ? 'show' : 'hide']  (duration, callBack, type);
		},
		
		/**
		 * �仯��ĳֵ��
		 * @param {String} value �仯��ֵ������Ϊ height opacity width all size position left top right bottom��
		 * @param {Function} [callBack] �ص���
		 * @param {Number} duration=500 ʱ�䡣
		 * @param {String} [type] ���͡�
		 * @return this
		 */
		animate: function (){
			var args = arguments, name = args[0], value = args[1];
			if(typeof name === 'string'){
				(args[1] = {})[name] = value;
				args[0] = null;
			} else if(typeof value !== 'object'){
				Array.prototype.unshift.call(args, null);
			}
			
			this.set(args[1]);
			if(args[3])
				setTimeout(args[3], 0);
					
			return  this;
		}
		
	}, 2);
	
	
	/// #endif
	
	/// #region λ��
	
	var rBody = /^(?:body|html)$/i,
		
		/**
		 * ��ʾһ���㡣
		 * @class Point
		 * @memberOf Py.Drawing
		 */
		Point = p.namespace(".Point", p.Class({
			
			/**
			 * ��ʼ�� Point ��ʵ����
			 * @param {Number} x X ���ꡣ
			 * @param {Number} y Y ���ꡣ
			 * @constructor Point
			 */
			constructor: function(x, y) {
				this.set(x, y);
			},
			
			/**
			 * ���õ�ǰ��λ�á�
			 * @method set
			 * @param {Number} x X ���ꡣ
			 * @param {Number} y Y ���ꡣ
			 * @return {Point} this
			 */
			set: function(x, y) {
				
				this.x = x;
				this.y = y;
				return this;
			},
			
			/**
			 * �� (x, y) ��ֵ��
			 * @method add
			 * @param {Number} value ֵ��
			 * @return {Point} this
			 */
			add: function(x, y) {
			
		   		assert(typeof x == 'number' && typeof y == 'number', "Point.prototype.add(x, y): ���� x �� ���� y ���������֡�");
				this.x += x;
				this.y += y;
				return this;
			},
			
			/**
			 * ���Ƶ�ǰ����
		 	 * @method clone
			 * @return {Point} ���ꡣ
			 */
			clone: function() {
				return new Point(this.x, this.y);
			},
			
			/**
			 * ��һ�������������ǰֵ��
			 * @method minus
			 * @param {Point} p ֵ��
			 * @return {Point} this
			 */
			minus: function(p) {
			
		   		assert(p && 'x' in p && 'y' in p, "Point.prototype.minus(p): ���� {p} ������ 'x' �� 'y' ���ԡ�", p);
				this.x -= p.x;
				this.y -= p.y;
				return this;
			}
			
		})),
				
		/**
         * ��ȡ�������ѹ����Ĵ�С��
         * @return {Point} λ�á�
         */
		getWindowScroll = 'pageXOffset' in w ? function() {
			var win = getWindow(this);
			return new Point(win.pageXOffset, win.pageYOffset);
		} : getScroll;
	
	
	//   ����  Mootools (MIT license)
	
	
	
	/**
	 * @class Document
	 */
	apply(document, {
		
		/**
		 * ��ȡԪ�ؿ��������С��
		 * @method getWindowSize
		 * @return {Point} λ�á�
		 */
		getWindowSize:function() {
			var dom = this.getDom(),
				win = getWindow(this);
			return new Point(win.outerWidth || dom.clientWidth, win.outerHeight || dom.clientHeight);
        },
		
		/**
		 * ����Ԫ�ؿ��������С��
		 * @method setWindowSize
		 * @param {Number} x ��С��
		 * @param {Number} y ��С��
		 * @return {Document} this ��
		 */
		setWindowSize: function(x, y) {
            var p = adaptXY(x,y, this.getDom(), 'getWindowSize');
			getWindow(this).resizeTo(p.x, p.y);
			return this;
        },
		
		/**
		 * ��ȡԪ�ؿ��������С������ margin �� border ��С��
		 * @method getSize
		 * @return {Point} λ�á�
		 */
		getSize: function() {
			var doc = this.getDom();
			
			assert.isNode(doc, "document.getSize(): document.getDom() ���뷵�� DOM �ڵ㡣");
			return new Point(doc.clientWidth, doc.clientHeight);
		},
		
		/**
         * ��ȡ�������ѹ����Ĵ�С��
		 * @method getScroll
         * @return {Point} λ�á�
         */
		getScroll: getWindowScroll,
		
		/**
         * ��ȡ�ุԪ�ص�ƫ�
		 * @method getOffsets
         * @return {Point} λ�á�
         */
		getPosition: getWindowScroll,

		/**
		 * ��ȡ���������С��
		 * @method getScrollSize
		 * @return {Point} λ�á�
		 */
		getScrollSize: function() {
			var html = this.getDom(),
				min = this.getSize(),
				max = Math.max,
				body = html.ownerDocument.body;
				
				
			return new Point(max(html.scrollWidth, body.scrollWidth, min.x), max(html.scrollHeight, body.scrollHeight, min.y));
		},
		
		/**
         * ������
		 * @method setScroll
         * @param {Number} x ���ꡣ
         * @param {Number} y ���ꡣ
         * @return {Document} this ��
         */
        setScroll: function(x, y) {
			var p = adaptXY(x,y, this, 'getScroll');
			
            getWindow(this).scrollTo(p.x, p.y);
			
			return this;
        }
		
	});
	
	e.implement( {
		
		/**
		 * ��ȡ���������С��
		 * @method getScrollSize
		 * @return {Point} λ�á�
		 */
        getScrollSize: function() {
			var me = this.getDom();
			
			assert.isNode(me, "Element.prototype.getScrollSize(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			return new Point(me.scrollWidth, me.scrollHeight);
        },
		
		/**
		 * ��ȡԪ�ؿ��������С������ border ��С��
		 * @method getSize
		 * @return {Point} λ�á�
		 */
		getSize: function() {
			var me = this.getDom();
			
			assert.isNode(me, "Element.prototype.getSize(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			return new Point(me.offsetWidth, me.offsetHeight);
		},
		
		/**
		 * ��ȡԪ�ؿ��������С������ margin ��С��
		 * @method getSize
		 * @return {Point} λ�á�
		 */
		getOuterSize: function(){
			var me = this.getDom();

			return this.getSize().add(e.getSize(me, 'width', 'm'), e.getSize(me, 'height', 'm'));
		},
		
		/**
		 * ��ȡԪ�ص����λ�á�
		 * @method getOffset
		 * @return {Point} λ�á�
		 */
		getOffset: function() {
			
			assert.isElement(this.getDom(), "Element.prototype.getOffset(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			
			// ������ù� left top �����Ƿǳ����ɵ��¡�
			var me = this.getDom(),
				left = me.style.left,
				top = me.style.top;
				
			// ���δ���ù���
			if (!left || !top) {
				
				// ���Զ�λ��Ҫ���ؾ���λ�á�
				if(checkPosition(me, 'absolute'))
					return this.getOffsets(this.getOffsetParent());
				
				// �Ǿ��Ե�ֻ���� css ��style��
				left = getStyle(me, 'left');
				top = getStyle(me, 'top');
			}
			
			// ���� auto �� �� ��Ϊ 0 ��
			return new Point(parseFloat(left) || 0, parseFloat(top) || 0);
		},
	
        /**
		 * ��ȡԪ�������С����������������
		 * @method getWidth
		 * @return {Point} λ�á�
		 */
		getWidth: function(){
			
			assert.isElement(this.getDom(), "Element.prototype.getWidth(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			var me = this.getDom(), width = parseFloat(me.style.width);
			return isNaN(width) ? styleNumber(me, 'width') : width;
		},
	
        /**
		 * ��ȡԪ�������С����������������
		 * @method getWidth
		 * @return {Point} λ�á�
		 */
		getHeight: function(){
			
			assert.isElement(this.getDom(), "Element.prototype.getWidth(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			var me = this.getDom(), height = parseFloat(me.style.height);
			return isNaN(height) ? styleNumber(me, 'height') : height;
		},
		
		/**
         * ��ȡ�������ѹ����Ĵ�С��
		 * @method getScroll
         * @return {Point} λ�á�
         */
        getScroll: getScroll,
		
		/**
		 * ��ȡԪ�ص��������Ҵ�С��
		 * @method getBound
		 * @return {Rectange} ��С��
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
         * ��ȡ�ุԪ�ص�ƫ�
		 * @method getPosition
         * @return {Point} λ�á�
         */
        getPosition: div.getBoundingClientRect   ? function() {
			
			assert.isNode(this.getDom(), "Element.prototype.getPosition(): {this.getDom()} ���뷵�� DOM �ڵ㡣");

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
         * ��ȡ��������λ�õ�λ�á�
		 * @method getOffsets
         * @param {Element/String/Boolean} relative ��ԵĽڵ㡣
         * @return {Point} λ�á�
         */
        getOffsets: function( relative) {
			if (isBody(this.getDom())) return new Point(0, 0);
            var me = this.getDom(), pos = this.getPosition().minus(getScrolls(me));
			if(relative) {
				
				assert.isElement(relative, "Element.prototype.getOffsets(relative): ���� {relative} ~��");
				
				pos.minus(p.$(relative).getOffsets()).add( -styleNumber(me, 'marginLeft') - styleNumber(relative, borderLeftWidth) ,-styleNumber(me, 'marginTop') - styleNumber(relative,  borderTopWidth) );
            }
			return pos;
        },
		
        /**
         * ��ȡ������Ϊ��Ԫ�صĽڵ㡣
		 * @method getOffsetParent
         * @return {Element} Ԫ�ء�
         */
        getOffsetParent: function() {
			
			assert.isNode(this.getDom(), "Element.prototype.getOffsetParent(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			var elem = this.getDom().offsetParent || getDoc(this.getDom()).body;
			while ( elem && !isBody(elem) && checkPosition(elem, "static") ) {
				elem = elem.offsetParent;
			}
            return elem;
        }
		
	})
	
	.implement( {
		
        /**
         * �ı��С��
         * @param {Number} x ���ꡣ
         * @param {Number} y ���ꡣ
         * @return {Element} this
         */
        setSize: function(x, y) {
			return setSize(this, 'pb', x, y);
        },
	
		/**
         * �ı��С��
         * @param {Number} x ���ꡣ
         * @param {Number} y ���ꡣ
         * @return {Element} this
         */
		setOuterSize: function(x, y){
			return setSize(this, 'mpb', x, y);
		},
		
        /**
		 * ��ȡԪ�������С����������������
		 * @return {Element} this
		 */
		setWidth: function(value){
			
			assert.isElement(this.getDom(), "Element.prototype.setWidth(value): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			this.getDom().style.width = (value > 0 ? value : 0) + 'px';
			return this;
		},
	
        /**
		 * ��ȡԪ�������С����������������
		 * @return {Element} this
		 */
		setHeight: function(value){
			
			assert.isElement(this.getDom(), "Element.prototype.setWidth(value): this.getDom(){this.getDom()} ���뷵�� DOM �ڵ㡣");
			this.getDom().style.height = (value > 0 ? value : 0) + 'px';
			return this;
		},
		
		/**
         * ������
         * @param {Element} dom
         * @param {Number} x ���ꡣ
         * @param {Number} y ���ꡣ
         * @return {Element} this
         */
        setScroll: function(x, y) {
            var me = this.getDom(), p = getXY(x,y);
			
			assert.isNode(me, "Element.prototype.setScro{this.getDom()} ���뷵�� DOM �ڵ㡣���� DOM �ڵ㡣");
	        if(p.x != null)
	            me.scrollLeft = p.x;
	        if(p.y != null)
	        	me.scrollTop = p.y;
            return this;
			
        },
		
		/**
		 * ����Ԫ�ص����λ�á�
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function(p) {
			
			assert.isElement(this.getDom(), "Element.prototype.setOffset(p): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			assert(p && 'x' in p && 'y' in p, "Element.prototype.setOffset(p): ���� {p} ������ 'x' �� 'y' ���ԡ�", p);
			var s = this.getDom().style;
			s.top = p.y + 'px';
			s.left = p.x + 'px';
			return this;
		},

		/**
         * ����Ԫ�صĹ̶�λ�á�
         * @param {Number} x ���ꡣ
         * @param {Number} y ���ꡣ
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

	apply(e, {
		
		/**
		 * ����һ��Ԫ�ؿ��϶���
		 * @method setMovable
		 * @param {Element} elem Ҫ���õĽڵ㡣
		 * @static
		 */
		setMovable: function(elem) {
		   assert.isElement(elem, "Element.setMovable(elem): ���� elem ~��");
		   if(!checkPosition(elem, "absolute"))
			   elem.style.position = "relative";
		},
		
		/**
		 * ���Ԫ�ص� position �Ƿ��ָ����һ�¡�
		 * @param {Element} elem Ԫ�ء�
		 * @param {String} position ��ʽ��
		 * @return {Boolean} һ�£����� true ��
		 * @static
		 */
		checkPosition: checkPosition,
		
		/**
		 * ���� x, y ��ȡ {x: x y: y} ����
		 * @param {Number/Point} x 
		 * @param {Number} y
		 * @static
		 * @private
		 */
		getXY: getXY
	
	});
	
	/**
	 * @class
	 */
	
	/**
	 * ���Ԫ�ص� position �Ƿ��ָ����һ�¡�
	 * @param {Element} elem Ԫ�ء�
	 * @param {String} position ��ʽ��
	 * @return {Boolean} һ�£����� true ��
	 */
	function checkPosition(elem, position) {
		return styleString(elem, "position") === position;
	}
	
	/**
	 * ��ȡһ���ڵ�����ڵĴ��ڡ�
	 * @param {Object} elem
	 */
	function getWindow(elem) {
		return (elem.ownerDocument || elem).defaultView;
	}
	
	/**
	 * ��ȡһ��Ԫ�ع�����
	 * @return {Point} ��С��
	 */
	function getScroll() {
		var doc = this.getDom();
		assert.isNode(doc, "Element.prototype.getScroll(): {this.getDom()} ���뷵�� DOM �ڵ㡣���� DOM �ڵ㡣");
		return new Point(doc.scrollLeft, doc.scrollTop);
	}

    /**
     * ����Ƿ�Ϊ body ��
     * @param {Element} elem ���ݡ�
     * @return {Boolean} �Ƿ�Ϊ�ĵ����ĵ����ڵ㡣
     */
    function isBody(elem) {
        return rBody.test(elem.nodeName);
    }
	
	/**
	 * δʹ�ú��ӱ߿�
	 * @param {Element} elem Ԫ�ء�
	 * @return {Boolean} �Ƿ�ʹ�á�
	 */
	function nborderBox(elem) {
		return getStyle(elem, 'MozBoxSizing') != 'border-box';
	}
	
	/**
	 * ת������Ϊ��׼�㡣
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	function getXY(x, y) {
		return o.isObject(x) ? x : {x:x, y:y};
	}
	
	/**
	 * ��ȡĬ�ϵ�λ�á�
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} obj
	 * @param {Object} method
	 */
	function adaptXY(x, y, obj, method) {
		var p = getXY(x, y);
		if(p.x == null) p.x = obj[method]().x;
		if(p.y == null) p.x = obj[method]().y;
		assert(!isNaN(p.x) && !isNaN(p.y), "adaptXY(x, y, obj, method): ���� {x}��{y} ���ǺϷ������֡�(method = {method})", x, y, method);
		return p;
	}
	
	/**
	 * ��ȡһ��Ԫ�ص����й�����С��
	 * @param {Element} elem Ԫ�ء�
	 * @return {Point} ƫ�
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

	/// #ifdef �ڵ�
	
	/**
	 * ���ԡ�
	 * @type RegExp
	 */
	var rAttr = /\[([^=]*)(=(.*))?\]/,
		
		/**
		 * �㡣
		 * @type RegExp
		 */
		rPoint = /\./g,
	
		/**
		 * �������Լ��ϡ�
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
		 * ���� get �����ʶ���
		 * @type String
		 */
		nodeMaps = e.nodeMaps = {
			
			// ȫ���ϼ��ڵ㡣
			parents: [dir, childMap[3]],
			
			// ǰ��Ľڵ㡣
			previouses: [dir, childMap[4]],
			
			// ����Ľڵ㡣
			nexts: [dir, childMap[1]],
			
			// ����Ľڵ㡣
			next: [walk, childMap[1], childMap[1]],
			
			// ��һ���ڵ㡣
			first: childMap,
			
			// ���Ľڵ㡣
			last: [walk, childMap[4], childMap[5]],
			
			// ǰ��Ľڵ㡣
			previous: [walk, childMap[4], childMap[4]],
			
			// �ϼ��ڵ㡣
			parent: [walk, childMap[3], childMap[3]],
			
			// ֱ�ӵ��ӽڵ㡣
			child: [dir, childMap[1], childMap[2]],
			
			// ������ż������
			odd: [function(elem, fn) {
				return dir(elem, function() {
					return fn = fn === false;
				}, childMap[1], childMap[2]);
			}],
			
			// ȫ���ӽڵ㡣
			children: [ function(elem, fn) {
				return new ElementList(find(elem,  fn));
			}],
			
			// �ֵܽڵ㡣
			siblings: [ function(elem, fn) {
				return dir(elem, function(node){
					return node != elem && fn(el);
				});
			}]
		},
		
		/**
		 * ����һ���ڵ㡣
		 * @param {Element} elem ���ڵ㡣
		 * @param {undefined/String/Function} fn ���Һ�����
		 * @param {Boolean} childOnly �Ƿ�ֻ�������ڵĽڵ㡣
		 * @return {Array/Element} �ڵ㡣
		 */
		find = 'all' in document ? function(elem, fn) { // ��������
			assert.isFunction(fn, "Element.prototype.find(elem, fn): ���� {fn} ~��");
			return  Array.prototype.filter.call(elem.all, fn);
        } : function(elem, fn) {
			assert.isFunction(fn, "Element.prototype.find(elem, fn): ���� {fn} ~��");
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
        },
		
		hasChild = !div.compareDocumentPosition ? function(elem, child){
			while(child = child.parentNode){
				if(elem === child)
					return true;
			};
			return false;
		} : function(elem, child) {
			return !!(elem.compareDocumentPosition(child) & 16);
		};
	
	e.implementIf( {
		
		/**
		 * �������Ի��Ԫ�����ݡ�
		 * @method getElementsByAttribute
		 * @param {Strung} name ��������
		 * @param {Strung} value ����ֵ��
		 * @return {Array} �ڵ㼯�ϡ�
		 */
		getElementsByAttribute: function(name, value) {
			return find(this.getDom(), function(elem) {
				
				// ��������ֵ == value �� value �ǿ�
				// ���� value�գ� ����ֵ�ǿ�
				return (value === undefined) !== (e.getAttr(elem, name) == value);
			});
		},
		
		/// #ifdef SupportIE6

        /**
         * �������������ӽڵ㡣
		 * @method getElementsByClassName
         * @param {Strung} classname ������
         * @return {Array} �ڵ㼯�ϡ�
         */
        getElementsByClassName: function(classname) {
			assert.isString(classname, "Element.prototype.getElementsByClassName(classname): ���� {classname} ~��");
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
		
		// ʹ     ElementList ֧�ִ˺���
		getElementsByTagName: function(name) {
			return this.getElementsByTagName(name);
		},
		
		getElementsByName:  function(name) {
			return this.getElementsByAttribute('name', name);
		},
		
		/// #ifdef SupportIE6
		
		/**
		 * ִ��һ���򵥵�ѡ������
		 * @method find
		 * @param {String} selecter ѡ������ �� h2 .cls attr=value ��
		 * @return {Element/undefined} �ڵ㡣
		 */
		findAll: div.querySelectorAll ? function(selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): ���� {selecter} ~��");
			return new p.ElementList(this.getDom().querySelectorAll(selecter));
		} : function(selecter){
			assert.isString(selecter, "Element.prototype.findAll(selecter): ���� {selecter} ~��");
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
		 * �����ƥ��Ľڵ㡣
		 * @method get
		 * @param {String} type ���͡�
		 * @param {Function/Number} fn ���˺������������ǩ��
		 * @return {Element} Ԫ�ء�
		 */
		get: function(type, fn) {
			
			// ��� type Ϊ������ ��ʾ Ĭ�������ӽڵ㡣
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
			assert(n, 'Element.prototype.get(type, fn): ������֧�� {0}���� �Ľڵ������', type);
			return n[0](this.getDom(), fn, n[1], n[2]);
		}
		
	}, 4)
	
	.implement( {
		
		/**
		 * �ж�һ���ڵ��Ƿ����һ���ڵ㡣 һ���ڵ��������
		 * @method contains
		 * @param {Element} child �ӽڵ㡣
		 * @return {Boolean} �з���true ��
		 */
		contains: function(child){
			var me = this.getDom();
			assert.isNode(me, "Element.prototype.contains(child): this.getDom() ���صı����� DOM �ڵ㡣");
			return child == me || hasChild(me, child);
		},
			
		/**
		 * �ж�һ���ڵ��Ƿ����ӽڵ㡣
		 * @method contains
		 * @param {Element} child �ӽڵ㡣
		 * @return {Boolean} �з���true ��
		 */
		hasChild: function(child) {
			var me = this.getDom();
			return arguments.length ? hasChild(me, child) : me.firstChild !== null;
		}
	}, 5)
	
	.implement( {
		
		/// #ifndef Std
		
		/**
		 * ִ��һ���򵥵�ѡ������
		 * @param {String} selecter ѡ������ �� h2 .cls attr=value ��
		 * @return {Element/undefined} �ڵ㡣
		 */
		find: div.querySelector ? function(selecter){
			assert.isString(selecter, "Element.prototype.find(selecter): ���� {selecter} ~��");
			return this.getDom().querySelector(selecter);
		} : function(selecter) {
			var current = this.getDom();
			assert.isString(selecter, "Element.prototype.find(selecter): ���� {selecter} ~��");
			if(selecter.split(' ').each(function(v) {
				return !!(current = findBy(current, v)[0]);
			}))
				return p.$(current);
		},
		/// #else
		
		/// find: div.querySelector,
		
		/// #endif
		
		/**
         * ���ƽڵ㡣
         * @param {Boolean} copyListener=false �Ƿ����¼���
         * @param {Boolean} contents=true �Ƿ�����Ԫ�ء�
         * @param {Boolean} keepid=false �Ƿ��� id ��
         * @return {Element} Ԫ�ء�
         */
        clone: function(copyListener, contents, keepid) {	
		
			assert.isNode(this.getDom(), "Element.prototype.clone(copyListener, contents, keepid): this.getDom() ���صı����� DOM �ڵ㡣");
			// from Mootools
            var me = this.getDom(),
				clone = me.cloneNode(contents = contents !== false),
				clean = function(node, element) {
					if (!keepid)
						node.removeAttribute('id');
						
					/// #ifdef SupportIE8
						
					if(node.mergeAttributes) {
						
						node.clearAttributes();
						node.mergeAttributes(element);

						// �� IE delete element.data  �����쳣��
						if(element.data)
							node.data = null;   // IE  ������ node.data
							
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
		 * ��ĳ��λ�ò���һ��HTML ��
		 * @param {String/Element} html ���ݡ�
		 * @param {String} [swhere] ����ص㡣 beforeBegin   �ڵ���    beforeEnd   �ڵ���    afterBegin    �ڵ���  afterEnd     �ڵ���
		 * @return {Element} ����Ľڵ㡣
		 */
		insert: 'insertAdjacentElement' in div ? function(html, swhere) {
			var me = this.getDom();
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.getDom() ���صı����� DOM �ڵ㡣");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd'.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): ���� swhere ������ beforeBegin��beforeEnd��afterBegin �� afterEnd ��");
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
			
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.getDom() ���صı����� DOM �ڵ㡣");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd'.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): ���� {swhere} ������ beforeBegin��beforeEnd��afterBegin �� afterEnd ��", swhere);
			if (typeof html === 'string') {
				return manip(this, 'insert', html, swhere);
			}

			switch (swhere) {
				case "afterEnd":
					if(!me.nextSibling) {
						
						assert(me.parentNode != null, "Element.prototype.insert(html, swhere): �ڵ��޸��ڵ�ʱ�޷����� {this}", me);
						
						me.parentNode.appendChild(html);
						break;
					}
					
					me = me.nextSibling;
				case "beforeBegin":
						assert(me.parentNode != null, "Element.prototype.insert(html, swhere): �ڵ��޸��ڵ�ʱ�޷����� {this}", me);
					me.parentNode.insertBefore(html, me);
					break;
				case "afterBegin":
					if (me.firstChild) {
						me.insertBefore(html, me.firstChild);
						break;
					}
				default:
					assert(arguments.length == 1 || !swhere || swhere == 'beforeEnd', 'Element.prototype.insert(html, swhere): ���� {swhere} ������ beforeBegin��beforeEnd��afterBegin �� afterEnd ��', swhere);
					me.appendChild(html);
					break;
			 }
			 
			 return html;
		},

		/**
		 * ����һ��HTML ��
		 * @param {String/Element} html ���ݡ�
		 * @param {Boolean} escape �Ƿ�ת�� HTML ���룬���������Ϊ�ı���
		 * @return {Element} Ԫ�ء�
		 */
		append: function(html, escape) {
			var me = this;
			
			if(typeof html === 'string'){
				if(escape)
					html = getDoc(me.getDom()).createTextNode(html);
				else
					return manip(me, 'append', html);
			}
			
			assert.isNode(html, "Element.prototype.append(html, escape): ���� {html} ���ǺϷ��� �ڵ�� HTML Ƭ�Ρ�");
			return me.appendChild(html);
		},
		
		/**
		 * ��һ���ڵ���html��Χ��
		 * @param {String} html ���ݡ�
		 * @return {Element} Ԫ�ء�
		 */
		wrapWith: function(html) {
			var node = html = this.replaceWith(html);
			while(node.firstChild) node = node.firstChild;
			node.appendChild(this.getDom());
			return html;
		},
		
		/**
		 * ��һ���ڵ�����һ���ڵ��滻�� 
		 * @param {String} html ���ݡ�
		 * @return {Element} Ԫ�ء�
		 */
		replaceWith: function(html) {
		
			var me = this;
			
			assert(me.parentNode, 'Element.prototype.replaceWith(html): ��ǰ�ڵ��޸��ڵ㣬����ִ�д˷��� {this}', me);
			if (typeof html === 'string') {
				return manip(me, 'replaceWith', html);
			}
			
			me = me.getDom();
			assert.isNode(html, "Element.prototype.replaceWith(html, escape): ���� {html} ~�� HTM Ƭ�Ρ�");
			return me.parentNode.replaceChild(html, me);
		}
	}, 3)
	
	.implement( {
			
		/**
		 * ���ýڵ�ĸ��ڵ㡣
		 * @method renderTo
		 * @param {Element} elem �ڵ㡣
		 * @return {Element} this
		 */
		renderTo: function(elem) {
			
			elem = elem && elem !== true ? p.$(elem) : document.body;
			
			assert.isNode(elem, 'Element.prototype.renderTo(elem): ���� {elem} ~��');
			assert.isNode(this.getDom(), "Element.prototype.render{this.getDom()} ���뷵�� DOM �ڵ㡣���� DOM �ڵ㡣");
			
			if (this.getDom().parentNode !== elem) {
				
				// ����ڵ�
				elem.appendChild(this.getDom());
			}
			
			// ����
			return this;
		},
		
		/**
         * ɾ��Ԫ���ӽڵ����
         * @param {Object/undefined} child �ӽڵ㡣
         * @return {Element} this
         */
        remove: function(child) {
			var me = this.getDom();
			assert(child && this.hasChild(child), 'Element.prototype.remove(child): ���� {child} ���ǵ�ǰ�ڵ���ӽڵ�', child);
            child ? this.removeChild(child) : ( me.parentNode && me.parentNode.removeChild(me) );
            return this;
        },
		
        /**
         * ɾ��һ���ڵ�������ӽڵ㡣
         * @return {Element} this
         */
        empty: function() {
			assert.isNode(this.getDom(), "Element.prototype.empty(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			empty(this.getDom());
            return this;
        },
		
        /**
         * �ͷŽڵ�������Դ��
		 * @method dispose
         */
        dispose: function() {
			assert.isNode(this.getDom(), "Element.prototype.dispose(): {this.getDom()} ���뷵�� DOM �ڵ㡣");
			dispose(this.getDom());
        }
		
	}, 2);
	
	/**
     * ����Ԫ��ָ���ڵ㡣
     * @param {Element} elem �ڵ㡣
     * @param {Number/Function/undefined/undefined} fn ���˺�����
     * @param {String} walk ·����
     * @param {String} first ��һ���ڵ㡣
     * @return {Element} �ڵ㡣
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
     * ����Ԫ�����������Ľڵ���б�
     * @param {Element} elem �ڵ㡣
     * @param {Number/Function/undefined} fn ���˺�����
     * @param {String} walk ·����
     * @param {String} first ��һ���ڵ㡣
	 * @return {ElementList} ���ϡ�
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
	 * ִ�м򵥵�ѡ������
	 * @param {Element} elem Ԫ�ء�
	 * @param {String} selector ѡ������
	 * @return {ElementList} Ԫ�ؼ��ϡ�
	 * @ignore
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
	 * ��ȡһ��ѡ������
	 * @param {Number/Function/undefined} fn
	 * @return {Funtion} ������
	 * @ignore
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
		
		assert.isFunction(fn, "getFilter(fn): {fn} ������һ��������", fn);
		return fn;
	}
	
	/// #endif
	
	/// #ifdef SupportIE6
	
	try{
		
		//  �޸�IE6 �� css �ı䱳��ͼ���ֵ���˸��
		document.execCommand("BackgroundImageCache", false, true);
	} catch(e) {
		
	}
	
	/// #endif
	
	/// #region Core
	
	div = null;
	
	/// #endregion

})(this);

