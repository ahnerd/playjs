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