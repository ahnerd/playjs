
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
			return assert(r === value, "assert失败。应该返回 " + value + "。现在返回 " + r);
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
		'../': '测试主页',
		'../dom/': 'DOM测试',
		'../core/': 'CORE测试',
		'../../ui/': 'UI主页',
		'javascript: doTestOneClick(this); void(0);': '测试所有'
	};
	
	document.write('<div id="_common_nav">' );
	
	for(var i in ns)
		document.write('<a href="' + i +'">' + ns[i] + '</a> ');
		
	writeWindow('_control', controls, 'ui');
	writeWindow('_core', core, 'test');
	
	document.write('<p></p>')
	
	
	
	
	function writeWindow(id, nst, b){
		document.write('<div id="' + id + '" onmouseup="this.style.display = \'none\'" style="position:fixed;left:0; background: white; top: 20px; display: none; width:876px; border: green 1px solid;margin-bottom:30px; _position: absolute; z-index:10000000000">');

		for(var i in nst){
			document.write('<b>' + i.replace(/\s/g, '&nbsp;') + '</b>  | ');
			
			
			var style = '';
			for(var j = 0; j < nst[i].length; j++){
				if(nst[i][j].length == 1)
					(style = ' style = "color: gray;"' ) && document.write(nst[i][j] + "   ")  | (nst[i][j] == '~') && (style = ' style = "color: gray; text-decoration: line-through "');
				else
					document.write('<a' + style + ' href="' + '../../' + b + '/' + i.replace(/\s*$/g, '') + '/' + nst[i][j] + '.html">' + nst[i][j] + '</a>  ');
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
		if(value.hasOwnProperty(i) && value[i].toString().indexOf('[native code]') == -1){
			r.push(format(i));
		}
	}
	
	r = tabs + r.join(",\r\n" + tabs);
	
	out(r);
	
	return r;
	
	function format(name){
		var d = obj+ "." + name;
		return "[\"" + d +"\", function(){ return " + d + "(" + "" + "); }]";
	}
}