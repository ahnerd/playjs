//===========================================
//  PyJs v0.4
//===========================================

/// #ifdef DefaultConfig

/**
 * 配置。可省略。
 * @type Object
 */
var Py = {
	
	/**
	 * 是否打开调试。
	 * @property debug
	 * @type Boolean
	 */
	debug: true,

	/**
	 * 根目录。
	 * @type String
	 * @property rootPath
	 * 程序会自动搜索当前脚本的位置为跟目录。
	 */
	rootPath: undefined,
	
	/**
	 * 启用控制台调试。
	 * @property trace
	 * @type Boolean 
	 * 如果不存在控制台，将自动调整为 false 。
	 */
	trace: true

};

/// #endif


//===========================================
//  核心   system.js
//  Copyright(c) 2009-2011 xuld
//===========================================

/**
 * Py.Core in Javascript
 * @author xuld
 * @license MIT license
 * @copyright 2009-2011 xuld
 */

(function(w) {
	
	/// #define PyJs
	/// #namespace System
	//
	// 可选宏: 
	//   Html:   只支持 HTML5， 支持 IE9+ FF3+ Chrome10+ Opera10+ Safari4+
	//   Std:    只支持 IE8+ FF3+ Chrome1+ Opera10+ Safari4+
	//
	// 默认支持:  IE6+ FF2+ Chrome1+ Opera8+ Safari4+ 。

	/// #region 全局变量
	
	/**
	 * 检查空白的正则表达式。
	 * @type RegExp
	 */
	var rSpace = /^[\s\u00A0]+|[\s\u00A0]+$/g,
		
		/**
		 * 格式化字符串用的正则表达式。
		 * @type RegExp
		 */
		rFormat = /\{+?(\S*?)\}+/g,
		
		/**
		 * 查找字符点的正则表达式。
		 * @type RegExp
		 */
		rPoint = /\./g,
		
		/**
		 * 匹配第一个字符。
		 * @type RegExp
		 */
		rFirstChar = /\b[a-z]/g,
		
		/**
		 * 表示空白字符。
		 * @type RegExp
		 */
		rWhite = /%20/g,
		
		/**
	     * 转为骆驼格式的正则表达式。
	     * @type RegExp
	     */
		rToCamelCase = /[\-_]\D/g,
		
		/**
		 * document 简写。
		 * @type Document
		 */
		document = w.document,
		
		/**
		 * nv 简写。
		 * @type Navigator
		 */
		nv = w.navigator,
		
		/**
		 * Array.prototype  简写。
		 * @type Object
		 */
		arp = Array.prototype,
		
		/// #ifdef Html
		
		/// forEach = arp.forEach,
		
		/// #else
	
		/**
		 * forEach 简写。
		 * @type Function
		 */
		forEach = arp.forEach || each,
		
		/// #endif
	
		/**
		 * 复制产生数组。
		 * @type Function
		 */
		makeArray = arp.slice,
		
		/// #ifndef Std
		/**
		 * 浏览器是否为标准事件。就目前浏览器状况， IE6，7 中 isQuirks = true  其它皆 false 。
		 * @type Boolean
		 * 此处认为 IE6,7 是怪癖的。
		 */
		isQuirks = typeof w.Element !== 'function' && String(w.Element) !== "[object Element]",

		/**
		 * 元素。
		 * @class Element
		 */
		Element = w.Element || function() {},
		
		/// #else
		
		/// isQuirks = false,
		
		/// Element: w.Element,
		
		/// #endif
		
		/**
		 * 管理所有事件类型的工具。
		 * @type Object
		 */
		eventMgr = {
			
			/**
			 * 管理默认的类事件。
			 * @type Object
			 */
			$default: {
				add: emptyFn,
				trigger: emptyFn,
				remove: emptyFn
			},
			
			/**
			 * 管理元素的事件。
			 * @type Object
			 */
			element: {
				
				/**
				 * 默认事件。
			 	 * @type Object
				 */
				$default: {
					
					setup: function() {
						return function(e) {
						
							// 此函数，存储事件相关数据。
							var fn = arguments.callee, i = -1,  // 存在类型说明有 one 事件，需生成函数副本，防止被删后循环错误。
							handlers = fn.handlers.slice(0), len = handlers.length, target = fn.target, F = false;
							
							// 创建参数
							fn.event.trigger.call(target, e);
							
							// 自身的句柄
							while (++i < len) {
							
								if (e.returnValue === F) 									
									return F;
								
								// 如果返回 false ， 运行   stopPropagation/preventDefault
								if (handlers[i].call(target, e) === F) {
									e.stopPropagation();
									e.preventDefault();
								}
								
							}
							
							return e.returnValue !== F;
						}  ;
					},
				
					createEventArgs: function(e, target){
						return e || new p.EventArgs(target);
					},
					
					trigger: emptyFn,
				
					add: function(obj, type, fn) {
						obj.addEventListener(type, fn, false);
					},
					
					remove: function(obj, type, fn) {
						obj.removeEventListener(type, fn, false);
					}
				}
			
			}
			
		},
		
		/**
		 * Object  简写。
		 * @namespace Object
		 */
		o = apply(Object, {
	
			/**
			 * 如果目标成员不存在就复制对象的所有属性到其它对象。 
			 * @method extendIf
			 * @param {Object} dest 复制目标。
			 * @param {Object} obj 要复制的内容。
			 * @return {Object} 复制后的对象。
			 * @see Object.extend
			 */
			extendIf: applyIf,
	
			/**
			 * 复制对象的所有属性到其它对象。 
			 * @method extend
			 * @param {Object} dest 复制目标。
			 * @param {Object} obj 要复制的内容。
			 * @return {Object} 复制后的对象。
			 * @see Object.extendIf
			 * @example
			 * <code>
			 * var a = {v: 3}, b = {g: 2};
			 * Object.extend(a, b);
			 * trace(a); // {v: 3, g: 2}
			 * </code>
			 */
			extend: (function(){
				for(var item in {toString: true})
					return apply;
				
				var members = ["toString", "hasOwnProperty"]
				return function(dest, src){
					for(var i = members.length, value; i--;)
						if(hasOwnProperty.call(src, value = members[i]))
							dest[value] = src[value];
					return apply(dest, src);
				}
			})(),
			
			/**
			 * 不用 eval() 方法返回变量的值。 
			 * @method value
			 * @param {Object/String} path 变量路径或变量自身。
			 * @param {Object} [root] 开始位置。
			 * @return 返回的值，如果位置已经为变量直接返回。
			 * @example
			 * <code>
			 * var obj={a: 'aaa'};
			 * alert(Object.value('obj.a'));//aaa
			 * obj=new function() {this.a="bbb"};
			 * alert(Object.value('obj.a'));//bbb
			 * current.target
			 * alert(Object.value('s'));//object 空对象 s={}; 
			 *</code>
			 */
			value: function(path, root) {
				
				assert(path, "path 等于空");
				
				// 依次遍历。
				for (var obj = root || w, i = 0, t, n = path.split ? path.split('.') : path; t = n[i]; ++i) {
					
					// 如果对象空。
					if (obj[t] == undefined) {
							
						// 创建空对象，用于下次继续循环。
						obj[t] = {};
					}
					
					// 进行第二次循环。
					obj = obj[t];
				}
	
				return obj;
			},
	
			/**
			 * 在原有可迭代对象遍历。
			 * @method each
			 * @param {Array/Object} iterable 对象，不支持函数。
			 * @param {Function} fn 执行的函数。参数 value (值), key|index (键), iterable (对象)。
			 * @param {Object} bind 迭代函数的环境变量。
			 * @return {Boolean} 是否遍历完所传的所有值。
			 * @example
			 * <code> 
			 * Object.each({a: '1', c: '3'}, function(value, key) {
			 * 		trace(key + ' : ' + value);
			 * });
			 * // 输出 'a : 1' 'c : 3'
			 * </code>
			 */
			each: function(iterable, fn, bind) {
	
				assert(o.isFunction(fn), "遍历的 fn 必须是可执行的函数。 ");
				
				// 如果 iterable 是 null， 无需遍历 。
				if (iterable != null) {
				
					// 获取长度。
					var l = iterable.length, t;
					
					//可遍历
					if (l === undefined) {
						
						// Object 遍历。
						for (t in iterable) 
							if (fn.call(bind, iterable[t], t, iterable) === false) 
								return false;
					} else {
						
						// 开始数。 第一次 0 。
						t = -1;
						
						// Array 遍历。
						while (++t < l) 
							if(fn.call(bind, iterable[t], t, iterable) === false)
								return false;
					}
					
				}
				
				// 正常结束。
				return true;
			},
	
			/**
			 * 更新可迭代对象。
			 * @method update
			 * @param {Array/Object} iterable 对象。
			 * @param {String/Function} fn 属性/执行的函数。参数 value。如果函数返回 undefined , 则不更新。
			 * @param {Object} dest=iterable 更新目标。
			 * @param {mixed} [args] 参数/绑定对象/方式。
			 * @return {Object}  返回的对象。
			 * @example 
			 * Object.update(["aa","aa23"], "length", []); // => [2, 4];
			 * Object.update(["aa","aa23"], 'charAt', [], 0); // => ["a", "a"];
			 * Object.update(["aa","aa23"], function(value, key) {return value.charAt(0);}, []); // => ["a", "a"];
			 */
			update: function(iterable, fn, dest, args) {
				
				// 如果没有目标，源和目标一致。
				dest = dest || iterable;
				
				// 遍历源。
				o.each(iterable, o.isFunction(fn) ? function(value, key) {
	                
					// 执行函数获得返回。
					value = fn.call(args, value, key);
					
					// 只有不是 undefined 更新。
	                if(value !== undefined)
					    dest[key] = value;
				} : function(value, key) {
					
					// 如果存在这个值。即源有 fn 内容。
					if(value != undefined) {
						
						// 如果此属性已为函数，则执行函数，并得到结果数组。
						if (o.isFunction(value[fn]))
							dest[key] = value[fn](args);
						
						// 如果属性是非函数，则说明更新。 a.value -> b.value
						else if(args)
							dest[key][fn] = value[fn];
							
						// 类似函数的更新。 a.value -> value
						else
							dest[key] = value[fn];
					}
	                    
				});
				
				// 返回目标。
				return dest;
			},
	
			/**
			 * 判断一个变量是否是引用变量。
			 * @method isObject
			 * @param {Object} object 变量。
			 * @return {Boolean} 所有 {} 和 new Object() 对象变量返回 true。
			 */
			isObject: function(obj) {
				
				// 只检查 null 。
				return obj !== null && typeof obj == "object";
			},
	
			/**
			 * 判断一个变量是否是数组。
			 * @method isArray
			 * @param {Object} object 变量。
			 * @return {Boolean} 判断是否数组。
			 */
			isArray: function(obj) {
				
				// 检查原型。
				return toString.call(obj) === "[object Array]";
			},
	
			/**
			 * 判断一个变量是否是函数。
			 * @method isFunction
			 * @param {Object} object 变量。
			 * @return {Boolean} 判断是否是函数。
			 */
			isFunction: function(obj) {
				
				// 检查原型。
				return toString.call(obj) === "[object Function]";
			},
			
			/**
			 * 返回一个变量的类型的字符串形式。
			 * @method type
			 * @param {Object} obj 变量。
			 * @return {String} 所有可以返回的字符串：  string  number   boolean   undefined	null	array	function   element  class   date   regexp object。
			 */
			type: function(obj) {
				
				//获得类型
				var b = typeof obj;
				
				switch (b) {
					case "object":  // 对象， 直接获取 xType
						return obj == null ? "null" : (obj.xType || b);

					case "function":  // 如果有原型， 则为类
						for(obj in obj.prototype) { return "class";}
						
					default:  // 和 typeof 一样
						return b;
						
				}
			},
	
			/**
			 * 深拷贝一个对象本身, 不深复制函数。
			 * @method clone
			 * @param {Object} obj 对象。
			 * @return {Object} 复制的对象。
			 * @example
			 * <code>
			 * var obj1 = {a: 0, b: 1};
			 * var obj2 = Object.clone(obj1);
			 *  
			 * obj1.a = 3;
			 * trace(obj1.a);  // trace 3
			 * trace(obj2.a);  // trace 0
			 *
			 * </code>
			 */
			clone: function(obj) {
				
				// 内部支持深度。
				// 用法:  Object.clone.call(1, val);
				var deep = this - 1;
				
				// 如果是对象，则复制。
				if (o.isObject(obj) && !(deep < 0)) {
					
					// 如果对象支持复制，自己复制。
					if(obj.clone)
						return obj.clone();
						
					//仅当对象才需深拷贝，null除外。
					obj = o.update(obj, o.clone, o.isArray(obj) ? [] : {}, deep);
				}
				
				return obj;
			}
	
		}),
	
		/**
		 * Object.prototype.toString 简写。
		 * @type Function
		 */
		toString = o.prototype.toString,
		
		hasOwnProperty = o.prototype.hasOwnProperty,
		
		/**
		 * @class Class
		 */
		np = Native.prototype = {
		
			/**
			 * 扩展当前类的动态方法。
			 * @method implement
			 * @param {Object} obj 成员。
			 * @return {Class} 继承的子类。
			 * @see Class.implement
			 */
			implement: function (obj) {
	
				assert(obj && this.prototype, "无法扩展类，因为 obj 或 this.prototype 为空。\n\t{0}", obj);
		
				// 复制到原型
				o.extend(this.prototype, obj);
		        
				return this;
			},
			
			/**
			 * 如果不存在成员, 扩展当前类的动态方法。
			 * @method implementIf
			 * @param {Object} obj 成员。
			 * @return {Class} 继承的子类。
			 * @see Class.implement
			 */
			implementIf: function(obj) {
			
				assert(obj && this.prototype, "无法扩展类，因为 obj 或 this.prototype 为空。\n\t{0}", obj);
		
				applyIf(this.prototype, obj);
				
				return this;
			},
			
			/**
			 * 为当前类添加事件。
			 * @method addEvents
			 * @param {String} evens 所有事件。 如字符串用“,”分开的事件。 事件对象，包含 {add, trigger, remove} 方法。
			 * @return this
			 */
			addEvents: function (events) {
				
				var ep = this.prototype;
				
				applyIf(ep, p.IEvent);
				
				// 如果有自定义事件，则添加。
				if (events) {
					
					// 更新事件对象。
					o.update(events, function(e) {
						return applyIf(e, eventMgr.$default);
						
						// 添加 Py.Events 中事件。
					}, o.value(hasOwnProperty.call(ep, 'xType') ? ep.xType : (ep.xType = (p.id++).toString()), eventMgr));
				
				}
				
				
				return this;	
			},
	
			/**
			 * 完成动态类的自身继承。
			 * @method extend
			 * @param {Object} methods 成员。
			 * @param {Boolean} quick=true 如果 true 那么这个类只能有1个实例，且不能复制 。
			 * @return {Class} 继承的子类。
			 */
		 	extend: function(members, quick) {
		
				// 未指定函数   使用默认构造函数(Object.prototype.constructor);
				
				/**
				 * 初始化类。
				 * @constructor Class
				 */ 
				var constructorDefined = hasOwnProperty.call(members =  members instanceof Function ? {
						constructor: members
					} : (members || {}), "constructor"),
				
					// 如果是快速模式且已经存在类构造函数，使用类的构造函数，否则，使用函数作为类。
					useDefinedConstructor = (quick = quick !== false) && constructorDefined,
				
					// 生成子类
					subClass = useDefinedConstructor ? members.constructor :  function() {
				 	
						// 去除闭包
				 		var me = this, subClass = arguments.callee, c = me.constructor;
				 		
				 		if (subClass.cloneMembers)  // 解除引用
							o.update(me, o.clone);
						
						// 重写构造函数
						me.constructor = subClass;
						
						// 重新调用构造函数
						c.apply(me, arguments);
						
					},
					
					// 基类( this )
					baseClass = this;
				
				// 代理类
				defaultConstructor.prototype = baseClass.prototype;
				
				// 指定成员
				Native(subClass).prototype = o.extend(new defaultConstructor, members);
				
				/// #ifndef Std
				
				// 强制复制构造函数。  FIX  6
				subClass.prototype.constructor = constructorDefined ? members.constructor : baseClass.prototype.constructor;
				
				
				if (!useDefinedConstructor && !quick) {
					
					// 设置是否为快速模式。
					subClass.cloneMembers = true;
				}
				
				/// #else
				
				/// if (!useDefinedConstructor) {
				///
				/// 	if(quick)
				///			subClass.cloneMembers = true;
				/// 
				///		// 强制复制构造函数。  FIX  6
				/// 	subClass.prototype.constructor = constructorDefined ? members.constructor : baseClass.prototype.constructor;
				/// }
				
				/// #endif
				
				// 指定父类
				subClass.base = baseClass;
		        
				// 指定Class内容
				return subClass;

			}
	
		},

		/**
		 * Py静态对象。
		 * @namespace Py
		 */
		p = namespace('Py', {
			
			/**
			 * 管理所有事件类型的工具。
			 * @property Events
			 * @type Object
			 */
			Events: eventMgr,   
			
			/**
			 * 元素。
			 * @class Element
			 */
			Element: Element,
			
			/// #ifndef Std
	
			/**
		     * 根据一个 id 或 对象获取节点。
			 * @method $
		     * @param {String/Element} id 对象的 id 或对象。
			 * @memberOf window, Py
		     */
			$: isQuirks ? function(id){
				var dom = getElementById(id);
				
				if(dom && dom.domVersion !== Element.prototype.domVersion) {
					applyIf(dom, Element.prototype);
				}
				
				return dom;
				
				
			} : getElementById,
			
			/// #else
			
			/// $: getElementById,
			
			/// #endif     
			
			/**
			 * 获取属于一个元素的数据。
			 * @method data
			 * @param {Object} obj 元素。
			 * @param {String} type 类型。
			 * @return {Object} 值。
			 */
			data: function (obj, type) {
				
				// 创建或测试。
				var d = obj.data || (obj.data = {}) ;
				
				// 同样。
				return d[type] || (d[type] = {});
			},
		
			/**
			 * 如果存在，获取属于一个元素的数据。
			 * @method dataIf
			 * @param {Object} obj 元素。
			 * @param {String} type 类型。
			 * @return {Object} 值。
			 */
			dataIf:function (obj, type) {
				
				// 获取变量。
				var d = obj.data;
				return d && d[type];
			},
			
			/**
			 * 设置属于一个元素的数据。
			 * @method setData
			 * @param {Object} obj 元素。
			 * @param {String} type 类型。
			 * @param {mixed} data 内容。
			 */
			setData: function(obj, type, data) {
				
				// 简单设置变量。
				return (obj.data || (obj.data = {}))[type] = data;
			},
			
			/**
			 * 复制一个对象的数据到另一个对象。
			 * @param {Object} src
			 * @param {Object} dest
			 */
			cloneData: function(src, dest){
				var data = src.data;
				
				if(data){
					dest.data = o.clone.call(1, data);
					
					var evt = src.data.event, i  ;
					if(evt){
						delete dest.data.event;
						for (i in evt) {
							evt[i].handlers.forEach( function(fn) {
								p.IEvent.on.call(dest, i, fn);
							});
						}
					}
				}
			},
		
			/**
			 * 全部已载入的名字空间。
			 * @type Array
			 */
			namespaces: [],
			
			/**
			 * 同步载入文本。
			 * @method loadText
			 * @param {String} uri 地址。
			 * @param {Function} callback 对返回值的处理函数。
			 * @return {String} 载入的值。
			 * @see Py.loadJs, Py.using
			 */
			loadText: function(uri, callback) {
	
				assert(w.location.protocol != "file:", "请求错误:  当前正使用 file 协议，请使用 http 协议。 \r\n请求地址: {0}",  uri);
				
				// 新建请求。
				var xmlHttp = new XMLHttpRequest();
	
				try {
					
					// 打开请求。
					xmlHttp.open("GET", uri, false);
	
					// 发送请求。
					xmlHttp.send(null);
	
					// 检查当前的 XMLHttp 是否正常回复。
					if (!XMLHttpRequest.isOk(xmlHttp)) {
						//载入失败的处理。
						throw String.format("请求失败:  \r\n   地址: {0} \r\n   状态: {1}   {2} ", uri, xmlHttp.status, xmlHttp.statusText);
					}
					
					// 运行处理函数。
					return callback(xmlHttp.responseText);
	
				} catch(e) {
					
					// 调试输出。
					trace.error(e);
				} finally{
					
					// 释放资源。
					xmlHttp = null;
				}
				
				return null;
	
			},
	
			/**
			 * 全局运行一个函数。
			 * @method eval
			 * @param {String} statement 语句。
			 * @return {Object} 执行返回值。
			 */
			eval: w.execScript || function(statement) {
				
				// 如果正常浏览器，使用 window.eval
				return w.eval(statement);
			},
			
			addCss: document.createStyleSheet ?function(text){
				document.createStyleSheet().cssText = text;
			} : function(text) {
				var style = document.createElement('STYLE');
				style.textContent = text;
				(document.getElementsByTagName('HEAD')[0] || document).appendChild(style);
			},
			
			/**
			 * 创建一个类。
			 * @method Class
			 * @param {Object/Function} methods 用于创建类的对象。/ 用于创建类的构造函数。
			 * @param {Boolean} quick=true 如果 true 那么这个类只能有1个实例，且不能复制，这会明显地提高创建类实例效率。
			 * @return {Class} 生成的类。
			 * @sdoc window.Class
			 */
			Class: Class,
			
			/**
			 * 表示一个事件接口。
			 * @namespace Py.IEvent
			 */
			IEvent: {
			
				/**
				 * 增加一个监听者。
				 * @method on
				 * @param {String} type 监听名字。
				 * @param {Function} fn 调用函数。
				 * @return Object this
				 */
				on: function(type, fn) {
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.data(me, 'event'), evt = d[type];
					
					// 如果未绑定
					if (!evt) {
					
						// 找到和对象有关的事件。
						var eMgr = eventMgr[me.xType];
							
						// 目前类型的对象。
						eMgr = eMgr && eMgr[type] || getMgr(me, type) || eventMgr.$default;
						
						// 支持自定义安装。
						evt = eMgr.setup ? eMgr.setup() : function(e) {
							var fn = arguments.callee,
								target = fn.target,
								handlers = fn.handlers.slice(0), 
								i = -1,
								len = handlers.length;
							
							// 默认事件函数。
							fn.event.trigger.call(target, e);
							
							// 循环直到 return false。 
							while (++i < len) 
								if (handlers[i].call(target, e) === false) 										
									return false;
							
							return true;
						};
						
						// 绑定事件对象，用来删除和触发。
						evt.event = eMgr;
						
						//指定当然事件的全部函数。
						evt.handlers = [fn];
						
						// 保存全部内容。
						d[type] = evt;
						
						// 添加事件。
						eMgr.add(evt.target = me, type, evt);
						
					} else {
						evt.handlers.push(fn);
					}
						
					return me;
				},
				
				/**
				 * 增加一个只执行一次的监听者。
				 * @method one
				 * @param {String} type 监听名字。
				 * @param {Function} fn 调用函数。
				 * @return Object this
				 */
				one: function(type, fn) {
					return this.on(type, function() {
						
						// 删除先。
						this.un( type, arguments.callee);
						
						// 然后调用。
						return fn.apply(this, arguments);
					});
				},
				
				/**
				 * 删除一个监听器。
				 * @method un
				 * @param {String} [type] 监听名字。
				 * @param {Function/undefined} fn 回调器。
				 * @return Object this
				 */
				un: function (type, fn) {
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.dataIf(me, 'event'), evt;
					if (d) {
						 if (evt = d[type]) {
							if (fn) 
								evt.handlers.remove(fn);
								
							// 检查是否存在其它函数或没设置删除的函数。
							if (!fn || evt.handlers.length == 0) {
								
								evt.handlers = null;
								delete d[type];
								
								// 内部事件管理的删除。
								evt.event.remove(me, type, evt);
							}
						}else if (!type) {
							for (evt in d) 
								me.un(evt);
						}
					}
					return me;
				},
				
				/**
				 * 触发一个监听器。
				 * @method trigger
				 * @param {String} type 监听名字。
				 * @param {Object/undefined} e 事件参数。
				 * @return Object this
				 */
				trigger: function (type, e) {
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, evt = p.dataIf(me, 'event');
					   
					   // LOG  ? applyIf(e, p.EventArgs.prototype) : 
					return (!evt || !(evt = evt[type]) || evt(evt.event.createEventArgs ? ( e = evt.event.createEventArgs(e, me)) : e)) && (!me[type = 'on' + type] || me[type](e) !== false);
					
				}
			},
			
			/**
			 * 所有类的基类。
			 * @namespace Py.Object
			 */
			Object: Native(from).implement({
				
				/**
				 * 调用父类的构造函数。
				 * @method base
				 * @return {mixed} 父类返回。
				 */
				base: function() {
					
					// 调用父类的函数。
					return this.baseCall('constructor', arguments);
				},
				
				/**
				 * 调用父类的成员变量。
				 * @method baseCall
				 * @param {Class} me 当前类。
				 * @param {Class} args 调用的参数数组。
				 * @param {String} name 属性名。
				 * @return {mixed} 父类返回。
				 */
				baseCall: function(name, args) {
					
					var me =  this.constructor.base,
					
						fn = this[name];
						
					// xuld:Assume that there are 3 classes named A, B and C. The relation of each class is
					// C extends B and B extends A. If A has a member called f(). Of course, A's 
					// child class has f() as well. when C calls baseCall('f'), it will actually
					// call B.f(), which is same as C.f() (Both are extended from class A).
					// In most cases, we want to call f() of superclass of A.
					// So we need to check if the base[name] fn is same as current class.
					// But checking is a waste of time and the situation memtioned cannot happen
					// unless we call base.f() outside this.f()
					// Finnaly, I comment up this code to save time.
					// So when you get something wrong using baseCall, you can:
					//     1. remove the comment. this code can ensure baseCall working well.
					//  or 2. use base.prototype[name].apply(this, araguments) instead
					
					fn.bubble = true;
					
					// 保证得到的是父类的成员。
					while(me && (fn = me.prototype[name]).bubble){
						me = me.base;
					}
					
					fn.bubble = true;
					
					// 确保 bubble 记号被移除。
					try {
						return fn.apply(this, args === arguments.callee.caller.arguments ? args : makeArray.call(arguments, 1));
					} finally {
						delete fn.bubble;
					}
				},
				
				/**
				 * 创建当前 Object 的浅表副本。
				 */
				memberwiseClone : function(){
					
					// 创建一个同类。
					var me = this, newObject = new me.constructor(), i;
					
					// 复制自身。
					for(i in me) {
						if(hasOwnProperty.call(me, i)) {
							newObject[i] = me[i];
						}
					}
					
					return newObject;
				}
			
			}),
	
			/**
			 * 使用一个名空间。
			 * @method using
			 * @param {String} name 名字空间。
			 * @param {Function} callBack 处理函数。
			 * @return Boolean 是否成功载入。
			 * @sdoc window.using
			 */
			using: include,
	
			/**
			 * 定义名字空间。
			 * @method namespace
			 * @param {String} name 名字空间。
			 * @param {String} className 类的名字。
			 * @param {Object} obj 值。
			 * @sdoc window.namespace
			 */
			namespace: namespace,
			
			imports: function (resource, theme){
				include(resource, theme, true);
			},
								
			/**
			 * 绑定一个监听器。
			 * @method addListener
			 * @param {Element} elem 元素。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 * @see Py.removeListener
			 */
			addEventListener: document.addEventListener ? function( type, fn) {
				this.addEventListener(type, fn, false);
			} : function(type, fn) {
				
				// IE8- 使用 attachEvent 。
				this.attachEvent('on' + type, fn);
			},
			
			/**
			 * 移除一个监听器。
			 * @method removeListener
			 * @param {Element} elem 元素。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 * @see Py.addListener
			 */
			removeEventListener: document.removeEventListener ? function(type, fn) {
				this.removeEventListener(type, fn, false);
			} : function(type, fn) {
				
				// IE8- 使用 detachEvent 。
				this.detachEvent('on' + type, fn);
			},
			
			/**
			 * 定义事件。 
			 * @method defineDomEvents
			 * @param {String} 事件名。
			 * @param {Function} trigger 触发器。
			 * @return {Function} Py.defineDomEvents
			 */
			defineDomEvents: function(events, baseEvent, trigger, add, remove, createEventArgs) {
				
				var ee = eventMgr.element;
				
				// 删除已经创建的事件。
				delete ee[events];
				
				// 对每个事件执行定义。
				String.map(events, from(applyIf({
					
					trigger: baseEvent && trigger ? function(e){
							eventMgr.element[baseEvent].trigger.call(this, e);
							trigger.call(this, e);
					} : trigger || (ee[events] || ee.$default).trigger,
					
					//  DOM 使用同方法来安装。
					add: add === true ? function(elem, type, fn) {
		                elem.addEventListener(baseEvent, this.delegate, false);
		            } : add || baseEvent && function(elem, type, fn) {
		                elem.addEventListener(baseEvent, fn, false);
		            },
					
					createEventArgs: createEventArgs,
					
					remove: remove === true ?  function(elem, type, fn) {
		                elem.addEventListener(baseEvent, this.delegate, false);
		            } : remove || baseEvent && function(elem, type, fn) {
		                elem.removeEventListener(baseEvent, fn, false);
		            }
					
				}, ee.$default)), ee);
				
				// 方便继续使用本函数，如果重命名，返回事件对象，否则返回此函数。
				return baseEvent ? ee[events] : arguments.callee;
			},
	
			/**
			 * 由存在的类修改创建类。即为类添加一个 implement 和 implementIf 成员。
			 * @method Native
			 * @param {Function/Class} nativeClass 将创建的类。
			 * @see Py.Class
			 * @return {Class} 生成的类。
			 * @remark 
			 * 如果引入 System.Core.Native
			 * Native和Class一样，生成一个类，但Native是在原有对象或类（包括JavaScript内置对象）上转成类。见示例。
			 * <code>
			 * Py.Native(Array); //同样， new 可省略，将Array本地类化。
			 * var myArray = Array.extend({	//既然是类，拥有继承方法。这时  myArray 是一个继承自原生  Array  的类，拥有 Array 类的原有动态成员。
			 * 	    size : function() {return this.length;}
			 * });
			 * var arr = new myArray();
			 * trace(arr.length);   // 输出 0。
			 * </code>
			 */
			Native: Native,
				
			/**
			 * 页面加载时执行。
			 * @param {Functon/undefined} fn 执行的函数。
			 * @memberOf document
			 */
			ready: function(fn) {
				
				// 已经完成则执行函数，否则 on 。
				document.isReady ? fn.call(document) : document.on('ready', fn);
				
			},
			
		    /**
		     * 将窗口对象本地化。
			 * @method setupWindow
		     * @param {Window} w 窗口。
		     * @memberOf Py
		     */
		    setupWindow: function(w) {
		    
		        /**
		         * 本地化 Element 。
		         * @class Element
		         */
				
				/// #ifndef Std
				
		        if (!w.Element) w.Element = Element;
				
				/// #endif
		        
		        // 对非     IE6/7 ,手动复制 Element.prototype
		        if (w.Element !== Element) {
					
					copyIf(Element.prototype, w.Element.prototype);
					
		            applyIf(w.Element, Element);
		        }
				
		        // 复制 document 变量。
		    	var wd = apply(w.document, p.IEvent);
				
				if(!wd.id)
					copyIf(document, wd);
				/// #ifndef Html
		        
		        // 修正 IE 不支持     defaultView
		        if (!('defaultView' in wd)) wd.defaultView = wd.parentWindow;
		        
				/// #endif
	
				// 将以下成员赋予 window ，这些成员是全局成员。
				String.map('$ ready Class addEventListener removeEventListener using imports data setData namespace dataIf', p, w, true);
				w.undefined = w.undefined;
				
				
				function copyIf(from, to){
					for (var item in from) {
						if(!(item in to) && (item in from))
							to[item] = from[item];
					}
				}
		    }
			
		});
	
	/// #endregion
		
	/// #region 全局函数

	/**
	 * 数组。
	 * @namespace Array
	 */
	applyIf(Array, {

		/**
		 * 在原有可迭代对象生成一个数组。
		 * @method create
		 * @param {Object} iterable 可迭代的实例。
		 * @param {Number} start (默认 0)开始的位置。
		 * @return {Array} 复制得到的数组。
		 */
		create: function(iterable, start) {
			if(!iterable)
				return [];
			if(iterable.item || iterable.count) {   //  DOM     Object  集 
				var l = iterable.length || iterable.count;
				start = start || 0;
				
				// 复制。
				var r = new Array(l);
				while (l--) r[l] = iterable[start++];
				return r;
			}
			
			// 调用 slice 实现。
			return makeArray.call(iterable, start);
		},

		/**
		 * 连接数组。
		 * @method plain
		 * @param {Array} ... 数据成员。
		 * @return 新数组。
		 */
		plain: function() {

			var r = [];
			
			// 对每个参数
			forEach.call(arguments, function(d) {
				
				
				// 如果数组，把内部元素压入r。
				if (o.isArray(d) || d.item) forEach.call(d, r.include, r);
				
				// 不是数组，直接压入 r 。
				else r.include(d);
			});

			return r;
		}

	});

	/**
	 * 函数。
	 * @namespace Function
	 */
	apply(Function, {
		
		/**
		 * 空函数。
		 * @property empty
		 * @type Function
		 * Function.empty返回空函数的引用。
		 */
		empty: emptyFn,

		/**
		 * 一个返回 true 的函数。
		 * @property returnTrue
		 * @type Function
		 */
		returnTrue: from(true),

		/**
		 * 一个返回 false 的函数。
		 * @property returnFalse
		 * @type Function
		 */
		returnFalse: from(false),
		
		/**
		 * 绑定函数作用域。
		 * @method bind
		 * @param {Function} fn 函数。
		 * @param {Object} bind 位置。
		 */
		bind: function(fn, bind) {
			
			// 返回对 bind 绑定。
			return function() {
				return fn.apply(bind, arguments);
			}
		},
		
		/**
		 * 返回自身的函数。
		 */
		from: from
		
	});

	/**
	 * 字符串。
	 * @namespace String
	 */
	apply(String, {

		/**
		 * 格式化字符串。
		 * @method format
		 * @param {String} format 字符。
		 * @param {Object} object 数组或对象。
		 * @param {Object} ... 参数。
		 * @return {String} 格式化后的字符串。
		 * <code>
		 *  String.format("{0}转换", 1); //  "1转换"
		 *  String.format("{1}翻译",0,1); // "1翻译"
		 *  String.format("{a}翻译",{a:"也可以"}); // 也可以翻译
		 *  String.format("{{0}}不转换, {0}转换", 1); //  "{0}不转换1转换"
		 *  格式化的字符串{}不允许包含空格。
		 *  不要出现{{{ 和  }}} 这样将获得不可预知的结果。
		 * </code>
		 */
		format: function(format, object) {

			if (format == null) return "";

			//支持参数2为数组或对象的直接格式化。
			var toString = this,
				arr = o.isObject(object) && arguments.length === 2 ? object: makeArray.call(arguments, 1);

			//通过格式化返回
			return format.replace(rFormat, function(match, name) {
				var start = match.charAt(1) == '{',
					end = match.charAt(match.length - 2) == '}';
				if (start || end) return match.slice(start, match.length - end);
				//LOG : {0, 2;yyyy} 为了支持这个格式, 必须在这里处理 match , 同时为了代码简短, 故去该功能。
				return name in arr ? toString(arr[name]) : "";
			});
		},
		
		/**
		 * 将一个数组源形式的字符串内容拷贝。
		 * @method map
		 * @param {Object} str 字符串。用空格隔开。
		 * @param {Object/Function} source 更新的函数或源。
		 * @param {Object} [dest] 目标。
		 * @example
		 * <code>
		 * String.map("aaa bbb ccc", function(v) {log(v); }); //  aaa bbb ccc
		 * String.map("aaa bbb ccc", function(v) { return v; }, {});    //    {aaa:aaa, bbb:bbb, ccc:ccc};
		 * </code>
		 */
		map: function(str, source, dest, copyIf) {
			var isFn = o.isFunction(source);
			// 分隔。
			str.split(' ').forEach(function(v, k, c) {
				var val = isFn ? source(v, k, c) : source[v];
				if(dest && !(copyIf && (v in dest)))
					dest[v] = val;
			});
			return dest;
		},
		
		/**
		 * 返回变量的地址形式。
		 * @param {Object} obj 变量。
		 * @return {String} 字符串。
		 */
		param: function(obj){
			var s = [], e = encodeURIComponent;
			o.each(obj, function( value, key ){
				s.push(e(key) + '=' + e(value));
			});
			return s.join('&').replace(rWhite, '+');
		}
		
	});
	
	/**
	 * 所有的类。
	 * @namespace Class
	 */
	apply(Class, {
		
		/**
		 * 将一个对象解析成一个类的属性。
		 * @method extend
		 * @param {Object} obj 类实例。
		 * @param {Object} config 参数。
		 * @param {Object} [dft] 默认。
		 */
		extend: function(obj, config) {
			
			// 对每项进行复制。
			o.each(config, extendClass, obj);
			
			return obj;
		},
		
		/**
		 * 添加一个对象的成员函数调用结束后的回调函数。
		 * @method addCallback
		 * @param {Object} obj 对象。
		 * @param {String} name 成员函数名。
		 * @param {Function} fn 对象。
		 * @return {Object} 对象。
		 * @example  Class.addCallback(window, "onload",trace.empty);
		 */
		addCallback: function(obj, name, fn) {
			
			// 获取已有的句柄。
			var f = obj[name];
			
			// 如果不存在则直接拷贝，否则重新拷贝。新函数对原函数调用。
			obj[name] = typeof f === 'function' ? function() {
				
				// 获取上次的函数。
				var v = f.apply(this, arguments);
				
				// 调用回调函数。
				fn.apply(this, arguments);
				
				// 返回原值。
				return v;
				
			} : fn;
			return obj;
		}
		
	});
	
	/**
	 * 日期。
	 * @namespace Date
	 */
	applyIf(Date, {
		
		/**
		 * 获取当前时间。
		 * @method now
		 * @return {Number} 当前的时间点。
		 */
		now: function() {
			return +new Date();
		}
		
	});
	
	/// #endregion
	
	applyIf(document, {
				
		/**
		 * 页面加载时执行。
		 * @param {Functon/undefined} fn 执行的函数。
		 * @memberOf document
		 */
		ready: p.ready,
		
		/// #ifndef Html
		
		/**
		 * 绑定一个监听器。
		 * @method addEventListener
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		addEventListener: p.addEventListener,
		
		/**
		 * 移除一个监听器。
		 * @method removeEventListener   
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		removeEventListener: p.removeEventListener,

		/// #endif
		
		/// #ifndef Std
		
		/**
		 * 根据 id 获取元素。
		 * @method getDom
		 * @param {String/Element} id 元素的id 或 元素。
		 * @return {Element} 元素。
		 * @memberOf document
		 */
		id: getElementById,
		
		/**
		 * 获取节点本身。
		 * @return {Element}
		 */
		getDom: isQuirks ? function(){
				
			// 这里直接使用 documentElement ，故不支持 QUIRKS ，如果 html = wd.body 则为 QUIRKS 模式。
			return p.$(this.documentElement);
		} : function(){
				
			// 这里直接使用 documentElement ，故不支持 QUIRKS ，如果 html = wd.body 则为 QUIRKS 模式。
			return this.documentElement;
		}
		
		/// #else
		
		/// id: getElementById,
		
		/// getDom: function(){
		///				
		///		// 这里直接使用 documentElement ，故不支持 QUIRKS ，如果 html = wd.body 则为 QUIRKS 模式。
		///		return this.documentElement;
		/// }
		
		///#endif
		
	});
	
	/// #region 浏览器

	/**
	 * 浏览器。
	 * @namespace nv
	 */
	applyIf(nv, (function(ua) {

		//检查信息
		var match = ua.match(/(IE|Firefox|Chrome|Opera|Version).((\d+)\.?[\d.]*)/i) || ["", "Other", 0, 0],
			
			//浏览器名字
			browser = match[0] ? match[1] : !document.all && !nv.taintEnabled ? 'Safari' : match[0],
	
			//详细信息
			fullBrowser = browser + match[3];
		
		/**
		 * 浏览器信息。
		 * @property isIE isFirefox isChrome isOpera isSafari
		 * @type Boolean 是否为某个名字的浏览器。
		 * @alias nv.isIE, nv.isFirefox, nv.isChrome, nv.isOpera, nv.isSafari
		 */
		nv["is" + browser] = nv["is" + fullBrowser] = true;
		
		//结果
		return {
			
			/**
			 * 浏览器信息。
			 * @property browser
			 * @type String
			 */
			browser: browser,
			
			/**
			 * 浏览器版本。
			 * @property version
			 * @type String
			 */
			version: match[2],
			
			/**
			 * 浏览器详细信息。
			 * @property fullBrowser
			 * @type String
			 */
			fullBrowser: fullBrowser,
			
			/**
			 * 是否为标准浏览器模式。IE6,7不被认为是标准的。
			 * @property isQuirks
			 * @type Boolean
			 */
			isQuirks: isQuirks,
			
			/**
			 * 是否为标准浏览器事件。
			 * @property isQuirks
			 * @type Boolean
			 */
			isStd: !!-[1,]
			
		};

		//LOG : 添加更多的侦查。比如isWindows  isAir
	
	})(nv.userAgent));

	/// #endregion
	
	/// #region 内部函数

	/**
	 * 类型。
	 * @property xType
	 * @type String
	 * @memberOf Date.prototype
	 */
	Date.prototype.xType = "date";
	
	/**
	 * 类型。
	 * @property xType
	 * @type String
	 * @memberOf RegExp.prototype
	 */
	RegExp.prototype.xType = "regexp";
	
	
	// 把所有内建对象本地化
	forEach.call([String, Array, Function, Date, Class, Element, Number], Native);
	
	/**
	 * @class String 
	 */
	String.implementIf({
		
		/**
	     * 转为骆驼格式。
	     * @method toCamelCase
	     * @param {String} value 内容。
	     * @return {String} 返回的内容。
	     * @memberOf String
	     */
		toCamelCase: function() {
	        return this.replace(rToCamelCase, toCamelCase);
	    },

		/// #ifndef Html

		/**
		 * 去除首尾空格。
		 * @method trim
		 * @return {String}    处理后的字符串。
		 */
		trim: function() {
			
			// 使用正则实现。
			return this.replace(rSpace, "");
		},
		
		/// #endif
		
		/**
		 * 将字符首字母大写。
		 * @method capitalize
		 * @return {String} 大写的字符串。
		 */
		capitalize: function() {
			
			// 使用正则实现。
			return this.replace(rFirstChar, toUpperCase);
		}

	});
	
	/**
	 * @class Array
	 */
	Array.implementIf({

		/// #ifndef Html

		/**
		 * 返回数组某个值的第一个位置。值没有,则为-1 。
		 * @method indexOf
		 * @param {Object} item 成员。
		 * @param {Number} start 开始查找的位置。
		 * @return Number 位置，找不到返回 -1 。 
		 * 现在大多数浏览器已含此函数.除了 IE8-  。
		 */
		indexOf: indexOf,
		
		/// #endif

		/**
		 * 返回数组是否包含一个值。
		 * @method contains
		 * @param {Object} item 成员。
		 * @return {Boolean} 存在返回 true 。
		 */
		contains: function(item) {
			
			// 检查判断 indexOf
			return this.indexOf(item) != -1;
		},

		/**
		 * 对数组运行一个函数。
		 * @method each
		 * @param {Function} fn 函数.参数 value, index
		 * @param {Object} bind 对象。
		 * @return {Boolean} 有无执行完。
		 */
		each: each,

		/// #ifndef Html

		/**
		 * 对数组每个元素通过一个函数过滤。返回所有符合要求的元素的数组。
		 * @method filter
		 * @param {Function} fn 函数。参数 value, index, this。
		 * @param {Object} bind 绑定的对象。
		 * @return {Array} this
		 */
		filter: function(fn, bind) {
			var r = [];
			forEach.call(this, function(value, i, array) {
				
				// 过滤布存在的成员。
				if(fn.call(this, value, i, array))
					r.push(value);
			}, bind);
			
			return r;

		},

		/**
		 * 对数组运行一个函数。
		 * @method forEach
		 * @param {Function} fn 函数.参数 value, index
		 * @param {Object} bind 对象。
		 */
		forEach: each,
		
		/// #endif
		
		/**
		 * 对数组每个元素查找一个函数返回true的项。 或按属性返回数组一个元素。
		 * @method select
		 * @param {Function/String} name 函数。参数 value, index。 /数组成员的字段。
		 * @param {Object} value 值。
		 * @return {Array} 新数组。
		 * <code>
		 * var a = ["", "aaa", "zzz", "qqq"];
		 * a.select("length", 0); //  返回"";
		 * a = [{q: "1"}, {q: "3"}];
		 * a.select("q", "3");	//  返回{q: "3"};
		 * </code>
		 */
		select: function(name, value) {
			var me = this, index = -1, i = -1 , l = me.length, t,
				fn = o.isFunction(name) ? name : function(t) {
					return t[name] === value;
				};
			while (++i < l) {
				t = me[i];
				
				// 调用。
				if (fn.call(t, t, i, me)) {
					me[++index] = t;
				}
			}
			me.splice(++index, l - index);
			
			return me;
		},

		/**
		 * 包含一个元素。元素存在直接返回。
		 * @method include
		 * @param {Object} value 值。
		 * @return {Boolean} 是否包含元素。
		 */
		include: function(value) {
			
			//未包含，则加入。
			var b = this.indexOf(value) !== -1;
			if(!b)
				this.push(value);
			return b;
		},
		
		/**
		 * 在指定位置插入项。
		 * @param {Number} index 插入的位置。
		 * @param {Object} value 插入的内容。
		 */
		insert: function(index, value){
			
			
			for(var i = this.length++; i > index; i--)
				this[i] = this[i - 1];
				
			this[index] = value;
			return this;
		},
		
		/**
		 * 对数组成员遍历执行。
		 * @param {String/Function} fn
		 * @param {Array} args
		 * @return {Array} 结果。
		 */
		invoke: function(fn, args){
			var r = [];
			forEach.call(this, o.isFunction(fn) ? function(value, index){
				r.push(fn.call(args, value, index));
			} : function(value){ 
				r.push(value[fn].apply(value, args));
			});
			
			return r;
		},
		
		/**
		 * 删除数组中重复元素。
		 * @return {Array} 结果。
		 */
		unique : function() {
			var r = [];
			forEach.call(this, r.include, r);
		    return r; 
		},
		
		/**
		 * 删除元素, 参数为元素的内容。
		 * @method remove
		 * @param {Object} value 值。
		 * @return {Number} 删除的值的位置。
		 */
		remove: function(value) {
			
			// 找到位置， 然后删。
			var i = this.indexOf(value);
			if(i !== -1)this.splice(i, 1);
			return i;
		},
		
		/**
		 * xType。
		 * @property xType
		 * @type String
		 */
		xType: "array"

	});
	
	/**
	 * @class Element
	 */
	Element.implementIf({
		
		/**
		 * xType
		 * @method xType
		 * @type String
		 * @memberOf Element.prototype, document
		 */
		xType: document.xType = "element",
		
		/**
		 * 获取节点本身。
		 * @return {Element}
		 */
		getDom: function(){
			return this;
		},
		
		/// #ifndef Html
		
		/**
		 * 绑定一个监听器。
		 * @method addEventListener
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		addEventListener: p.addEventListener,
		
		/**
		 * 移除一个监听着。
		 * @method removeEventListener   
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		removeEventListener: p.removeEventListener
		
		/// #endif
		
	});
	
	
	/// #endregion
	
	/// #region 远程请求
	
	/**
	 * 生成一个请求。
	 * @method XMLHttpRequest
	 * @return {XMLHttpRequest} 请求的对象。
	 * @memberOf window
	 */
	
	/// #ifndef Std
		
	if (isQuirks) {
		
		
		// 避免 getElementById 函数返回错误的函数。
		Element.prototype.domVersion = 1;
		
	}
	
	if(!w.XMLHttpRequest) {
		
		try{
			(w.XMLHttpRequest = function() {
				return new ActiveXObject("MSXML2.XMLHTTP");
			})();
		} catch(e) {
			try {
				(w.XMLHttpRequest = function() {
					return new ActiveXObject("Microsoft.XMLHTTP");
				})();
			} catch (e) {
				
			}
		}
	}
	
	
	/// #endif
	
	/**
	 * 判断当前请求是否有正常的返回。
	 * @method isOk
	 * @param {XMLHttpRequest} xmlHttp 请求。
	 * @return {Boolean} 正常返回true 。
	 * @memberOf XMLHttpRequest
	 */
	w.XMLHttpRequest.isOk = function(xmlHttp) {
		
		// 获取状态。
		var status = xmlHttp.status;
		if (!status) {
			
			// 获取协议。
			var protocol = w.location.protocol;
			
			// 对谷歌浏览器，  status 不存在。
			return (protocol == "file: " || protocol == "chrome: " || protocol == "app: ");
		}
		
		// 检查， 各浏览器支持不同。
		return (status >= 200 && status < 300) || status == 304 || status == 1223;
	};
	
	/// #endregion

	/// #region 页面
	
	/**
	 * @class Element
	 */
	Element.addEvents({
		
		/**
		 * 文档初始化事件。
		 * @event ready
		 */
		ready: {
			add: function(elem, type, fn) {
				
				assert(elem.nodeType === 9, '只有文档对象才能添加 ready 。');
				
				// 使用系统文档完成事件。
				elem.addEventListener(this.eventName, fn, false);
				
				// 使用 window.onload。确保函数被成功运行。
				var w = elem.defaultView;
				
				p.addEventListener.call(w, 'load', fn);
				
				
				// 如果readyState 不是  complete, 说明文档正在加载。
				if (elem.readyState !== "complete") { 
					
					/// #ifndef Html
					
					// 只对 IE 检查。
					if (!navigator.isStd) {
					
						// 来自 jQuery
			
						//   如果是 IE 且不是框架
						var toplevel = false;
			
						try {
							toplevel = w.frameElement == null;
						} catch(e) {}
			
						if ( toplevel && elem.documentElement.doScroll) {
							
							/**
							 * 为 IE 检查状态。
							 * @private
							 */
							(function () {
								if (elem.isReady) {
									return;
								}
							
								try {
									//  http:// javascript.nwbox.com/IEContentLoaded/
									elem.documentElement.doScroll("left");
								} catch(e) {
									setTimeout( arguments.callee, 1 );
									return;
								}
							
								elem.trigger('ready');
							})();
						}
					}
					
					/// #endif
					
				} else {
					
					elem.trigger('ready');
				}
			},
			
			remove: function(elem, type, fn) {
				
				// 删除系统自带事件。
				elem.removeEventListener(this.eventName, fn, false);
				p.removeEventListener.call(elem.defaultView, 'load', fn);
			},
			
			trigger: function(e) {
				this.isReady = true;
				this.un('ready');
			},
			
			/// #ifndef Html
			
			eventName: nv.isStd ? 'DOMContentLoaded' : 'readystatechange'
			
			
			/// #else
			
			/// eventName: 'DOMContentLoaded'   
			
			/// #endif
		}
	
	});
	
	p.setupWindow(w);
	
	/**
	 * @namespace Py
	 */
	apply(p, {
		
		/**
		 * id种子 。
		 * @property id
		 * @type {Number}
		 * @private
		 */
		id: Date.now() % 100,
			
		/**
		 * PyJs 安装的根目录, 可以为相对目录。
		 * @property rootPath
		 * @type String
		 */
		rootPath: p.rootPath || (function(d) {
				
				
				/// HACK: this function fails in special environment
				
				var b = d.getElementsByTagName("script");
				
				// 当前脚本在 <script> 引用。最后一个脚本即当前执行的文件。
				b = b[b.length - 1];
						
				// IE6/7 使用  getAttribute
				b = isQuirks ? b.getAttribute('src', 5) : b.src;
				return (b.match(/[\S\s]*\//) || [""])[0];
				
		}) (document),
		
		theme: p.theme || 'default',
			
		/**
		 * 表示事件的参数。
		 * @class EventArgs
		 */
		EventArgs: Class({
			
			/**
			 * 构造函数。
			 * @param {Object} target
			 * @constructor EventArgs
			 */
			constructor: function(target){
				 this.target = target;
			},
	
			/**
			 * 阻止冒泡。
			 * @method stopPropagation
			 */
			stopPropagation : function() {
				this.cancelBubble = true;
			},
			
			/**
			 * 停止默认。
			 * @method preventDefault
			 */
			preventDefault : function() {
				this.returnValue = false;
			}
			
		})
		
	});

	/// #endregion
	
	/// #region 函数
	
	/**
	 * @private
	 */
	
	/**
	 * 复制所有属性到任何对象。 
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function apply(dest, src) {
		
		assert(dest && src, "复制属性异常 : dest 或 src 为空");
		
		
		for (var b in src)
			dest[b] = src[b];
		return dest;
	}
	
	/**
	 * 如果不存在就复制所有属性到任何对象。 
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function applyIf(dest, src) {

		assert(dest && src, "复制属性异常 : dest 或 src 为空。");

		for (var b in src)
			if (dest[b] === undefined)
				dest[b] = src[b];
		return dest;
	}

	/**
     * 根据一个 id 或 对象获取节点。
     * @param {String/Element} id 对象的 id 或对象。
	 * @memberOf window
     */
	function getElementById(id) {  
		return typeof id == "string" ? document.getElementById(id) : id;
	}
	
	/**
	 * 扩展类。
	 * @param {Object} v 值。
	 * @param {String} k 键。
	 */
	function extendClass(v, k) {
				
		var obj = this,
		
		// 检查 setValue 。
			setter = 'set' + k.capitalize();


		if (o.isFunction(obj[setter])) {
			obj[setter](v);
			return;
		} 
		
		// 是否存在函数。
		if(o.isFunction(obj[k])) {
			obj[k](v);
			return;
		}
		
		// 检查 value.set 。
		if (obj[k] && obj[k].set) {
			obj[k].set(v);
			return;
		} 
		
		// 检查 set 。
		if(obj.set)
			obj.set(k, v);
		else
		
			// 最后，就直接赋予。
			obj[k] = v;
		
	}
	
	/**
	 * 由存在的类修改创建类。即为类添加一个 implement 和 implementIf 成员。
	 * @method Native
	 * @param {Function/Class} nativeClass 将创建的类。
	 * @see Py.Class
	 * @return {Class} 生成的类。
	 * @remark 
	 * 如果引入 System.Native
	 * Native和Class一样，生成一个类，但Native是在原有对象或类（包括JavaScript内置对象）上转成类。见示例。
	 * <code>
	 * new Py.Native(Array); //同样， new 可省略，将Array本地类化。
	 * var myArray = Array.extend({	//既然是类，拥有继承方法。这时  myArray 是一个继承自原生  Array  的类，拥有 Array 类的原有动态成员。
	 * 	    size : function() {return this.length;}
	 * });
	 * var arr = new myArray();
	 * trace(arr.length);   // 输出 0。
	 * </code>
	 */
	function Native(nativeClass) {
		
		// 简单拷贝  Native.prototype 的成员，即拥有类的特性。
		// 在 JavaScript， 一切函数都可作为类，故此函数存在。
		// Native.prototype 的成员一般对当前类构造函数原型辅助。
		return applyIf(nativeClass, np);
	}
			
	/**
 	 * 返回数组某个值的第一个位置。值没有,则为-1 。
	 * @param {Object} item 成员。
	 * @param {Number} startIndex 开始查找的位置。
	 * @return {Number} 位置，找不到返回 -1 。 
	 * 现在大多数浏览器已含此函数.除了 IE8-  。
	 */
	function indexOf(item, startIndex) {
		startIndex = startIndex || 0;
		for (var l = this.length; startIndex < l; startIndex++)
			if (this[startIndex] === item)
				return startIndex;
		return -1;
	}

	/**
	 * 对数组运行一个函数。
	 * @param {Function} fn 函数.参数 value, index, array
	 * @param {Object} bind 对象。
	 * @return {Boolean} 有无执行完。
	 * 现在大多数浏览器已含此函数.除了 IE8-  。
	 */
	function each(fn, bind) {
		var i = -1,
			me = this,
			l = me.length;
		while (++i < l)
			if(fn.call(bind, me[i], i, me) === false)
				return false;
		return true;
	}
	
    /**
     * 到骆驼模式。
     * @param {Match} match 匹配的内容。
     * @return {String} 返回的内容。
     */
    function toCamelCase(match) {
        return match.charAt(1).toUpperCase();
    }
	
	/**
	 * 将一个字符转为大写。
	 * @param {String} match 字符。
	 */
	function toUpperCase(match) {
		return match.toUpperCase();
	}
	
	/**
	 * 空函数。
	 */
	function defaultConstructor(){
		
	}
	
	/**
	 * 空函数。
	 */
	function emptyFn(){
		
	}
	
	/**
	 * 获取父类的同名方法。
	 * @param {Object} obj 对象。
	 * @param {String} type 类型。
	 * @return {Object} 对象。
	 */
	function getMgr(me, type) {
		var cb = me.constructor, eMgr;
							
		while(cb && (cb = cb.base)) {
			
			eMgr = eventMgr[cb.prototype.xType];
			
			if(eMgr && (type in eMgr))
				return eMgr[type];
		
		}
		
	}

	/**
	 * 定义名字空间。
	 * @param {String} name 名字空间。
	 * @param {String} className 类的名字。
	 * @param {Object} obj 值。
	 */
	function namespace(name, className, obj) {
		
		// 简单声明。
		if (!className) {
			
			// 加入已使用的名字空间。
			return   p.namespaces.include(name);
		}
		
		// 取值，创建。
		name = o.value(name);
		
		// 指明的是对象。
		if (obj) {
			
			// 获取类。
			var q = name[className];
			
			// 复制到全局对象和名字空间。
			return w[className] = (q ? apply(q, obj) : (name[className] = obj));
			
		}
		
		// 只复制当前成员。
		return apply(  name, className);
		
	}
	
	/**
	 * 同步载入一个脚本或样式表。
	 * @param {Object} name
	 * @param {Object} theme
	 * @param {Object} isStyle
	 */
	function include(name, theme, isStyle){
		
		assert(name, "name不是合法的名字空间");
		
		if(name.indexOf('*') > -1){
		 	return (theme || (isStyle ?['share', Py.theme] : [])).forEach(function(value){
				include(name.replace('*', value), null, isStyle);
			});
		 }
		
		// 已经载入。
		if(Py.namespaces.include(name))
			return;
		
		if(name.indexOf('/') == -1){
			name = name.toLowerCase().replace(rPoint, '/') + (isStyle ? '.css' : '.js');
		}
		 
		 var doms, check, callback;
		 
		 if(isStyle){
		 	e = p.addCss;
		 	doms = document.styleSheets;
			src = 'href';
		 } else {
		 	e = p.eval;
		 	doms = document.getElementsByTagName("SCRIPT");
			src = 'src';

			/* this donot work in IE7/6
			e = function(text){
				var style = document.createElement('script');
				style.innerHTML = text;
				(document.getElementsByTagName('head')[0] || document).appendChild(style);
			};
			*/
			
			
		 }
		 
		 
		  Object.each(doms, function(dom){
		 	return !dom[src] || dom[src].toLowerCase().indexOf(name) == -1;
		 }) && p.loadText(p.rootPath + name, e );
	}
	
	/**
	 * 创建一个类。
	 * @param {Object/Function} methods 用于创建类的对象。/ 用于创建类的构造函数。
	 * @param {Boolean} quick=true 如果 true 那么这个类只能有1个实例，且不能复制，这会明显地提高创建类实例效率。
	 * @return {Class} 生成的类。
	 */
	function Class(members, quick) {
			
		// 生成新类
		return p.Object.extend(members, quick);
	}
	
	/**
	 * 返回返回指定结果的函数。
	 * @param {mixed} v 结果。
	 * @return {Function} 函数。
	 */
	function from(v) {
		return function() {
			return v;
		}
	}

	/// #endregion

})(this);



// ===========================================
//   调试   debug.js
//   Copyright(c) 2009-2011 xuld
// ===========================================

///  #ifdef Debug
///  #region 调试


/**
 * @namespace String
 */
Object.extend(String, {
	
	/**
	 * 将字符串转为 utf-8 字符串。
	 * @param {String} s 字符串。
	 * @return {String} 返回的字符串。
	 */
	toUTF8:function(s) {
		return s.replace(/[^\x00-\xff]/g, function(a,b) {
			return '\\u' + ((b=a.charCodeAt()) < 16 ? '000' : b<256 ? '00' : b<4096 ? '0' : '') + b.toString(16);
		});
	},
    
	/**
	 * 将字符串从 utf-8 字符串转义。
	 * @param {String} s   字符串。
	 * @return {String} 返回的字符串。
	 */
	fromUTF8:function(s) {
		return s.replace(/\\u([0-9a-f]{3})([0-9a-f])/gi,function(a,b,c) {return String.fromCharCode((parseInt(b,16)*16+parseInt(c,16)))})
	}
		
});
 


/**
 * 调试输出。
 * @param {Object} obj 值。
 * @param {String} args 格式化的字符串。
 */
function trace(obj, args) {

	if (arguments.length == 0 || !Py.trace) return; // 关闭调试
	
	var useConsole = window.console && console.log;

	if (typeof obj == "string") {
		if(arguments.length > 1)
			obj = String.format.apply(trace.inspect, arguments);
		// 存在       console
		//   IE8  存在控制台，这是好事，但问题是IE8的控制台对对象输出全为 [object] 为了更好的调试，我们期待自定义的调试信息。
		//    为了支持类的输出，也不使用默认的函数输出
	} else if (!useConsole || navigator.isIE8) {
		obj = trace.inspect(obj, args);
	}


	if (useConsole) console.log(obj);
	else trace.alert(obj);
}

/**
 * @namespace trace
 */
Object.extendIf(trace, {
	
	/**
	 * 输出方式。
	 * @param {String} message 信息。
	 */
	alert: function(message) {
		alert(message);
	},
	
	/**
	 * 得到输出指定内容的函数。
	 * @return {Function}
	 */
	from: function(msg) {
		return function() {
			trace(msg, arguments);
		};
	},

	/**
	 * 遍历对象每个元素。
	 * @param {Object} obj 对象。
	 */
	dir: function(obj) {
		if (Py.trace) {
			if (window.console && console.dir) 
				console.dir(obj);
			else 
				if (obj) {
					var r = "{\r\n", i;
					for (i in obj) 
						r += "\t" + i + " = " + trace.inspect(obj[i], 1) + "\r\n";
					r += "}";
					trace.alert(r);
				}
		}
	},
	
	/**
	 * 获取对象的所有成员的字符串形式。
	 * @param {Object} obj 要输出的内容。
	 * @param {Number/undefined} deep 递归的层数。
	 * @return String 成员。
	 */
	inspect: function(obj, deep) {
		
		if( deep == null ) deep = 0;
		switch (typeof obj) {
			case "function":
				if(deep == 0 && obj.prototype && obj.prototype.xType) {
					// 类
					return String.format(
							"class {0} : {1} {2}",
							obj.prototype.xType,
							(obj.prototype.base && obj.prototype.base.xType || "Object"),
							trace.inspect(obj.prototype, deep + 1)
						);
				}
				
				//  函数
				return deep == 0 ? String.fromUTF8(obj.toString()) : "function()";
				
			case "object":
				if (obj == null) return "null";
				if(deep >= 3)
					return obj.toString();

				if(Object.isArray(obj)) {
					return "[" + Object.update(obj, trace.inspect, []).join(", ") + "]";
					
				}else{
					if(obj.setInterval && obj.resizeTo)
						return "window";
					if (obj.nodeType) {
						if(obj.nodeType == 9)
							return 'document';
						if (obj.tagName) {
							var tagName = obj.tagName.toLowerCase(), r = tagName;
							if (obj.id) {
								r += "#" + obj.id;
								if (obj.className) 
									r += "." + obj.className;
							}
							else 
								if (obj.outerHTML) 
									r = obj.outerHTML;
								else {
									if (obj.className) 
										r += " class=\"." + obj.className + "\"";
									r = "<" + r + ">" + obj.innerHTML + "</" + tagName + ">  ";
								}
							
							return r;
						}
						
						return '[Node name=' + obj.nodeName + 'value=' + obj.nodeValue + ']';
					}
					var r = "{\r\n", i;
					for(i in obj)
						r += "\t" + i + " = " + trace.inspect(obj[i], deep + 1) + "\r\n";
					r += "}";
					return r;
				}
			case "string":
				return deep == 0 ? obj : '"' + obj + '"';
			case "undefined":
				return "undefined";
			default:
				return obj.toString();
		}
	},
	
	/**
	 * 输出信息。
	 * @param {Object} ... 内容。
	 */
	log: function() {
		if (Py.trace) {
			if (window.console && console.log && console.log.apply) {
				console.log.apply(console, arguments);
			} else {
				trace(Object.update(arguments, trace.inspect, []).join(" "));
			}
		}
	},

	/**
	 * 输出一个错误信息。
	 * @param {Object} msg 内容。
	 */
	error: function(msg) {
		if (Py.trace) {
			if (window.console && console.error) 
				console.error(msg); //   如果错误在此行产生，说明这是预知错误。
				
			else {
				throw msg;
			}
		}
	},
	
	/**
	 * 输出一个警告信息。
	 * @param {Object} msg 内容。
	 */
	warn: function(msg) {
		if (Py.trace) {
			if (window.console && console.warn) 
				console.warn(msg);
			else 
				trace.alert("[警告]" + msg);
		}
	},

	/**
	 * 输出一个信息。
	 * @param {Object} msg 内容。
	 */
	info: function(msg) {
		if (Py.trace) {
			if (window.console && console.info) 
				console.info(msg);
			else 
				trace.alert("[信息]" + msg);
		}
	},

	/**
	 * 如果是调试模式就运行。
	 * @param {Function} f 函数。
	 * @return String 返回运行的错误。如无错, 返回空字符。
	 */
	ifDebug: function(f) {
		if (Py.debug === false) return;
		try {
			f();
			return "";
		} catch(e) {
			return e;
		}
	},
	
	/**
	 * 清除调试信息。  (没有控制台时，不起任何作用)
	 */
	clear: function() {
		if( window.console && console.clear)
			console.clear();
	},

	/**
	 * 空函数，用于证明输出。
	 */
	empty: function(msg) {
		trace("函数运行了    " + ( msg || Py.id++));
	},

	/**
	 * 如果false则输出。
	 * @param {Boolean} condition 字段。
	 * @return {String} msg  输出的内容。
	 */
	ifNot: function(condition, msg) {
		if (!condition) trace.warn(msg);
	},
	
	/**
	 * 测试某个函数运行一定次数的时间。
	 * @param {Function} fn 函数。
	 * @param {Array} args 函数参数。
	 * @param {Number} times 运行次数。默认1000。
	 * @return {Number} 运行的时间 。
	 */
	runTime: function(fn, args, times) {
		times = times || 1000;
		args = args || [];
		var d = new Date();
		while (times-->0)
			fn.apply(null, args);
		return new Date() - d;
	}

});

/**
 * 确认一个值正确。
 * @param {Object} bValue 值。
 * @param {String} format 错误后的提示。默认为“错误”。
 * @return {Boolean} 返回 bValue 。
 */
function assert(bValue, format) {
	if (!bValue && Py.debug) { // LOG : bValue === false 

		// 错误源
		var cal = arguments.callee.caller,
			mess = format ? String.format.apply(trace.inspect, Array.create(arguments, 1)) : " assert 出现错误。 ";

		if (cal) mess += "\r\n来自: " + String.fromUTF8(cal.toString());

		if(trace.error)
			trace.error(mess);
		else
			throw new Error(mess);

	}

	return bValue;
}

/**
 * @namespace assert
 */
Object.extend(assert, {

	/**
	 * 确认一个值非空。
	 * @param {Object} value 值。
	 * @param {String} argsName 变量的名字字符串。
	 * @return {Boolean} 返回 assert 是否成功 。
	 */
	notNull: function(value, argsName) {
		return assert(value != null, "{0} 为 null 。", argsName || "参数");
	},

	/**
	 * 确认一个值在 min ， max 间。
	 * @param {Number} value 判断的值。
	 * @param {Number} min 最小值。
	 * @param {Number} max 最大值。
	 * @param {String} argsName 变量的米各庄。
	 * @return {Boolean} 返回 assert 是否成功 。
	 */
	between: function(value, min, max, argsName) {
		return assert(value >= min && (max === undefined || value < max), "{0} 超出索引, 它必须在 [{1}, {2}) 间。",  argsName || "参数", min, max === undefined ? "+∞" : max);
	},

	/**
	 * 确认一个值属于一个类型。
	 * @param {Object} v 值。
	 * @param {String/Array} types 类型/表示类型的参数数组。
	 * @param {String} message 错误的提示信息。
	 * @return {Boolean} 返回 assert 是否成功 。
	 */
	instanceOf: function(v, types, message) {
		if (!Object.isArray(types)) types = [types];
		var ty = typeof v,
			iy = Object.type(v);
		return assert(types.filter(function(type) {
			return type == ty || type == iy;
		}).length, message || "类型错误。");
	},

	/**
	 * 确认一个值非空。
	 * @param {Object} value 值。
	 * @param {String} argsName 变量的参数名。
	 * @return {Boolean} 返回 assert 是否成功 。
	 */
	notEmpty: function(value, argsName) {
		return assert(value && value.length, "{0} 为空 。", argsName || "参数");
	},

	/**
	 * 确认一个值非静态。
	 * @param {Object} value 值。
	 * @param {String} argsName 变量的参数名。
	 * @return {Boolean} 返回 assert 是否成功 。
	 */
	notStatic: function(value, argsName) {
		return assert(Object.isObject(value), "{0} 为引用变量。", argsName || "参数");
	}

});

/// #endregion
/// #endif

//===========================================================
