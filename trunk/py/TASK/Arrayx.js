//===========================================
//  数组x   Arrayx.js  MIT LICENCE
//===========================================

py.applyIf(Array.prototype,{
	
	findFirstOf : Array.prototype.indexOf,
	
	findFirstNotOf : function(a){
		var o = this;
		for ( var i=0,length=o.length; i<length; i++)
			if(o[i] != a)
				return i;
		return -1;
	},

	findLastNotOf : function(a){
		var o = this;
		for ( var i=o.length-1; i>=0; i--)
			if(o[i] != a)
				return i;
		return -1;
	},
	
	findLastOf : function(a){
		var o = this;
		for ( var i=o.length-1; i>=0; i--)
			if(o[i] == a)
				return i;
		return -1;
	},

	min : function() {
		///<summary>获取数组中的最小值。语法：min()</summary>
		///<returns type="number">返回数组中的最小值。</returns>
	    var min = this[0];
	    for (var i = 1; i < this.length; i++) {
	        if (min > this[i]) {
	            min = this[i];
	        }
	    }
	
	    return min;
	},
	
	max : function() {
		///<summary>获取数组中的最大值。语法：max()</summary>
		///<returns type="number">返回数组中的最大值。</returns>
	    var max = this[0];
	    for (var i = 1; i < this.length; i++) {
	        if (max < this[i]) {
	            max = this[i];
	        }
	    }
	
	    return max;
	},

	checkRepeat : function() {
		///<summary>检查数组中是否存在重复值。语法：checkRepeat()</summary>
		///<returns type="boolean">若数组中存在重复值，则返回 true，否则返回 false。</returns>
	    for (var i = 0; i < this.length - 1; i++) {
	        for (var j = i + 1; j < this.length; j++) {
	            if (this[i] == this[j]) {
	                return true;
	            }
	        }
	    }
	
	    return false;
	},
	
	
	clear : Array.prototype.removeAll

});



 
				
		/**
		 * 对迭代对象的每个元素执行函数。并返回值。
		 * @param {Object} iterable 对象。
		 * @param {Function/String} name 执行对象或属性。
		 * @param {Object} ... 参数。
		 * @return {Array} 结果的数组。
		 */
		map: function(iterable, name){
			
			var r = [], fn;
			
			if(Object.isFunction(name)){
				
				fn = function(value, key){
					r.push(name.call(this, value, key));
				};
				
			} else {
				
				var args = makeArray.call(arguments, 2);
				
				fn = function(value, key){
					r.push(value && Object.isFunction(key = value[name]) ? key.apply(this, args) : undefined);
				};
				
			}
			
			Object.each(iterable, fn);
			
			return r;
		},
		
		
		
		
			

		/**
		 * 返回当前数组的副本。
		 * @return {Array} 数组。
		 */
		clone: function(){
			return this.slice(0);
		},
		
		
		
		
		
		/**
		 * 返回数组某个值的最后一个位置。值没有,则为-1。
		 * @param {Object} item 成员。
		 * @param {Number} startIndex 开始查找位置。
		 */
		lastIndexOf: function (item, startIndex) {
			var l = start == undefined ? this.length: startIndex;
			while (l-- && this[l] !== startIndex);
			return l;
		},

		
		
		

		/**
		 *  获取数组最后一个元素。
		 *  @return Object  内容。空的数组得到 undefined 。
		 */
		last: function() {
			return this[this.length - 1];
		},
		
		
		
				
		/**
		 * 删除指定位置元素。
		 * @param {Number} index 索引。第一个元素是 0。
		 * @return {Object}   删除的元素。
		 */
		removeAt: function(index) {
			return this.splice(index, 1)[0];
		},
		
		/**
		 * 添加指定位置元素。
		 * @param {Object} value 值。
		 * @param {Number} index 索引。第一个元素是 0。
		 * @return {Array} this
		 */
		insertAt: function(value, index) {
			if(index == null){
				this.push(value);
			}else if(index == 0) {
				this.unshift(value);
			}else{
				var l = this.length++;
				while (l > index) 
					this[l] = this[--l];
				this[index] = value;
			}
			return this;
		},
		
		/**
		 * 删除数组全部元素。
		 * @return {Array} this
		 */
		removeAll: function() {
			this.length = 0;
			return this;
		},

,
		
		/**
		 * 复制到另一个数组。
		 * @param {Object} o 位置。
		 * @return {Array} 参数的内容。
		 */
		copyTo: function(o) {
			var i = o.length;
			forEach.call(this, function(x) {
				o[i++] = x;
			});
			return o;
		}
		
		
		
		/**
		 * 增加读写属性。
		 * @param {String} evens 所有事件。 如字符串用“,”分开的事件。 事件对象，包含 {add, trigger, remove} 方法。
		 * @return this
		 */
		proxy: function(values, returnThis){
			
			Object.each(values, function(value, key){
				String.map(key, function(k){
					return returnThis ? function(){
						var me = this[value];
						me[k].apply(me, arguments);
						return this;
					} : function(){
						var me = this[value];
						return me[k].apply(me, arguments);
					};
				}, this.prototype);
				
			}, this);
			
			return this;
		}
		
		
		
,

		/**
		 * 分隔字符并返回数组。
		 * @param {String} value 值。
		 * @param {String/RegExp} sep 分隔符。
		 * @remark 这个函数和 String.split 一样，但value 可为数组。
		 */
		toArray: function(value, sep) {
			return typeof value == "string" ? value.split(sep) : value;
		}
		
		