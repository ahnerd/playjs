//===========================================
//  变换   animate.js      C
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
				return delegateAttr(current, elem, 'width', 'height', from || elem.getSize(), to, e.getSizes(elem, 'x', 'pb'), e.getSizes(elem, 'y', 'pb'));
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
					this.dom = this.dom.dom || this.dom;
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
				d.dom = elem;
				Py.setData(elem, 'fx', d = new Py.Fx.Animate(d));
			}
			return d;
		},
		
		getData = Fx.getData = function(elem, start){
			var from = p.data(elem, 'fxdata'), i, dom = elem.dom || elem;
			for(i in start){
				from[i] = styleNumber(dom, i);
			}
			return from;
		},
	
		ep = e.prototype,
		show = ep.show,
		animate = ep.animate,
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
			var me = this;
			if (duration && me.isHidden()) {
				var fx = getFx(me), from, to, style = (me.dom || me).style;
				if (!fx.timer) {
					style.overflow = 'hidden';
					style.display = '';
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
			var me = this;
			if (duration && !me.isHidden()) {
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
