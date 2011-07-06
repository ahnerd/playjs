//===========================================
//  PyJs v0.4
//===========================================


//
// HtmlFive - 支持 IE10+ FF5+ Chrome12+ Opera12+ Safari6+ 。
// SupportIE9 - 支持 IE9+ FF4+ Chrome10+ Opera10+ Safari4+ 。
// SupportIE8  -   支持 IE8+ FF3+ Chrome10+ Opera10+ Safari4+ 。
// SupportIE6   -  支持 IE6+ FF3+ Chrome1+ Opera10+ Safari4+ 。
// Framework -  作为框架而非 UI 库使用。
// SupportUsing - 支持 namespace 等。
// Compact - 当前执行了打包操作。
// Zip - 当前执行了压缩操作。
// Format - 当前在格式化代码。
// SupportGlobalObject  -   污染全局对象。
// Debug - 启用调试， 启用调试将执行 assert 函数。




 
// 配置。可省略。

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
	
	/// #ifndef Framework
	
	/**
	 * 如果使用了 UI 库，则 theme 表示默认皮肤。
	 * @config {String}
	 * @value 'default'
	 */
	theme: 'default',
	
	/// #endif
	
	/**
	 * 启用控制台调试。
	 * @config {Boolean} 
	 * 如果不存在控制台，将自动调整为 false 。
	 */
	trace: true

};


//===========================================
//  核心   system.js  C
//  Copyright(c) 2009-2011 xuld
//===========================================

/**
 * @author xuld
 * @license MIT license
 * @copyright 2009-2011 xuld
 * @projectDescription Py.Core for Javascript
 */

(function(w) {
	
	/// #define PyJs
	
	/// #ifndef Debug
	/// #define trace.
	/// #define assert.
	/// #define assert(
	/// #define trace(
	/// #endif
	
	/// #if !defined(SupportIE9) && !defined(SupportIE8) && !defined(SupportIE6) && !defined(HtmlFive)
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
	/// #define using(
	/// #define Py.using(
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
		 * document 简写。
		 * @type Document
		 */
		document = w.document,
		
		/**
		 * nv 简写。
		 * @type Navigator
		 * @name navigator
		 */
		nv = w.navigator,
		
		/**
		 * Array.prototype  简写。
		 * @type Object
		 */
		arp = Array.prototype,
		
		/// #ifdef SupportIE8
	
		/**
		 * forEach 简写。
		 * @type Function
		 */
		forEach = arp.forEach || each,
		
		/// #else
		
		/// forEach = arp.forEach,
		
		/// #endif
	
		/**
		 * 复制产生数组。
		 * @type Function
		 */
		makeArray = arp.slice,
		
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
			}
			
		},
		
		/**
		 * Object  简写。
		 * @class Object
		 */
		o = apply(w.Object, {
	
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
			extend: (function(){
				for(var item in {toString: true})
					return apply;
				
				Py.enumerables = ["toString", "hasOwnProperty", "valueOf", "constructor", "isPrototypeOf"];
				// IE6  需要复制
				return function(dest, src){
					for(var i = Py.enumerables.length, value; i--;)
						if(hasOwnProperty.call(src, value = Py.enumerables[i]))
							dest[value] = src[value];
					return apply(dest, src);
				}
			})(),
	
			/**
			 * 在一个可迭代对象上遍历。
			 * @static
			 * @param {Array/Object} iterable 对象，不支持函数。
			 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
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
			 * 更新一个可迭代对象。
			 * @static
			 * @param {Array/Object} iterable 对象，不支持函数。
			 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Array} array 数组本身} {@return {Boolean} 如果中止循环， 返回 false。}
		 	 * @param {Object} bind=iterable 函数执行时的作用域。
			 * @param {Object/Boolean} [args] 参数/是否间接传递。
			 * @return {Object}  返回的对象。
			 * @example 
			 * 该函数支持多个功能。主要功能是将一个对象根据一个关系变成新的对象。
			 * 
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
			 * Object.isFunction(function(){}); // true
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
			 * document.setA = function(value){
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
					for(var key in config){
						
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
	
		}),
	
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
		 * @class Py.Native
		 */
		np = Native.prototype = {
		
			/**
			 * 扩展当前类的动态方法。
			 * @param {Object} obj 成员。
			 * @return this
			 * @seeAlso Py.Native.prototype.implementIf
			 * @example
			 * <code>
			 * Number.implement({
			 *   sin: function(){
			 * 	    return Math.sin(this);
			 *  }
			 * });
			 * 
			 * (1).sin();  //  Math.sin(1);
			 * </code>
			 */
			implement: function (obj) {
	
				assert(obj && this.prototype, "Native.prototype.implement(obj): 无法扩展类，因为 {obj} 或 this.prototype 为空。", obj);
				// 复制到原型
				o.extend(this.prototype, obj);
		        
				return this;
			},
			
			/**
			 * 如果不存在成员, 扩展当前类的动态方法。
			 * @param {Object} obj 成员。
			 * @return this
			 * @seeAlso Py.Native.prototype.implement
			 */
			implementIf: function(obj) {
			
				assert(obj && this.prototype, "Native.prototype.implementIf(obj): 无法扩展类，因为 {obj} 或 this.prototype 为空。", obj);
		
				applyIf(this.prototype, obj);
				
				return this;
			},
			
			/**
			 * 为当前类添加事件。
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
			 * addEvents 函数的参数是一个事件信息，格式如:  {click: { add: ..., remove: ..., trigger: ..., createEvent: ..., setup: ... } 。
			 * 其中 click 表示事件名。一般建议事件名是小写的。
			 * </p>
			 * 
			 * <p>
			 * 一个事件有多个相应，分别是: 绑定(add), 删除(remove), 触发(setup)， 创建事件参数(createEvent), 初始化事件参数(trigger)
			 * </p>
			 * 
			 * </p>
			 * 当用户使用   o.on('事件名', 函数)  时， 系统会判断这个事件是否已经绑定过，
			 * 如果之前未绑定事件，则会使用 setup() 返回新的函数 evtTrigger，
			 * evtTrigger.handlers 表示 当前这个事件的所有实际调用的函数的数组。 
			 * evtTrigger 本身将遍历并执行 evtTrigger.handlers 里的成员。
			 * 然后系统会调用 add(o, '事件名', evtTrigger)
			 * 然后把 evtTrigger 保存在 o.data.event['事件名'] 中。
			 * 如果 之前已经绑定了这个事件，则 evtTrigger 已存在，无需创建。
			 * 这时系统只需把 函数 放到 evtTrigger.handlers 即可。
			 * </p>
			 * 
			 * <p>
			 * 也就是说，真正的事件触发函数是 evtTrigger， evtTrigger去执行用户定义的一个事件全部函数。
			 * evtTrigger 是 setup() 返回的， 如果没有 setup， 系统自己生成一个，这个生成的 evtTrigger会触发所有的 evtTrigger.handlers, 如果其中一个函数执行后返回 false， 则中止执行，并返回 false， 否则返回 true。
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
			 * 如果事件有 createEvent， 则参数更新成 createEvent(参数, this) 的值。
			 * 使用这个函数执行 evtTrigger(参数)， 并返回  evtTrigger(参数) 的返回内容。
			 * 默认的 evtTrigger 内部会调用 trigger(参数) 对参数初始化。 默认的 trigger 是空函数。
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
			 * function add(elem, type, fn){
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
			 * trigger 的参数是一个事件参数，它只能有1个参数。
			 * </p>
			 * 
			 * <p>
			 * createEvent 和 setup 是高级的事件。参考上面的说明。 
			 * </p>
			 * 
			 * <p>
			 * 如果你不知道其中的几个参数功能，特别是 setup 和 createEvent ，请不要自定义。
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
			 * 			add:  function(elem, type, fn){
			 * 	   			alert("为  elem 绑定 事件 " + type );
			 * 			},
			 * 
			 * 			trigger: function(e){
			 * 	   			alert("初始化 事件参数  " + e );
			 * 			}
			 * 
			 * 		}
			 * 
			 * });
			 * 
			 * var m = new MyCls;
			 * m.on('click', function(){
			 * 	  alert(' 事件 触发 ');
			 * });
			 * 
			 * m.trigger('click', 2);
			 * 
			 * </code>
			 */
			addEvents: function (events) {
				
				var ep = this.prototype;
				
				assert(!events || o.isObject(events), "Py.Native.prototype.addEvents(events): 参数 {event} 必须是一个包含事件的对象。 如 {click: { add: ..., remove: ..., trigger: ..., createEvent: ..., setup: ... } ", events);
				
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
			 * @param {Object/Function} [methods] 成员或构造函数。
			 * @param {Boolean} quick=true 如果 true 那么这个类不解除成员对象的引用 。
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
			 * 这个函数实现的是 单继承。如果子类有定义构造函数，则仅调用子类的构造函数，否则调用父类的构造函数。
			 * </p>
			 * 
			 * <p>
			 * 要想在子类的构造函数调用父类的构造函数，可以使用  {@link Py.Object.prototype.base} 。
			 * </p>
			 * 
			 * <p>
			 * 这个函数返回的类实际是一个函数，但它被使用 Py.Native 修饰过。
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
		 	extend: function(members, quick) {
		
				// 未指定函数   使用默认构造函数(Object.prototype.constructor);
				
				var constructorDefined = hasOwnProperty.call(members =  members instanceof Function ? {
						constructor: members
					} : (members || {}), "constructor"),
				
					// 如果是快速模式且已经存在类构造函数，使用类的构造函数，否则，使用函数作为类。
					useDefinedConstructor = (quick = quick !== false) && constructorDefined,
				
					// 生成子类
					subClass = useDefinedConstructor ? members.constructor : function(){
						
						// 去除闭包
				 		var me = this, c = me.constructor;
				 		
						// 重写构造函数
						me.constructor = arguments.callee;
						
						// 重新调用构造函数
						c.apply(me, arguments);
						
					},
					
					// 基类( this )
					baseClass = this,
					
					// 强制复制构造函数。  FIX  6
					constructor = constructorDefined ? members.constructor : baseClass.prototype.constructor;
				
				// 代理类
				emptyFn.prototype = baseClass.prototype;
				
				// 指定成员
				Native(subClass).prototype = apply(new emptyFn, members);
				
				/// #ifdef SupportIE6
				
				// 强制复制构造函数。  FIX  6
				// 是否需复制成员。
				subClass.prototype.constructor = !useDefinedConstructor && !quick ?  function(){
						
						// 解除引用。
						o.update(this, o.clone);
						
						// 重新调用构造函数
						constructor.apply(this, arguments);
						
					} : constructor;
				
				/// #else
				
				/// if (!useDefinedConstructor) {
				///
				/// 	if(quick)
				///			subClass.cloneMembers = true;
				/// 
				///		// 强制复制构造函数。
				/// 	subClass.prototype.constructor = quick ?  function(){
				/// 			
				/// 		// 解除引用。
				/// 		o.update(this, o.clone);
				/// 			
				/// 		// 重新调用构造函数
				/// 		constructor.apply(this, arguments);
				/// 		
				/// 	} : constructorDefined ? members.constructor : baseClass.prototype.constructor;
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
		p = namespace('Py.', {
			
			/**
			 * 管理所有事件类型的工具。
			 * @property Events
			 * @type Object
			 */
			Events: eventMgr, 
			
			/**
			 * 获取属于一个元素的数据。
			 * @static
			 * @param {Object} obj 元素。
			 * @param {String} type 类型。
			 * @return {Object} 值。
			 */
			data: function (obj, type) {
				
				assert.isObject(obj, "Py.data(obj, type): 参数 {obj} ~。");
				
				// 创建或测试。
				var d = obj.data || (obj.data = {}) ;
				
				// 同样。
				return d[type] || (d[type] = {});
			},
		
			/**
			 * 如果存在，获取属于一个元素的数据。
			 * @static
			 * @param {Object} obj 元素。
			 * @param {String} type 类型。
			 * @return {Object} 值。
			 */
			dataIf:function (obj, type) {
				
				assert.isObject(obj, "Py.dataIf(obj, type): 参数 {obj} ~。");
				
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
				
				assert.isObject(obj, "Py.setData(obj, type): 参数 {obj} ~。");
				
				// 简单设置变量。
				return (obj.data || (obj.data = {}))[type] = data;
			},
			
			/**
			 * 复制一个对象的数据到另一个对象。
			 * @param {Object} src
			 * @param {Object} dest
			 */
			cloneData: function(src, dest){
				
				assert.isObject(src, "Py.cloneData(src, dest): 参数 {src} ~。");
				assert.isObject(dest, "Py.cloneData(src, dest): 参数 {dest} ~。");
				
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
			
			/// #ifdef SupportUsing
		
			/**
			 * 全部已载入的名字空间。
			 * @type Array
			 */
			namespaces: [],
			
			/**
			 * 异步载入样式。
			 * @param {String} uri 地址。
			 */
			loadStyle: function(url){
				document.getElementsByTagName("HEAD")[0].appendChild(apply(document.createElement('link'), {
					href: url,
					rel: 'stylesheet',
					type: 'text/css'
				}));
			},
			
			/**
			 * 同步载入文本。
			 * @param {String} uri 地址。
			 * @param {Function} callback 对返回值的处理函数。
			 * @return {String} 载入的值。
			 * @see Py.loadJs, Py.using
			 */
			loadText: function(uri, callback) {
	
				//     assert(w.location.protocol != "file:", "Py.loadText(uri, callback):  当前正使用 file 协议，请使用 http 协议。 \r\n请求地址: {0}",  uri);
				
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
						throw String.format("请求失败:  \r\n   地址: {0} \r\n   状态: {1}   {2}  {3}", uri, xmlHttp.status, xmlHttp.statusText, w.location.protocol == "file:" ? '\r\n原因: 当前正使用 file 协议打开文件，请使用 http 协议。' : '');
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
			
			/// #endif
	
			/**
			 * 全局运行一个函数。
			 * @method
			 * @param {String} statement 语句。
			 * @return {Object} 执行返回值。
			 */
			eval: w.execScript || function(statement) {
				
				// 如果正常浏览器，使用 window.eval
				return w.eval(statement);
			},
			
			/**
			 * 创建一个类。
			 * @method
			 * @param {Object/Function} methods 用于创建类的对象。/ 用于创建类的构造函数。
			 * @param {Boolean} quick=true 如果 true 那么这个类只能有1个实例，且不能复制，这会明显地提高创建类实例效率。
			 * @return {Class} 生成的类。
			 */
			Class: Class,
			
			/**
			 * 表示一个事件接口。
			 * @interface Py.IEvent
			 */
			IEvent: {
			
				/**
				 * 增加一个监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} fn 调用函数。
				 * @return Object this
				 */
				on: function(type, fn) {
					
					assert.isFunction(fn, 'IEvent.on(type, fn): 参数 {fn} ~。');
					
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
				 * @param {String} type 监听名字。
				 * @param {Function} fn 调用函数。
				 * @return Object this
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
				 */
				un: function (type, fn) {
					
					assert(!fn || o.isFunction(fn), 'IEvent.un(type, fn): 参数 {fn} 必须是可执行的函数或空参数。', fn);
					
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
				 * @param {String} type 监听名字。
				 * @param {Object/undefined} e 事件参数。
				 * @return Object this
				 */
				trigger: function (type, e) {
					
					// 获取本对象     本对象的数据内容   本事件值
					var me = this, evt = p.dataIf(me, 'event');
					    
					return (!evt || !(evt = evt[type]) || evt(evt.event.createEvent ? ( e = evt.event.createEvent(e, me)) : e)) && (!me[type = 'on' + type] || me[type](e) !== false);
					
				}
			},
			
			/**
			 * 所有类的基类。
			 * @class Py.Object
			 */
			Object: Native(Object).implement({
				
				/**
				 * 调用父类的构造函数。
				 * @return {Object} 父类返回。
				 */
				base: function() {
					
					var ctor = arguments.callee.caller;
					
					ctor.bubble = true;
					
					try {
					
						// 调用父类的函数。
						this.baseCall('constructor', arguments);
						
					} finally {
						
						delete ctor.bubble;
						
					}
				},
				
				/**
				 * 调用父类的成员变量。
				 * @param {Class} me 当前类。
				 * @param {Class} args 调用的参数数组。
				 * @param {String} name 属性名。
				 * @return {Object} 父类返回。
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
					assert(!me || me.prototype[name], "baseCall(name, args): 父类不存在 {name} 的属性或方法。", name);
					
					// 保证得到的是父类的成员。
					while(me && (fn = me.prototype[name]).bubble){
						me = me.base;
						assert(!me || me.prototype[name], "baseCall(name, args): 父类不存在 {name} 的属性或方法。", name);
					}
					
					fn.bubble = true;
					
					// 确保 bubble 记号被移除。
					try {
						if(args === arguments.callee.caller.arguments)
							return fn.apply(this, args);
						arguments[0] = this;
						return fn.call.apply(fn, arguments);
						//return fn.apply(this, args === arguments.callee.caller.arguments ? args : makeArray.call(arguments, 1));
					} finally {
						delete fn.bubble;
					}
				},
				
				/**
				 * 创建当前 Object 的浅表副本。
				 * @return {Object} 当前变量的副本。
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
			
			/// #ifdef SupportUsing
	
			/**
			 * 使用一个名空间。
			 * @method
			 * @param {String} name 名字空间。
			 */
			using: include,
			
			/// #endif
	
			/**
			 * 定义名字空间。
			 * @param {String} name 名字空间。
			 * @param {Object/Boolean} obj 值。
			 * @param {Object} value 如果 obj 为 true， value 指示复制的成员。
			 */
			namespace: namespace,
			
			/// #ifdef SupportUsing
			
			/**
			 * 导入一个名字空间的资源。
			 * @param {String} resource 资源地址。
			 * @param {Array} [theme] 主题。
			 */
			imports: function (resource, theme){
				include(resource, theme, true);
			},
			
			/// #endif
			
			/// #ifdef SupportIE8
								
			/**
			 * 绑定一个监听器。
			 * @param {Element} elem 元素。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 * @seeAlso Py.removeListener
			 */
			addEventListener: document.addEventListener ? function( type, fn) {
				this.addEventListener(type, fn, false);
			} : function(type, fn) {
				
				// IE8- 使用 attachEvent 。
				this.attachEvent('on' + type, fn);
			},
			
			/**
			 * 移除一个监听器。
			 * @param {Element} elem 元素。
			 * @param {String} type 类型。
			 * @param {Function} fn 函数。
			 * @seeAlso Py.addListener
			 */
			removeEventListener: document.removeEventListener ? function(type, fn) {
				this.removeEventListener(type, fn, false);
			} : function(type, fn) {
				
				// IE8- 使用 detachEvent 。
				this.detachEvent('on' + type, fn);
			},
			
			/// #endif
	
			/**
			 * 由存在的类修改创建类。即为类添加一个 implement 和 implementIf 成员。
			 * @method
			 * @param {Function/Class} nativeClass 将创建的类。
			 * @seeAlso Py.Class
			 * @return {Class} 生成的类。
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
			
			/// #ifndef Framework
			
			/**
			 * 主题。
			 * @type String
			 */
			theme: 'default',
			
			/// #endif
	
			/**
			 * 默认的全局名字空间。
			 */
			defaultNamespace: w
			
		});
	
	/// #endregion
		
	/// #region 全局函数

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
		 * 如果目标数组不存在值，则拷贝，否则忽略。
		 * @param {Array} src 来源数组。
		 * @param {Array} dest 目标数组。
		 */
		copyIf: function(src, dest){
			
			for(var i = 0; i < src.length; i++)
				dest.include(src[i]);
		},

		/**
		 * 把传入的值连接为新的数组。如果元素本身是数组，则合并。此函数会过滤以存在的值。
		 * @static
		 * @param {Object} ... 数据成员。
		 * @return {Array} 新数组。
		 */
		plain: function() {

			var r = [];
			
			// 对每个参数
			forEach.call(arguments, function(d) {
				
				
				// 如果数组，把内部元素压入r。
				if (d && typeof d.length === 'number') Array.copyIf(d, r);
				
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
		returnTrue: Object(true),

		/**
		 * 一个返回 false 的函数。
		 * @static
		 * @property
		 * @type Function
		 */
		returnFalse: Object(false),
		
		/**
		 * 绑定函数作用域。
		 * @static
		 * @param {Function} fn 函数。
		 * @param {Object} bind 位置。
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
		 * @type Function
		 * @hide
		 */
		from: Object
		
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
		 * @param {Object} object 数组或对象。
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
		 * @static
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
		 */
		param: function(obj){
			if(!obj) return "";
			var s = [], e = encodeURIComponent;
			o.each(obj, function( value, key ){
				s.push(e(key) + '=' + e(value));
			});
			return s.join('&').replace(rWhite, '+');
		},
	
		/**
		 * 把字符串转为指定长度。
		 * @param {String} value   字符串。
		 * @param {Number} len 需要的最大长度。
		 */
		ellipsis: function(value, len){
			assert.isString(value, "String.ellipsis(value, len): {value} ~。");
			return value.length > len ?  value.substr(0, len) + "..." : value;
		}
		
	});
	
	/**
	 * 日期。
	 * @class Date
	 */
	applyIf(Date, {
		
		/**
		 * 获取当前时间。
		 * @static
		 * @return {Number} 当前的时间点。
		 */
		now: function() {
			return +new Date();
		}
		
	});
	
	/// #endregion
	
	/// #region 浏览器

	/**
	 * 浏览器。
	 * @namespace navigator
	 */
	applyIf(nv, (function(ua) {

		//检查信息
		var match = ua.match(/(IE|Firefox|Chrome|Opera|Version).((\d+)\.?[\d.]*)/i) || ["", "Other", 0, 0],
			
			//浏览器名字
			browser = match[0] ? match[1] : !document.all && !nv.taintEnabled ? 'Safari' : match[0],
	
			//详细信息
			fullBrowser = browser + match[3];
		
		
		nv["is" + browser] = nv["is" + fullBrowser] = true;
		
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
			 */
			version: match[2],
			
			/// #ifdef SupportIE6
			
			/**
			 * 浏览器是否为标准事件。就目前浏览器状况， IE6，7 中 isQuirks = true  其它皆 false 。
			 * @type Boolean
			 * 此处认为 IE6,7 是怪癖的。
			 */
			isQuirks: typeof w.Element !== 'function' && String(w.Element) !== "[object Element]",
			
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

		//LOG : 添加更多的侦查。比如isWindows  isAir
	
	})(nv.userAgent));

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
	forEach.call([String, Array, Function, Date, Number], Native);
	
	/**
	 * @class String 
	 */
	String.implementIf({
		
		/**
	     * 转为骆驼格式。
	     * @param {String} value 内容。
	     * @return {String} 返回的内容。
	     */
		toCamelCase: function() {
	        return this.replace(rToCamelCase, toCamelCase);
	    },

		/// #ifdef SupportIE8

		/**
		 * 去除首尾空格。
		 * @return {String}    处理后的字符串。
		 */
		trim: function() {
			
			// 使用正则实现。
			return this.replace(rSpace, "");
		},
		
		/// #endif
		
		/**
		 * 将字符首字母大写。
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

		/// #ifdef SupportIE8

		/**
		 * 返回数组某个值的第一个位置。值没有,则为-1 。
		 * @param {Object} item 成员。
		 * @param {Number} start 开始查找的位置。
		 * @return Number 位置，找不到返回 -1 。 
		 * 现在大多数浏览器已含此函数.除了 IE8-  。
		 * @method
		 */
		indexOf: indexOf,
		
		/// #endif

		/**
		 * 返回数组是否包含一个值。
		 * @param {Object} item 成员。
		 * @return {Boolean} 存在返回 true 。
		 */
		contains: function(item) {
			
			// 检查判断 indexOf
			return this.indexOf(item) != -1;
		},

		/**
		 * 对数组运行一个函数。
		 * @param {Function} fn 函数.参数 value, index
		 * @param {Object} bind 对象。
		 * @return {Boolean} 有无执行完。
		 * @method
		 */
		each: each,

		/// #ifdef SupportIE8

		/**
		 * 对数组每个元素通过一个函数过滤。返回所有符合要求的元素的数组。
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
		 * 对数组内的所有变量执行函数，并可选设置作用域。
		 * @method
		 * @param {Function} fn 对每个变量调用的函数。 {@param {Object} value 当前变量的值} {@param {Number} key 当前变量的索引} {@param {Array} array 数组本身}
		 * @param {mixed} bind 函数执行时的作用域。
		 * */
		forEach: each,
		
		/// #endif
		
		/**
		 * 对数组每个元素查找一个函数返回true的项。 或按属性返回数组一个元素。
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
		 */
		invoke: function(fn, args){
			assert(args && typeof args.length === 'number', "Array.prototype.invoke(fn, args): 参数 {args} 必须是数组, 无法省略。")
			var r = [];
			forEach.call(this, o.isFunction(fn) ? function(value, index){
				r.push(fn.call(args, value, index));
			} : function(value){ 
				assert(value && o.isFunction(value[fn]), "Array.prototype.invoke(fn, args): {args} 内的 {value} 不包含可执行的函数 {fn}。", args, value, fn);
				r.push(value[fn].apply(value, args));
			});
			
			return r;
		},
		
		/**
		 * 删除数组中重复元素。
		 * @return {Array} 结果。
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
	
	if(!w.XMLHttpRequest || nv.isQuirks) {
		
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
		 * @type String
		 */
		rootPath: p.rootPath || (function(d) {
				
				
				/// HACK: this function fails in special environment
				
				var b = d.getElementsByTagName("script");
				
				// 当前脚本在 <script> 引用。最后一个脚本即当前执行的文件。
				b = b[b.length - 1];
						
				// IE6/7 使用  getAttribute
				b = nv.isQuirks ? b.getAttribute('src', 5) : b.src;
				return (b.match(/[\S\s]*\//) || [""])[0];
				
		}) (document),
		
		/**
		 * 初始化 window 对象。
		 * @param {Document} doc
		 */
		setupWindow: function(){
			
			/// #region 变量
			
			/// #ifdef SupportGlobalObject
		
			// 将以下成员赋予 window ，这些成员是全局成员。
			String.map('Class using imports namespace', p, w, true);
			
			/// #endif
			
			
			w.undefined = w.undefined;
			
			/// #endregion
			
			/// #region bindReady
			
			var document = w.document,
			
				doReady = function(){
					
					if(document.isReady)
						return;
						
					document.isReady = true;
					
					// 使用 document 删除事件。
					p.removeEventListener.call(document, eventName, doReady, false);
					
					// 调用所有函数。
					doReady.list.invoke('call', [document, p]);
					
					
					
					doReady = null;
					
				},
				
				doLoad = function(){
					document.isLoaded = true;
					p.removeEventListener.call(w, 'load', doLoad, false);
					
					doLoad.list.invoke('call', [w, p]);
					
					doLoad = null;
				},
				
				/// #ifdef SupportIE8
			
				eventName = nv.isStd ? 'DOMContentLoaded' : 'readystatechange';
			
				/// #else
				
				/// eventName = 'DOMContentLoaded';  
				
				/// #endif
		
			/**
			 * 页面加载时执行。
			 * @param {Functon/undefined} fn 执行的函数。
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
	
	p.setupWindow();

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
	 * 由存在的类修改创建类。即为类添加一个 implement 和 implementIf 成员。
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
			
	 /// #ifdef SupportUsing
	
	/**
	 * 同步载入一个脚本或样式表。
	 * @param {Strung} name
	 * @param {Object} theme
	 * @param {Object} isStyle
	 */
	function include(name, theme, isStyle){
		
		assert(name && name.indexOf, "using(namespace): 参数 {namespace} 不是合法的名字空间。", name);
		
		// 已经载入。
		if(p.namespaces.include(name))
			return;
			
		if(name.indexOf('*') > -1){
		 	return (theme || (isStyle ?['share', p.theme] : [])).forEach(function(value){
				include(name.replace('*', value), null, isStyle);
			});
		 }
		
		if(name.indexOf('/') == -1){
			name = name.toLowerCase().replace(rPoint, '/') + (isStyle ? '.css' : '.js');
		}
		 
		 var doms, check, callback;
		 
		 if(isStyle){
		 	callback = p.loadStyle;
			//  e = function (text){
				//     Py.addCss(text.replace(/url\s*\(\s*"?([^)]+)"?\s*\)/gi, "url(" + name + "../$1)"));
			//   };
		 	doms = document.styleSheets;
			src = 'href';
		 } else {
		 	callback = p.loadText;
		 	doms = document.getElementsByTagName("SCRIPT");
			src = 'src';

			/* this does not work in IE7/6
			e = function(text){
				var style = document.createElement('script');
				style.innerHTML = text;
				(document.getElementsByTagName('head')[0] || document).appendChild(style);
			};
			*/
			
			
		 }
		 
		 
		  o.each(doms, function(dom){
		 	return !dom[src] || dom[src].toLowerCase().indexOf(name) == -1;
		 }) && callback(p.rootPath + name, p.eval );
	}
			
	/// #endif
	
	
	
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
	function Object() {
		var v = arguments[0];
		return function() {
			return v;
		}
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
	 * 输出类的信息。
	 * @param {Object} 成员。
	 */
	api: function(obj){
		if(obj && obj.prototype) {
			for (var i in obj.prototype) {
				trace.dir(obj.prototype);
				return;
			}
		} else if(Object.isObject(obj)) {
			trace.dir(obj);
			return;
		} 
		
		  trace(obj);
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
	test: function(fn, times){
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
	if (!bValue && Py.debug) { // LOG : bValue === false 
	
		 var val = arguments;

		// 如果启用 [参数] 功能
		if (val.length > 2) {
			var i = 2;
			msg = msg.replace(/\{([\w$\.\(\)]*?)\}/g, function(s, x){
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

(function(){
	
	function  assertInternal(asserts, msg, value, dftMsg){
		return assert(asserts, msg ?  msg.replace('~', dftMsg) : dftMsg, value);
	}
	
	function assertInternal2(fn, dftMsg, args){
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
		isFunction: function(){
			return assertInternal2(Object.isFunction, "必须是可执行的函数", arguments);
		},
		
		/**
		 * 确认一个值为数组。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isArray: function(){
			return assertInternal2(Object.isArray, "必须是数组", arguments);
		},
		
		/**
		 * 确认一个值为函数变量。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isObject: function(value, msg){
			return assertInternal(Object.isObject(value) || Object.isFunction(value), msg, value,  "必须是引用的对象", arguments);
		},
		
		/**
		 * 确认一个值为数字。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNumber: function(value, msg){
			return assertInternal(typeof value == 'number' || value instanceof Number, msg, value, "必须是数字");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isNode: function(value, msg){
			return assertInternal(value && value.nodeType, msg, value, "必须是 DOM 节点");
		},
		
		/**
		 * 确认一个值为节点。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isElement: function(value, msg){
			return assertInternal(value && value.style, msg, value, "必须是 Element 对象");
		},
		
		/**
		 * 确认一个值是字符串。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isString: function(value, msg){
			return assertInternal(typeof value == 'string' || value instanceof String, msg, value, "必须是字符串");
		},
		
		/**
		 * 确认一个值是日期。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isDate: function(value, msg){
			return assertInternal(Object.type(value) == 'date' || value instanceof Date, msg, value, "必须是日期");
		},
		
		/**
		 * 确认一个值是正则表达式。
		 * @param {Object} bValue 值。
		 * @param {String} msg="断言失败" 错误后的提示。
		 * @return {Boolean} 返回 bValue 。
		 */
		isRegExp: function(value, msg){
			return assertInternal2(Object.type(value) == 'regexp' || value instanceof RegExp, msg, value, "必须是正则表达式");
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
	
	
	for(var fn in assert){ 
		assert[fn].debugStepThrough = true;
	}

	
})();

/// #endregion
/// #endif

//===========================================================
