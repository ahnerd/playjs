

(function(Py, w){
	
	Object.extend(w, {
	
		/**
		 * 返回属性。
		 * @param {String} name 属性名。
		 * @param {Function} fn 修改属性的调用函数。
		 * javascript 不都支持 get,set 。Attribute 用于提供类似的功能。
		 * LOG:  如果您不喜欢默认方式，可以更改此函数。
		 * 常见属性方法:
		 * attr(); -> get    attr(value);  -> set(默认)
		 * getAttr();  -> get    setAttr(value); -> set
		 * {get:fn -> get, set:fn -> set}
		 * 生成一个属性字段。
		 * <code>
		 * var Cup = new Class({
		 *
		 * 	_height : 6,
		 *
		 * 	height : Property("height",function(value){
		 * 		trace("原来height = {0}.现在height = {1}",this.height,value);
		 * 	})
		 *
		 * });
		 * var cup = new Cup();
		 * trace(cup.height()); //  输出 6
		 * cup.height(12);      //  输出 原来height = 6.现在height = 12
		 * trace(cup.height()); //  输出 12
		 * </code>
		 */
		Property: Property,
		
		/**
		 * 事件。
		 *  @param {String} name 名字。
		 *  @param {Boolean} bubbles 是否冒泡。
		 *  @param {Boolean} ostatic 是否静态。
		 *  @return {Function} 事件。
		 */
		EventField: EventField
	
	});
	
	Object.extend(Py.Class, {
		
		/**
		 * 返回属性。
		 * @param {String} name 属性名。
		 * @param {Function} fn 修改属性的调用函数。
		 * javascript 不都支持 get,set 。Attribute 用于提供类似的功能。
		 * LOG:  如果您不喜欢默认方式，可以更改此函数。
		 * 常见属性方法:
		 * attr(); -> get    attr(value);  -> set(默认)
		 * getAttr();  -> get    setAttr(value); -> set
		 * {get:fn -> get, set:fn -> set}
		 * 生成一个属性字段。
		 * <code>
		 * var Cup = new Class({
		 *
		 * 	_height : 6,
		 *
		 * 	height : Property("height",function(value){
		 * 		trace("原来height = {0}.现在height = {1}",this.height,value);
		 * 	})
		 *
		 * });
		 * var cup = new Cup();
		 * trace(cup.height()); //  输出 6
		 * cup.height(12);      //  输出 原来height = 6.现在height = 12
		 * trace(cup.height()); //  输出 12
		 * </code>
		 */
		Property: Property,
		
		/**
		 * 事件。
		 *  @param {String} name 名字。
		 *  @param {Boolean} bubbles 是否冒泡。
		 *  @param {Boolean} ostatic 是否静态。
		 *  @return {Function} 事件。
		 */
		EventField: EventField,
			
		/**
		 * 将一个对象解析成一个类的属性。
		 * @param {Object} obj 类实例。
		 * @param {Object} config 参数。
		 * @param {Array} filter 过滤。
		 * <code>
		 * var Cat = new Class({
		 *
		 * 	constructor : function(config){
		 * 		Class.extend(this, config);
		 * 	},
		 *
		 * 	height : Property("_height", function(value){trace.empty()})
		 *
		 * });
		 *
		 *
		 * var cat = new Cat({
		 * 	height : 0
		 *	});
		 * </code>
		 *
		 *  此时，会调用   cat.height(0);
		 */
		extend: function(obj, config, filter) {
			if(Object.isRef(config))
				for (var k in config) {
					if (k && config[k] !== undefined && filter == undefined || filter.indexOf(k) == -1) {
						if (typeof obj[k] == "function") obj[k](config[k]);
						else obj[k] = config[k];
					}
				}
		},
		
		/**
		 * 为一个类添加事件。
		 * @param {Class} obj 任何类。
		 * @param {Array/String} events 所有事件。 如字符串用“,”分开的事件。
		 * @param {Boolean} bubbles是否支持冒泡。
		 * @param {Boolean} bstatic 是否静态方法。
		 */
		addEvents: function(obj, events, bubbles, bstatic) {
			
			assert(obj && events, "添加事件空");
			
			var en = Py.Class.EventField; //使用  EventField

			if(!bstatic)
				obj = obj.prototype;
			
			String.split(events).forEach(function(e) {
				obj[e] = en.call(obj,  e, bubbles, !bstatic);
			});
		}

	});
	
	/**
	 * 事件。
	 *  @param {String} name 名字。
	 *  @param {Boolean} bubbles 是否冒泡。
	 *  @param {Boolean} ostatic 是否静态。
	 *  @return {Function} 事件。
	 */
	function EventField(name, bubbles, ostatic){
		var clone = function(me){
		me.events = me.events || {};
		var event = function(f){
			var events = me.events;
    			//如果是函数
    			if (typeof f == "function") {
    				if(!events[name])
					events[name] = [f];
    				//增加函数
                        	else
    					events[name].push(f);

                        	return this;
                        
    			} else {
    						   	
    				//执行函数
    				var e = arguments,
    				    o = function(p){
    						return !me[p + name] || me[p + name].apply(me, e) !== false;
    					},
				    et = events[name],
				    b = this.parentControl;
				    return (o('$') &&  (!et ||  et.each( function(f){
							return f.apply(me, e) !== false;
						}) == et.length) && 
        					o("on") && o('_')) &&
						(!bubbles || !b || !b.prototype[name] || b.prototype[name].apply(b, e));
    			}
    		};
                event.remove = function(f){
                    return me.events && me.events[name][f ? 'remove' : 'removeAll'](f);
                };
                return event;
                
            },
	    l = this[name];
	    if (l) {
		this["_" + name] = l;
	    }
        
	    return ostatic ? {
		clone : clone
	    } : clone(this);
	}

	
	/**
	 * 返回属性。
	 * @param {String} name 属性名。
	 * @param {Function} fn 修改属性的调用函数。
	 */
	function Property(name, fn) {

		assert.instanceOf(name, ["string", "object"], "name必须字符串或数组");
        
        

		if (typeof name == "string") {

			name = {
				
				get: function() {
					return this[name];
				},
				
				set:  fn ? function(value) {
					fn.call(this, value);
					return this[name] = value;
				} : function(value) {
					return this[name] = value;
				}
				
			};

		}

		// 封装的属性名
		return function(value) {

			assert(value !== undefined && name.set || name.get, "当前属性不可{0}", value !== undefined ? "写": "读");

			if (value !== undefined) {
				return name.set.call(this, value);
			}

			return name.get.call(this);
		};
	}


	
	
})(Py,   this);



