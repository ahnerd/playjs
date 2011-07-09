
function main(){
	
	if(!window.fns)
		return;
	
	compile(fns);

	show(document.body, fns);

	function show(parent, fns){
		for (var i = 0; i < fns.length; ++i) {
			var c = fns[i], node;
			if (typeof c == 'string') {
				node = document.createElement('h4');
				node.innerHTML = c;
			} else {
				node = document.createElement('div');
				node.title = c[1].toString();
				node.innerHTML = '<span>' + c[0] + '</span>                  <a href="javascript:;" onclick="doTest(this, ' + i + ')">测试函数</a>   <a href="javascript:;" onclick="runTimeTest(this, ' + i + ', ' + c[3] + ')">运行' + c[3] + '个</a>';
			}
			parent.appendChild(node);
		}
	}
	
	function compile(fns){
		for(var i = fns.length - 1; i >= 0; --i){
			if(typeof fns[i] == "function")
				fns[i] = [getName(fns[i]), fns[i], null, 1000];
			else if(typeof fns[i] != 'string' && !fns[i][3])
				fns[i][3] = 1000;
				
			if(fns[i][2] != null && typeof fns[i][2] != 'function'){
				fns[i][2] = getAsserter(fns[i][2]);
			}
		}
	}
	
	function assertTrue(t){
		return assert(t, "assert失败。应该返回不空。");
	}
	
	function getName(fn){
		return fn.toString();
	}
	
	function getAsserter(value){
		if(value === true)
			return assertTrue;
		
		return function(r){
			var b = r === value;
			
			if(!b && typeof r.length == 'number' && r.length === value.length){
				
				b = true;
				for(var i = 0; 	i < r.length; i++){
					if(r[i] !== value[i]){
						b = false;
						break;
					}
				}
			}
			
			return assert(b, "assert失败。应该返回 " + value + "。现在返回 " + r);
		};
	}
}

function doTest(elem, id){
	id = fns[id];
	var result = id[1]();
	trace("{0}   {1}", result, id[1]);
	if(id[2])
		id[2](result) ;
}

function doTestOneClick(elem){
	if (window.fns) {
		for (var i = 0; i < fns.length; i++) {
			if (fns[i] instanceof Array) doTest(elem, i);
		}
	}
}

function runTimeTest(elem, id){
	trace.test(fns[id][1], fns[id][3]);
}

window.onload = main;

writeNavigator();

function writeNavigator(){
	
	var ns = {
		'javascript: document.getElementById(\'_control\').style.display = \'\'; void -1': '控件',
		'javascript: document.getElementById(\'_core\').style.display = \'\'; void -1': '核心',
		'javascript: document.getElementById(\'_componets\').style.display = \'\'; void -1': '组件',
		'../': '测试主页',
		'../../tools/格式化/Javascript格式化工具.htm': '格式化',
		'../../tools/加密/index.htm': '加密',
		'../../tools/压缩/JavaScript代码压缩-js代码压缩-压缩JS.htm': '压缩',
		'../../模块/': '模块',
		'../../test/tools/javascript.html':'无框架',
		'javascript: doTestOneClick(this); void(0);': '测试所有'
	};
	
	var stylesplit = {
		'@': 'color: gray',
		'~': 'color: gray; text-decoration: line-through',
		'$': '',
		'!': 'color: red'
	}
	
	document.write('<div id="_common_nav">' );
	
	for(var i in ns)
		document.write('<a href="' + i +'">' + ns[i] + '</a> ');
		
	writeWindow('_control', controls, 'ui');
	writeWindow('_core', core, 'test');
	writeWindow('_componets', components, 'componet');
	
	document.write('<hr>');
	
	function writeWindow(id, nst, b){
		
		document.write('<div id="' + id + '" onmouseup="this.style.display = \'none\'" style="position:fixed;left:0; background: white; top: 20px; display: none; width:876px; border: green 1px solid;margin-bottom:30px; _position: absolute; z-index:10000000000">');

		for(var i in nst){
			
			var key = i.replace(/\s*$/g, '').toLowerCase(),
				val = nst[i].split(/\s+/);
			
			document.write('<b>' + i.replace(/\s/g, '&nbsp;') + '</b>  | ');
			
			
			var style = '';
			for(var j = 0; j < val.length; j++){
				if(val[j] in stylesplit) {
					style = 'style="' + stylesplit[val[j]] + '" ';
					document.write( val[j] + "   " );
				} else
					document.write('<a ' + style + 'href="' + '../../' + b.toLowerCase() + '/' + key + '/' + val[j].toLowerCase() + '.html">' + val[j] + '</a>  ');
			}
			
			document.write('<br>');
		}
	
	
		
		document.write('</div>');
	}
	
	
	document.write('</div></div>');
}

function toolCreateAllFunction(obj){
	var r = [], value = eval(obj), tabs = "\t\t\t\t";
	for(var i in value){
		if(value.hasOwnProperty(i) && typeof value[i] == 'function' && value[i].toString().indexOf('[native code]') == -1){
			r.push(format(i));
		}
	}
	
	for(var i in value.prototype){
		if(value.prototype.hasOwnProperty(i) && typeof value.prototype[i] == 'function' && value.prototype[i].toString().indexOf('[native code]') == -1){
			r.push(format("prototype." + i));
		}
	}
	
	r = tabs + r.join(",\n" + tabs);
	
	alert(r);
	
	return r;
	
	function format(name){
		var d = obj+ "." + name;
		return "[\"" + d +"\", function(){ return " + d + "(" + "" + "); }]";
	}
}