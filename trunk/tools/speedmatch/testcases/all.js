

var options = {
	defaultHtml: 'demo.html',
	time: 1000
};

var framewroks = {
	'jQuery': {
		js: '../libs/jquery.js',
		init:  function(window){
			window.el = window.$("#header");
			window.fn = fn;
		}
	},
	'mootools': {
		js: '../libs/mootools.js',
		init:  function(window){
			window.el = window.$("header");
			window.fn = fn;
		}
	},
	'py': {
		js: [
			'../libs/system.js',
			'../libs/element.js'
		],
		init:  function(window){
			window.el = window.$("header");
			window.fn = fn;
		}
	}
};

var cases = {
	'文档载入': '-',
	'加载时运行':{
		py: 'document.onReady(fn)',
		mootools: 'document.addEvent("domready", fn)',
		jQuery: '$(fn)'
	},
	'节点': '-',
	'获取一个节点':{
		jQuery: '$("#header")',
		mootools: '$("header")',
		py: '$("header")'
	},
	'事件 - 添加':{
		py: 'el.on("click", function(e){})',
		mootools: 'el.addEvent("click", function(e){})',
		jQuery: 'el.click(function(e){})'
	},
	'事件 - 触发':{
		py: 'el.trigger("click")',
		mootools: 'el.fireEvent("click")',
		jQuery: 'el.click()'
	},
	'事件 - 删除':{
		py: 'el.un("click")',
		mootools: 'el.removeEvent("click")',
		jQuery: 'el.unbind("click")'
	},
	'事件 - 单一':{
		py: 'el.one("click", function(e){})',
		mootools: '-',
		jQuery: 'el.one("click", function(e){})'
	},
	'属性 - 获取':{
		py: 'el.getAttr("name")',
		mootools: 'el.getProperty("name")',
		jQuery: 'el.attr("name")'
	},
	'属性 - 设置':{
		py: 'el.setAttr("name", "1")',
		mootools: 'el.setProperty("name", "1")',
		jQuery: 'el.attr("name", "1")'
	},
	'样式 - 取得':{
		py: 'el.getStyle("background-color")',
		mootools: 'el.getStyle("background-color")',
		jQuery: 'el.css("background-color")'
	},
	'样式 - 设置':{
		py: 'el.setStyle("background-color", "green")',
		mootools: 'el.setStyle("background-color", "green")',
		jQuery: 'el.css("background-color", "green")'
	},
	'类名 - 添加':{
		py: 'el.addClass("g")',
		mootools: 'el.addClass("g")',
		jQuery: 'el.addClass("g")'
	},
	'类名 - 反类':{
		py: 'el.toggleClass("g")',
		mootools: 'el.toggleClass("g")',
		jQuery: 'el.toggleClass("g")'
	},
	'类名 - 删除类':{
		py: 'el.removeClass("g")',
		mootools: 'el.removeClass("g")',
		jQuery: 'el.removeClass("g")'
	},
	'节点 - 插入':{
		py: 'el.append("<br>")',
		mootools: 'new Element("<br>").inject(el)',
		jQuery: 'el.append("<br>")'
	},
	'位置 - 计算':{
		py: 'el.getPosition()',
		mootools: 'el.getPosition()',
		jQuery: 'el.position()'
	},
	'位置 - 设置':{
		py: 'el.setPosition(3,4)',
		mootools: '-',
		jQuery: 'el.position(3,4)'
	},
	'工具函数': '-',
	'Object - 拷贝': {
			py: 'Object.extend({a:1}, {b:2})',
			mootools: 'Object.append({a:1}, {b:2})',
			jQuery: '$.extend({a:1}, {b:2})'
		},
		'Object - 遍历':{
			py: 'Object.each({a:1}, fn)',
			mootools: 'Object.each({a:1}, fn)',
			jQuery: '$.each({a:1}, function(i, n){fn(n)})'
		},
		'Object - 类型':{
			py: 'Object.type({})',
			mootools: '$type({})',
			jQuery: '-'
		},
		'Object - 数组判断':{
			py: 'Object.isArray([])',
			mootools: '-',
			jQuery: '$.isArray([])'
		},
		'Object - 函数判断':{
			py: 'Object.isFunction(function(){})',
			mootools: '$type(function(){}) == "function"',
			jQuery: '$.isFunction(function(){})'
		},
		'Object - 无成员判断':{
			py: '-',
			mootools: '-',
			jQuery: '$.isEmptyObject({})'
		},
		'Array - 遍历':{
			py: '[2,3].forEach(fn)',
			mootools: '[2,3].forEach(fn)',
			jQuery: '$.each([2,3], function(i, n){fn(n)})'
		},
		'Array - 生成':{
			py: 'Array.create([2,3])',
			mootools: 'Array.from([2,3])',
			jQuery: '$.makeArray([2,3])'
		},
		'Array - 过滤':{
			py: '[2,3].filter(function(v){return v > 2;})',
			mootools: '[2,3].filter(function(v){return v > 2;})',
			jQuery: '$.grep([2,3], function(v){return v > 2;})'
		},
		'Array - 匹配':{
			py: 'Object.update([2,3], function(v){return v * v;})',
			mootools: '[2,3].map(function(v){return v * v;})',
			jQuery: '$.map([2,3], function(v){return v * v;})'
		},
		'Array - 查找':{
			py: '[2,3].indexOf(3)',
			mootools: '[2,3].indexOf(3)',
			jQuery: '$.inArray(3, [2,3])'
		},
		'Array - 结合':{
			py: 'Array.plain([2,3], [5])',
			mootools: '[2,3].concat([5])',
			jQuery: '$.merge([2,3], [5])'
		},
		'Array - 删除重复':{
			py: '-',
			mootools: '-',
			jQuery: '$.unique([2,3,2,4,5])'
		},
		'Function - 空':{
			py: 'Function.empty()',
			mootools: '$empty()',
			jQuery: '$.noop()'
		},
		'Function - 作用域绑定':{
			py: 'Function.bind(fn, this)',
			mootools: '$empty.bind(this)',
			jQuery: '$.proxy(fn, this)'
		},
		'String - trim':{
			py: '" s ".trim()',
			mootools: '" s ".trim()',
			jQuery: '$.trim(" s ")'
		}

};




function fn(){

}


initSpeedMatch(framewroks, cases, options   );




