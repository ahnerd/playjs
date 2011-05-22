//===========================================
//  迭代器   Enumerable.js  MIT LICENCE
//  Copyright(c) 2005 prototype
//===========================================
var Enumerable = {
	//用于对对象的每一个元素遍历执行iterator迭代器函数
	each: function(iterator){
		var index = 0; //可选参数表示元素在枚举对象的次序
		try {
			this._each(function(value){//value是枚举元素的值
				try {
					iterator(value, index++);
				} catch (e) {
					if (e != $continue) throw e;
				}
			});
		} catch (e) {
			if (e != $break) throw e;
		}
	},
	//判断是否所有的枚举元素都能使iterator返回true
	all: function(iterator){
		var result = true;
		this.each(function(value, index){
			result = result && !!(iterator || Prototype.K)(value, index);
			if (!result) throw $break;
		});
		return result;
	},
	//判断是否有枚举元素能使iterator返回true，有一个就是True
	any: function(iterator){
		var result = true;
		this.each(function(value, index){
			if (result = !!(iterator || Prototype.K)(value, index)) throw $break;
		});
		return result;
	},
	//对所有的枚举元素执行iterator迭代器函数 结果作为一个数组返回
	collect: function(iterator){
		var results = [];
		this.each(function(value, index){
			results.push(iterator(value, index));
		});
		return results;
	},
	//第一个素能使iterator返回true的枚举元素的值，没有返回undefined
	detect: function(iterator){
		var result;
		this.each(function(value, index){
			if (iterator(value, index)) {
				result = value;
				throw $break;
			}
		});
		return result;
	},
	//找到所有的能使iterator迭代器函数返回true的枚举元素 作为一个数组返回
	findAll: function(iterator){
		var results = [];
		this.each(function(value, index){
			if (iterator(value, index)) results.push(value);
		});
		return results;
	},
	//找到素有匹配pattern的枚举元素，结果作为数组返回，iterator可选，如果不指定旧返回素有匹配pattern的枚举元素
	grep: function(pattern, iterator){//正则模式 迭代器
		var results = [];
		this.each(function(value, index){
			var stringValue = value.toString();
			if (stringValue.match(pattern)) results.push((iterator || Prototype.K)(value, index));
		})
		return results;
	},
	//判断枚举对象中是否含有参数Object指定的值
	include: function(object){
		var found = false;
		this.each(function(value){
			if (value == object) {
				found = true;
				throw $break;
			}
		});
		return found;
	},
	//将memo作为iterator的第一个参数，枚举元素作为iterator的第二个参数，枚举元素的次序作为第三个
	//参数每次迭代器的返回值将作为下一个iterator的memo参数，从而所有的迭代执行都通过memo联系起来了
	
	inject: function(memo, iterator){
		this.each(function(value, index){
			memo = iterator(memo, value, index);
		});
		return memo;
	},
	//对所有的枚举元素执行method方法 后面是要传递的参数
	invoke: function(method){
		var args = $A(arguments).slice(1);
		return this.collect(function(value){
			return value[method].apply(value, args);
		});
	},
	//返回的最大的迭代器执行结果
	max: function(iterator){
		var result;
		this.each(function(value, index){
			value = (iterator || Prototype.K)(value, index);
			if (value >= (result || value)) result = value;
		});
		return result;
	},
	//反之
	min: function(iterator){
		var result;
		this.each(function(value, index){
			value = (iterator || Prototype.K)(value, index);
			if (value <= (result || value)) result = value;
		});
		return result;
	},
	//返回两个数组一组能使iterator返回true 另一组返回false
	partition: function(iterator){
		var trues = [], falses = [];
		this.each(function(value, index){
			((iterator || Prototype.K)(value, index) ? trues : falses).push(value);
		});
		return [trues, falses];
	},
	//获取所有枚举元素的property属性值作为数组的返回
	pluck: function(property){
		var results = [];
		this.each(function(value, index){
			results.push(value[property]);
		});
		return results;
	},
	//与findall相反 
	reject: function(iterator){
		var results = [];
		this.each(function(value, index){
			if (!iterator(value, index)) results.push(value);
		});
		return results;
	},
	//根据iterator的结果排序 最小的在前面 作为数组返回
	sortBy: function(iterator){
		return this.collect(function(value, index){
			return {
				value: value,
				criteria: iterator(value, index)
			};
		}).sort(function(left, right){
			var a = left.criteria, b = right.criteria;
			return a < b ? -1 : a > b ? 1 : 0;
		}).pluck('value');
	},
	//枚举对象--》数组
	toArray: function(){
		return this.collect(Prototype.K);
	},
	//接收多个枚举对象参数，最后一个可以是迭代器用于阵列转换
	zip: function(){
		var iterator = Prototype.K, args = $A(arguments);
		if (typeof args.last() == 'function') iterator = args.pop();
		
		var collections = [this].concat(args).map($A);
		return this.map(function(value, index){
			iterator(value = collections.pluck(index));
			return value;
		});
	},
	//返回枚举对象的字符串描述
	inspect: function(){
		return '#<Enumerable:' + this.toArray().inspect() + '>';
	}
};