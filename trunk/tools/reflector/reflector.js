


// BY XULD

// INTERNAL

// DO NOT USE THIS CODE WITHOUT PERMISSION


var url = '';

// 注入
function initReflector(){
	
	var window = this;
	
	if(window.setupReflect)
		return;

	var document = window.document;
	
	var node = document.createElement('script');
	
	node.type = 'text/javascript';
	node.charset = "utf-8";
	node.src = url;
	
	document.getElementsByTagName('head')[0].appendChild(node);
}


initReflector();

setupReflect();

function setupReflect(){
	
	/*
Element.prototype._addEventListener = Element.prototype.addEventListener;
	
	Element.prototype.addEventListener = function (type, fn, dest){
		if(!this.events)
			this.events = {};
		if(!this.events[type]  )
			this.events[type] = [];
		
		this.events[type].push(fn);	
		
		this._addEventListener(type, fn, dest);
	};
*/
	
	this.Reflector = {
		
		document: this.document || document,
		
		id: function(value){
			return this.node(this.document.getElementById(value));
		},
		
		cls: function(cls){
			return this.node( this.document.getElementsByClassName(cls)[0] );
		},
		
		node: function(elem){
		
		var d = window.open('about:blank', 'n').document;
		
			d.write( this.inString(elem)  );
			
			d.close();
		},
		
		inString: function(elem){
			
			var r = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\
<html>\
    <head>\
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
		<style type="text/css">\
		{0}\
		</style>\
			\
		<script type="text/javascript">\
		{2}\
		</script>\
	</head>\
	<body>\
		{1}\
	</body>\
</html>\
		' 
		;
		
		
		
			
			
			var nodes  = this.getRelations  (elem)    ;
			
			
			var css = this.getStyles( nodes );
			
			var resourse = [];
			
			
			this.getResouces(css);
			
			
			    // console. log(css   ) ;
				
				
			r  = r.replace('{1}', this.inElemString(elem) ).replace('{0}',  this.inCssString(css, resourse)) .replace('{2}', '  ');
			
			
			
			
			
			console.log(    css  );
			
			console.log(    resourse  );
			
			
			return r;
		},
		
		inCssString: function(lines, resouces){
			
			var r = [];
			
			for (var k = 0; k < lines.length; k++) {
			
				var styles = lines[k];
				
				r.push('/*  ' + styles.href + '   */');
				r.push('   ');
				
				for(var si = 0; si < styles.rules.length; si++){
					
					
					r.push(styles.rules[si].text || styles.rules[si].cssText);
					
					
					if(styles.images){
						
						for(var n = 0; n < styles.images.length; n++){
							
							if(resouces.indexOf(styles.images[n])  == -1)
								resouces.push(styles.images[n]);
						}
					}
				}
			}
			
			
			return r.join('\r\n');
		},
		
		inElemString: function(node){
			var div = this.document.createElement('span');
			
			node.parentNode.replaceChild(div, node);
			div.appendChild(node);
			
			var htm = div.innerHTML;
			
			div.removeChild(node);
			div.parentNode.replaceChild(node, div);
			
			return htm;
		},
		
		// a  有 b的元素
		_inArray: function(a, b){
			for(var i = 0; i < a.length; i++)
				if(b.indexOf(a[i]) != -1)
					return true;
					
			
			
			return false;
		},
		
		// 分析style内全部图片。
		getResouces: function(lines){
			for(var k = 0; k < lines.length; k++){
				var styles = lines[k];
						
						
				styles.images = [];
				for(var n = 0 ; n < styles.rules.length; n++){
					var style = styles.rules[n];
					
					var url = /url\(\"?([^\"]*)\"?\)/g.exec(style.cssText);
					
					if(url){
						

						var root = styles.href.replace(/\/[^\/]*$/, '/');
						
						for(var i = 1; i < url.length; i += 2){
						
							var href = root  + url[i];
							
							style.text = style.cssText.replace   (url[i], href);
							
							styles.images.push(href);
						}
						
					}
				}
			}
		},
		
		getStyles: function(elems){
			
			
			var styleSheets =  this.document.styleSheets;
			
			var styles = [];
			
			for(var i = 0; i < styleSheets.length; i++) {
				
				var style = styleSheets[i];
				
				var c = {
					href: style.href || location.href,
					rules: []
				};
				
				styles.push(c);
				
				style =   style.cssRules;
				
				c = c.rules;
				
				for(var ri = 0; ri < style.length; ri++) {
					
					var rule = style[ri];
					
					if(!rule.selectorText)
						continue;
						
					var results = this.document.querySelectorAll(rule.selectorText.replace(/:(hover|active|link|visited)/g, ''));
					
					if(this._inArray(results, elems)){
						c.push(rule);
					}
				}
				
			}
			
			
			return styles  ;
		},
		
		getRelations: function(elem){
			
			var r = [elem], parent = elem.parentNode, cache = [elem];
			while(parent && parent != this.document){
				r.push(parent);
				parent = parent.parentNode;
			}
			
			
			while(cache.length){
				
				var c = cache.pop();
				r.push(c);
				for(c = c.firstElementChild; c; c = c.nextElementSibling)
					cache.push(c);
			}
			
			
			return r;
		}
		
	};
}
