

		loadResource : function(attr, callback, autoremove, doc) {
					// javascript , img..
					var src = CC.delAttr(attr, 'src');
					// css style sheet
					var href = CC.delAttr(attr, 'href');
					// tag
					var res = this.$C(attr, doc);
					if(callback || autoremove){
  					if(res.readyState) {
  						//IE
  						res.onreadystatechange = function() {
  							if (res.readyState == "loaded" ||
  							res.readyState == "complete") {
  								res.onreadystatechange = null;
  								if(autoremove)
  								  setTimeout(function(){res.parentNode.removeChild(res)},1)
  								if(callback)
  								callback.call(res);
  							}
  						};
  					}else{
  						//Others
  						res.onload = function() {
  							if(autoremove)
  							  setTimeout(function(){res.parentNode.removeChild(res)},1)
  							if(callback)
  							  callback.call(res);
  						};
  					}
				  }
					
					if(src)
					 res.src = src;
					
					if(href)
					 res.href = href;
					
					this.$T('head')[0].appendChild(res);
					
					return res;
				},
/**
 * 加载JavaScript脚本文件
 * @param {String} url
 * @param {Function} callback
 * @param {String} [id]
 */
        loadScript: function(url, callback, id) {
          var nd = this.loadResource({
                tagName: 'script',
                src: url,
                type: 'text/javascript'
          }, callback, true);
          
          if(id) 
          	nd.id = id;
          return nd;
        }
        ,
/**
 * 加载一个CSS样式文件
 * @param {String} url 加载css的路径
 * @param {Function} callback 
 * @param {String} [id] style node id
 * @return {DOMElement} link node
 */
        loadCSS: function(url, callback, id) {
          var nd = this.loadResource({
                tagName: 'link',
                rel: 'stylesheet',
                href: url,
                type: 'text/css'
          }, callback);
          if(id) 
          	nd.id = id;
          return nd;
        }
        ,
/**
 * 应用一段CSS样式文本.
 * <pre><code>
   CC.loadStyle('.g-custom {background-color:#DDD;}');
   //在元素中应用新增样式类
   &lt;div class=&quot;g-custom&quot;&gt;动态加载样式&lt;/div&gt;
   </code></pre>
 * @param {String} id 生成的样式style结点ID\
 * @param {String} 样式文本内容
 */
        loadStyle: function(ss, doc) {
          var styleEl = this._styleEl;
          if(!styleEl){
            styleEl = this._styleEl = this.$C( {
              tagName: 'style',
              type: 'text/css'
            });
            this.$T('head')[0].appendChild(styleEl);
          }
          styleEl.styleSheet && (styleEl.styleSheet.cssText += ss) || styleEl.appendChild((doc||document).createTextNode(ss));
          return styleEl;
        }
        