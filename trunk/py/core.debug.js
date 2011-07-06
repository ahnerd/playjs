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
	 * 如果使用了 UI 库，则 theme 表示默认主题。
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
			 * @property
			 * @static
			 * @type Object
			 * @private
			 * 所有类的事件信息存储在这个变量。使用 xType -> name的结构。
			 */
			Events: eventMgr, 
			
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
			 * 这个函数会在对象内生成一个 data 字段， 并生成一个 data.type 对象返回。
			 * 如果原先存在 data.type, 则直接返回。
			 * @example
			 * <code>
			 * var obj = {};
			 * if(Py.dataIf(obj, 'a')) // 如果存在 a 属性。 
			 *     trace(  Py.data(obj, 'a')  )
			 * </code>
			 */
			dataIf:function (obj, type) {
				
				assert.isObject(obj, "Py.dataIf(obj, type): 参数 {obj} ~。");
				
				// 获取变量。
				var d = obj.data;
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
				return (obj.data || (obj.data = {}))[type] = data;
			},
			
			/**
			 * 复制一个对象的数据到另一个对象。
			 * @static
			 * @param {Object} src 来源的对象。
			 * @param {Object} dest 目标的对象。
			 * @example
			 * <code>
			 * var obj = {}, obj2 = {};
			 * Py.cloneData(obj, obj2);    //     5
			 * </code>
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
			 * @param {Function} [callback] 对返回值的处理函数。
			 * @return {String} 载入的值。
			 * 因为同步，所以无法跨站。
			 * @example
			 * <code>
			 * trace(  Py.loadText('./v.html')  );
			 * </code>
			 */
			loadText: function(uri, callback) {
				
				assert.notNull(uri, "Py.loadText(uri, callback): 参数 {uri} ~。");
	
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
					
					uri = xmlHttp.responseText;
					
					// 运行处理函数。
					return callback ? callback(uri) : uri;
	
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
			 * @param {Boolean} quick=true 如果 true 那么这个类不解除成员对象的引用 。
			 * @return {Class} 生成的类。
			 * 创建一个类，相当于继承于 Py.Object创建。
			 * @see Py.Native.prototype.extend
			 * @example
			 * <code>
			 * var MyCls = Class({
			 * 
			 *    constructor: function(g, h){
			 * 	      alert('构造函数' + g + h)
			 *    }	
			 * 
			 * });
			 * 
			 * 
			 * var c = new MyCls(4, ' g');
			 * </code>
			 */
			Class: function (members, quick) {
					
				// 生成新类
				return p.Object.extend(members, quick);
			},
			
			/**
			 * 表示一个事件接口。
			 * @interface Py.IEvent
			 * @singleton
			 * Py.IEvent 提供了事件机制的基本接口，凡实行这个接口的类店都有事件的处理能力。
			 * 在调用  {@link Py.Native.prototype.addEvents} 的时候，将自动实现这个接口。
			 */
			IEvent: {
			
				/**
				 * 增加一个监听者。
				 * @param {String} type 监听名字。
				 * @param {Function} fn 调用函数。
				 * @return Object this
				 * @example
				 * <code>
				 * elem.on('click', function(e){
				 * 		return true;
				 * });
				 * </code>
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
				 * @example
				 * <code>
				 * elem.one('click', function(e){
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
				 * 注意: function(){} !== function(){}, 这意味着这个代码有问题:
				 * <code>
				 * elem.on('click', function(){});
				 * elem.un('click', function(){});
				 * </code>
				 * 你应该把函数保存起来。
				 * <code>
				 * var c =  function(){};
				 * elem.on('click', c);
				 * elem.un('click', c);
				 * </code>
				 * @example
				 * <code>
				 * elem.un('click', function(e){
				 * 		return true;
				 * });
				 * </code>
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
				 * trigger 只是手动触发绑定的事件。
				 * @example
				 * <code>
				 * elem.trigger('click');
				 * </code>
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
				 * @param {Object} ... 调用的参数数组。
				 * 这个函数等价  this.baseCall('constructor', arguments);
				 * @see Py.Object.prototype.baseCall
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
				 * @param {String} name 属性名。
				 * @param {Object} ... 调用的参数数组。
				 * @return {Object} 父类返回。
				 * 注意只能从子类中调用父类的同名成员。
				 * @example
				 * <code>
				 * 
				 * var MyBa = new Class({
				 *    a: function(g, b){
				 * 	    alert(g + b);
				 *    }
				 * });
				 * 
				 * var MyCls = MyBa.extend({
				 * 	  a: function(g, b){
				 * 	    this.baseCall('a', g, b);   // 或   this.baseCall('a', arguments);
				 *    }
				 * });
				 * 
				 * new MyCls().a();   
				 * </code>
				 */
				baseCall: function(name, args) {
					
					var me =  this.constructor.base,
					
						fn = this[name];
					
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
				 * @protected
				 * @example
				 * <code>
				 * var MyBa = new Class({
				 *    clone: function(){
				 * 	     return this.memberwiseClone();
				 *    }
				 * });
				 * </code>
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
			 * @static
			 * @param {String} name 名字空间。
			 * 有关名字空间的说明， 见 {@link Py.namespace} 。
			 * @example
			 * <code>
			 * using("System.Dom.Keys");
			 * </code>
			 */
			using: include,
			
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
			 * 名字空间用来快速表示资源。 {@link Py.using} 和  {@link Py.imports} 可以根据制定的名字空间载入相应的内容。
			 * </p>
			 * 
			 * <p>
			 * namespace 函数有多个重载， 如果只有1个参数:
			 * <code>
			 * namespace("System.Dom.Keys"); 
			 * </code>
			 * 表示系统已经载入了这个名字空间的资源， using 和 import 将忽视这个资源的载入。
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
			
			/// #ifdef SupportUsing
			
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
			 * 有关名字空间的说明， 见 {@link Py.namespace} 。
			 * @example
			 * <code>
			 * imports("Resources.*.Text");
			 * </code>
			 */
			imports: function (resource, theme){
				
				assert(name && name.indexOf, "imports(resource, theme): 参数 {namespace} 不是合法的名字空间。", name);
				assert.isArray(theme, "imports(resource, theme): 参数 {theme} ~。");
		
				if(name.indexOf('*') > -1){
				 	(theme || [p.resource, p.theme]).forEach(function(value){
						include(name.replace('*', value), isStyle);
					});
				} else {
					include(resource, true);
				}
			},
			
			/// #endif
			
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
			 * Py.addEventListener.call(document, 'click', function(){
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
			 * Py.removeEventListener.call(document, 'click', function(){
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
			 * 由存在的类修改创建类。即为类添加一个 implement 和 implementIf 成员。
			 * @method
			 * @static
			 * @param {Function/Class} nativeClass 将创建的类。
			 * @seeAlso Py.Class
			 * @return {Class} 生成的类。
			 * @private
			 */
			Native: Native,
			
			/// #ifndef Framework
			
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
					
			/// #endif
	
			/**
			 * 默认的全局名字空间。
			 * @config {Object}
			 * @value window
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
			return makeArray.call(iterable, start);
		},
		
		/**
		 * 如果目标数组不存在值，则拷贝，否则忽略。
		 * @param {Array} src 来源数组。
		 * @param {Array} dest 目标数组。
		 * @example
		 * <code>
		 * Array.copyIf([4,6], [4, 7]); // [4, 7, 6]
		 * </code>
		 */
		copyIf: function(src, dest){
			
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
		 * 注意，未来 Function.prototype.bind 是系统函数， 因此这个函数将在那个时候被 替换掉。
		 * @example
		 * <code>
		 * Function.bind(function(){return this}, 0)()    ; // 0
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
		 * @example
		 * <code>
		 * String.ellipsis("123", 2); //   '1...'
		 * </code>
		 */
		ellipsis: function(value, len){
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
			 * 输出的格式比如 6.0
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
		 * [1, 7, 2].filter(function(key){return key &lt; 5 })   [1, 2]
		 * </code>
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
		 * @example
		 * <code>
		 * ["vhd"].invoke('charAt, [0]); //    ['v']
		 * </code>
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
		 * @config {String}
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
		 * @private
		 */
		setupWindow: function(){
			
			/// #region 变量
			
			/// #ifdef SupportGlobalObject
		
			// 将以下成员赋予 window ，这些成员是全局成员。
			String.map('Class using imports namespace undefined', p, w, true);
			
			/// #endif
		
			
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
	 * @return {Class} 生成的类。
	 */
	function Native(nativeClass) {
		
		// 简单拷贝  Native.prototype 的成员，即拥有类的特性。
		// 在 JavaScript， 一切函数都可作为类，故此函数存在。
		// Native.prototype 的成员一般对当前类构造函数原型辅助。
		return applyIf(nativeClass, np);
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
	function include(name, isStyle){
		
		assert(name && name.indexOf, "using(namespace): 参数 {namespace} 不是合法的名字空间。", name);
		
		// 已经载入。
		if(p.namespaces.include(name))
			return;
		
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




Py.namespace("System.Dom.Element");



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
			
		/// #ifdef SupportIE6

		/**
	     * 根据一个 id 或 对象获取节点。
	     * @param {String/Element} id 对象的 id 或对象。
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
			
	        if (!w.Element) w.Element = e;
			
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
	 * @class Element
	 * @implements Py.IEvent
	 */
	
    /**
     * 节点集合。
     * @class ElementList
     * @extends Element
     */
    p.namespace(".ElementList", p.Class({
	
		xType: "elementlist",

        /**
         * 初始化 ElementList  实例。
         * @param {Array/ElementList} doms 节点集合。
         * @constructor ElementList
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
	 * @class Element
	 * @implements Py.IEvent
	 */
	apply(e,  {
		 
	    /**
	     * 转换一个HTML字符串到节点。
	     * @param {String/Element} html 字符。
	     * @param {Document} context 内容。
	     * @param {Boolean} cachable=true 是否缓存。
	     * @return {Element} 元素。
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
						
					} else div.innerHTML = h;
					
					// 一般使用最好的节点， 如果存在最后的节点，使用父节点。
					div = div.firstChild;
					
					// 如果有多节点，则复制到片段对象。
					if(div.nextSibling){
						var fragment = context.createDocumentFragment();
						
						var newS = div.nextSibling;
						while(newS){
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
		implementListeners: [function(obj, listType, copyIf){
			
			Object.each(obj, function(value, key){
				
				var value = obj[key];
					
				//  复制到  Element.prototype
				if(!copyIf || !(key in ep))
					ep[key] = value;
					
				//  复制到 Document
				if (!(key in document))
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
		
	});
	
	/**
	 * @namespace document
	 */
	apply(document, {
	   
		/**
		* 生成一个层。
		* @param {String} className 类。
		* @return {Element} 节点。
		*/
		createDiv: function(className){
			
			return document.create("div", className);
		},
		
		/**
		 * 创建一个节点。
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
		getDom: navigator.isQuirks ? function(){
				
			// 这里直接使用 documentElement ，故不支持 QUIRKS ，如果 html = wd.body 则为 QUIRKS 模式。
			return p.$(this.documentElement);
		} : function(){
			
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
	
	/**
	 * @class Element
	 */
	e.implementIf({
	
		/**
		 * 获取节点本身。
		 * @return {Element}
		 */
		getDom: function(){
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
		 * 事件初始化。
		 * @return {Function} 启用当前事件的函数。
		 */
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
	
		/**
		 * 创建当前事件可用的参数。
		 * @param {Event} e 事件参数。
		 * @param {Object} target 事件目标。
		 * @return {Event} e 事件参数。
		 */
		createEvent: function(e, target){
			assert(!e || ( e.stopPropagation && e.preventDefault), "IEvent.trigger(e): 参数 e 必须有成员 stopPropagation 和 preventDefault ，可使用类型 Py.Event 代替。");
			return e || new p.Event(target);
		},
		
		/**
		 * 事件触发后对参数进行处理。
		 * @param {Event} e 事件参数。
		 */
		trigger: emptyFn,
	
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
	 * @return {Function} Py.defineDomEvents
	 */
	e.defineEvents = function(events, baseEvent, trigger, add, remove, createEvent) {
			
		var ee = p.Events.element;
		
		// 删除已经创建的事件。
		delete ee[events];
		
		// 对每个事件执行定义。
		String.map(events, Function.from(o.extendIf({
			
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
			
			createEvent: createEvent,
			
			remove: remove === true ?  function(elem, type, fn) {
				elem.addEventListener(baseEvent, this.delegate, false);
			} : remove || baseEvent && function(elem, type, fn) {
				elem.removeEventListener(baseEvent, fn, false);
			}
			
		}, ee.$default)), ee);
		
		// 方便继续使用本函数，如果重命名，返回事件对象，否则返回此函数。
		return baseEvent ? ee[events] : arguments.callee;
	};
	
	
	/**
	 * 表示事件的参数。
	 * @class Event
	 */	
	
	var pep = p.namespace(".Event", Class({
			
		/**
		 * 构造函数。
		 * @param {Object} target
		 * @constructor
		 */
		constructor: function(target){
			 this.target = target;
		},

		/**
		 * 阻止冒泡。
		 */
		stopPropagation : function() {
			this.cancelBubble = true;
		},
		
		/**
		 * 停止默认。
		 */
		preventDefault : function() {
			this.returnValue = false;
		}
		
	})).prototype,
	
	/**
	 * @class
	 */
		
		/**
		 * Event
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
		
	/// #ifdef SupportIE6

    if (navigator.isStd) {
		
	/// #endif

        mc = kc = c = function(e) {
			
			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

            //重写  preventDefault
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
			//  1 ： 单击  2 ：  中键点击 3 ： 右击
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
		getSize: defaultView ? function (elem, type, names) {
			
			assert.isElement(elem, "Element.getSize(elem, type, names): 参数 {elem} ~。");
			assert(type in styleMaps, "Element.getSize(elem, type, names): 参数 {type} 必须是 \"width\" 或 \"height\"。", type);
			assert.isString(names, "Element.getSize(elem, type, names): 参数 {names} ~。");
			
			
			var value = 0, map = styleMaps[type], i = names.length, val, currentStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(currentStyle[val[0]]) || 0) + (parseFloat(currentStyle[val[1]]) || 0);
			}
			
			return value;
		} : function (elem, type, names) {
			
			
			assert.isElement(elem, "Element.getSize(elem, type, names): 参数 {elem} ~。");
			assert(type in styleMaps, "Element.getSize(elem, type, names): 参数 {type} 必须是 \"width\" 或 \"height\"。", type);
			assert.isString(names, "Element.getSize(elem, type, names): 参数 {names} ~。");
			
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
		getAttr: function(elem, name){
			
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
		hasClass: function(elem, className){
			assert.isNode(elem, "Element.hasClass(elem, className): 参数 {elem} ~。");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		}
		
	});
	
	
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
		getHtml: function(){
			
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
	
	.implement( {
		
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
		setHtml: function(value){
			
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
		 * @param {String} value 变化的值。可以为 height opacity width all size position left top right bottom。
		 * @param {Function} [callBack] 回调。
		 * @param {Number} duration=500 时间。
		 * @param {String} [type] 类型。
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
	 * @namespace document
	 */
	apply(document, {
		
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
	
	e.implement( {
		
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
		getWidth: function(){
			
			assert.isElement(this.getDom(), "Element.prototype.getWidth(): {this.getDom()} 必须返回 DOM 节点。");
			var me = this.getDom(), width = parseFloat(me.style.width);
			return isNaN(width) ? styleNumber(me, 'width') : width;
		},
	
        /**
		 * 获取元素自身大小（不带滚动条）。
		 * @method getWidth
		 * @return {Point} 位置。
		 */
		getHeight: function(){
			
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
		 * @method getOffsets
         * @param {Element/String/Boolean} relative 相对的节点。
         * @return {Point} 位置。
         */
        getOffsets: function( relative) {
			if (isBody(this.getDom())) return new Point(0, 0);
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
	
	.implement( {
		
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
		setOuterSize: function(x, y){
			return setSize(this, 'mpb', x, y);
		},
		
        /**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Element} this
		 */
		setWidth: function(value){
			
			assert.isElement(this.getDom(), "Element.prototype.setWidth(value): {this.getDom()} 必须返回 DOM 节点。");
			this.getDom().style.width = (value > 0 ? value : 0) + 'px';
			return this;
		},
	
        /**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Element} this
		 */
		setHeight: function(value){
			
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
	
	});
	
	/**
	 * @class
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
		
		hasChild: !div.compareDocumentPosition ? function(elem, child){
			while(child = child.parentNode){
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
		} : function(selecter){
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
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
			assert(n, 'Element.prototype.get(type, fn): 函数不支持 {0}类型 的节点关联。', type);
			return n[0](this.getDom(), fn, n[1], n[2]);
		}
		
	}, 4)
	
	.implement( {
		
		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @method contains
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function(child){
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
	
	.implement( {
		
		/// #ifdef SupportIE6
		
		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: div.querySelector ? function(selecter){
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
		 * @param {String} [swhere] 插入地点。 beforeBegin   节点外    beforeEnd   节点里    afterBegin    节点外  afterEnd     节点里
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
			
			if(!html.nodeType){
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
			while(html.lastChild) html = html.lastChild;
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
	
	.implement( {
			
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
	function clean(srcElem, destElem, copyDataAndEvent, keepid){
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
		
		assert.isFunction(fn, "getFilter(fn): {fn} 必须是一个函数。", fn);
		return fn;
	}
	
	/// #endif
	
	/// #region 核心
	
	/// #ifdef SupportIE6
	
	try{
		
		//  修复IE6 因 css 改变背景图出现的闪烁。
		document.execCommand("BackgroundImageCache", false, true);
	} catch(e) {
		
	}
	
	/// #endif
	
	div = null;
	
	/// #endregion

})(this);






Py.namespace("System.Ajax.Ajax");



//===========================================
//  请求   ajax.js    C
//===========================================



/**
 * 处理异步请求的功能。
 * @class Ajax
 */
Py.namespace(".Ajax", Py.Class({

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





Py.namespace("System.Fx.Base");



//===========================================
//  效果   base.js      C
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
	 * @namespace Py.Fx
	 */
	p.namespace(".Fx.", {
		
		/**
		 * 实现特效。
		 * @class Py.Fx.Base
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
			 * 在效果开始时执行
			 * @protected
			 */
			onStart: emptyFn,
			
			/**
			 * 在效果完成后执行
			 * @protected
			 */
			onComplete: emptyFn,
			
			/**
			 * 在效果停止后执行
			 * @protected
			 */
			onStop: emptyFn,
			
			/**
			 * 初始化当前特效。
			 * @param {Object} options 选项。
			 */
			constructor: function(options) {
				if(options)
					Object.extend(this, options);
					
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
			addOnComplete: function(fn){
				assert.isFunction(fn, "Fx.Base.prototype.addOnComplete(fn): 参数 {fn} ~。");
				this._competeListeners.unshift(fn);	
				return this;
			},
			
			/**
			 * 检查当前的运行状态。
			 * @param {Object} from 开始位置。
			 * @param {Object} to 结束位置。
			 * @param {Function} callback 回调。
			 * @param {String} link='ignore' 链接方式。 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
			 * @return {Boolean} 是否可发。
			 */
			check: function(from, to, duration, callback, link) {
				var me = this;
				
				//如正在运行。
				if(me.timer){
					switch (link || me.link) {
						
						// 链式。
						case 'wait':
							this._competeListeners.push(function() {
								
								this.start(from, to, duration, callback, true);
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
							assert(!link || link == 'ignore', "Fx.Base.prototype.start(from, to, duration, callback, link): 参数 {link} 必须是 wait、restart、cancel、replace、ignore 之一。", link);
							return false;
					}
				}
				
				// 如果 duration > 0  更新。
				if (duration > 0) this.duration = duration;
				else if(duration < -1) this.duration *= -duration;
				
				// 如果有回调， 加入回调。
				if (callback) {
					assert.isFunction(callback, "Fx.Base.prototype.start(from, to, duration, callback, link): 参数 {callback} ~。");
					this._competeListeners.unshift(callback);
				}
				
				return true;
			},
			
			/**
			 * 开始运行特效。
			 * @param {Object} from 开始位置。
			 * @param {Object} to 结束位置。
			 * @return {Base} this
			 */
			start: function() {
				var me = this, args = arguments;
				if (me.check.apply(me, args)) {
				
					// 设置时间
					me.time = 0;
					
					me.compile(args[0], args[1]).set(0);
					me.resume().onStart(args[4]);
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
				
				me.onComplete();
				return me;
			},
			
			/**
			 * 中断当前效果。
			 */
			stop: function() {
				var me = this;
				me.set(1);
				me.pause().onStop();
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



Py.namespace("System.Fx.Animate");




//===========================================
//  变换   animate.js      C
//===========================================



Py.using("System.Dom.Element");
Py.using("System.Fx.Base");


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
	var e = p.Element,
	
		Fx = p.Fx,
		
		/**
		 * compute 简写。
		 * @param {Object} from 从。
		 * @param {Object} to 到。
		 * @param {Object} delta 变化。
		 * @return {Object} 结果。
		 */
		c = Fx.compute,
		
		specialAttrSetter = function(current, elem, key, from, to){
			var cap = key.capitalize(), getter = function(target){
				return target['get' + cap]();
			};
			current[key] = {
				parser: cache[key] = {
					set: function(target, name, from, to, delta){
						target['set' + cap]({
							x: c(from.x, to.x, delta),
							y: c(from.y, to.y, delta)
						});
					},
					parse: self,
					get: getter
				},
				
				from:    from || getter(elem),
				
				to: to
			};
		},
		
		offsetAttrSetter =  function(current, elem, key, from, to){
			var p = elem['get' + e.specialAttr[key]](), offset = elem.getOffset();
			e.setMovable(elem);
			return delegateAttr(current, elem, 'left', 'top', from || p, to, p.x - offset.x, p.y - offset.y);
		},
		
		/**
		 * 特殊属性。
		 * @type Object
		 */
		specialAttr = {
			size: function(current, elem, key, from, to){
				return delegateAttr(current, elem, 'width', 'height', from || elem.getSize(), to, e.getSize(elem, 'width', 'pb'), e.getSize(elem, 'height', 'pb'));
			},
			position: offsetAttrSetter,
			offsets: offsetAttrSetter,
			offset: specialAttrSetter,
			scroll: specialAttrSetter
			
		},
		
		cache = { 
			opacity: {
				set: function(target, name, from, to, delta){
					target.setOpacity(c(from, to, delta));
				},
				parse: self,
				get: function(target){
					return target.getOpacity();
				}
			}
		},
	
		/**
		 * @class Py.Fx.Animate
		 * @extends Py.Fx.Base
		 */
		pfe = p.namespace(".Fx.Animate", p.Fx.Base.extend({
			
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
			 * 获取当前封装的节点。
			 * @return {Element} 返回节点。
			 */
			getDom: function(){
				return this.dom.getDom();
			},
			
			/**
			 * 初始化当前特效。
			 * @param {Object} options 选项。
			 * @param {Object} key 键。
			 * @param {Number} duration 变化时间。
			 */
			constructor: function(options){
				if (options) {
					if (options.nodeType)
						this.dom = p.$(options);
					else
						Object.extend(this, options);
				}
				 
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
				var me = this;
				
				// 对于每个键, 转换目前属性。
				parseStyle(me.current = {}, me.dom, from, to);
				
				return me;
			}
		
		}));
	
	pfe.specialAttr = specialAttr;
	
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

	function parseStyle(current, elem, from, to){
		
		for (var key in to) {
			
			var parsed = null, fromV = from[key], toV = to[key];
			
			key = key.toCamelCase();
		
			// 已经编译过，直接使用
			if (!(key in cache)) {
				
				// 特殊属性
				if (key in specialAttr) {
					parsed = specialAttr[key](current, elem, key, fromV, toV);
					if(parsed)
						parseStyle(current, elem, parsed[0], parsed[1]);
					continue;
					
				} else {
					
					// 尝试使用每个转换器
					for (var p in pfe.parsers) {
						
						// 获取转换器
						p = pfe.parsers[p];
						parsed = p.parse(toV, key);
						
						// 如果转换后结果合格，证明这个转换器符合此属性。
						if (parsed || parsed === 0) {
							// 指明值
							cache[key] = p;
							break;
						}
					}
				}
			}
			
			// 找到合适转换器
			if (parser = cache[key]) {
				current[key] = {
					from: parser.parse(fromV === undefined ? parser.get(elem, key) : fromV),
					to: parsed === null ? parser.parse(toV, key) : parsed,
					parser: parser
				};
				
				assert(current.from !== null && current.to !== null, "Animate.prototype.complie(from, to): 无法处理属性 {key} 的值。", key);
			}
			
		}
	}
	
	function delegateAttr(current, elem, key1, key2, from, to, deltaX, deltaY){
		var r = [{}, {}];
		r[0][key1] = from.x - deltaX;
		r[1][key1] = to.x - deltaX;
		r[0][key2] = from.y - deltaY;
		r[1][key2] = to.y - deltaY;
		
		return r;
	}
	
	function self(v){
		return v;
	}
	
	
	
	var maps = Fx.maps = {
			all: true,  // 加速搜索
			opacity: 'opacity',
			height: 'height marginTop paddingTop marginBottom paddingBottom',
			width: 'width marginLeft paddingLeft marginRight paddingRight'
		},
		
		getFx = Fx.getFx = function(elem){
			var d = Py.dataIf(elem, 'fx');
			if(!d){
				d = Py.dataIf(elem, 'fxcfg') || {};
				d.dom = elem.getDom();
				Py.setData(elem, 'fx', d = new Py.Fx.Animate(d));
			}
			return d;
		},
		
		getData = Fx.getData = function(elem, start){
			var from = p.data(elem, 'fxdata'), i, dom = elem.getDom();
			for(i in start){
				from[i] = styleNumber(dom, i);
			}
			return from;
		},
	
		ep = e.prototype,
		show = ep.show,
		animate = ep.animate,
		isHidden = e.isHidden,
		hide = ep.hide,
		styleNumber =  e.styleNumber;
	
	maps.all = [maps.opacity, maps.height, 'width'].join(' ');
	maps.size = [ maps.height, maps.width].join(' ');
	
	
	Object.update(maps, function(map){
		return Function.from(String.map(map, Function.from(0), {}));
	});
	
	String.map('left right top bottom', Function.from(function(elem, type){
		elem.parentNode.style.overflow = 'hidden';
		var r = {};
		if (/left|right/.test(type))
			r['margin-right'] = r['margin-left'] = elem.offsetWidth;
		else
			r['margin-top'] = r['margin-bottom'] = elem.offsetHeight;
		type = 'margin-' + type;
		r[type] = -r[type];
		return r;
	}), maps);
	
	function getStart(elem, type){
		var map = maps[type || 'all'];
		return typeof map == 'function' ? map(elem, type) : map;
	}
	
	e.implement({
		
		/**
		 * 变化到某值。
		 * @param {String/Object} [name] 变化的名字或变化的末值或变化的初值。
		 * @param {Object} value 变化的值或变化的末值。
		 * @param {Number} duration=-1 变化的时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} link='wait' 变化串联的方法。 可以为 wait, 等待当前队列完成。 restart 柔和转换为目前渐变。 cancel 强制关掉已有渐变。 ignore 忽视当前的效果。
		 * @return this
		 */
		animate: function(){
			var args = arguments, name = args[0], value = args[1];
			if(typeof name === 'string'){
				(args[1] = {})[name] = value;
				args[0] = {};
			} else if(typeof value !== 'object'){
				Array.prototype.unshift.call(args, {});
			}
			
			if (args[2] !== 0) {
				value = getFx(this);
				value.start.apply(value, args);
			} else
				animate.apply(this, args);
			
			return this;
		},
		
		/**
		 * 显示当前元素。
		 * @method show
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack, type){
			var me = this, dom = me.getDom();
			if (duration && isHidden(dom)) {
				var fx = getFx(me), from, to;
				if (!fx.timer) {
					dom.style.overflow = 'hidden';
					dom.style.display = '';
					from = getStart(me, type);
					to = p.dataIf(me, 'fxdata') || getData(me, from);
					fx.start(from, to, duration, callBack);
				}
			} else
				show.apply(me, arguments);
			return me;
		},
		
		/**
		 * 隐藏当前元素。
		 * @method hide
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function(duration, callBack, type){
			var me = this, dom = me.getDom();
			if (duration && !isHidden(dom)) {
				var fx = getFx(me), to;
				me.setStyle('overflow', 'hidden');
				if (!fx.timer) {
					to = getStart(me, type);
					fx.addOnComplete(hide).start(getData(me, to), to, duration, callBack);
				}
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
			var fx = getFx(this),
				from = {
					backgroundColor: e.getStyle(this, 'backgroundColor')
				},
				to = {
					backgroundColor: color || '#ffff88'
				};
			
			duration /= 2;
			
			if(!fx.timer)
				fx.start(from, to, duration).start(to, from, duration, callBack);
			return this;
		}
	}, 2);
	
})(Py);

