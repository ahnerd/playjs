



/**
		 * 对迭代对象的每个元素执行函数。并返回值。
		 * @param {Object} iterable 对象。
		 * @param {Function/String} name 执行对象或属性。
		 * @param {Object} ... 参数。
		 * @return {Array} 结果的数组。
		 */


Array.implement({

///<summary>获取数组中的最小值。语法：min()</summary>
		///<returns type="number">返回数组中的最小值。</returns>
	min: function(){
		return Math.min.apply(null, this);
	},

///<summary>获取数组中的最大值。语法：max()</summary>
		///<returns type="number">返回数组中的最大值。</returns>
	max: function(){
		return Math.max.apply(null, this);
	},

	average: function(){
		return this.length ? this.sum() / this.length : 0;
	},

	sum: function(){
		var result = 0, l = this.length;
		if (l){
			while (l--) result += this[l];
		}
		return result;
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

	shuffle: function(){
		for (var i = this.length; i && --i;){
			var temp = this[i], r = Math.floor(Math.random() * ( i + 1 ));
			this[i] = this[r];
			this[r] = temp;
		}
		return this;
	},
	
	
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
		


,


'swap': function(a, b) {
            var temp = this[a];
            this[a] = this[b];
            this[b] = temp;
        }

,



});

Array.compare = function (a, b) {
   if(a.length==b.length) return a.sort().join("")==b.sort().join("");
    a = a.sort().join("").replace(/(.)\1+/g,"$1");
    b = b.sort().join("").replace(/(.)\1+/g,"$1");
    var arr = a.split("");
    var re = new RegExp(arr.join("|"),"g");
    return (b.length - b.replace(re,"").length == a.length || b.replace(re,"").length==0)

}

/**
 * 获取数组内指定个数的 元素的 组合。
 */
Array.getCombination =  function (value, n) {
   if(1>=n){
        return value;
    }else{
        var aRV = [];
        var fooSetCB = function(x,aList){
            while(aList.length>0){
                var y = aList.shift();
                var z = Array.prototype.concat.call(x,y);
                (z.length==n)?aRV.push(z):arguments.callee(z,aList.slice(0));
            }
        }
        while(aList.length>=n){
            var x = aList.shift();
            fooSetCB(x,aList.slice(0));
        }
        return aRV.slice(0);
    }

}


Object.
		/**
		 * 分隔字符并返回数组。
		 * @param {String} value 值。
		 * @param {String/RegExp} sep 分隔符。
		 * @remark 这个函数和 String.split 一样，但value 可为数组。
		 */
		toArray = function(value, sep) {
			return typeof value == "string" ? value.split(sep) : value;
		}