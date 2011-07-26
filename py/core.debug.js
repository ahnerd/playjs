//===========================================
//  PyJs v0.4
//===========================================


//
// HtmlFive - 支持 IE10+ FF5+ Chrome12+ Opera12+ Safari6+ 。
// SupportIE9 - 支持 IE9+ FF4+ Chrome10+ Opera10+ Safari4+ 。
// SupportIE8  -   支持 IE8+ FF3+ Chrome10+ Opera10+ Safari4+ 。
// SupportIE6   -  支持 IE6+ FF2.5+ Chrome1+ Opera9+ Safari4+ 。
// SupportUsing - 支持 namespace 等。
// Compact - 当前执行了打包操作。
// Zip - 当前执行了压缩操作。
// Format - 当前在格式化代码。
// SupportGlobalObject  - 允许扩展全局对象。
// Debug - 启用调试， 启用调试将执行 assert 函数。



/// #ifndef Compact

 
// 配置。编译后会删除以下代码。

/**
 * @type Object
 */
var Py = {
	
	/**
	 * 是否打开调试。
	 * @config {Boolean}
	 */
	debug: true,

	/**
	 * 根目录。(需要末尾追加 /)
	 * @config {String}
	 * 程序会自动搜索当前脚本的位置为跟目录。
	 */
	rootPath: undefined,
	
	/**
	 * 是否输出 assert 来源。
	 * @config {Boolean}
	 * @value false
	 * 如果此项是 true， 将会输出 assert 失败时的来源函数。
	 */
	stackTrace: false,
	
	/**
	 * 默认的全局名字空间。
	 * @config {Object}
	 * @value window
	 */
	defaultNamespace: this,
	
	/**
	 * 如果使用了 UI 库，则 theme 表示默认主题。
	 * @config {String}
	 * @value 'default'
	 */
	theme: 'default',
	
	/**
	 * 如果使用了 UI 库，则  resource 表示公共的主题资源。
	 * @config {String}
	 * @value 'share'
	 */
	resource: 'share',
	
	/**
	 * 启用控制台调试。
	 * @config {Boolean} 
	 * 如果不存在控制台，将自动调整为 false 。
	 */
	trace: true

};




/// #endif

//===========================================
//  核心:定义必须的系统函数。   G
//===========================================

/**
 * @projectDescription Py.Core for Javascript
 * @copyright 2009-2011 Py.Core Team
 * @fileOverview 系统核心的核心部分。
 * @author xuld
 */

(function (w) {
	
	/// #define PyJs
	
	/// #ifndef Debug
	/// #define assert
	/// #define trace
	/// #endif
	
	/// #if defined(SupportIE7) && !defined(SupportIE6)
	/// #define SupportIE6
	/// #endif
	
	/// #if !defined(SupportIE9) && !defined(SupportIE8) && !defined(SupportIE6)
	/// #define SupportIE6
	/// #endif
	
	/// #ifdef SupportIE6
	/// #define SupportIE8
	/// #endif
	
	/// #ifdef SupportIE8
	/// #define SupportIE9
	/// #endif
	
	/// #ifndef Compact
	/// #define SupportUsing
	/// #endif
	
	/// #ifndef SupportUsing
	/// #define using
	/// #endif

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
				initEvent: emptyFn,
				remove: emptyFn
			}
			
		},
		
		/**
		 * document 简写。
		 * @type Document
		 */
		document = w.document,
		
		/**
		 * navigator 简写。
		 * @type Navigator
		 */
		navigator = w.navigator,
		
		/**
		 * Object  简写。
		 * @type Function
		 */
		o = w.Object,
	
		/**
		 * Object.prototype.toString 简写。
		 * @type Function
		 */
		toString = o.prototype.toString,
		
		/**
		 * Object.prototype.hasOwnProperty 简写。
		 * @type Function
		 */
		hasOwnProperty = o.prototype.hasOwnProperty,
		
		/**
		 * Array.prototype  简写。
		 * @type Object
		 */
		ap = Array.prototype,

		/**
		 * Py静态对象。
		 * @namespace Py
		 */
		p = namespace('Py.', {
			
			/**
			 * 获取属于一个元素的数据。
			 * @static
			 * @param {Object} obj 元素。
			 * @param {String} type 类型。
			 * @return {Object} 值。
			 * 这个函数会在对象内生成一个 data 字段， 并生成一个 data.type 对象返回。
			 * 如果原先存在 data.type, 则直接返回。
			 * @example
			 * <code>
			 * var obj = {};
			 * Py.data(obj, 'a').c = 2;
			 * trace(  Py.data(obj, 'a').c  ) // 2
			 * </code>
			 */
			data: function (obj, type) {
				
				assert.isObject(obj, "Py.data(obj, type): 参数 {obj} ~。");
				
				// 创建或测试 '$data'。
				var d = obj.$data || (obj.$data = {}) ;
				
				// 创建或测试   type。
				return d[type] || (d[type] = {});
			},
		
			/**
			 * 如果存在，获取属于一个元素的数据。
			 * @static
			 * @param {Object} obj 元素。
			 * @param {String} type 类型。
			 * @return {Object} 值。
			 * 这个函数会在对象内生成一个 data 字段， 并生成一个 data.type 对象返回。
			 * 如果原先存在 data.type, 则直接返回。
			 * @example
			 * <code>
			 * var obj = {};
			 * if(Py.getData(obj, 'a')) // 如果存在 a 属性。 
			 *     trace(  Py.data(obj, 'a')  )
			 * </code>
			 */
			getData:function (obj, type) {
				
				assert.isObject(obj, "Py.getData(obj, type): 参数 {obj} ~。");
				
				// 获取变量。
				var d = obj.$data;
				return d && d[type];
			},
			
			/**
			 * 设置属于一个元素的数据。
			 * @static
			 * @param {Object} obj 元素。
			 * @param {String} type 类型。
			 * @param {Object} data 内容。
			 * @return data
			 * @example
			 * <code>
			 * var obj = {};
			 * Py.setData(obj, 'a', 5);    //     5
			 * </code>
			 */
			setData: function(obj, type, data) {
				
				assert.isObject(obj, "Py.setData(obj, type): 参数 {obj} ~。");
				
				// 简单设置变量。
				return (obj.$data || (obj.$data = {}))[type] = data;
			},
			
			/**
			 * 复制一个对象的数据到另一个对象。
			 * @static
			 * @param {Object} src 来源的对象。
			 * @param {Object} dest 目标的对象。
			 * @return this
			 * @example
			 * <code>
			 * var obj = {}, obj2 = {};
			 * Py.cloneData(obj2, obj);
			 * </code>
			 */
			cloneData: function(dest, src) {
				
				assert.isObject(src, "Py.cloneData(dest, src): 参数 {src} ~。");
				assert.isObject(dest, "Py.cloneData(dest, src): 参数 {dest} ~。");
				
				var data = src.$data;
				
				if(data) {
					dest.$data = o.clone.call(1, data);
					
					var evt = src.$data.event, i  ;
					if(evt) {
						delete dest.data.event;
						for (i in evt) {
							evt[i].handlers.forEach( function(fn) {
								p.IEvent.on.call(dest, i, fn);
							});
						}
					}
				}
				
				return dest;
			}, 
			
			/**
			 * 全局运行一个函数。
			 * @method
			 * @static
			 * @param {String} statement 语句。
			 * @return {Object} 执行返回值。
			 * @example
			 * <code>
			 * Py.eval('alert("hello")');
			 * </code>
			 */
			eval: w.execScript || function(statement) {
				
				// 如果正常浏览器，使用 window.eval
				return w.eval(statement);
			},
			
			/**
			 * 创建一个类。
			 * @method
			 * @static
			 * @param {Object/Function} [methods] 成员或构造函数。
			 * @return {Class} 生成的类。
			 * 创建一个类，相当于继承于 Py.Object创建。
			 * @see Py.Object.extend
			 * @example
			 * <code>
			 * var MyCls = Class({
			 * 
			 *    constructor: function(g, h) {
			 * 	      alert('构造函数' + g + h)
			 *    }	
			 * 
			 * });
			 * 
			 * 
			 * var c = new MyCls(4, ' g');
			 * </code>
			 */
			Class: function (members) {
					
				// 生成新类
				return Object.extend(members);
			},
			
			/**
			 * 所有类的基类。
			 * @class Py.Object
			 */
			Object: Object,
			
			/// #ifdef SupportUsing
		
			/**
			 * 全部已载入的名字空间。
			 * @static
			 * @type Array
			 * @private
			 */
			namespaces: [],
			
			/**
			 * 异步载入样式。
			 * @static
			 * @param {String} uri 地址。
			 * @example
			 * <code>
			 * Py.loadStyle('./v.css');
			 * </code>
			 */
			loadStyle: function(url) {
				document.getElementsByTagName("HEAD")[0].appendChild(apply(document.createElement('link'), {
					href: url,
					rel: 'stylesheet',
					type: 'text/css'
				}));
			},
			
			/**
			 * 同步载入代码。
			 * @static
			 * @param {String} uri 地址。
			 * @example
			 * <code>
			 * Py.loadScript('./v.js');
			 * </code>
			 */
			loadScript: function(url) {
				return p.loadText(url, p.eval);
			},
			
			/**
			 * 同步载入文本。
			 * @param {String} uri 地址。
			 * @param {Function} [callback] 对返回值的处理函数。
			 * @return {String} 载入的值。
			 * 因为同步，所以无法跨站。
			 * @example
			 * <code>
			 * trace(  Py.loadText('./v.html')  );
			 * </code>
			 */
			loadText: function(url, callback) {
				
				assert.notNull(url, "Py.loadText(url, callback): 参数 {url} ~。");
	
				//     assert(w.location.protocol != "file:", "Py.loadText(uri, callback):  当前正使用 file 协议，请使用 http 协议。 \r\n请求地址: {0}",  uri);
				
				// 新建请求。
				var xmlHttp = new XMLHttpRequest();
	
				try {
					
					// 打开请求。
					xmlHttp.open("GET", url, false);
	
					// 发送请求。
					xmlHttp.send(null);
	
					// 检查当前的 XMLHttp 是否正常回复。
					if (!XMLHttpRequest.isOk(xmlHttp)) {
						//载入失败的处理。
						throw String.format("请求失败:  \r\n   地址: {0} \r\n   状态: {1}   {2}  {3}", url, xmlHttp.status, xmlHttp.statusText, w.location.protocol == "file:" ? '\r\n原因: 当前正使用 file 协议打开文件，请使用 http 协议。' : '');
					}
					
					url = xmlHttp.responseText;
					
					// 运行处理函数。
					return callback ? callback(url) : uri;
	
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
			 * 使用一个名空间。
			 * @method
			 * @static
			 * @param {String} namespace 名字空间。
			 * @param {Boolean} isStyle 是否为样式表。
			 * 有关名字空间的说明， 见 {@link namespace} 。
			 * @example
			 * <code>
			 * using("System.Dom.Keys");
			 * </code>
			 */
			using: function(namespace, isStyle) {
				
				assert.isString(namespace, "using(namespace): 参数 {namespace} 不是合法的名字空间。");
				
				// 已经载入。
				if(p.namespaces.include(namespace))
					return;
				
				if(namespace.indexOf('/') === -1) {
					namespace = namespace.toLowerCase().replace(rPoint, '/') + (isStyle ? '.css' : '.js');
				}
				 
				 var doms, check, callback;
				 
				 if(isStyle) {
				 	callback = p.loadStyle;
				 	doms = document.styleSheets;
					src = 'href';
				 } else {
				 	callback = p.loadScript;
				 	doms = document.getElementsByTagName("SCRIPT");
					src = 'src';
				 }
				 
				 each.call(doms, function(dom) {
				 	return !dom[src] || dom[src].toLowerCase().indexOf(namespace) === -1;
				 }) && callback(p.rootPath + namespace);
			},
			
			/// #endif
	
			/**
			 * 定义名字空间。
			 * @method
			 * @static
			 * @param {String} name 名字空间。
			 * @param {Object} [obj] 值。
			 * <p>
			 * 名字空间是项目中表示资源的符合。
			 * </p>
			 * 
			 * <p>
			 * 比如  system/dom/keys.js 文件， 名字空间是 System.Dom.Keys
			 * 名字空间用来快速表示资源。 {@link using} 和  {@link imports} 可以根据制定的名字空间载入相应的内容。
			 * </p>
			 * 
			 * <p>
			 * namespace 函数有多个重载， 如果只有1个参数:
			 * <code>
			 * namespace("System.Dom.Keys"); 
			 * </code>
			 * 表示系统已经载入了这个名字空间的资源， using 和 imports 将忽视这个资源的载入。
			 * </p>
			 * 
			 * <p>
			 * namespace 如果有2个参数， 表示在指定的位置创建对象。
			 * <code>
			 * namespace("A.B.C", 5); // 最后 A = {B: {C: 5}}  
			 * </code>
			 * 这个写法最后覆盖了 C 的值，但不影响 A 和 B。 
			 * 
			 * <p>
			 * 如果这个名字空间的首字符是 . 则系统会补上 'Py'
			 * </p> 
			 * 
			 * <p>
			 * 如果这个名字空间的最后的字符是 . 则系统不会覆盖已有对象，而是复制成员到存在的成员。
			 * </p> 
			 * 
			 * </p>
			 * 
			 * @example
			 * <code>
			 * namespace("System.Dom.Keys");  // 避免 重新去引入   System.Dom.Keys
			 * 
			 * var A = {   B:  {b: 5},  C: {b: 5}    };
			 * namespace("A.B", {a: 6})  // A = { B: {a: 6}, C: {b: 5}  }
			 * 
			 * var A = {   B:  {b: 5},  C: {b: 5}    };
			 * namespace("A.C.", {a: 6})  // A = { B: {b: 5},  C: {a: 6, b: 5} }
			 * 
			 * namespace(".G", 4);    // Py.G = G  = 4
			 * </code>
			 */
			namespace: namespace,
	
			/**
			 * 默认的全局名字空间。
			 * @config {Object}
			 * @value window
			 */
			defaultNamespace: w,
			
			/// #ifdef SupportIE8
								
			/**
			 * 绑定一个监听器。
			 * @method
			 * @static
			 * @param {Element} elem 元素。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 * @seeAlso Py.removeListener
			 * @example
			 * <code>
			 * Py.addEventListener.call(document, 'click', function() {
			 * 	
			 * });
			 * </code>
			 */
			addEventListener: document.addEventListener ? function( type, fn) {
				this.addEventListener(type, fn, false);
			} : function(type, fn) {
				
				// IE8- 使用 attachEvent 。
				this.attachEvent('on' + type, fn);
			},
			
			/**
			 * 移除一个监听器。
			 * @method
			 * @static
			 * @param {Element} elem 元素。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 * @seeAlso Py.addListener
			 * @example
			 * <code>
			 * Py.removeEventListener.call(document, 'click', function() {
			 * 	
			 * });
			 * </code>
			 */
			removeEventListener: document.removeEventListener ? function(type, fn) {
				this.removeEventListener(type, fn, false);
			} : function(type, fn) {
				
				// IE8- 使用 detachEvent 。
				this.detachEvent('on' + type, fn);
			},
			
			/// #endif
			
			/**
			 * 管理所有事件类型的工具。
			 * @property
			 * @static
			 * @type Object
			 * @private
			 * 所有类的事件信息存储在这个变量。使用 xType -> name的结构。
			 */
			Events: eventMgr, 
			
			/**
			 * 表示一个事件接口。
			 * @interface Py.IEvent
			 * @singleton
			 * Py.IEvent 提供了事件机制的基本接口，凡实现这个接口的类店都有事件的处理能力。
			 * 在调用  {@link Py.Object.addEvents} 的时候，将自动实现这个接口。
			 */
			IEvent: {
			
				/**
				 * 增加一个监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} fn 调用函数。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.on('click', function(e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				on: function(type, fn) {
					
					assert.isFunction(fn, 'IEvent.on(type, fn): 参数 {fn} ~。');
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.data(me, 'event'), evt = d[type], eMgr;
					
					// 如果未绑定
					if (!evt) {
					
						eMgr = me;
						
						evt = me.constructor;
						
						// 遍历父类， 找到适合的 eMgr	
						while(!(eMgr = eventMgr[eMgr.xType]) || !(eMgr = eMgr[type])) {
							
							if(evt && (evt = evt.base)) {
								eMgr = evt.prototype;
							} else {
								eMgr = eventMgr.$default;
								break;
							}
						
						}
						
						// 支持自定义安装。
						evt = function(e) {
							var fn = arguments.callee,
								target = fn.target,
								handlers = fn.handlers.slice(0), 
								i = -1,
								len = handlers.length;
							
							// 循环直到 return false。 
							while (++i < len) 
								if (handlers[i].call(target, e) === false) 										
									return false;
							
							return true;
						};
						
						// 绑定事件对象，用来删除和触发。
						evt.event = eMgr;
						
						//指定当然事件的全部函数。
						evt.handlers = [eMgr.initEvent, fn];
						
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
				 * @param {String} type 监听名字。
				 * @param {Function} fn 调用函数。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.one('click', function(e) {
				 * 		trace('a');  
				 * });
				 * 
				 * elem.trigger('click');   //  输出  a
				 * elem.trigger('click');   //  没有输出 
				 * </code>
				 */
				one: function(type, fn) {
					
					assert.isFunction(fn, 'IEvent.one(type, fn): 参数 {fn} ~。');
					
					
					return this.on(type, function() {
						
						// 删除先。
						this.un( type, arguments.callee);
						
						// 然后调用。
						return fn.apply(this, arguments);
					});
				},
				
				/**
				 * 删除一个监听器。
				 * @param {String} [type] 监听名字。
				 * @param {Function/undefined} fn 回调器。
				 * @return Object this
				 * 注意: function() {} !== function() {}, 这意味着这个代码有问题:
				 * <code>
				 * elem.on('click', function() {});
				 * elem.un('click', function() {});
				 * </code>
				 * 你应该把函数保存起来。
				 * <code>
				 * var c =  function() {};
				 * elem.on('click', c);
				 * elem.un('click', c);
				 * </code>
				 * @example
				 * <code>
				 * elem.un('click', function(e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				un: function (type, fn) {
					
					assert(!fn || o.isFunction(fn), 'IEvent.un(type, fn): 参数 {fn} 必须是可执行的函数或空参数。', fn);
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, d = p.getData(me, 'event'), evt;
					if (d) {
						 if (evt = d[type]) {
							if (fn) 
								evt.handlers.remove(fn);
								
							// 检查是否存在其它函数或没设置删除的函数。
							if (!fn || evt.handlers.length < 2) {
								
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
				 * @param {String} type 监听名字。
				 * @param {Object/undefined} e 事件参数。
				 * @return Object this
				 * trigger 只是手动触发绑定的事件。
				 * @example
				 * <code>
				 * elem.trigger('click');
				 * </code>
				 */
				trigger: function (type, e) {
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, evt = p.getData(me, 'event');
					   
					return !evt || !(evt = evt[type]) || ( evt.event.trigger ? evt.event.trigger(me, type, evt, e) : evt(e) );
					
				}
			}
			
		});
	
	/// #endregion
		
	/// #region 全局函数
	
	/**
	 * @class Py.Object
	 */
	apply(Object, {
	
		/**
		 * 扩展当前类的动态方法。
		 * @static
		 * @param {Object} obj 成员。
		 * @return this
		 * @seeAlso Py.Object.implementIf
		 * @example
		 * <code>
		 * Number.implement({
		 *   sin: function() {
		 * 	    return Math.sin(this);
		 *  }
		 * });
		 * 
		 * (1).sin();  //  Math.sin(1);
		 * </code>
		 */
		implement: function (obj) {

			assert(obj && this.prototype, "Class.implement(obj): 无法扩展类，因为 {obj} 或 this.prototype 为空。", obj);
			// 复制到原型
			o.extend(this.prototype, obj);
	        
			return this;
		},
		
		/**
		 * 如果不存在成员, 扩展当前类的动态方法。
		 * @static
		 * @param {Object} obj 成员。
		 * @return this
		 * @seeAlso Py.Object.implement
		 */
		implementIf: function(obj) {
		
			assert(obj && this.prototype, "Class.implementIf(obj): 无法扩展类，因为 {obj} 或 this.prototype 为空。", obj);
	
			applyIf(this.prototype, obj);
			
			return this;
		},
		
		/**
		 * 为当前类添加事件。
		 * @static
		 * @param {Object} [evens] 所有事件。 具体见下。
		 * @return this
		 * <p>
		 * 由于一个类的事件是按照 xType 属性存放的，拥有相同  xType 的类将有相同的事件，为了避免没有 xType 属性的类出现事件冲突， 这个方法会自动补全  xType 属性。
		 * </p>
		 * 
		 * <p>
		 * 这个函数是实现自定义事件的关键。
		 * </p>
		 * 
		 * <p>
		 * addEvents 函数的参数是一个事件信息，格式如:  {click: { add: ..., remove: ..., initEvent: ..., trigger: ...} 。
		 * 其中 click 表示事件名。一般建议事件名是小写的。
		 * </p>
		 * 
		 * <p>
		 * 一个事件有多个相应，分别是: 绑定(add), 删除(remove), 触发(trigger), 初始化事件参数(initEvent)
		 * </p>
		 * 
		 * </p>
		 * 当用户使用   o.on('事件名', 函数)  时， 系统会判断这个事件是否已经绑定过，
		 * 如果之前未绑定事件，则会创建新的函数 evtTrigger，
		 * evtTrigger 函数将遍历并执行 evtTrigger.handlers 里的成员, 如果其中一个函数执行后返回 false， 则中止执行，并返回 false， 否则返回 true。
		 * evtTrigger.handlers 表示 当前这个事件的所有实际调用的函数的数组。 evtTrigger.handlers[0] 是事件的 initEvent 函数。
		 * 然后系统会调用 add(o, '事件名', evtTrigger)
		 * 然后把 evtTrigger 保存在 o.data.event['事件名'] 中。
		 * 如果 之前已经绑定了这个事件，则 evtTrigger 已存在，无需创建。
		 * 这时系统只需把 函数 放到 evtTrigger.handlers 即可。
		 * </p>
		 * 
		 * <p>
		 * 也就是说，真正的事件触发函数是 evtTrigger， evtTrigger去执行用户定义的一个事件全部函数。
		 * </p>
		 * 
		 * <p>
		 * 当用户使用  o.un('事件名', 函数)  时， 系统会找到相应 evtTrigger， 并从
		 * evtTrigger.handlers 删除 函数。
		 * 如果  evtTrigger.handlers 是空数组， 则使用
		 * remove(o, '事件名', evtTrigger)  移除事件。
		 * </p>
		 * 
		 * <p>
		 * 当用户使用  o.trigger(参数)  时， 系统会找到相应 evtTrigger， 
		 * 如果事件有trigger， 则使用 trigger(对象, '事件名', evtTrigger, 参数) 触发事件。
		 * 如果没有， 则直接调用 evtTrigger(参数)。
		 * </p>
		 * 
		 * <p>
		 * 下面分别介绍各函数的具体内容。
		 * </p>
		 * 
		 * <p>
		 * add 表示 事件被绑定时的操作。  原型为: 
		 * </p>
		 * 
		 * <code>
		 * function add(elem, type, fn) {
		 * 	   // 对于标准的 DOM 事件， 它会调用 elem.addEventListener(type, fn, false);
		 * }
		 * </code>
		 * 
		 * <p>
		 *  elem表示绑定事件的对象，即类实例。 type 是事件类型， 它就是事件名，因为多个事件的 add 函数肯能一样的， 因此 type 是区分事件类型的关键。fn 则是绑定事件的函数。
		 * </p>
		 * 
		 * <p>
		 * remove 同理。
		 * </p>
		 * 
		 * <p>
		 * initEvent 的参数是一个事件参数，它只能有1个参数。
		 * </p>
		 * 
		 * <p>
		 * trigger 是高级的事件。参考上面的说明。 
		 * </p>
		 * 
		 * <p>
		 * 如果你不知道其中的几个参数功能，特别是  trigger ，请不要自定义。
		 * </p>
		 * 
		 * @example
		 * 下面代码演示了如何给一个类自定义事件，并创建类的实例，然后绑定触发这个事件。
		 * <code>
		 * 
		 * // 创建一个新的类。
		 * var MyCls = new Class();
		 * 
		 * MyCls.addEvents({
		 * 
		 *     click: {
		 * 			
		 * 			add:  function(elem, type, fn) {
		 * 	   			alert("为  elem 绑定 事件 " + type );
		 * 			},
		 * 
		 * 			initEvent: function(e) {
		 * 	   			alert("初始化 事件参数  " + e );
		 * 			}
		 * 
		 * 		}
		 * 
		 * });
		 * 
		 * var m = new MyCls;
		 * m.on('click', function() {
		 * 	  alert(' 事件 触发 ');
		 * });
		 * 
		 * m.trigger('click', 2);
		 * 
		 * </code>
		 */
		addEvents: function (events) {
			
			var ep = this.prototype;
			
			assert(!events || o.isObject(events), "Class.addEvents(events): 参数 {event} 必须是一个包含事件的对象。 如 {click: { add: ..., remove: ..., initEvent: ..., trigger: ... } ", events);
			
			applyIf(ep, p.IEvent);
			
			// 如果有自定义事件，则添加。
			if (events) {
				
				var xType = hasOwnProperty.call(ep, 'xType') ? ep.xType : ( ep.xType = (p.id++).toString() );
				
				// 更新事件对象。
				o.update(events, function(e) {
					return applyIf(e, eventMgr.$default);
					
					// 添加 Py.Events 中事件。
				}, eventMgr[xType] || (eventMgr[xType] = {}));
			
			}
			
			
			return this;	
		},
	
		/**
		 * 继承当前类并返回子类。
		 * @static
		 * @param {Object/Function} [methods] 成员或构造函数。
		 * @return {Class} 继承的子类。
		 * <p>
		 * 这个函数是实现继承的核心。
		 * </p>
		 * 
		 * <p>
		 * 在 Javascript 中，继承是依靠原型链实现的， 这个函数仅仅是对它的包装，而没有做额外的动作。
		 * </p>
		 * 
		 * <p>
		 * 成员中的  constructor 成员 被认为是构造函数。
		 * </p>
		 * 
		 * <p>
		 * 这个函数实现的是 单继承。如果子类有定义构造函数，则仅调用子类的构造函数，否则调用父类的构造函数。
		 * </p>
		 * 
		 * <p>
		 * 要想在子类的构造函数调用父类的构造函数，可以使用  {@link Py.Object.prototype.base} 。
		 * </p>
		 * 
		 * <p>
		 * 这个函数返回的类实际是一个函数，但它被使用 Py.Object 修饰过。
		 * </p>
		 * 
		 * <p>
		 * 由于原型链的关系， 肯能存在共享的引用。
		 * 
		 * 如: 类 A ，  A.prototype.c = [];
		 * 
		 * 那么，A的实例 b , d 都有 c 成员， 但它们共享一个   A.prototype.c 成员。
		 * 
		 * 这显然是不正确的。所以你应该把 参数 quick 置为 false ， 这样， A创建实例的时候，会自动解除共享的引用成员。
		 * 
		 * 当然，这是一个比较费时的操作，因此，默认  quick 是 true 。
		 * </p>
		 * 
		 * <p>
		 * 你也可以把动态成员的定义放到 构造函数， 如: this.c = [];
		 * 
		 * 这是最好的解决方案。
		 * </p>
		 */
	 	extend: function(members) {
	
			// 未指定函数   使用默认构造函数(Object.prototype.constructor);
			
			// 生成子类
			var subClass = hasOwnProperty.call(members =  members instanceof Function ? {
					constructor: members
				} : (members || {}), "constructor") ? members.constructor : function() {
					
					// 调用父类构造函数
					arguments.callee.base.apply(this, arguments);
					
				};
				
			// 代理类
			emptyFn.prototype = (subClass.base = this).prototype;
			
			// 指定成员
			subClass.prototype = o.extend(new emptyFn, members);
			
			// 覆盖构造函数。
			subClass.prototype.constructor = subClass;

			// 指定Class内容
			return Class(subClass);

		}

	});
	
	/**
	 * Object  简写。
	 * @class Object
	 */
	apply(o, {

		/**
		 * 复制对象的所有属性到其它对象。 
		 * @static
		 * @method
		 * @param {Object} dest 复制目标。
		 * @param {Object} obj 要复制的内容。
		 * @return {Object} 复制后的对象 (dest)。
		 * @seeAlso Object.extendIf
		 * @example
		 * <code>
		 * var a = {v: 3}, b = {g: 2};
		 * Object.extend(a, b);
		 * trace(a); // {v: 3, g: 2}
		 * </code>
		 */
		extend: (function () {
			for (var item in {toString: true})
				return apply;
			
			p.enumerables = ["toString", "hasOwnProperty", "valueOf", "constructor", "isPrototypeOf"];
			// IE6  需要复制
			return function(dest, src) {
				for (var i = p.enumerables.length, value; i--;)
					if(hasOwnProperty.call(src, value = p.enumerables[i]))
						dest[value] = src[value];
				return apply(dest, src);
			}
		})(),

		/**
		 * 如果目标成员不存在就复制对象的所有属性到其它对象。 
		 * @static
		 * @method
		 * @param {Object} dest 复制目标。
		 * @param {Object} obj 要复制的内容。
		 * @return {Object} 复制后的对象 (dest)。
		 * @seeAlso Object.extend
		 * <code>
		 * var a = {v: 3, g: 5}, b = {g: 2};
		 * Object.extendIf(a, b);
		 * trace(a); // {v: 3, g: 5}  b 未覆盖 a 任何成员。
		 * </code>
		 */
		extendIf: applyIf,
		
		/**
		 * 在一个可迭代对象上遍历。
		 * @static
		 * @param {Array/Object} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
	 	 * @param {Object} bind 函数执行时的作用域。
		 * @return {Boolean} 如果已经遍历完所传的所有值， 返回 true， 如果遍历被中断过，返回 false。
		 * @example
		 * <code> 
		 * Object.each({a: '1', c: '3'}, function(value, key) {
		 * 		trace(key + ' : ' + value);
		 * });
		 * // 输出 'a : 1' 'c : 3'
		 * </code>
		 */
		each: function(iterable, fn, bind) {

			assert(!o.isFunction(iterable), "Object.each(iterable, fn, bind): 参数 {iterable} 不能是可执行的函数。 ", iterable);
			assert(o.isFunction(fn), "Object.each(iterable, fn, bind): 参数 {fn} 必须是可执行的函数。 ", fn);
			
			// 如果 iterable 是 null， 无需遍历 。
			if (iterable != null) {
				
				//可遍历
				if (iterable.length === undefined) {
					
					// Object 遍历。
					for (var t in iterable) 
						if (fn.call(bind, iterable[t], t, iterable) === false) 
							return false;
				} else {
					return each.call(iterable, fn, bind);
				}
				
			}
			
			// 正常结束。
			return true;
		},

		/**
		 * 更新一个可迭代对象。
		 * @static
		 * @param {Array/Object} iterable 对象，不支持函数。
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
	 	 * @param {Object} bind=iterable 函数执行时的作用域。
		 * @param {Object/Boolean} [args] 参数/是否间接传递。
		 * @return {Object}  返回的对象。
		 * @example 
		 * 该函数支持多个功能。主要功能是将一个对象根据一个关系变成新的对象。
		 * <code>
		 * Object.update(["aa","aa23"], "length", []); // => [2, 4];
		 * Object.update([{a: 1},{a: 4}], "a", [{},{}], true); // => [{a: 1},{a: 4}];
		 * Object.update(["aa","aa23"], function(value, key, array) {return value.charAt(0);}, []); // => ["a", "a"];
		 * </code>
		 * */
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
					
					value = value[fn];
					
					assert(dest[key], "Object.update(iterable, fn, dest, args): 试图把iterable[{key}][{fn}] 放到 dest[key][fn], 但  dest[key] 是一个空的成员。");
					
					// 如果属性是非函数，则说明更新。 a.value -> b.value
					if(args)
						dest[key][fn] = value;
						
					// 类似函数的更新。 a.value -> value
					else
						dest[key] = value;
				}
                    
			});
			
			// 返回目标。
			return dest;
		},

		/**
		 * 判断一个变量是否是引用变量。
		 * @static
		 * @param {Object} object 变量。
		 * @return {Boolean} 所有对象变量返回 true, null 返回 false 。
		 * @example
		 * <code>
		 * Object.isObject({}); // true
		 * Object.isObject(null); // false
		 * </code>
		 */
		isObject: function(obj) {
			
			// 只检查 null 。
			return obj !== null && typeof obj == "object";
		},

		/**
		 * 判断一个变量是否是数组。
		 * @static
		 * @param {Object} object 变量。
		 * @return {Boolean} 如果是数组，返回 true， 否则返回 false。
		 * @example
		 * <code> 
		 * Object.isArray([]); // true
		 * Object.isArray(document.getElementsByTagName("div")); // false
		 * Object.isArray(new Array); // true
		 * </code>
		 */
		isArray: function(obj) {
			
			// 检查原型。
			return toString.call(obj) === "[object Array]";
		},

		/**
		 * 判断一个变量是否是函数。
		 * @static
		 * @param {Object} object 变量。
		 * @return {Boolean} 如果是函数，返回 true， 否则返回 false。
		 * @example
		 * <code>
		 * Object.isFunction(function() {}); // true
		 * Object.isFunction(null); // false
		 * Object.isFunction(new Function); // true
		 * </code>
		 */
		isFunction: function(obj) {
			
			// 检查原型。
			return toString.call(obj) === "[object Function]";
		},
		
		/**
		 * 返回一个变量的类型的字符串形式。
		 * @static
		 * @param {Object} obj 变量。
		 * @return {String} 所有可以返回的字符串：  string  number   boolean   undefined	null	array	function   element  class   date   regexp object。
		 * @example
		 * <code> 
		 * Object.type(null); // "null"
		 * Object.type(); // "undefined"
		 * Object.type(new Function); // "function"
		 * Object.type(+'a'); // "number"
		 * Object.type(/a/); // "regexp"
		 * Object.type([]); // "array"
		 * </code>
		 * */
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
		 * @static
		 * @param {Object} obj 要拷贝的对象。
		 * @return {Object} 返回复制后的对象。
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
		},
		
		/**
		 * 将一个对象解析成一个类的属性。
		 * @static
		 * @param {Object} obj 类实例。
		 * @param {Object} config 参数。
		 * 这个函数会分析对象，并试图找到一个 属性设置函数。
		 * 当设置对象 obj 的 属性 key 为 value:
		 * 发生了这些事:
		 *      检查，如果存在就调用: obj.setKey(value)
		 * 否则， 检查，如果存在就调用: obj.key(value)
		 * 否则， 检查，如果存在就调用: obj.key.set(value)
		 * 否则，检查，如果存在就调用: obj.set(value)
		 * 否则，执行 obj.key = value;
		 * 
		 * @example
		 * <code>
		 * document.setA = function(value) {
		 * 	  this._a = value;
		 * };
		 * 
		 * Object.set(document, 'a', 3); 
		 * 
		 * // 这样会调用     document.setA(3);
		 * 
		 * </code>
		 */
		set: function(obj, config) {
			
			if(config) 
				for(var key in config) {
					
					// 检查 setValue 。
					var setter = 'set' + key.capitalize(),
						val = config[key];
			
			
					if (o.isFunction(obj[setter])) {
						obj[setter](val);
					} 
					
					// 是否存在函数。
					else if(o.isFunction(obj[key])) {
						obj[key](val);
					}
					
					// 检查 value.set 。
					else if (obj[key] && obj[key].set) {
						obj[key].set(val);
					} 
					
					// 检查 set 。
					else if(obj.set)
						obj.set(key, val);
					else
					
						// 最后，就直接赋予。
						obj[key] = val;
			
				}
			
		},
		
		/**
		 * 添加一个对象的成员函数调用结束后的回调函数。
		 * @static
		 * @param {Object} obj 对象。
		 * @param {String} name 成员函数名。
		 * @param {Function} fn 对象。
		 * @return {Object} obj。
		 * @example
		 * 
		 * 下面的代码方便地添加 onload 事件。 
		 * <code>
		 * Object.addCallback(window, "onload",trace.empty);
		 * </code>
		 */
		addCallback: function(obj, name, fn) {
			
			assert.notNull(obj, 'Object.addCallback(obj, name, fn): 参数 obj ~。');
			
			assert.isFunction(fn, 'Object.addCallback(obj, name, fn): 参数 {fn} ~。');
			
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
	 * 数组。
	 * @class Array
	 */
	applyIf(Array, {

		/**
		 * 在原有可迭代对象生成一个数组。
		 * @static
		 * @param {Object} iterable 可迭代的实例。
		 * @param {Number} start=0 开始的位置。
		 * @return {Array} 复制得到的数组。
		 * @example
		 * <code>
		 * Array.create([4,6], 1); // [6]
		 * </code>
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
			return ap.slice.call(iterable, start);
		},
		
		/**
		 * 如果目标数组不存在值，则拷贝，否则忽略。
		 * @static
		 * @param {Array} src 来源数组。
		 * @param {Array} dest 目标数组。
		 * @example
		 * <code>
		 * Array.copyIf([4,6], [4, 7]); // [4, 7, 6]
		 * </code>
		 */
		copyIf: function(src, dest) {
			
			for(var i = 0; i < src.length; i++)
				dest.include(src[i]);
		},

		/**
		 * 把传入的值连接为新的数组。如果元素本身是数组，则合并。此函数会过滤存在的值。
		 * @static
		 * @param {Object} ... 数据成员。
		 * @return {Array} 新数组。
		 * @example
		 * <code>
		 * Array.plain([4,6], [[4], 7]); // [4, 7, 6]
		 * </code>
		 */
		plain: function() {

			var r = [];
			
			// 对每个参数
			ap.forEach.call(arguments, function(d) {
				
				
				// 如果数组，把内部元素压入r。
				if (o.isArray(d)) Array.copyIf(d, r);
				
				// 不是数组，直接压入 r 。
				else r.include(d);
			});

			return r;
		}

	});

	/**
	 * 函数。
	 * @class Function
	 */
	apply(Function, {
		
		/**
		 * 空函数。
		 * @static
		 * @property
		 * @type Function
		 * Function.empty返回空函数的引用。
		 */
		empty: emptyFn,

		/**
		 * 一个返回 true 的函数。
		 * @static
		 * @property
		 * @type Function
		 */
		returnTrue: from(true),

		/**
		 * 一个返回 false 的函数。
		 * @static
		 * @property
		 * @type Function
		 */
		returnFalse: from(false),
		
		/**
		 * 绑定函数作用域。
		 * @static
		 * @param {Function} fn 函数。
		 * @param {Object} bind 位置。
		 * 注意，未来 Function.prototype.bind 是系统函数， 因此这个函数将在那个时候被 替换掉。
		 * @example
		 * <code>
		 * Function.bind(function() {return this}, 0)()    ; // 0
		 * </code>
		 */
		bind: function(fn, bind) {
					
			assert.isFunction(fn, 'Function.bind(fn): 参数 {fn} ~。');
			
			// 返回对 bind 绑定。
			return function() {
				return fn.apply(bind, arguments);
			}
		},
		
		/**
		 * 返回自身的函数。
		 * @static
		 * @method
		 * @param {Object} v 需要返回的参数。
		 * @return {Function} 执行得到参数的一个函数。
		 * @hide
		 * @example
		 * <code>
		 * Function.from(0)()    ; // 0
		 * </code>
		 */
		from: from
		
	});

	/**
	 * 字符串。
	 * @class String
	 */
	apply(String, {

		/**
		 * 格式化字符串。
		 * @static
		 * @param {String} format 字符。
		 * @param {Object} ... 参数。
		 * @return {String} 格式化后的字符串。
		 * @example
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

			if (!format) return "";
					
			assert(format.replace, 'String.format(format, object): 参数 {format} 必须是字符串。', format);

			//支持参数2为数组或对象的直接格式化。
			var toString = this,
				arr = o.isObject(object) && arguments.length === 2 ? object: ap.slice.call(arguments, 1);

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
		 * @static
		 * @param {Object} str 字符串。用空格隔开。
		 * @param {Object/Function} source 更新的函数或源。
		 * @param {Object} [dest] 如果指明了， 则拷贝结果到这个目标。
		 * @param {Boolean} copyIf=false 是否跳过本来存在的数据。
		 * @example
		 * <code>
		 * String.map("aaa bbb ccc", function(v) {log(v); }); //  aaa bbb ccc
		 * String.map("aaa bbb ccc", function(v) { return v; }, {});    //    {aaa:aaa, bbb:bbb, ccc:ccc};
		 * </code>
		 */
		map: function(str, source, dest, copyIf) {
					
			assert(typeof str == 'string', 'String.map(str, source, dest, copyIf): 参数 {str} 必须是字符串。', str);
			
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
		 * @static
		 * @param {Object} obj 变量。
		 * @return {String} 字符串。
		 * @example
		 * <code>
		 * String.param({a: 4, g: 7}); //  a=4&g=7
		 * </code>
		 */
		param: function(obj) {
			if(!obj) return "";
			var s = [], e = encodeURIComponent;
			o.each(obj, function( value, key ) {
				s.push(e(key) + '=' + e(value));
			});
			return s.join('&').replace(rWhite, '+');
		},
	
		/**
		 * 把字符串转为指定长度。
		 * @param {String} value   字符串。
		 * @param {Number} len 需要的最大长度。
		 * @example
		 * <code>
		 * String.ellipsis("123", 2); //   '1...'
		 * </code>
		 */
		ellipsis: function(value, len) {
			assert.isString(value, "String.ellipsis(value, len): 参数  {value} ~。");
			assert.isNumber(len, "String.ellipsis(value, len): 参数  {len} ~。");
			return value.length > len ?  value.substr(0, len) + "..." : value;
		}
		
	});
	
	/// #ifdef SupportIE8
	
	/**
	 * 日期。
	 * @class Date
	 */
	applyIf(Date, {
		
		/**
		 * 获取当前时间。
		 * @static
		 * @return {Number} 当前的时间点。
		 * @example
		 * <code>
		 * Date.now(); //   相当于 new Date().getTime()
		 * </code>
		 */
		now: function() {
			return +new Date();
		}
		
	});
	
	/// #endif
	
	
	/// #endregion
	
	/// #region 浏览器

	/**
	 * 浏览器。
	 * @namespace navigator
	 */
	applyIf(navigator, (function(ua) {

		//检查信息
		var match = ua.match(/(IE|Firefox|Chrome|Safari|Opera|Navigator).((\d+)\.?[\d.]*)/i) || ["", "Other", 0, 0],
			
			// 版本信息。
			version = ua.match(/(Version).((\d+)\.?[\d.]*)/i) || match,
			
			//浏览器名字
			browser = match[1],
	
			//详细信息
			fullBrowser = browser + version[3];
		
		
		navigator["is" + browser] = navigator["is" + fullBrowser] = true;
		
		/**
		 * 获取一个值，该值指示是否为 IE 浏览器。
		 * @getter isIE
		 * @type Boolean
		 */
		
		
		/**
		 * 获取一个值，该值指示是否为 Firefox 浏览器。
		 * @getter isFirefox
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Chrome 浏览器。
		 * @getter isChrome
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Opera 浏览器。
		 * @getter isOpera
		 * @type Boolean
		 */
		
		/**
		 * 获取一个值，该值指示是否为 Safari 浏览器。
		 * @getter isSafari
		 * @type Boolean
		 */
		
		//结果
		return {
			
			/**
			 * 浏览器信息。
			 * @type String
			 */
			browser: browser,
			
			/**
			 * 浏览器版本。
			 * @type String
			 * 输出的格式比如 6.0
			 */
			version: version[2],
			
			/// #ifdef SupportIE6
			
			/**
			 * 浏览器是否为标准事件。就目前浏览器状况， IE6，7 中 isQuirks = true  其它皆 false 。
			 * @type Boolean
			 * 此处认为 IE6,7 是怪癖的。
			 */
			isQuirks: typeof Element !== 'function' && String(w.Element).indexOf("object Element") === -1,
			
			/// #endif
			
			/// #ifdef SupportIE8
			
			/**
			 * 是否为标准浏览器事件。
			 * @type Boolean
			 */
			isStd: !!-[1,],
			
			/// #endif
			
			/**
			 * 浏览器详细信息。
			 * @type String
			 */
			fullBrowser: fullBrowser
			
		};
	
	})(navigator.userAgent));

	/// #endregion
	
	/// #region 内部函数

	/**
	 * xType。
	 */
	Date.prototype.xType = "date";
	
	/**
	 * xType。
	 */
	RegExp.prototype.xType = "regexp";
	
	
	// 把所有内建对象本地化
	each.call([String, Array, Function, Date, Number], Class);
	
	/**
	 * @class Py.Object
	 */
	Object.implement({
		
		/**
		 * 调用父类的成员变量。
		 * @param {String} name 属性名。
		 * @param {Object} ... 调用的参数数组。
		 * @return {Object} 父类返回。
		 * 注意只能从子类中调用父类的同名成员。
		 * @protected
		 * @example
		 * <code>
		 * 
		 * var MyBa = new Class({
		 *    a: function(g, b) {
		 * 	    alert(g + b);
		 *    }
		 * });
		 * 
		 * var MyCls = MyBa.extend({
		 * 	  a: function(g, b) {
		 * 	    this.base('a', g, b);   // 或   this.base('a', arguments);
		 *    }
		 * });
		 * 
		 * new MyCls().a();   
		 * </code>
		 */
		base: function(name, args) {
			
			var me = this.constructor,
			
				fn = this[name];
				
			assert(fn, "Object.prototype.base(name, args): 子类不存在 {name} 的属性或方法。", name);
			
			// 标记当前类的 fn 已执行。
			fn.$bubble = true;
				
			assert(!me || me.prototype[name], "Object.prototype.base(name, args): 父类不存在 {name} 的属性或方法。", name);
			
			// 保证得到的是父类的成员。
			
			do {
				me = me.base;
				assert(me && me.prototype[name], "Object.prototype.base(name, args): 父类不存在 {name} 的属性或方法。", name);
			} while('$bubble' in (fn = me.prototype[name]));
			
			fn.$bubble = true;
			
			// 确保 bubble 记号被移除。
			try {
				if(args === arguments.callee.caller.arguments)
					return fn.apply(this, args);
				arguments[0] = this;
				return fn.call.apply(fn, arguments);
			} finally {
				delete fn.$bubble;
			}
		},
		
		/**
		 * 创建当前 Object 的浅表副本。
		 * @return {Object} 当前变量的副本。
		 * @protected
		 * @example
		 * <code>
		 * var MyBa = new Class({
		 *    clone: function() {
		 * 	     return this.memberwiseClone();
		 *    }
		 * });
		 * </code>
		 */
		memberwiseClone : function() {
			
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
	
	});
	
	/**
	 * @class String 
	 */
	String.implementIf({
		
		/**
	     * 转为骆驼格式。
	     * @param {String} value 内容。
	     * @return {String} 返回的内容。
	     * @example
		 * <code>
		 * "font-size".toCamelCase(); //     "fontSize"
		 * </code>
	     */
		toCamelCase: function() {
	        return this.replace(rToCamelCase, toCamelCase);
	    },

		/// #ifdef SupportIE8

		/**
		 * 去除首尾空格。
		 * @return {String}    处理后的字符串。
	     * @example
		 * <code>
		 * "   g h   ".trim(); //     "g h"
		 * </code>
		 */
		trim: function() {
			
			// 使用正则实现。
			return this.replace(rSpace, "");
		},
		
		/// #endif
		
		/**
		 * 将字符首字母大写。
		 * @return {String} 大写的字符串。
	     * @example
		 * <code>
		 * "bb".capitalize(); //     "Bb"
		 * </code>
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

		/// #ifdef SupportIE8

		/**
		 * 返回数组某个值的第一个位置。值没有,则为-1 。
		 * @param {Object} item 成员。
		 * @param {Number} start=0 开始查找的位置。
		 * @return Number 位置，找不到返回 -1 。 
		 * 现在大多数浏览器已含此函数.除了 IE8-  。
		 * @method
		 */
		indexOf: function   (item, startIndex) {
			startIndex = startIndex || 0;
			for (var l = this.length; startIndex < l; startIndex++)
				if (this[startIndex] === item)
					return startIndex;
			return -1;
		},
		
		/// #endif

		/**
		 * 对数组运行一个函数。
		 * @param {Function} fn 函数.参数 value, index
		 * @param {Object} bind 对象。
		 * @return {Boolean} 有无执行完。
		 * @method
		 * @seeAlso Array.prototype.forEach
		 * @example
		 * <code> 
		 * [2, 5].each(function(value, key) {
		 * 		trace(value);
		 * 		return false
		 * });
		 * // 输出 '2'
		 * </code>
		 */
		each: each,

		/// #ifdef SupportIE8

		/**
		 * 对数组每个元素通过一个函数过滤。返回所有符合要求的元素的数组。
		 * @param {Function} fn 函数。参数 value, index, this。
		 * @param {Object} bind 绑定的对象。
		 * @return {Array} 新的数组。
		 * @seeAlso Array.prototype.select
		 * @example
		 * <code> 
		 * [1, 7, 2].filter(function(key) {return key &lt; 5 })   [1, 2]
		 * </code>
		 */
		filter: function(fn, bind) {
			var r = [];
			ap.forEach.call(this, function(value, i, array) {
				
				// 过滤布存在的成员。
				if(fn.call(this, value, i, array))
					r.push(value);
			}, bind);
			
			return r;

		},

		/**
		 * 对数组内的所有变量执行函数，并可选设置作用域。
		 * @method
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身}
		 * @param {Object} bind 函数执行时的作用域。
		 * @seeAlso Array.prototype.each
		 * @example
		 * <code> 
		 * [2, 5].forEach(function(value, key) {
		 * 		trace(value);
		 * });
		 * // 输出 '2' '5'
		 * </code>
		 * */
		forEach: each,
		
		/// #endif
		
		/**
		 * 对数组每个元素筛选出一个函数返回true或属性符合的项。 
		 * @param {Function/String} name 函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Number} index 当前变量的索引} {@param {Array} array 数组本身} /数组成员的字段。
		 * @param {Object} value 值。
		 * @return this
		 * @seeAlso Array.prototype.filter
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].select("length", 0); //  [""];
		 * [{q: "1"}, {q: "3"}].select("q", "3");	//  返回   [{q: "3"}];
		 * [{q: "1"}, {q: "3"}].select(function(v) {
		 * 	  return v.["q"] == "3";
		 * });	//  返回   [{q: "3"}];
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
		 * @param {Object} value 值。
		 * @return {Boolean} 是否包含元素。
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].include(""); //   true
		 * [false].include(0);	//   false
		 * </code>
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
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].insert(3, 4); //   ["", "aaa", "zzz", 4, "qqq"]
		 * </code>
		 */
		insert: function(index, value) {
			
			assert.isNumber(index, "Array.prototype.insert(index, value): 参数 index ~。");
			
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
		 * @example
		 * <code>
		 * ["vhd"].invoke('charAt', [0]); //    ['v']
		 * ["vhd"].invoke(function(v){ return v.charAt(0)} ); //    ['v']
		 * </code>
		 */
		invoke: function(fn, args) {
			assert(o.isFunction(fn) || (args && typeof args.length === 'number'), "Array.prototype.invoke(fn, args): 参数 {args} 必须是数组, 无法省略。", args)
			var r = [];
			ap.forEach.call(this, o.isFunction(fn) ? function(value, index) {
				r.push(fn.call(args, value, index));
			} : function(value) { 
				assert(value && o.isFunction(value[fn]), "Array.prototype.invoke(fn, args): {args} 内的 {value} 不包含可执行的函数 {fn}。", args, value, fn);
				r.push(value[fn].apply(value, args));
			});
			
			return r;
		},
		
		/**
		 * 删除数组中重复元素。
		 * @return {Array} 结果。
		 * @example
		 * <code>
		 * [1,7,8,8].unique(); //    [1, 7, 8]
		 * </code>
		 */
		unique: function() {
			var r = [];
			Array.copyIf(this, r);
		    return r; 
		},
		
		/**
		 * 删除元素, 参数为元素的内容。
		 * @param {Object} value 值。
		 * @return {Number} 删除的值的位置。
		 * @example
		 * <code>
		 * [1,7,8,8].remove(7); //   1
		 * </code>
		 */
		remove: function(value) {
			
			// 找到位置， 然后删。
			var i = this.indexOf(value);
			if(i !== -1)this.splice(i, 1);
			return i;
		},
		
		/**
		 * xType。
		 */
		xType: "array"

	});
	
	/// #endregion
	
	/// #region 远程请求
	
	
	/// #ifdef SupportIE6
	
	/**
	 * 生成一个请求。
	 * @class window.XMLHttpRequest
	 * @return {XMLHttpRequest} 请求的对象。
	 */
	
	if(!w.XMLHttpRequest || navigator.isQuirks) {
		
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
	 * @param {XMLHttpRequest} xmlHttp 请求。
	 * @return {Boolean} 正常返回true 。
	 * @static
	 */
	w.XMLHttpRequest.isOk = function(xmlHttp) {
		
		assert.isObject(xmlHttp, 'XMLHttpRequest.isOk(xmlHttp): 参数 {xmlHttp} 不是合法的 XMLHttpRequest 对象');
		
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
	
	/**
	 * @class
	 */
	
	/// #endregion

	/// #region 页面
	
	/**
	 * @namespace Py
	 */
	apply(p, {
		
		/**
		 * id种子 。
		 * @type Number
		 */
		id: Date.now() % 100,
			
		/**
		 * PyJs 安装的根目录, 可以为相对目录。
		 * @config {String}
		 */
		rootPath: p.rootPath || (function() {
				
				
				/// HACK: this function fails in special environment
				
				var b = document.getElementsByTagName("script");
				
				// 当前脚本在 <script> 引用。最后一个脚本即当前执行的文件。
				b = b[b.length - 1];
						
				// IE6/7 使用  getAttribute
				b = navigator.isQuirks ? b.getAttribute('src', 5) : b.src;
				return (b.match(/[\S\s]*\//) || [""])[0];
				
		}) (),
		
		/**
		 * 初始化 window 对象。
		 * @param {Document} doc
		 * @private
		 */
		setupWindow: function(w) {
			
			/// #region 变量
			
			/// #ifdef SupportGlobalObject
		
			// 将以下成员赋予 window ，这些成员是全局成员。
			String.map('Class using namespace undefined IEvent', p, w, true);
			
			/// #endif
		
			
			/// #endregion
			
			/// #region bindReady
			
			var document = w.document,
			
				doReady = function() {
					
					if(document.isReady)
						return;
						
					document.isReady = true;
					
					// 使用 document 删除事件。
					p.removeEventListener.call(document, eventName, doReady, false);
					
					// 调用所有函数。
					doReady.list.invoke('call', [document, p]);
					
					
					
					doReady = null;
					
				},
				
				doLoad = function() {
					document.isLoaded = true;
					p.removeEventListener.call(w, 'load', doLoad, false);
					
					doLoad.list.invoke('call', [w, p]);
					
					doLoad = null;
				},
				
				/// #ifdef SupportIE8
			
				eventName = navigator.isStd ? 'DOMContentLoaded' : 'readystatechange';
			
				/// #else
				
				/// eventName = 'DOMContentLoaded';  
				
				/// #endif
		
			/**
			 * 页面加载时执行。
			 * @param {Functon} fn 执行的函数。
			 * @memberOf document
			 */
			document.onReady = function(fn) {

				assert.isFunction(fn, "document.ready(fn): 参数 {fn} ~。");
				
				if(document.isReady)
					fn.call(document);
				else
					// 已经完成则执行函数，否则 on 。
					doReady.list.push(fn);
				
			};
			
			/**
			 * 在文档载入的时候执行函数。
			 * @param {Functon} fn 执行的函数。
			 * @memberOf document
			 */
			document.onLoad = function(fn) {

				assert.isFunction(fn, "document.ready(fn): 参数 {fn} ~。");
				
				if(document.isLoaded)
					fn.call(w);
				else
					// 已经完成则执行函数，否则 on 。
					doLoad.list.push(fn);
				
			};
				
			doReady.list = [];
			
			doLoad.list = [doReady];
				
			// 如果readyState 不是  complete, 说明文档正在加载。
			if (document.readyState !== "complete") { 
	
				// 使用系统文档完成事件。
				p.addEventListener.call(document, eventName, doReady, false);
				
				p.addEventListener.call(w, 'load', doLoad, false);
				
				/// #ifdef SupportIE8
				
				// 只对 IE 检查。
				if (!navigator.isStd) {
				
					// 来自 jQuery
		
					//   如果是 IE 且不是框架
					var toplevel = false;
		
					try {
						toplevel = w.frameElement == null;
					} catch(e) {}
		
					if ( toplevel && document.documentElement.doScroll) {
						
						/**
						 * 为 IE 检查状态。
						 * @private
						 */
						(function () {
							if (document.isReady) {
								return;
							}
						
							try {
								//  http:// javascript.nwbox.com/IEContentLoaded/
								document.documentElement.doScroll("left");
							} catch(e) {
								setTimeout( arguments.callee, 1 );
								return;
							}
						
							doReady();
						})();
					}
				}
				
				/// #endif
				
			} else {
				setTimeout(doLoad, 1);
			}
			
			/// #endregion
		}
		
	});
	
	p.setupWindow(w);

	/// #endregion
	
	/// #region 函数
	
	/**
	 * 复制所有属性到任何对象。 
	 * @param {Object} dest 复制目标。
	 * @param {Object} src 要复制的内容。
	 * @return {Object} 复制后的对象。
	 */
	function apply(dest, src) {
		
		assert(dest != null, "Object.extend(dest, src): 参数 {dest} 不可为空。", dest);
		assert(src != null, "Object.extend(dest, src): 参数 {src} 不可为空。", src);
		
		
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
		
		assert(dest != null, "Object.extendIf(dest, src): 参数 {dest} 不可为空。", dest);
		assert(src != null, "Object.extendIf(dest, src): 参数 {src} 不可为空。", src);

		for (var b in src)
			if (dest[b] === undefined)
				dest[b] = src[b];
		return dest;
	}

	/**
	 * 对数组运行一个函数。
	 * @param {Function} fn 函数.参数 value, index, array
	 * @param {Object} bind 对象。
	 * @return {Boolean} 有无执行完。
	 * 现在大多数浏览器已含此函数.除了 IE8-  。
	 */
	function each(fn, bind) {
		
		assert(o.isFunction(fn), "Array.prototype.each(fn, bind): 参数 {fn} 必须是一个可执行的函数。", fn);
		
		var i = -1,
			me = this,
			l = me.length;
		while (++i < l)
			if(fn.call(bind, me[i], i, me) === false)
				return false;
		return true;
	}
	
	/**
	 * 由存在的类修改创建类。
	 * @param {Function/Class} constructor 将创建的类。
	 * @return {Class} 生成的类。
	 */
	function Class(constructor) {
		
		// 简单拷贝  Object 的成员，即拥有类的特性。
		// 在 JavaScript， 一切函数都可作为类，故此函数存在。
		// Object 的成员一般对当前类构造函数原型辅助。
		return applyIf(constructor, Object);
	}
	
	/**
	 * 所有自定义类的基类。
	 */
	function Object() {
	
	}
		
	/**
	 * 返回返回指定结果的函数。
	 * @param {mixed} v 结果。
	 * @return {Function} 函数。
	 */
	function from(obj) {
		
		return function() {
			return obj;
		}
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
	function emptyFn() {
		
	}

	/**
	 * 定义名字空间。
	 * @param {String} name 名字空间。
	 * @param {Object/Boolean} obj 值。
	 */
	function namespace(name, obj) {
		
		assert(name && name.split, "namespace(namespace, obj, value): 参数 {namespace} 不是合法的名字空间。", name);
		
		
		// 简单声明。
		if (arguments.length == 1) {
			
			/// #ifdef SupportUsing
			
			// 加入已使用的名字空间。
			return   p.namespaces.include(name);
			
			/// #else
			
			/// return ;
			
			/// #endif
		}
			
		
		// 取值，创建。
		name = name.split('.');
		
		var current = w, i = -1, len = name.length - 1;
		
		name[0] = name[0] || 'Py';
		
		while(++i < len)
			current = current[name[i]] || (current[name[i]] = {});
			
		i = name[len];
		
		
		
		if (!i) {
			obj = applyIf(current, obj);
			i = name[--len];
		} else 
			current[i] = obj;
		
		/// #ifdef SupportGlobalObject
		
		// 指明的是对象。
		if (!(i in Py.defaultNamespace)) {
			
			// 复制到全局对象和名字空间。
			Py.defaultNamespace[i] = obj;
			
		}
		
		/// #endif
		
		return obj;
		
		
		
	}

	/// #endregion

})(this);



// ===========================================
//   调试   debug.js C
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
	else trace.write(obj);
}

/**
 * @namespace trace
 */
Object.extendIf(trace, {
	
	/**
	 * 输出方式。
	 * @param {String} message 信息。
	 */
	write: function(message) {
		alert(message);
	},
	
	/**
	 * 输出类的信息。
	 * @param {Object} 成员。
	 */
	api: function(obj, prefix) {
		var title = 'API信息: ', msg = [];

		if(arguments.length === 0) {
			title = '全局对象: ';
			prefix = '';
			String.map('Object String Date Array RegExp Function Element document Py navigator XMLHttpRequest', function(propertyName) {
				addValue(window, propertyName);
			});

			for(var propertyName in Py) {
				if(Py.defaultNamespace[propertyName] === Py[propertyName]) {
					addValue(Py, propertyName);
				}
			}
		} else if(obj != null) {
			if(obj.prototype) {
				for(var propertyName in obj.prototype) {
					var extObj = obj;
					
					try {
						while(!Object.prototype.hasOwnProperty.call(extObj.prototype, propertyName) && (extObj = extObj.base) && extObj.prototype);
						extObj = extObj === obj ? '' : (extObj = getClassInfo(extObj)) ? '(继承于 ' + extObj + ' 类)' : '(继承的)';
						
						msg.push('prototype.' + propertyName + ' ' + getMember(obj.prototype[propertyName], propertyName) + extObj);
					} catch(e) {
					}
				}
			}
			for(var item in obj) {
				try {
					addValue(obj, item);
				} catch(e) {
				}
			}
		}

		// 尝试获取一层的元素。
		if(prefix === undefined) {

			var typeName ,constructor = obj != null && obj.constructor;
			
			if(obj && obj.nodeType) {
				prefix = 'Element.prototype';
				title = 'Element 类的实例成员: ';
			} else {
				
				if(typeName = getClassInfo(obj)) {
					var extObj = getMember(obj, typeName) === '类' && getClassInfo(obj.base);
					title = typeName + ' ' + getMember(obj, typeName) + (extObj && extObj != "Object" ? '(继承于 ' + extObj + ' 类)' : '') + '的成员: ';
					prefix = typeName;
				} else if(typeName = getClassInfo(constructor)) {
					prefix = typeName + '.prototype';
					title = typeName + ' 类的实例成员: ';
				}
			}

			if(!prefix) {
				
				String.map('Object String Date Array RegExp Number Function Element XMLHttpRequest', function(value) {
					if(window[value] === obj) {
						title = value + ' ' + getMember(obj, value) + '的成员: ';
						prefix = value;
					} else if(constructor === window[value]) {
						prefix = value + '.prototype';
						title = value + ' 类的实例成员: ';
					}
				});
			}
		}

		if(msg.length === 0)
			msg.push(title + '无');
		else {
			msg.sort();
			msg.unshift(title);
		}

		trace(msg.join( prefix ? '\r\n' + prefix + "." : '\r\n'));


		function isEmptyObject(obj) {
			for(var i in obj)
			return false;

			return true;
		}

		function getMember(val, name) {
			
			if(typeof val === 'function' && name === 'constructor')
				return '构造函数';

			if(val && val.prototype && !isEmptyObject(val.prototype))
				return '类';

			if(Object.isObject(val))
				return name.charAt(0) === 'I' && isUpper(name, 1) ? '接口' : '对象';

			if(Object.isFunction(val)) {
				return isUpper(name, 0) ? '类' : '函数';
			}

			return '属性';
		}

		function isUpper(s, i) {
			s = s.charCodeAt(i);
			return s <= 90 && s >= 65;
		}
		
		function getClassInfo(value) {
			
			if(value) {
				for(var item in Py) {
					if(Py[item] === value) {
						return item;
					}
				}
				
			}
			
			return null;
		}
		
		function addValue(base, memberName) {
			msg.push(memberName + ' ' + getMember(base[memberName], memberName));
		}

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
	 * 空函数，用于证明函数已经执行过。
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
	 * 输出一个函数执行指定次使用的时间。
	 * @param {Function} fn 函数。
	 * @param {Number} times=1000 运行次数。
	 */
	test: function(fn, times) {
		trace("[时间] " + trace.runTime(fn, null, times));
	},
	
	/**
	 * 测试某个函数运行一定次数的时间。
	 * @param {Function} fn 函数。
	 * @param {Array} args 函数参数。
	 * @param {Number} times=1000 运行次数。
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
 * @param {String} msg="断言失败" 错误后的提示。
 * @return {Boolean} 返回 bValue 。
 * @example
 * <code>
 * assert(true, "{value} 错误。", value
 * 
 * </code>
 */
function assert(bValue, msg) {
	if (!bValue && Py.debug) {
	
		 var val = arguments;

		// 如果启用 [参数] 功能
		if (val.length > 2) {
			var i = 2;
			msg = msg.replace(/\{([\w$\.\(\)]*?)\}/g, function(s, x) {
				return val.length <= i ? s : x + " = " + String.ellipsis(trace.inspect(val[i++]), 200);
			});
		}else {
			msg = msg || "断言失败";
		}

		// 错误源
		val = arguments.callee.caller;
		
		if (Py.stackTrace !== false) {
		
			while (val.debugStepThrough) 
				val = val.caller;
			
			if (val) msg += "\r\n--------------------------------------------------------------------\r\n" + String.ellipsis(String.fromUTF8(val.toString()), 600);
			
		}

		if(Py.trace)
			trace.error(msg);
		else
			throw new Error(msg);

	}

	return bValue;
}

(function() {
	
	function  assertInternal(asserts, msg, value, dftMsg) {
		return assert(asserts, msg ?  msg.replace('~', dftMsg) : dftMsg, value);
	}
	
	function assertInternal2(fn, dftMsg, args) {
		return assertInternal(fn(args[0]), args[1], args[0], dftMsg);
	}
	
	/**
	 * @namespace assert
	 */
	Object.extend(assert, {
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 * @example
		 * <code>
		 * assert.isFunction(a, "a ~");
		 * </code>
		 */
		isFunction: function() {
			return assertInternal2(Object.isFunction, "必须是可执行的函数", arguments);
		},
		
		/**
		 * 确认一个值为数组。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isArray: function() {
			return assertInternal2(Object.isArray, "必须是数组", arguments);
		},
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isObject: function(value, msg) {
			return assertInternal(Object.isObject(value) || Object.isFunction(value), msg, value,  "必须是引用的对象", arguments);
		},
		
		/**
		 * 确认一个值为数字。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNumber: function(value, msg) {
			return assertInternal(typeof value == 'number' || value instanceof Number, msg, value, "必须是数字");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNode: function(value, msg) {
			return assertInternal(value && value.nodeType, msg, value, "必须是 DOM 节点");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isElement: function(value, msg) {
			return assertInternal(value && value.style, msg, value, "必须是 Element 对象");
		},
		
		/**
		 * 确认一个值是字符串。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isString: function(value, msg) {
			return assertInternal(typeof value == 'string' || value instanceof String, msg, value, "必须是字符串");
		},
		
		/**
		 * 确认一个值是日期。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isDate: function(value, msg) {
			return assertInternal(Object.type(value) == 'date' || value instanceof Date, msg, value, "必须是日期");
		},
		
		/**
		 * 确认一个值是正则表达式。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isRegExp: function(value, msg) {
			return assertInternal(Object.type(value) == 'regexp' || value instanceof RegExp, msg, value, "必须是正则表达式");
		},
	
		/**
		 * 确认一个值非空。
		 * @param {Object} value 值。
		 * @param {String} argsName 变量的名字字符串。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		notNull: function(value, msg) {
			return assertInternal(value != null, msg, value, "不可为空");
		},
	
		/**
		 * 确认一个值在 min ， max 间。
		 * @param {Number} value 判断的值。
		 * @param {Number} min 最小值。
		 * @param {Number} max 最大值。
		 * @param {String} argsName 变量的米各庄。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		between: function(value, min, max, msg) {
			return assertInternal(value >= min && !(value >= max), msg, value, "超出索引, 它必须在 [" + min + ", " + (max === undefined ? "+∞" : max) + ") 间");
		},
	
		/**
		 * 确认一个值属于一个类型。
		 * @param {Object} v 值。
		 * @param {String/Array} types 类型/表示类型的参数数组。
		 * @param {String} message 错误的提示信息。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		instanceOf: function(v, types, msg) {
			if (!Object.isArray(types)) types = [types];
			var ty = typeof v,
				iy = Object.type(v);
			return assertInternal(types.filter(function(type) {
				return type == ty || type == iy;
			}).length, msg, v, "类型错误。");
		},
	
		/**
		 * 确认一个值非空。
		 * @param {Object} value 值。
		 * @param {String} argsName 变量的参数名。
		 * @return {Boolean} 返回 assert 是否成功 。
		 */
		notEmpty: function(value, msg) {
			return assertInternal(value && value.length, msg, value, "为空");
		}

	});
	
	assertInternal.debugStepThrough = assertInternal2.debugStepThrough = true;
	
	
	for(var fn in assert) { 
		assert[fn].debugStepThrough = true;
	}

	
})();

/// #endregion
/// #endif

//===========================================================

namespace("System");

//===========================================
//  元素             G
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
		 * 如果页面已经存在 Element， 不管是不是用户自定义的，都直接使用。只需保证 Element 是一个函数即可。
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
		ep.domVersion = 1;

	}

	/**
	 * 根据一个 id 或 对象获取节点。
	 * @param {String/Element} id 对象的 id 或对象。
	 * @memberOf Py
	 */
	namespace(".$", navigator.isQuirks ? function(id) {
		var dom = getElementById(id);

		if(dom && dom.domVersion !== ep.domVersion) {
			o.extendIf(dom, ep);
		}

		return dom;


	} : getElementById);

	/// #else

	/// namespace(".$", getElementById);

	/// #endif

	///   #region ElementList

	/**
	 * 节点集合。
	 * @class ElementList
	 * @extends Element
	 * ElementList 是对元素数组的只读包装。
	 * ElementList 允许快速操作多个节点。
	 * ElementList 的实例一旦创建，则不允许修改其成员。
	 */
	namespace(".ElementList", p.Class({

		/**
		 * xType
		 */
		xType: "elementlist",

		/**
		 * 初始化 p.ElementList  实例。
		 * @param {Array/p.ElementList} doms 节点集合。
		 * @constructor
		 */
		constructor: function(doms) {

			assert(doms && doms.length !== undefined, 'ElementList.prototype.constructor(doms): 参数 {doms} 必须是一个 NodeList 或 Array 类型的变量。', doms);

			this.doms = doms;
			
			// 检查是否需要为每个成员调用  $ 函数。
			if(doms[0] && !doms[0].xType) {
				o.update(doms, p.$);
			}

		},

		/**
		 * 对集合每个元素执行一次函数。
		 * @param {Function/String} fn 参数。
		 * @param {Array} args/... 参数。
		 * @return {Array} 结果集。
		 */
		each: function(fn, args) {

			// 防止 doms 为 p.ElementList
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
		 * @static
		 */
		implementTargets: [ ep, document],

		/**
		 * 将一个成员附加到 Element 对象和相关类。
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 p.ElementList 实例。
		 * @return {Element} this
		 * @static
		 * 对 Element 扩展，内部对 Element ElementList document 皆扩展。
		 * 这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。
		 * 所谓的扩展，即一个类含需要的函数。
		 *
		 *
		 * DOM 方法 有 以下种
		 *
		 *  1, 其它  getText - 执行结果是数据，返回结果数组。 (默认)
		 *  2  setText - 执行结果返回 this， 返回 this 。
		 *  3  getElementById - 执行结果是DOM，返回  ElementList 包装。
		 *  4  getElementsByTagName - 执行结果是DOM数组，返回  ElementList 包装。
		 *  5  contains  - 执行结果是判断， 如果每个返回值都是 true， 则返回 true， 否则返回 false。
		 * 
		 * 
		 *
		 *  参数 copyIf 仅内部使用。
		 */
		implement: function (obj, listType, copyIf) {

			assert.notNull(obj, "Element.implement(obj, listType): 参数 {obj} ~。");
				
			Object.each(obj, function (value, key) {
	
				this.implementTargets.forEach( function(m) {
					if(!copyIf || !(key in m))
						m[key] = obj[key];
				});
				
				if(!copyIf || !(key in p.ElementList.prototype)) {
	
					// 复制到  p.ElementList
					switch (listType) {
						case 2:
							value = function() {
								var doms = this.doms, l = doms.length, i = -1;
								while (++i < l)
									doms[i][key].apply(doms[i], arguments);
								return this;
							};
							
							break;
						case 3:
							value = function() {
								return new p.ElementList(this.each(key, arguments));
							};
							break;
							
						case 4:
							value = function() {
								var args = arguments;
								return new p.ElementList(Array.plain.apply(Array, this.each( function(elem, index) {
									var r = this[index][key].apply(this[index], args);
									return r && r.doms || r;
								}, this.doms)));
	
							};
							break;
							
						case 5:
							value = function() {
								var args = arguments;
								return !ap.each.call(this.doms, function(node) {
									return  !node[key].apply(node[key], args);
								});
							};
							break;
							
						default:
							value = function() {
								return this.each(key, arguments);
							};
							
					}
				
					p.ElementList.prototype[key] = value;
				}
				
				
			}, this);

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
		 * @param {Number} listType 说明如何复制到 p.ElementList 实例。
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

	assert.isNode(document.documentElement, "在 element.js 执行时，必须存在 document.documentElement 属性。请确认浏览器为标准浏览器。");

	/**
	 * @namespace document
	 */
	o.extendIf(document, {

		/**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function(tagName, className) {
			
			assert.isString(tagName, 'document.create(tagName, className): 参数 {tagName} ~。');

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
		 * @return {Element/ElementList} 如果只有1个参数，返回元素，否则返回元素集合。
		 */
		getDom: function() {
			return arguments.length === 1 ? p.$(arguments[0]) : new p.ElementList(arguments);

			/*
			 return new p.ElementList(o.update(arguments, function(id){
			 return typeof id == 'string' ? this.getElementById(id) : id;
			 }, [], this));
			 */
		},

		/// #ifndef SupportIE8
		
		/**
		 * 返回当前文档默认的视图。
		 * @type {Window}
		 */
		defaultView: document.parentWindow,
	
		/// #endif

		/**
		 * 获取节点本身。
		 */
		dom: document.documentElement
		
	});
	
	/**
	 * @class
	 */

	/**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
	 * @return {Document} 文档。
	 */
	function getDoc(elem) {
		assert.isNode(elem, 'Element.getDocument(elem): 参数 {elem} ~。');
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

	/// #region 事件

	/**
	 * 默认事件。
	 * @type Object
	 * @hide
	 */
	namespace(".Events.element.$default", {

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
		initEvent: Function.empty,

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
		 * @param {Object} obj 对象。
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
	 * @static
	 * @memberOf Element
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

	var pep = namespace(".Event", Class({

		/**
		 * 构造函数。
		 * @param {Object} target
		 * @constructor
		 */
		constructor: function(target, type, e) {
			var me = this;
			me.target = target;
			me.srcElement = target.dom || target;
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
		w.Event.prototype.stop = pep.stop;

		initMouseEvent = initKeyboardEvent = initUIEvent = function(e) {

			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

		};

	/// #ifdef SupportIE6

	} else {   //  for IE6/IE7/IE8

		initUIEvent = function(e) {
			if(!e.preventDefault){
				e.target = e.srcElement ? p.$(e.srcElement) : (e.srcElement = document);
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
				var dom = getDoc(e.target).dom;
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

	if (navigator.isFirefox)
		e.defineEvents('mousewheel', 'DOMMouseScroll');
	if (!navigator.isIE) {
		function checkMouseEnter(e) {

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

	/// #region 属性

	/**
	 * 透明度的正则表达式。
	 * @type RegExp
	 */
	var rOpacity = /opacity=([^)]*)/,
	
		/**
		 * 是否为像素的正则表达式。
		 * @type RegExp
		 */
		rNumPx = /^-?\d+(?:px)?$/i,
	
		/**
		 * 是否为数字的正则表达式。
		 * @type RegExp
		 */
		rNum = /^-?\d/,
	
		/**
		 * 事件名。
		 * @type RegExp
		 */
		rEventName = /^on(\w+)/,
	
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
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
	
	
		/// #ifdef SupportIE8
	
		/**
		 * 是否使用方法 getComputedStyle。
		 * @type Boolean
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
			
			if(name in styles){
				switch(name) {
					case 'height':
						return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - e.getSizes(elem, 'y', 'pb') + 'px';
					case 'width':
						return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - e.getSizes(elem, 'x', 'pb') + 'px';
					case 'opacity':
						return ep.getOpacity.call(elem).toString();
		
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
		 * 特殊的样式。
		 * @type Object
		 */
		styles = {
			'float': 'cssFloat' in div.style ? 'cssFloat' : 'styleFloat',
			height: 'setHeight',
			width: 'setWidth'
		},
		
		/**
		 * 特殊属性集合。
		 * @type Object
		 */
		attributes = {
			innerText: 'innerText' in div ? 'innerText' : 'textContent',
			"for": "htmlFor",
			"class": "className"
		};
		
	/**
	 * @class Element
	 */
	apply(e, {
		
		/**
		 * 获取元素的计算样式。
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 * @static
		 */
		getStyle: getStyle,

		/**
		 * 读取样式字符串。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 * @static
		 */
		styleString:  styleString,

		/**
		 * 读取样式数字。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
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
			assert(type in e.styleMaps, "Element.getSizes(elem, type, names): 参数 {type} 必须是 \"x\" 或 \"y\"。", type);
			assert.isString(names, "Element.getSizes(elem, type, names): 参数 {names} ~。");


			var value = 0, map = e.styleMaps[type], i = names.length, val, currentStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(currentStyle[val[0]]) || 0) + (parseFloat(currentStyle[val[1]]) || 0);
			}

			return value;
		} : function (elem, type, names) {


			assert.isElement(elem, "Element.getSizes(elem, type, names): 参数 {elem} ~。");
			assert(type in e.styleMaps, "Element.getSizes(elem, type, names): 参数 {type} 必须是 \"x\" 或 \"y\"。", type);
			assert.isString(names, "Element.getSizes(elem, type, names): 参数 {names} ~。");

			var value = 0, map = e.styleMaps[type], i = names.length, val;
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(getStyle(elem, val[0])) || 0) + (parseFloat(getStyle(elem, val[1])) || 0);
			}

			return value;
		},
		
		/**
		 * 特殊的样式集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		styles: styles,

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
		 * @type Object
		 */
		styleMaps: {},
		
		/**
		 * 显示元素的样式。
		 * @static
		 * @type Object
		 */
		display: { position: "absolute", visibility: "visible", display: "block" },

		/**
		 * 不需要单位的 css 属性。
		 * @static
		 * @type Object
		 */
		styleNumbers: String.map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', Function.returnTrue, {}),
	
		/**
		 * 默认最大的 z-index 。
		 * @property
		 * @type Number
		 * @private
		 * @static
		 */
		zIndex: 10000,
		
		/**
		 * 清空元素的 display 属性。
		 * @param {Element} elem 元素。
		 */
		show: function(elem){
			
			// 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
			elem.style.display = '';
			
			// 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
			if(getStyle(elem, 'display') === 'none')
				elem.style.display = p.getData(elem, 'display') || 'block';
		},
		
		/**
		 * 赋予元素的 display 属性 none。
		 * @param {Element} elem 元素。
		 */
		hide: function(elem){
			var currentDisplay = styleString(elem, 'display');
			if(currentDisplay !== 'none') {
				p.setData(elem, 'display', currentDisplay);
				elem.style.display = 'none';
			}
		},

		/**
		 * 获取一个节点属性。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function(elem, name) {

			assert.isNode(elem, "Element.getAttr(elem, name): 参数 {elem} ~。");

			
			if(name in attributes){
				
				/// #ifdef SupportIE6
				if(navigator.isQuirks && /^(href|src)$/.test(name)) {
					return elem.getAttribute(name, 2);
				}
				/// #endif
				
				// if(navigator.isSafari && name === 'selected' && elem.parentNode){ elem.parentNode.selectIndex; if(elem.parentNode.parentNode) elem.parentNode.parentNode.selectIndex; }
				
				name = attributes[name];
			}

			// 如果是节点具有的属性
			if (name in elem) {

				// 表单上的元素，返回节点属性值
				if (elem.nodeName === "FORM") {
					var node = elem.getAttributeNode(name);
					return node && node.nodeValue;
				}

				return elem[name];
			}

			return elem.getAttribute(name); // 有些属性在 IE 需要参数获取

		},

		/**
		 * 检查是否含指定类名。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function(elem, className) {
			assert.isNode(elem, "Element.hasClass(elem, className): 参数 {elem} ~。");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		},
		
		/**
		 * 获取指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 * @return {Object} 收集的属性。
		 */
		getStyles: function(elem, styles){
			assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

			var r = {};
			for(var style in styles){
				r[style] = elem.style[style];
			}
			return r;
		},
		
		/**
		 * 设置指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 */
		setStyles: function(elem, styles){
			assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

			o.extend(elem.style, styles);
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

			assert.isString(name, "Element.prototypgetStyle(name): 参数 {name} ~。");

			var me = this.dom || this;

			return me.style[name = name.toCamelCase()] || getStyle(me, name);

		},

		/// #ifdef SupportIE8

		/**
		 * 获取透明度。
		 * @method
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
		getOpacity: !('opacity' in div.style) ? function() {

			return rOpacity.test(styleString(this.dom || this, 'filter')) ? parseInt(RegExp.$1) / 100 : 1;

		} : function() {

			return styleNumber(this.dom || this, 'opacity');

		},

		/// #else
		///
		/// getOpacity: function() {
		///
		///    return parseFloat(styleString(this.dom || this, 'opacity')) || 0;
		///
		/// },

		/// #endif

		/**
		 * 获取一个节点属性。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function(name) {
			return e.getAttr(this.dom || this, name);
		},

		/**
		 * 检查是否含指定类名。
		 * @param {String} className
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function(className) {
			return e.hasClass(this.dom || this, className);
		},

		/**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
		getText: function() {
			var me = this.dom || this;

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

			return (this.dom || this).innerHTML;
		},

		/**
		 * 判断一个节点是否隐藏。
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 */
		isHidden: function() {
			var me = this.dom || this;

			return (me.style.display || getStyle(me, 'display')) === 'none';
		}

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
			var me = this, style = (me.dom || me).style;

			//没有键  返回  cssText
			if (arguments.length == 1) {
				style.cssText = name;
			} else {

				if(name in styles) {

					name = styles[name];
					
					if(me[name]){
						return me[name](value);
					}

				} else {
					name = name.toCamelCase();
	
					//如果值是函数，运行。
					if (typeof value === "number" && !(name in e.styleNumbers))
						value += "px";
					
				}

				// 指定值
				style[name] = value;
			}

			return me;
		},

		/// #ifdef SupportIE8

		/**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
		setOpacity: !('opacity' in div.style) ? function(value) {

			var style = (this.dom || this).style;

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

			// 当元素未布局，IE会设置失败，强制使生效
			style.zoom = 1;

			// 设置值
			style.filter = (style.filter || 'alpha(opacity=?)').replace(rOpacity, "opacity=" + value * 100);

			//返回值， 保证是字符串  值为  0 - 100
			return this;

		} : function(value) {

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

			//  标准浏览器使用   opacity
			(this.dom || this).style.opacity = value;
			return this;

		},

		/// #else

		/// setOpacity: function(value) {
		///	
		/// 	assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);
		///
		///     //  标准浏览器使用   opacity
		///     (this.dom || this).style.opacity = value;
		///     return this;
		///
		/// },

		/// #endif
		
		/**
		 * 设置节点属性。
		 * @param {String} name 名字。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setAttr: function(name, value) {

			//简写
			var me = this.dom || this;

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
				
				var dom = me.dom || me;

				// event 。
				if(name.match(rEventName))
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
			var me = this.dom || this;

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
			
			var me = this.dom || this;

			me.className = className ? me.className.replace(new RegExp('\\b' + className + '\\b\\s*', "g"), '') : '';
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
			var me = this.dom || this;

			switch(me.tagName) {
				case "SELECT":
					if(me.type === 'select-multiple' && value) {
						
						assert.isString(value, "Element.prototype.setText(value): 参数  {value} ~。");
					
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

			(this.dom || this).innerHTML = value;
			return this;
		},

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
			var args = arguments, value = args[1];
			if(typeof args[0] === 'string') {
				(args[1] = {})[args[0]] = value;
				args[0] = null;
			} else if(typeof value !== 'object') {
				ap.unshift.call(args, null);
			}

			this.set(args[1]);
			
			if(args[4])
				args[4].call(this);
				
			if(args[3])
				setTimeout(args[3], 0);

			return  this;
		},

		/**
		 * 显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack) {
			
			e.show(this.dom || this);
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

			e.hide(this.dom || this);
			if(callBack)
				setTimeout(callBack, 0);
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
			return this[(flag === undefined ? this.isHidden() : flag) ? 'show' : 'hide']  (duration, callBack, type);
		},

		/**
		 * 设置元素不可选。
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function(value) {

			(this.dom || this).unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function(value) {

			(this.dom || this).onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function(value) {

			(this.dom || this).style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},

		/**
		 * 将元素引到最前。
		 * @param {Element} [elem] 参考元素。
		 * @return this
		 */
		bringToFront: function(elem) {
			
			assert(!elem || (elem.dom  && elem.dom.style) || elem.style, "Element.prototype.bringToFront(elem): 参数 {elem} 必须为 元素或为空。", elem);
			
			var me = this.dom || this;

			me.style.zIndex = Math.max(parseInt(styleString(me, 'zIndex')) || 0, elem && (parseInt(styleString(elem.dom || elem, 'zIndex')) + 1) || e.zIndex++);
			return this;
		}

	}, 2);
	
	String.map('x y', function(c, i){
		c = e.styleMaps[c] = {};
		var tx = i ? ['Top', 'Bottom'] : ['Left', 'Right'];
		c.d = tx.invoke('toLowerCase', []);
		String.map('padding~ margin~ border~Width', function(v){
			c[v.charAt(0)] = [v.replace('~', tx[0]), v.replace('~', tx[1])];
		});
	});
	
	String.map("href src defaultValue accessKey cellPadding cellSpacing rowSpan colSpan frameBorder maxLength readOnly tabIndex useMap contentEditable", function(value) {
		attributes[value.toLowerCase()] = value;
	});
	
	if(!('opacity' in div.style)){
		styles.opacity = 'setOpacity';
	}
	
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
		var value = parseFloat(elem.style[name]);
		if(!value && value !== 0) {
			value = parseFloat(getStyle(elem, name));
		}
		
		if(!value && value !== 0) {
			if(name in styles){
				var style = e.getStyles(elem, e.display);
				e.setStyles(elem, e.display);
				value= parseFloat(getStyle(elem, name)) || 0;
				e.setStyles(elem, style);
			} else {
				value = 0;
			}
		}
		
		return value;
	}

	/// #endregion

	/// #region 位置

	var rBody = /^(?:body|html)$/i,
	
		/**
		 * 表示一个点。
		 * @class Point
		 */
		Point = namespace(".Point", p.Class({
	
			/**
			 * 初始化 Point 的实例。
			 * @param {Number} x X 坐标。
			 * @param {Number} y Y 坐标。
			 * @constructor Point
			 */
			constructor: function(x, y) {
				this.x = x;
				this.y = y;
			},
	
			/**
			 * 将 (x, y) 增值。
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
			 * 将一个点坐标减到当前值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			minus: function(p) {
	
				assert(p && 'x' in p && 'y' in p, "Point.prototype.minus(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
				this.x -= p.x;
				this.y -= p.y;
				return this;
			},
	
			/**
			 * 复制当前对象。
			 * @return {Point} 坐标。
			 */
			clone: function() {
				return new Point(this.x, this.y);
			}
	
		})),
	
		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getWindowScroll = 'pageXOffset' in w ? function() {
			var win = this.defaultView;
			return new Point(win.pageXOffset, win.pageYOffset);
		} : getScroll;

	//   来自  Mootools (MIT license)
	/**
	 * @class Element
	 */

	apply(e, {

		/**
		 * 设置一个元素可拖动。
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
		 * @return {Point} 位置。
		 */
		getScrollSize: function() {
			var me = this.dom || this;

			return new Point(me.scrollWidth, me.scrollHeight);
		},

		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var me = this.dom || this;

			return new Point(me.offsetWidth, me.offsetHeight);
		},

		/**
		 * 获取元素可视区域大小。包括 margin 大小。
		 * @return {Point} 位置。
		 */
		getOuterSize: function() {
			var me = this.dom || this;
			return this.getSize().add(e.getSizes(me, 'x', 'm'), e.getSizes(me, 'y', 'm'));
		},

		/**
		 * 获取元素的相对位置。
		 * @return {Point} 位置。
		 */
		getOffset: function() {

			// 如果设置过 left top ，这是非常轻松的事。
			var me = this.dom || this,
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
		 * @return {Point} 位置。
		 */
		getWidth: function() {
			return styleNumber(this.dom || this, 'width');
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
		getHeight: function() {
			return styleNumber(this.dom || this, 'height');
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll: getScroll,

		/**
		 * 获取元素的上下左右大小。
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
		 * @return {Point} 位置。
		 */
		getPosition: div.getBoundingClientRect   ? function() {

			var me = this.dom || this,
				bound = me.getBoundingClientRect(),
				doc = getDoc(me),
				html = doc.dom,
				htmlScroll = checkPosition(me, 'fixed') ? {
					x:0,
					y:0
				} : doc.getScroll();

			return new Point(
				bound.left+ htmlScroll.x - html.clientLeft,
				bound.top + htmlScroll.y - html.clientTop
			    );
		} : function() {

			var me = this.dom || this,
				elem = me,
				p = getScrolls(elem);

			while (elem && !isBody(elem)) {
				p.add(elem.offsetLeft, elem.offsetTop);
				if (navigator.isFirefox) {
					if (nborderBox(elem)) {
						add(elem);
					}
					var parent = elem.parentNode;
					if (parent && styleString(parent, 'overflow') != 'visible') {
						add(parent);
					}
				} else if (elem != me && navigator.isSafari) {
					add(elem);
				}

				elem = elem.offsetParent;
			}
			if (navigator.isFirefox && nborderBox(me)) {
				p.add(-styleNumber(me, borderLeftWidth), -styleNumber(me, borderTopWidth));
			}
			
			function add(elem){
				p.add(styleNumber(elem, borderLeftWidth),  styleNumber(elem, borderTopWidth));
			}
			return p;
		},

		/**
		 * 获取包括滚动位置的位置。
		 * @param {Element/String/Boolean} relative 相对的节点。
		 * @return {Point} 位置。
		 */
		getOffsets: function( relative) {
			var pos, me = this.dom || this;
			if (isBody(me))
				return new Point(0, 0);
			pos = this.getPosition().minus(getScrolls(me));
			if(relative) {
				
				relative = relative.dom || p.$(relative);

				assert.isElement(relative, "Element.prototype.getOffsets(relative): 参数 {relative} ~。");

				pos.minus(relative.getOffsets()).add( -styleNumber(me, 'marginLeft') - styleNumber(relative, borderLeftWidth) ,-styleNumber(me, 'marginTop') - styleNumber(relative,  borderTopWidth) );
			}
			return pos;
		},

		/**
		 * 获取用于作为父元素的节点。
		 * @return {Element} 元素。
		 */
		getOffsetParent: function() {
			var me = this.dom || this, elem = me.offsetParent || getDoc(me).body;
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

			(this.dom || this).style.width = value > 0 ? value + 'px' : value <= 0 ? '0px' : '';
			return this;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Element} this
		 */
		setHeight: function(value) {

			(this.dom || this).style.height = value > 0 ? value + 'px' : value <= 0 ? '0px' : '';
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
			var me = this.dom || this, p = getXY(x,y);

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

			assert(o.isObject(p) && 'x' in p && 'y' in p, "Element.prototype.setOffset(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
			var s = (this.dom || this).style;
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

			e.setMovable(me.dom || me);

			return me.setOffset(offset);
		}

	} ,2);

	/**
	 * @namespace document
	 */
	apply(document, {

		/**
		 * 获取元素可视区域大小。包括 margin 和 border 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var doc = this.dom;

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
			var html = this.dom,
				min = this.getSize(),
				max = Math.max,
				body = this.body;


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

			this.defaultView.scrollTo(p.x, p.y);

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
	 * 获取一个元素滚动。
	 * @return {Point} 大小。
	 */
	function getScroll() {
		var doc = this.dom || this;
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
	 * 设置元素的宽或高。
	 * @param {Element/Control} me 元素。
	 * @param {String} fix 修正的边框。
	 * @param {Number} x 宽。
	 * @param {Number} y 宽。
	 */
	function setSize(elem, fix, x ,y) {
		var p = getXY(x,y);

		if(p.x != null)
			elem.setWidth(p.x - e.getSizes(elem.dom || elem, 'x', fix));

		if (p.y != null)
			elem.setHeight(p.y - e.getSizes(elem.dom || elem, 'y', fix));

		return elem;
	}

	/**
	 * 未使用盒子边框
	 * @param {Element} elem 元素。
	 * @return {Boolean} 是否使用。
	 */
	function nborderBox(elem) {
		return styleString(elem, 'MozBoxSizing') != 'border-box';
	}

	/**
	 * 转换参数为标准点。
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	function getXY(x, y) {
		return x && typeof x === 'object' ? x : {
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

	/// #endregion

	/// #region 节点

	/**
	 * 属性。
	 * @type RegExp
	 */
	var rAttr = /^\[\s*([^=]+?)(\s*=\s*(['"])([\s\S]*)\3)?\s*\]$/,
	
		/**
		 * @type Object
		 */
		childMap = 'firstElementChild' in div ?
			[walk, 'nextElementSibling', 'firstElementChild', 'parentNode', 'previousElementSibling', 'lastElementChild'] :
			[walk, 'nextSibling', 'firstChild', 'parentNode', 'previousSibling', 'lastChild'],
	
		/**
		 * 查找一个节点。
		 * @param {Element} elem 父节点。
		 * @param {undefined/String/Function} fn 查找函数。
		 * @param {Boolean} childOnly 是否只搜索相邻的节点。
		 * @return {Array/Element} 节点。
		 */
		find = 'all' in div ? function(elem, fn) { // 返回数组
			assert.isFunction(fn, "Element.prototype.find(elem, fn): 参数 {fn} ~。");
			return  ap.filter.call(elem.all, fn);
		} : function(elem, fn) {
			assert.isFunction(fn, "Element.prototype.find(elem, fn): 参数 {fn} ~。");
			if(!elem.firstChild) return [];
			var ds = [], doms = [elem], p, nx;
			while (doms.length) {
				p = doms.pop();
				nx = p.firstChild;
				do {
					if (nx.nodeType != 1)
						continue;
					if (fn(nx)) {
						ds.push(nx);
					}
	
					if(nx.firstChild)
						doms.push(nx);
				} while(nx = nx.nextSibling);
			}
	
			return ds;
		};

	/**
	 * @class Element
	 */
	
	apply(e, {
	
		/**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
		 * @static
		 */
		hasChild: !div.compareDocumentPosition ? function(elem, child) {
			assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
			assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
			while(child = child.parentNode) {
				if(elem === child)
					return true;
			}
			return false;
		} : function(elem, child) {
			assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
			assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
			return !!(elem.compareDocumentPosition(child) & 16);
		},

		/**
		 * 删除一个节点的所有子节点。
		 * @param {Element} elem 节点。
		 * @static
		 */
		empty: function (elem) {
			assert.isNode(elem, "Element.empty(elem): 参数 {elem} ~。");
			while(elem.lastChild)
				e.dispose(elem.lastChild);
		},

		/**
		 * 释放节点所有资源。
		 * @param {Element} elem 节点。
		 * @static
		 */
		dispose: function (elem) {
			assert.isNode(elem, "Element.dispose(elem): 参数 {elem} ~。");
			
			//删除事件
			if (elem.clearAttributes) {
				elem.clearAttributes();
			}

			p.IEvent.un.call(elem);
			
			if(elem.$data)
				elem.$data = null;

			e.empty(elem);

			elem.parentNode && elem.parentNode.removeChild(elem);

		},
	
		/**
		 * 特殊属性集合。
		 * @type Object
		 */
		properties: {
			INPUT: 'checked',
			OPTION: 'selected',
			TEXTAREA: 'value'
		},
		
		/**
		 * 用于 get 的名词对象。
		 * @type String
		 */
		nodeMaps: {
	
			// 全部子节点。
			children: [function(elem, fn) {
				return new p.ElementList(find(elem,  fn));
			}],
	
			// 上级节点。
			parent: [walk, childMap[3], childMap[3]],
	
			// 直接的子节点。
			child: [dir, childMap[1], childMap[2]],
	
			// 后面的节点。
			next: [walk, childMap[1]],
	
			// 前面的节点。
			previous: [walk, childMap[4], childMap[4]],
	
			// 第一个节点。
			first: childMap,
	
			// 最后的节点。
			last: [walk, childMap[4], childMap[5]],
	
			// 全部上级节点。
			parents: [dir, childMap[3]],
	
			// 前面的节点。
			previouses: [dir, childMap[4]],
	
			// 后面的节点。
			nexts: [dir, childMap[1]],
	
			// 奇数或偶数个。
			odd: [function(elem, fn) {
				return dir(elem, function() {
					return fn = fn === false;
				}, childMap[1], childMap[2]);
			}],
	
			// 兄弟节点。
			siblings: [function(elem, fn) {
				return dir(elem, function(node) {
					return node != elem && fn(elem);
				}, childMap[1], childMap[2]);
	
			}]
	
		}

	})

	.implementIf({

		/**
		 * 根据属性获得元素内容。
		 * @param {Strung} name 属性名。
		 * @param {Strung} value 属性值。
		 * @return {Array} 节点集合。
		 */
		getElementsByAttribute: function(name, value) {
			return find(this.dom || this, value === undefined ? function(elem){
				return !!e.getAttr(elem, name);
			} : function(elem) {

				// 或者属性值 == value 且 value 非空
				// 或者 value空， 属性值非空
				return e.getAttr(elem, name) === value;
			});

		},

		/// #ifdef SupportIE6

		/**
		 * 根据类名返回子节点。
		 * @param {Strung} className 类名。
		 * @return {Array} 节点集合。
		 */
		getElementsByClassName: function(className) {
			assert.isString(className, "Element.prototype.getElementsByClassName(classname): 参数 {classname} ~。");
			className = className.split(/\s/); 
			return find(this.dom || this, function(elem) {
				var i = className.length;
				while(i--) if(!e.hasClass(elem, className[i])) return false;
                return true;
			});

		},

		/// #else

		/// getElementsByClassName:  function(name) {
		/// 	return this.getElementsByClassName(name);
		/// },

		/// #endif

		// 使     p.ElementList 支持此函数
		
		/**
		 * 根据标签返回子节点。
		 * @param {Strung} name 类名。
		 * @return {Array} 节点集合。
		 */
		getElementsByTagName: function(name) {
			return this.getElementsByTagName(name);
		},

		/**
		 * 根据名字返回子节点。
		 * @param {Strung} classname 类名。
		 * @return {Array} 节点集合。
		 */
		getElementsByName: function(name) {
			return this.getElementsByAttribute('name', name);
		},

		/// #ifdef SupportIE6

		/**
		 * 执行一个简单的选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		findAll: div.querySelectorAll ? function(selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
			return new p.ElementList((this.dom || this).querySelectorAll(selecter));
		} : function(selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
			var current = new p.ElementList([this.dom || this]);
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
		 * @param {String} type 类型。
		 * @param {Function/Number} fn 过滤函数或索引或标签。
		 * @return {Element} 元素。
		 */
		get: function(type, fn) {

			// 如果 type 为函数， 表示 默认所有子节点。
			switch (typeof type) {
				case 'string':
					fn = fn ? getFilter(fn) : Function.returnTrue;
					break;
				case 'function':
					fn = type;
					type = 'children';
					break;
				case 'number':
					fn = getFilter(type);
					type = 'first';
			}

			var n = e.nodeMaps[type];
			assert(n, 'Element.prototype.get(type, fn): 函数不支持 {0}类型 的节点关联。', type);
			return n[0](this.dom || this, fn, n[1], n[2]);
		}

	}, 4)

	.implement({

		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function(child) {
			var me = this.dom || this;
			assert.isNode(me, "Element.prototype.contains(child): this.dom || this 返回的必须是 DOM 节点。");
			assert.notNull(child, "Element.prototype.contains(child):参数 {child} ~。");
			child = child.dom || child;
			return child == me || e.hasChild(me, child);
		},

		/**
		 * 判断一个节点是否有子节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		hasChild: function(child) {
			var me = this.dom || this;
			return child ? e.hasChild(me, child.dom || child) : me.firstChild !== null;
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
			return (this.dom || this).querySelector(selecter);
		} : function(selecter) {
			var current = this.dom || this;
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
		 * @return {Element} 元素。
		 */
		clone: function(copyDataAndEvent, contents, keepid) {

			assert.isNode(this.dom || this, "Element.prototype.clone(copyDataAndEvent, contents, keepid): this.dom || this 返回的必须是 DOM 节点。");

			var elem = this.dom || this,
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
			var me = this.dom || this;
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.dom || this 返回的必须是 DOM 节点。");
			assert.notNull(html, "Element.prototype.insert(html, swhere): 参数  {html} ~。");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): 参数  {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", swhere);
			if(typeof html === 'string')
				me.insertAdjacentHTML(swhere, html);
			else
				me.insertAdjacentElement(swhere, html.dom || html);
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

			var me = this.dom || this;

			assert.notNull(html, "Element.prototype.insert(html, swhere): 参数 {html} ~。");
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.dom || this 返回的必须是 DOM 节点。");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): 参数 {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", swhere);
			if (!html.nodeType) {
				html = html.dom || e.parse(html, getDoc(me));
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
					assert(arguments.length == 1 || !swhere || swhere == 'beforeEnd' || swhere == 'afterBegin', 'Element.prototype.insert(html, swhere): 参数 {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。', swhere);
					me.appendChild(html);
					break;
			}

			return html;
		},

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function(html) {
			var me = this;


			assert.notNull(html, "Element.prototype.append(html, escape): 参数 {html} ~。");

			if(!html.nodeType) {
				html = html.dom || e.parse(html, getDoc(me.dom || me));
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
			html.appendChild(this.dom || this);
			return html;
		},

		/**
		 * 将一个节点用另一个节点替换。
		 * @param {String} html 内容。
		 * @return {Element} 元素。
		 */
		replaceWith: function(html) {
			var me = this.dom || this;

			assert.notNull(html, "Element.prototype.replaceWith(html): 参数 {html} ~。");
			if (!html.nodeType) {
				html = html.dom || e.parse(html, getDoc(me));
			}


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

			assert(elem.appendChild, 'Element.prototype.renderTo(elem): 参数 {elem} ~ 必须是 DOM 节点或控件。');
			
			var me = this.dom || this;
			
			if (me.parentNode !== elem) {

				// 插入节点
				elem.appendChild(me);
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
			var me = this.dom || this;
			assert(!child || this.hasChild(child.dom || child), 'Element.prototype.remove(child): 参数 {child} 不是当前节点的子节点', child);
			child ? this.removeChild(child.dom || child) : ( me.parentNode && me.parentNode.removeChild(me) );
			return this;
		},

		/**
		 * 删除一个节点的所有子节点。
		 * @return {Element} this
		 */
		empty: function() {
			e.empty(this.dom || this);
			return this;
		},

		/**
		 * 释放节点所有资源。
		 * @method dispose
		 */
		dispose: function() {
			e.dispose(this.dom || this);
		}

	}, 2);

	/**
	 * @class
	 */

	/**
	 * 返回元素指定节点。
	 * @param {Element} elem 节点。
	 * @param {Number/Function/undefined/undefined} fn 过滤函数。
	 * @param {String} walk 路径。
	 * @param {String} first 第一个节点。
	 * @return {Element} 节点。
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
	 * @param {Function} fn 过滤函数。
	 * @param {String} walk 路径。
	 * @param {String} first 第一个节点。
	 * @return {ElementList} 集合。
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
		return new p.ElementList(es);
	}

	/**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} copyDataAndEvent=true 是否复制数据。
	 * @param {Boolean} keepid=false 是否留下ID。
	 * @return {Element} 元素。
	 */
	function clean(srcElem, destElem, copyDataAndEvent, keepid) {
		if (!keepid)
			destElem.removeAttribute('id');

		/// #ifdef SupportIE8

		if( destElem.mergeAttributes) {

			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			// 在 IE delete destElem.$data  出现异常。
			destElem.removeAttribute("$data");
			//if(srcElem.$data)
			//	destElem.$data = null;   // IE  将复制 node.$data


			if (srcElem.options) {
				o.update(srcElem.options, 'selected', destElem.options, true);
			}
		}

		/// #endif

		if (copyDataAndEvent) {
			p.cloneData(destElem, srcElem);
		}


		var prop = e.properties[srcElem.tagName];
		if (prop)
			destElem[prop] = srcElem[prop];
	}

	/**
	 * 执行简单的选择器。
	 * @param {Element} elem 元素。
	 * @param {String} selector 选择器。
	 * @return {Py.ElementList} 元素集合。
	 */
	function findBy(elem, selector) {
		switch(selector.charAt(0)) {
			case '.':
				elem = elem.getElementsByClassName(selector.replace(/\./g, ' '));
				break;
			case '[':
				var s = rAttr.exec(selector);
				assert(s && s[1], "Element.prototype.find(selector): 参数 {selector} 不是合法的选择器。 属性选择器如: [checked='checked']", selector);
				elem = elem.getElementsByAttribute(s[1], s[4]);
				break;
			default:
				elem = elem.getElementsByTagName(selector);
				break;
		}

		return elem;
	}

	/**
	 * 获取一个选择器。
	 * @param {Number/Function/String} fn
	 * @return {Funtion} 函数。
	 */
	function getFilter(fn) {
		var t;
		switch(typeof fn){
			case 'number':
				t = fn;
				fn = function(elem) {
					return --t < 0;
				};
				break;
			case 'string':
				t = fn.toUpperCase();
				fn = function(elem) {
					return elem.tagName === t;
				};
		}
		
		assert.isFunction(fn, "Element.prototype.get(type, fn): 参数 {fn} 必须是一个函数、数字或字符串。", fn);
		return fn;
	}
	/// #endregion

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
namespace("System.Dom.Element");

//===========================================
//  特效的基类     C
//===========================================


(function(p){
	
	
	/// #region interval
	
	var cache = {}, emptyFn = Function.empty;
	
	/**
	 * 定时执行的函数。
	 */
	function interval(){
		var i = this.length;
		while(--i >= 0)
			this[i].step();
	};
	
	/// #endregion
		
	/**
	 * @namespace Fx
	 */
	namespace(".Fx.", {
		
		/**
		 * 实现特效。
		 * @class Fx.Base
	 	 * @abstract
		 */
		Base: p.Class({
		
			/**
			 * 每秒的运行帧次。
			 * @type {Number}
			 */
			fps: 50,
			
			/**
			 * 总运行时间。 (单位:  毫秒)
			 * @type {Number}
			 */
			duration: 500,
			
			/**
			 * 在特效运行时，第二个特效的执行方式。 可以为 'ignore' 'cancel' 'wait' 'restart' 'replace'
			 * @type {String}
			 */
			link: 'ignore',
			
			/**
			 * xType
			 * @type {String}
			 */
			xType: 'fx',
			
			/**
			 * 初始化当前特效。
			 * @param {Object} options 选项。
			 */
			constructor: function() {
				this._competeListeners = [];
			},
			
			/**
			 * 实现变化。
			 * @param {Object} p 值。
			 * @return {Object} p 变化值。
			 */
			transition: function(p) {
				return -(Math.cos(Math.PI * p) - 1) / 2;
			},
			
			/**
			 * 当被子类重写时，实现生成当前变化所进行的初始状态。
			 * @param {Object} from 开始位置。
			 * @param {Object} to 结束位置。
			 * @return {Base} this
			 */
			compile: function(from, to) {
				var me = this;
				me.from = from;
				me.to = to;
				return me;
			},
			
			/**
			 * 进入变换的下步。
			 */
			step: function() {
				var me = this, time = Date.now() - me.time;
				if (time < me.duration) {
					me.set(me.transition(time / me.duration));
				}  else {
					me.set(1);
					me.complete();
				}
			},
			
			/**
			 * 根据指定变化量设置值。
			 * @param {Number} delta 变化量。 0 - 1 。
			 * @abstract
			 */
			set: Function.empty,
			
			/**
			 * 增加完成后的回调工具。
			 * @param {Function} fn 回调函数。
			 */
			onReady: function(fn){
				assert.isFunction(fn, "Fx.Base.prototype.onReady(fn): 参数 {fn} ~。");
				this._competeListeners.unshift(fn);	
				return this;
			},
			
			/**
			 * 检查当前的运行状态。
			 * @param {Object} from 开始位置。
			 * @param {Object} to 结束位置。
			 * @param {Number} duration=-1 变化的时间。
			 * @param {Function} [onStop] 停止回调。
			 * @param {Function} [onStart] 开始回调。
			 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
			 * @return {Boolean} 是否可发。
			 */
			check: function() {
				var me = this, args = arguments;
				
				//如正在运行。
				if(me.timer){
					switch (args[5] || me.link) {
						
						// 链式。
						case 'wait':
							this._competeListeners.unshift(function() {
								
								this.start.apply(this, args);
								return false;
							});
							
							//  如当前fx完成， 会执行 _competeListeners 。
							
							//  [新任务开始2, 新任务开始1]
							
							//  [新任务开始2, 回调函数] 
							
							//  [新任务开始2]
							
							//  []
							
							return false;
							
						case 'restart':
							me.pause();
							while(me._competeListeners.pop());
							break;
							
						// 停掉目前项。
						case 'cancel':
							me.stop();
							break;
							
						case 'replace':
							me.pause();
							break;
							
						// 忽视新项。
						default:
							return false;
					}
				}
				
				return true;
			},
			
			/**
			 * 开始运行特效。
			 * @param {Object} from 开始位置。
			 * @param {Object} to 结束位置。
			 * @param {Number} duration=-1 变化的时间。
			 * @param {Function} [onStop] 停止回调。
			 * @param {Function} [onStart] 开始回调。
			 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
			 * @return {Base} this
			 */
			start: function() {
				var me = this, args = arguments;
				if (me.check.apply(me, args)) {
					
					// 如果 duration > 0  更新。
					if (args[2] > 0) this.duration = args[2];
					
					// 如果有回调， 加入回调。
					if (args[3]) {
						assert.isFunction(args[3], "Fx.Base.prototype.start(from, to, duration, onStop, onStart, link): 参数 {callback} ~。");
						me._competeListeners.push(args[3]);
					}
					
					if (args[4] && args[4].apply(me, args) === false) {
						return me.complete();
					}
				
					// 设置时间
					me.time = 0;
					
					me.compile(args[0], args[1]).set(0);
					me.resume();
				}
				return me;
			},
			
			/**
			 * 完成当前效果。
			 */
			complete: function() {
				var me = this;
				me.pause();
				var handlers = me._competeListeners;
				while(handlers.length)  {
					if(handlers.pop().call(me) === false)
						return me;
				}
				
				return me;
			},
			
			/**
			 * 中断当前效果。
			 */
			stop: function() {
				var me = this;
				me.set(1);
				me.pause();
				return me;
			},
			
			/**
			 * 暂停当前效果。
			 */
			pause: function() {
				var me = this;
				if (me.timer) {
					me.time = Date.now() - me.time;
					var fps = me.fps, value = cache[fps];
					value.remove(me);
					if (value.length === 0) {
						clearInterval(me.timer);
						delete cache[fps];
					}
					me.timer = undefined;
				}
				return me;
			},
			
			/**
			 * 恢复当前效果。
			 */
			resume: function() {
				var me = this;
				if (!me.timer) {
					me.time = Date.now() - me.time;
					var fps = me.fps, value = cache[fps];
					if(value){
						value.push(me);
						me.timer = value[0].timer;
					}else{
						me.timer = setInterval(Function.bind(interval, cache[fps] = [me]), Math.round(1000 / fps ));
					}
				}
				return me;
			}
			
		}),
		
		/**
		 * 常用计算。
		 * @param {Object} from 开始。
		 * @param {Object} to 结束。
		 * @param {Object} delta 变化。
		 */
		compute: function(from, to, delta){
			return (to - from) * delta + from;
		}
	
	});
	

})(Py);
namespace("System.Fx.Base");

//===========================================
//  变换     C
//===========================================



using("System.Dom.Element");
using("System.Fx.Base");


(function(p){
	
	
	/// #region 字符串扩展
	
	/**
	 * 表示 十六进制颜色。
	 * @type RegExp
	 */
	var rhex = /^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})$/i,
	
		/**
		 * 表示 RGB 颜色。
		 * @type RegExp
		 */
		rRgb = /(\d+),\s*(\d+),\s*(\d+)/;
	
	/**
	 * @namespace String
	 */
	Object.extend(String, {
		
		/**
		 * 把十六进制颜色转为 RGB 数组。
		 * @param {String} hex 十六进制色。
		 * @return {Array} rgb RGB 数组。
		 */
		hexToArray: function(hex){
			assert.isString(hex, "String.hexToArray(hex): 参数 {hex} ~。");
			if(hex == 'transparent')
				return [255, 255, 255];
			var m = hex.match(rhex);
			if(!m)return null;
			var i = 0, r = [];
			while (++i <= 3) {
				var bit = m[i];
				r.push(parseInt(bit.length == 1 ? bit + bit : bit, 16));
			}
			return r;
		},
		
		/**
		 * 把 RGB 数组转为数组颜色。
		 * @param {Array} rgb RGB 数组。
		 * @return {Array} rgb RGB 数组。
		 */
		rgbToArray: function(rgb){
			assert.isString(rgb, "String.rgbToArray(rgb): 参数 {rgb} ~。");
			var m = rgb.match(rRgb);
			if(!m) return null;
			var i = 0, r = [];
			while (++i <= 3) {
				r.push(parseInt(m[i]));
			}
			return r;
		},
		
		/**
		 * 把 RGB 数组转为十六进制色。
		 * @param {Array} rgb RGB 数组。
		 * @return {String} hex 十六进制色。
		 */
		arrayToHex: function(rgb){
			assert.isArray(rgb, "String.arrayToHex(rgb): 参数 {rgb} ~。");
			var i = -1, r = [];
			while(++i < 3) {
				var bit = rgb[i].toString(16);
				r.push((bit.length == 1) ? '0' + bit : bit);
			}
			return '#' + r.join('');
		}
	});
	
	/// #endregion
	
	/**
	 * Element 简写。
	 * @type Element
	 */
	var e = Element,
	
		Fx = p.Fx,
		
		/**
		 * compute 简写。
		 * @param {Object} from 从。
		 * @param {Object} to 到。
		 * @param {Object} delta 变化。
		 * @return {Object} 结果。
		 */
		c = Fx.compute,
	
		/**
		 * @class Animate
		 * @extends Fx.Base
		 */
		pfe = namespace(".Fx.Animate", p.Fx.Base.extend({
			
			/**
			 * 当前绑定的节点。
			 * @type Element
			 * @protected
			 */
			dom: null,
			
			/**
			 * 当前的状态存储。
			 * @type Object
			 * @protected
			 */
			current: null,
			
			/**
			 * 链接方式。
			 * @type String
			 */
			link: "wait",
			
			/**
			 * 初始化当前特效。
			 * @param {Object} options 选项。
			 * @param {Object} key 键。
			 * @param {Number} duration 变化时间。
			 */
			constructor: function(dom){
				this.dom = dom;
				
				this._competeListeners = [];
			},
			
			/**
			 * 根据指定变化量设置值。
			 * @param {Number} delta 变化量。 0 - 1 。
			 * @override
			 */
			set: function(delta){
				var me = this,
					key,
					target = me.dom,
					value;
				for(key in me.current){
					value = me.current[key];
					value.parser.set(target, key, value.from, value.to, delta);
				}
			},
			
			/**
			 * 生成当前变化所进行的初始状态。
			 * @param {Object} from 开始。
			 * @param {Object} to 结束。
			 */
			compile: function(from, to){
				assert.notNull(from, "Fx.Animate.prototype.start(from, to, duration, callback, link): 参数 {from} ~。");
				assert.notNull(to, "Fx.Animate.prototype.start(from, to, duration, callback, link): 参数 {to} ~。");
					
				// 对每个设置属性
				var me = this, key, cache = pfe.cachedParsers;
				
				me.current = {};
				
				for (key in to) {
					
					var parsed = undefined, fromV = from[key], toV = to[key], parser = cache[key = key.toCamelCase()];
					
					// 已经编译过，直接使用
					if (!parser) {
							
						// 尝试使用每个转换器
						for (parser in pfe.parsers) {
							
							// 获取转换器
							parser = pfe.parsers[parser];
							parsed = parser.parse(toV, key);
							
							// 如果转换后结果合格，证明这个转换器符合此属性。
							if (parsed || parsed === 0) {
								me.dom = me.dom.dom || me.dom;
								// 指明值
								cache[key] = parser;
								break;
							}
						}
					}
					
					// 找到合适转换器
					if (parser) {
						me.current[key] = {
							from: parser.parse((fromV ? fromV === 'auto' : fromV !== 0) ? parser.get(me.dom, key) : fromV),
							to: parsed === undefined ? parser.parse(toV, key) : parsed,
							parser: parser
						};
						
						assert(me.current[key].from !== null && me.current[key].to !== null, "Animate.prototype.complie(from, to): 无法正确获取属性 {key} 的值({from} {to})。", key, me.current[key].from, me.current[key].to);
					}
					
				}
				
				return me;
			}
		
		}));
	
	pfe.cachedParsers = {
		opacity: {
			set: function(target, name, from, to, delta){
				target.setOpacity(c(from, to, delta));
			},
			parse: self,
			get: function(target){
				return target.getOpacity();
			}
		},
		
		scrollTop:{
			set: function (target, name, from, to, delta) {
				target.setScroll(null, c(from, to, delta));
			},
			parse: self,
			get: function(target){
				return target.getScroll().y;
			}
		},
		
		scrollLeft:{
			set: function (target, name, from, to, delta) {
				target.setScroll(c(from, to, delta));
			},
			parse: self,
			get: function(target){
				return target.getScroll().x;
			}
		}
		
	};
	
	pfe.parsers = {
		
		/**
		 * 数字。
		 */
		number: {
			set: !navigator.isStd ?  function(target, name, from, to, delta){
				try {
					
					// ie 对某些负属性内容报错
					target.style[name] = c(from, to, delta);
				}catch(e){}
			} : function(target, name, from, to, delta){
				
				target.style[name] = c(from, to, delta) + 'px';
			},
			parse: function(value){
				return typeof value == "number" ? value : parseFloat(value);
			},
			get: e.styleNumber
			
		},
		
		/**
		 * 颜色。
		 */
		color: {
			set: function set(target, name, from, to, delta){
				target.style[name] = String.arrayToHex([
					Math.round(c(from[0], to[0], delta)),
					Math.round(c(from[1], to[1], delta)),
					Math.round(c(from[2], to[2], delta))
				]);
			},
			parse: function(value){
				return String.hexToArray(value) ||
					String.rgbToArray(value);
			},
			get: e.getStyle
			
		}
		
	};
	
	function self(v){
		return v;
	}
	
	/// #region 元素
	
	var height = 'height marginTop paddingTop marginBottom paddingBottom',
		
		maps = pfe.maps = {
			all: height + ' opacity width',
			opacity: 'opacity',
			height: height,
			width: 'width marginLeft paddingLeft marginRight paddingRight'
		},
	
		ep = e.prototype,
		animate = ep.animate,
		show = ep.show,
		hide = ep.hide;
	
	Object.update(maps, function(value){
		return String.map(value, Function.from(0), {});
	});
	
	String.map('left right top bottom', Function.from({$slide: true}), maps);
	
	e.implement({
		
		/**
		 * 获取和当前节点有关的 Animate 实例。
		 * @return {Animate} 一个 Animate 的实例。
		 */
		fx: function(){
			return p.getData(this, 'fx') || p.setData(this, 'fx', new p.Fx.Animate(this));
		}
		
	})	
	
	.implement({
		
		/**
		 * 变化到某值。
		 * @param {String/Object} [name] 变化的名字或变化的末值或变化的初值。
		 * @param {Object} value 变化的值或变化的末值。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [onStop] 停止回调。
		 * @param {Function} [onStart] 开始回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
		 * @return this
		 */
		animate: function(){
			var args = arguments, value = args[1];
			if(typeof args[0] === 'string'){
				(args[1] = {})[args[0]] = value;
				args[0] = {};
			} else if(typeof value !== 'object'){
				Array.prototype.unshift.call(args, {});
			}
			
			if (args[2] !== 0) {
				value = this.fx();
				value.start.apply(value, args);
			} else {
				animate.apply(this, args);
			}
			
			return this;
		},
		
		/**
		 * 显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack, type){
			var me = this;
			if (duration) {
				var dom = me.dom || me, savedStyle = {};
		       
				me.fx().start(getAnimate(dom, type),  {}, duration, function(){
					Element.setStyles(dom, savedStyle);
					
					if(callBack)
						callBack.call(me, true);
				}, function(from, to){
					if(!me.isHidden())
						return false;
					e.show(dom);
					
					if(from.$slide){
						initSlide(from, dom, type, savedStyle);
					} else {
						savedStyle.overflow = dom.style.overflow;
						dom.style.overflow = 'hidden';
					}
					
					for(var style in from){
						savedStyle[style] = dom.style[style];
						to[style] = e.styleNumber(dom, style);
					}
				});
			} else {
				show.apply(me, arguments);
			}
			return me;
		},
		
		/**
		 * 隐藏当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function(duration, callBack, type){
			var me = this;
			if (duration) {
				var  dom = me.dom || me, savedStyle = {};
				me.fx().start({}, getAnimate(dom, type), duration, function(){  
					e.hide(dom);
					e.setStyles(dom, savedStyle);
					if(callBack)
						callBack.call(me, false);
				}, function (from, to) {
					if(me.isHidden())
						return false;
					if(to.$slide) {
						initSlide(to, dom, type, savedStyle);
					} else {
						savedStyle.overflow = dom.style.overflow;
						dom.style.overflow = 'hidden';
					}
					for(var style in to){
						savedStyle[style] = dom.style[style];
					}
				});
			}else{
				hide.apply(me, arguments);
			}
			return this;
		},
	
		/**
		 * 高亮元素。
		 * @param {String} color 颜色。
		 * @param {Function} [callBack] 回调。
		 * @param {Number} duration=500 时间。
		 * @return this
		 */
		highlight: function(color, duration, callBack){
			assert(!color || Object.isArray(color) || rhex.test(color) || rRgb.test(color), "Element.prototype.highlight(color, duration, callBack): 参数 {color} 不是合法的颜色。", color);
			assert(!callBack || Object.isFunction(callBack), "Element.prototype.highlight(color, duration, callBack): 参数 {callBack} 不是可执行的函数。", callBack);
			var from = {},
				to = {
					backgroundColor: color || '#ffff88'
				};
			
			duration /= 2;
			
			this.fx().start(from, to, duration, null, function (from) {
				from.backgroundColor = e.getStyle(this.dom.dom || this.dom, 'backgroundColor');
			}).start(to, from, duration, callBack);
			return this;
		}
	}, 2);
	
	/**
	 * 获取变换。
	 */
	function getAnimate(elem, type){
		return Object.extend({}, maps[type || 'all']);
	}
	
	/**
	 * 初始化滑动变换。
	 */
	function initSlide(animate, dom, type, savedStyle){
		delete animate.$slide;
		dom.parentNode.style.overflow = 'hidden';
		var margin = 'margin' + type.charAt(0).toUpperCase() + type.substr(1);
		if(/^(l|r)/.test(type)){
			animate[margin] = -dom.offsetWidth;
			var margin2 = type.length === 4 ? 'marginRight' : 'marginLeft';
			animate[margin2] = dom.offsetWidth;
			savedStyle[margin2] = dom.style[margin2];
		} else {
			animate[margin] = -dom.offsetHeight;
		}
		 savedStyle[margin] = dom.style[margin];
	}
	

	/// #endregion
	
})(Py);

namespace("System.Fx.Animate");

//===========================================
//  请求   ajax.js    C
//===========================================



/**
 * 处理异步请求的功能。
 * @class Ajax
 */
namespace(".Ajax", Py.Class({

	onAbort: function(){
		this.trigger("abort");
	},
	
	onStart: function(data){
		this.trigger("start", data);
	},
	
	onSuccess: function(response, xhr){
		this.trigger("success", response);
	},
	
	onError: function(e, xhr){
		this.trigger("error", e);
	},
	
	onTimeout: function(xhr){
		this.trigger("timeout");
	},
	
	onComplete: function(xhr, status){
		this.trigger("complete", xhr);
	},

	onStateChange: function(isTimeout){
		var me = this, xhr = me.xhr, status;
			
		if(xhr && (xhr.readyState === 4 || isTimeout)) {
			
		
			// 删除 readystatechange  。
			xhr.onreadystatechange = Function.empty;
			
			// 删除目前的活动对象。
			me.xhr = null;
			
			if(isTimeout === true){
				xhr.abort();
				me.onTimeout(xhr);
				status = 'Request Timeout';
			} else if(isTimeout) {
				status = 'error';
			} else {
				isTimeout = true;
			
				status = !XMLHttpRequest.isOk(xhr) && (xhr.statusText || 'error');
			}
			
			
			
			if (!status) {
				// xhr[/xml/.test(xhr.getResponseHeader('content-type')) ? 'responseXML' : 'responseText']
				me.onSuccess(xhr.responseText, xhr);
			} else {
				if(isTimeout === true) {
					isTimeout = new Error(status);
				}
				
				isTimeout.xhr = xhr;
				me.onError(isTimeout, xhr);
			}
			
			me.onComplete(xhr, status);
		
			xhr = null;
		}
	},

	/**
	 * 初始化当前请求。
	 * @param {Object} obj 配置对象。
	 * @constructor Ajax
	 */
	constructor: function(obj) {
		if (obj) Object.extend(this, obj);
	},
	
	/**
	 * 获取或设置请求类型。
	 */
	type: 'GET',
	
	/**
	 * 获取或设置是否为异步请求。
	 */
	async: true,
	
	/**
	 * 多个请求同时发生后的处理方法。 wait - 等待上个请求。 cancel - 中断上个请求。 ignore - 忽略新请求。
	 */
	link: 'wait',
	
	/**
	 * 获取请求头。
	 */
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
	},
	
	/**
	 * 获取或设置是否忽略缓存。
	 */
	disableCache: false,
	
	/**
	 * 发送请求前检查。
	 * @param {Object} data 数据。
	 * @return {Boolean} 是否可发。
	 */
	check: function(data) {
		var me = this;
		
		// 当前无请求， 可请求。
		if (!me.xhr) return true;
		switch (me.link) {
			case 'wait':
			
				// 在 complete 事件中处理下一个请求。
				me.one('complete', function() {
					this.send(data, true);
					return false;
				});
				return false;
			case 'cancel':
			
				// 中止请求。
				me.abort();
				return true;
			default:
				assert(!link || link == 'ignore', "Ajax.prototype.send(data): 成员 {link} 必须是 wait、cancel、ignore 之一。", me.link);
				return false;
		}
		return true;
	},
	
	/**
	 * 超时的时间大小。 (单位: 毫秒)
	 * @property timeouts
	 * @type Number
	 */
	 
	 /**
	  * 是否允许缓存。
	  * @property enableCache
	  * @type Boolean
	  */
	
	/**
	 * 发送请求。
	 */
	send: function(data) {
	
		assert.notNull(this.url, "Ajax.prototype.send(data, chain): {this.url} ~。", this.url);
		assert(/^(GET|POST|PUT)$/.test(this.type), "{this.type} 必须是 GET、PUT 或 POST (注意大小写) 。");
		
		
		/**
		 * 当前实例。
		 * @type Ajax
		 * @ignore
		 */
		var me = this,  
			
			/**
			 * 类型。
			 * @type String
			 */
			type = me.type,  
			
			/**
			 * 当前请求。
			 * @type String
			 */
			url = me.url,  
			
			/**
			 * 是否异步请求。
			 * @type Boolean
			 */
			async = me.async;
		
		if (!me.check(data)) {
			return me;
		}
		
		me.onStart(data);
		
		/// #region 数据
			
		// 改成字符串。
		if(typeof data !== 'string')
			data = String.param(data);
		
		// get  请求
		if (data && type == 'GET') {
			url += (url.indexOf('?') >= 0 ? '&' : '?') + data;
			data = null;
		}
		
		// 禁止缓存，为地址加上随机数。
		if(me.disableCache){
			url += (url.indexOf('?') >= 0 ? '&' : '?') + Py.id++;
		}
		
		/// #endregion
		
		/// #region 打开
		
		/**
		 * 请求对象。
		 * @type XMLHttpRequest
		 * @ignore
		 */
		var xhr = me.xhr = new XMLHttpRequest();
		
		try {
		
			if ('username' in me) 
				xhr.open(type, url, async, me.username, me.password);
			else xhr.open(type, url, async);
				
				
		} catch (e) {
		
			me.xhr = null;
			e.xhr = xhr;
			//  出现错误地址时  ie 在此产生异常
			me.onError(e, xhr);
			me.onComplete(xhr, "error");
			return me;
		}
		
		/// #endregion
		
		/// #region 设置文件头
		
		for(var key in me.headers)
			try {
				xhr.setRequestHeader(key, me.headers[key]);
			} catch (e){
				trace.error(e);
			}
		
		/// #endregion
		
		/// #region 发送
		
		// 监视 提交是否完成
		xhr.onreadystatechange = function(){
			me.onStateChange(false);
		};
		
		
		try {
			xhr.send(data);
		} catch (e) {
			me.onStateChange(e);
			return me;
		}
		
		// 不是同步时，火狐不会自动调用 onreadystatechange
		if (!async)
			me.onStateChange();
		else if (me.timeouts > 0) {
			setTimeout(function() {
				me.onStateChange(true);
			}, me.timeouts);
		}
		
		
		/// #endregion
		
		return me;
		
	},
	
	/**
	 * 设置地址的编码。
	 * @param {String} [value] 字符集。
	 * @return this
	 */
	setEncoding: function(value){
		
		if(value)
			this.setHeader("Accept-Charset", value);
		return this.setHeader('contentType', 'application/x-www-form-urlencoded' + (value ? '; charset=' + value : ''));

	},
	
	/**
	 * 设置请求头。
	 * @param {String} key 键。
	 * @param {String} text 值。
	 * @return this
	 */
	setHeader: function(key, text){
		if(!this.hasOwnProperty("header"))
			this.header = Object.clone(this.header);
		
		this.header[key] = text;
		
		return this;
	},
	
	/**
	 * 停止当前的请求。
	 * @return this
	 */
	abort: function() {
		if (this.xhr) {
			this.xhr.abort();
			this.onAbort();
			this.xhr = null;
		}
		
		return this;
	},
	
	/**
	 * xType。
	 */
	xType: "ajax"
	
}).addEvents());

String.map("get post", function(k) {
	
	var emptyFn = Function.empty;

	/**
	 * 快速请求一个地址。
	 * @param {String} url 地址。
	 * @param {String/Object} data 数据。
	 * @param {Function} [onsuccess] 成功回调函数。
	 * @param {Function} [onerror] 错误回调函数。
	 * @param {Object} timeouts=-1 超时时间， -1 表示不限。
	 * @param {Function} [ontimeout] 超时回调函数。
	 * @method Ajax.get
	 */
	
	/**
	 * 快速请求一个地址。
	 * @param {String} url 地址。
	 * @param {String/Object} data 数据。
	 * @param {Function} [onsuccess] 成功回调函数。
	 * @param {Function} [onerror] 错误回调函数。
	 * @param {Object} timeouts=-1 超时时间， -1 表示不限。
	 * @param {Function} [ontimeout] 超时回调函数。
	 * @method Ajax.post
	 */
	
	return function(url, data, onsuccess, onerror, timeouts, ontimeout) {
		assert.isString(url, "Ajax." + k + "(url, data, onsuccess, onerror, timeouts, ontimeout): 参数{url} 必须是一个地址。如果需要提交至本页，使用 location.href。");
		new Ajax({
			url: url,
			onSuccess: onsuccess || emptyFn,
			onError: onerror || emptyFn,
			timeouts: timeouts,
			onTimeout: ontimeout || emptyFn,
			type: k.toUpperCase()
		}).send(data);
	};
}, Ajax);



namespace("System.Ajax.Ajax");

