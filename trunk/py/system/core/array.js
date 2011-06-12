//===========================================
//  数组   Array.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================







/// <summary>
/// 数组
/// </summary>
/// <class name="Array" />
Array.implementIf({

	/// <summary>
	/// 对数组每个元素判断一个函数返回true。
	/// </summary>
	/// <params name="fn" type="Function">函数。参数 value, index, this</params>
	/// <params name="bind" type="Object" optional="true">绑定的对象</params>
	/// <returns type="Boolean">全部返回 true则返回 true。</returns>
	every: function(fn, bind){
		bind = bind || this;
		for (var i = 0, l = this.length; i < l; i++){
			if (!fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	/// <see cref="Array.prototype.each" />
	forEach : Array.prototype.each,

	/// <summary>
	/// 删除数组中等价false的内容。
	/// </summary>
	/// <returns type="Boolean">全部返回 true则返回 true。</returns>
	clean: function(){
		return this.filter(function(x){return !x;});
	},

	/// <summary>
	/// 对数组链至对象
	/// </summary>
	/// <params name="fn" type="Function">函数。参数 value, index, this</params>
	/// <params name="bind" type="Object" optional="true">绑定的对象</params>
	/// <returns type="Array">数组</returns>
	link: function(object){
		var result = [];
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	/// <summary>
	/// 返回数组是否含一项。
	/// </summary>
	/// <params name="item" type="Function">内容</params>
	/// <params name="from" type="Number" optional="true">开始的位置</params>
	/// <returns type="Boolean">存在返回 true。</returns>
	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	/// <summary>
	/// 返回数组的随机位置的值。
	/// </summary>
	/// <returns type="Object">内容</returns>
	random : function(){
		return this.length > 0 ? this[Math.rand(0, this.length - 1)] : null;
	},

	/// <summary>
	/// 使数组包含一个元素。
	/// </summary>
	/// <params name="item" type="Object">内容</params>
	/// <returns type="Array">数组</returns>
	include : function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

    	/// <summary>
    	/// 加最后一个元素
    	/// </summary>
    	/// <params name="v" type="Object">值</params>
    	///	<returns type="Array" >数组</returns>
	/// <remarks>现在大多数浏览器已含此函数</remarks>
	push : function(v){
		this[this.length] = v;
		return this.length;
	},
	
    	/// <summary>
    	/// 删数组最后一个元素
    	/// </summary>
    	/// <returns type="Array" >数组</returns>
	/// <remarks>现在大多数浏览器已含此函数</remarks>
	pop : function(){
		var l = this.length-1;
		var v = this[l];
		delete this[l];
		return v;
	},

	/// <summary>
	/// 删除重复的元素。
	/// </summary>
	/// <params name="item" type="Object">内容</params>
	/// <returns type="Array">数组</returns>
	unique : function() {
		var ret = [], done = {},o = this;
		for ( var i=0,length=o.length; i<length; i++) {
			if (!done[o[i]]){
				done[o[i]] = true;
				ret.push( o[i] );
			}
		}
		return ret;
	},

	/// <summary>
	/// 合并2个数组，第2个数组不覆盖原成员。
	/// </summary>
	/// <params name="array" type="Array">数组</params>
	/// <returns type="Array">数组</returns>
	combine : function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},
	
	/// <summary>
	/// 返回数组的副本
	/// </summary>
	/// <params name="start" type="Number" optional="true">位置</params>
	/// <params name="length" type="Number" optional="true">长度</params>
	/// <returns type="Array" > 拷贝的数组 </returns>
	clone : function(start,length){
		var m = [];
		for(var i = start || 0,len = length || this.length - i;i<len;i++)
			m[i] = Object.clone(this[i]);
		return m;
	}
		
		/**
		 * 对数组的每个成员执行一个函数。
		 * @param {String} fn 函数。
		 * @param {Array} args 参数。
		 * @return {Array} 结果数组。
		 */
		invoke: function(fn, args){
			var r = [];
			for(var i = 0; i < this.length; i++){
				r.push(this[i][fn].apply(this[i], args));
			}
			return r;
		},
});




Array.implement({

	invoke: function(methodName){
		var args = Array.slice(arguments, 1);
		return this.map(function(item){
			return item[methodName].apply(item, args);
		});
	},

	every: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	clean: function(){
		return this.filter(function(item){
			return item != null;
		});
	},

	indexOf: function(item, from){
		var len = this.length;
		for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	link: function(object){
		var result = {};
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	append: function(array){
		this.push.apply(this, array);
		return this;
	},

	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	getRandom: function(){
		return (this.length) ? this[Number.random(0, this.length - 1)] : null;
	},

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--;){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = typeOf(this[i]);
			if (type == 'null') continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},

	hexToRgb: function(array){
		if (this.length != 3) return null;
		var rgb = this.map(function(value){
			if (value.length == 1) value += value;
			return value.toInt(16);
		});
		return (array) ? rgb : 'rgb(' + rgb + ')';
	},

	rgbToHex: function(array){
		if (this.length < 3) return null;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return (array) ? hex : '#' + hex.join('');
	}

});





Array.prototype.unique = function(){
    var a = [];
    var l = this.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (this[i] === this[j]) 
                j = ++i;
        }
        a.push(this[i]);
    }
    return a;
};

// Usage :
var uniqueA = [1,2,3,3,5,5,3,7];
var uniqueResult = uniqueA.unique();
// uniqueResult = [1, 2, 5, 3, 7];
 获取数组中不相同的元素 当一个数组调用 diff 方法，将得到这个数组中元素与其他数组中元素所不同的元素。有点拗口是吧？试试就知道是怎么回事了。
 Array.prototype.diff = function(){
    var a1 = this;
    var a = a2 = null;
    var n = 0;
    while (n < arguments.length) {
        a = [];
        a2 = arguments[n];
        var l = a1.length;
        var l2 = a2.length;
        var diff = true;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < l2; j++) {
                if (a1[i] === a2[j]) {
                    diff = false;
                    break;
                }
            }
            diff ? a.push(a1[i]) : diff = true;
        }
        a1 = a;
        n++;
    }
    return a.unique();
};

// Usage :
var diffA = [1,2,3];
var diffB = [2,3,4];
var diffResult = diffA.diff(diffB);
// diff = [1];
 合并数组 这个方法将传入的数组进行合并，并返回合并后的新数组
 Array.prototype.union = function(){
    var a = [].concat(this);
    var l = arguments.length;
    for (var i = 0; i < l; i++) {
        a = a.concat(arguments[i]);
    }
    return a;
};

// Usage :
var unionA = [1,2,3];
var unionB = [2,3,4];
var unionResult = unionA.union(unionB);
// unionResult = [1, 2, 3, 2, 3, 4]
 交集 intersect 将返回传入几的数组中相同的元素
 Array.prototype.intersect = function(){
    if (!arguments.length) 
        return [];
    var a1 = this;
    var a = a2 = null;
    var n = 0;
    while (n < arguments.length) {
        a = [];
        a2 = arguments[n];
        var l = a1.length;
        var l2 = a2.length;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < l2; j++) {
                if (a1[i] === a2[j]) 
                    a.push(a1[i]);
            }
        }
        a1 = a;
        n++;
    }
    return a.unique();
};

// Usage :
var intersectA = [1,2,3];
var intersectB = [2,3,4];
var intersectC = [3,4,5];
var intersectResult = intersectA.intersect(intersectB,intersectC);
// intersectResult = [3];
 随机化 对一个数组进行随机排序，返回值为 undefined
 Array.prototype.randomize = function(){
        this.sort(function(){
            return ((Math.random() * 3) | 0) - 1;
        });
};

// Usage :
var randomizeA = [4,7,3,7,3];
randomizeA.randomize();





Array.max = function( array ){ 
return Math.max.apply( Math, array );
};

Array.min = function( array ){ 
return Math.min.apply( Math, array );
};