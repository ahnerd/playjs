//===========================================
//  请求   Ajax.js  MIT LICENCE
//  JQuery
//===========================================
//  本文件包括Ajax的所有文件
//     Ajax.Base.js
//     Dom.HTMLFormElement.js
//     Ajax.Helper.js
//    
//     引用 [String.js] String.param     
//         [Dom.Base.js]  document.getDom
//===========================================

Py.namespace("System.Ajax");


(function(p){
	
	/// #region 字符串扩展
	
	var rspace = /%20/g;
	
	/**
	 * 返回变量的地址形式。
	 * @param {Object} a 变量。
	 * @return {String} 字符串。
	 */
	String.param = function(obj){
		var s = [];
		object.each(obj, function( value, key ){
			s.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
		});
		return s.join('&').replace(rspace, '+');
	};
	
	/// #endregion
	
	/**
	 * 是否含  =?
	 * @type Boolean
	 */
	var jsre = /=\?(&|$)/g;
	
	/**
	 * 处理异步请求的功能。
	 * @class Ajax
	 */ 
	p.namespace("Py", "Ajax", new Py.Class({/*

		
		/// <summary>
		/// 请求
		/// </summary>
		/// <type name="XMLHttpRequest" />
		xhr : null,
		
		/// <summary>
		/// 请求地址
		/// </summary>
		/// <type name="String" />
		url : null,
		
		/// <summary>
		/// 请求方式
		/// </summary>
		/// <type name="String" />
		type : null,
		
		/// <summary>
		/// 请求类型
		/// </summary>
		/// <type name="String" />
		contentType : null,
		
		/// <summary>
		/// 同步
		/// </summary>
		/// <type name="Boolean" />
		async : true,
		
		/// <summary>
		/// 超时时间
		/// </summary>
		/// <type name="Number" />
		timeouts : 0,
*/

		/**
		 * 是否存储  XMLHttpRequest  实例 。
		 * @type {Boolean} 
		 */
		saveState : true,
		
		async: true,
		
		/**
		 * 初始化当前请求。
		 * @param {Object} obj 配置对象。
		 * @constructor Ajax
		 */
		constructor : function(obj){
			this.init(obj);
		},
		
		init: function(obj){
			Class.extend(this, obj);
			var me = this;
				
				
				
			me.xhr = new XMLHttpRequest();
			
		},
		
	/*
	/// <summary>
		/// 数据源
		/// </summary>
		/// <type name="Object" />
		dataSource : null,
		
		/// <summary>
		/// 数据
		/// </summary>
		/// <type name="Object" />
		data : null,
		
		/// <summary>
		/// 用户名。
		/// </summary>
		/// <type name="String" />
		username : null,
		
		/// <summary>
		/// 密码。
		/// </summary>
		/// <type name="String" />
		password : null,
		
		/// <summary>
		/// 数据源。 (String param)
		/// </summary>
		/// <type name="Object" />
		dataSource : null,
		
		/// <summary>
		/// 编码
		/// </summary>
		/// <type name="String" />
		/// <value>
		/// utf-8   国际
		/// gb2312  中文
		/// gbk     中文繁体
		/// </value>
		charset : null,
		
		/// <summary>
		/// 如果修改过返回
		/// </summary>
		/// <type name="String" />
		/// <value>
		/// new Date()
		/// </value>
		ifModified : null,
		
		/// <summary>
		/// 数据JSONP回调参数
		/// </summary>
		/// <type name="String" />
		jsonp : null,
		
		/// <summary>
		/// 数据解析类型
		/// </summary>
		/// <type name="String" />
		/// <value>
		/// jsonp    跨站函数请求
		/// json     对象数据
		/// xml      XML数据
		/// js       JS数据
		/// html     HTML数据
		/// text     文本数据（默认）
		/// </value>
		dataType : null,
*/
		
		/**
		 * 发送请求。
		 */
		send : function(data){
		
			assert(this.url, "地址必须不空");
		
				/**
				 * 临时
				 */
			var t,
			
				/**
				 * 当前实例。
				 * @type Ajax
				 */
				me = this,
				
				/**
				 * 数据。
				 * @type mixed
				 */
				data = data || this.data
				
				/**
				 * 位置。
				 * @type String
				 */
				url = me.url,
				
				/**
				 * 类型。
				 * @type String
				 */
				dataType = me.dataType,
	            
	            /**
	             * 触发一个事件。
	             * @param {Object} name 事件。
	             * @param {Object} e 事件参数。
	             */
				dispatch = me.triggerListener ? function(name, e){
				    return me.triggerListener(name, e);
				}: function(name, e){
					name = "on" + name;
				    return !me[name] || me[name](e) !== false;
				},

				/**
				 * 请求。
				 * @type String
				 */
				type = me.type && me.type.toUpperCase() || "GET";
			
			/// #region 数据
			
			// 如果开始不是字符串。改成参数。
			if (typeof data !== 'string') 
				data = String.param(data);
			
			// 构建jsonp请求字符集串。jsonp是跨域请求，要加上callback=？后面将会进行加函数名
			if (dataType == 'jsonp') {
				me.jsonp = me.jsonp || "callback";
				if (!data.match(jsre) || (type == 'GET' && !url.match(jsre))) {
					data = String.concat(data, data.length ? '&' : '', me.jsonp, '=?');
					dataType = 'json';
				}
			}
			
			// 生成 JSON 函数
			if (dataType == 'json' && (data.length && data.match(jsre) || url.match(jsre))) {
				var jsonp = "jsonp" + (++Py.id), t = '=' + jsonp + '$1';
				
				// 替换所有  =？
				if (data.length) 
					data = data.replace(jsre, t);
				
				url = url.replace(jsre, t);
				
				dataType = 'js';
				
				// jsonp   回调函数
				window[jsonp] = function(tmp){
					data = tmp;
					if(dispatch("success"))
	                    dispatch("complete");
					
					// 回收资源
					window[jsonp] = undefined;
					
					try {
						delete window[jsonp];
					}  catch (e) {
					}
					if (head) 
						head.removeChild(script);
				};
			}
			
			if (me.cache === false && type == 'GET') {
				t = Date.now();
				var ret = url.replace(/(\?|&)_=.*?(&|$)/, '$1_=' + t + '$2');
				url = ret + ((ret == url) ? (url.contain('?') ? '&' : '?') + '_=' + t : '');
			}
			
			if (data.length && type == 'GET') {
				url += (url.contain('?') ? '&' : '?') + data;
				data = me.data = null;
			}
			
			
			// 获取绝对位置
			t = /^(\w+:)?\/\/([^\/?#]+)/.exec(url);
			
			// 当 GET 为跨站请求
			if (dataType == 'js' && type == 'GET' && t &&
			(t[1] && t[1] != location.protocol || t[2] != location.host)) {
			
				assert(me.async, "当前请求为跨站脚本请求，不支持同步");
				
				if(init() === false){
					return me;
				}
				
				var head = document.getElementsByTagName('head')[0];
				var script = document.createElement('script');
				script.src = url;
				if (me.charset != null) 
					script.charset = me.charset;
				script.type = "text/javascript";
				
				// 指定加载函数
				if (!jsonp) {
					var done = false;
					
					// 指定加载事件
					script.onload = script.onreadystatechange = function(){
						if (!done &&
						(!this.readyState ||
						this.readyState == 'loaded' ||
						this.readyState == 'complete')) {
							done = true;
							success();
							complete();
							
							// 避免内存泄露
							script.onload = script.onreadystatechange = null;
							head.removeChild(script);
						}
					};
				}
				
				head.appendChild(script);
				
				// 通过TAG完成加载
				return me;
			}
			
			/// #endregion
			
			var requestDone = false;
			
			var xhr = me.xhr || new XMLHttpRequest();
	
			try {
			
			    if (me.username) 
				    xhr.open(type, url, me.async, me.username, me.password);
			    else 
				    xhr.open(type, url, me.async);
			} catch (e) {
				
				//  出现错误地址时  ie 在此产生异常
			    trace.error(e.message);
				me.status = "error";
			    dispatch("error", xhr);
				dispatch("complete");
			    return me;
			}
			
			try {
				if (me.ifModified) 
					xhr.setRequestHeader('If-Modified-Since', (me.ifModified === true ? XMLHttpRequest.lastModified[me.url] : me.ifModified) || 'Thu, 01 Jan 1970 00:00:00 GMT');
				
				if (!me.contentType) 
					me.contentType = "application/x-www-form-urlencoded";
				
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				
				if (me.charset)
					xhr.setRequestHeader("Accept-Charset", me.charset);
				
				xhr.setRequestHeader('Content-Type', me.contentType);
				
				t = dataType && Ajax.accepts[dataType] ? (Ajax.accepts[dataType] + ', */*') : Ajax.accepts._default;
				
				xhr.setRequestHeader('Accept', t);
			} catch (e) {
			
			} 
			
			if (!dispatch("init")) {
				xhr.abort();
				return me;
			}
			
			var onreadystatechange = function(flag, isTimeout){
				
				if (xhr.readyState == 0) {		//没有任何状态
					clear();
				} else if (!requestDone && xhr && (xhr.readyState == 4 || isTimeout)) {
					requestDone = true;
					
					clear();
					
					me.status = isTimeout ? isTimeout : !XMLHttpRequest.isOk(xhr) ? (xhr.statusText || 'error') : me.ifModified && XMLHttpRequest.httpNotModified(xhr, me.url) ? 'notmodified' : 'success';
					
					if (me.status == 'success') {
						try {//初期确定字符串。如果进入if，说明成功
							var ct = xhr.getResponseHeader('content-type'), xml = type == 'xml' || !type && ct && ct.contain('xml'), data = xml ? xhr.responseXML : Ajax.decode(xhr.responseText, me.charset);
							
							assert(!xml || data.documentElement.tagName != 'parsererror', "处理XML产生错误,以下字符不是有效XML\me\n{0}", data);
							
							if (typeof data === 'string') {
								// 如果是  js  则执行
								if (dataType == "js") 
									Py.eval(data);
								
								// 如果是  json  则执行
								else if (dataType == 'json') 
										data = window.eval('(' + data + ')');
							}
							
							
						}catch (e) {
							trace.error("\"{0}\"   不是合法的 {1} 。转换错误", data, dataType);
							me.status = 'parsererror';
						}
						
					}
						
					//完成成功
					if (me.status == 'success') {
						var modRes;
						try {
							modRes = xhr.getResponseHeader('Last-Modified');
						}  catch (e) {
						}
						
						if (me.ifModified && modRes){
							if(!XMLHttpRequest.lastModified)XMLHttpRequest.lastModified = {};
							XMLHttpRequest.lastModified[me.url] = modRes;
						} 
						
						// JSONP自己处理回调函数
						if (!jsonp) 
							dispatch("success", {data : data, contentType : ct, xml : xml});
					}
					
					//判断是否超时
					if (isTimeout) {
						xhr.abort();
						if(isTimeout == "timeout")
							dispatch("ontimeout");
					}
					
					if (me.status != 'success')
						dispatch("error", xhr);
					
					dispatch("complete");
					
					if (me.saveState)
						me.xhr = xhr;
						
					if (me.async)
						xhr = null;
				}
				
			};
			
			//异步时，定义计时器跟踪状态
			if (me.async) {
				var ival = setInterval(onreadystatechange, 13),
					clear = function(){
						if (ival) {
							clearInterval(ival);
							ival = null;
						}
					};
				
				if (me.timeouts > 0) 
					setTimeout(function(){
						if (xhr && !requestDone) 
							onreadystatechange(0, "timeout");
					}, me.timeouts);
			}
			
			try {
				xhr.send(Ajax.encode(data, me.charset));
			} catch (e) {
				
				//  opera  将在此出现错误
				trace.error(e.message);
				onreadystatechange(0, "error");
			}
			
			if(me.saveState){	//加速下次初始化
				me.data = data;
				me.url = url;
				me.dataType = dataType;
			}
			
			// 不是同步时，火狐不会自动调用 onreadystatechange
			if (!me.async) 
				onreadystatechange();
			
			return me;
					
		},
		
		/**
		 * xType
		 * @type String
		 */ 
		xType : "Ajax",
		
		/**
		 * 停止当前的请求。
		 */
		_abort : function(){
			var me = this;
			if (me.xhr) {
				me.xhr.abort();
			}
		}
								   
	}, true).implement(Py.IEvent) );
		
	Object.extendIf(Ajax, {
		
		/// <summary>
		/// 所有可接受的类型
		/// </summary>
		/// <type name="Enum" />
		accepts: {
				xml : 'application/xml, text/xml',
				html : 'text/html',
				js : "text/javascript, application/javascript",
				json : "application/json, text/javascript",
				text : 'text/plain',
				_default : '*/*'
		},
		
		/// <summary>
		/// 发送请求
		/// </summary>
		/// <params name="obj" type="Object">配置信息</params>
		send: function(obj){
			Ajax.prototype.send.call(obj);
			obj = null;
		},
		
		/// <summary>
		/// 改写此函数实现ajax发送前数据编码
		/// </summary>
		/// <params name="data" type="String">内容</params>
		/// <params name="encode" type="String">当前编码</params>
	    /// <abstract />
		encode: function(data, encode){
			return data;
		},
		
		/// <summary>
		/// 改写此函数实现ajax发送后数据编码
		/// </summary>
		/// <params name="data" type="String">内容</params>
		/// <params name="encode" type="String">当前编码</params>
	    /// <abstract />
		decode: function(data, encode){
			return data;
		},
		
		/// <summary>
		/// 快速请求get一个地址
		/// </summary>
		/// <params name="url" type="String">地址</params>
		/// <params name="data" type="String" optional="true">数据</params>
		/// <params name="callback" type="Function" optional="true">返回信息处理函数，参数为信息</params>
		/// <params name="type" type="String" optional="true">类型，见<see cref="Array.prototype.dataType" /></params>
		get: function(url, data, callback, type){
			Ajax.prototype.send.call({
				url : url,
				
				data : data,
				
				onsuccess: callback && function(eventArgs){
					callback(eventArgs.data);
				},
				
				dataType : type,
				
				type : "GET"
				
			});
		},
		
		/// <summary>
		/// 快速请求post一个地址
		/// </summary>
		/// <params name="url" type="String">地址</params>
		/// <params name="data" type="String" optional="true">数据</params>
		/// <params name="callback" type="Function" optional="true">返回信息处理函数，参数为信息</params>
		/// <params name="type" type="String" optional="true">类型，见<see cref="Array.prototype.dataType" /></params>
		post: function(url, data, callback, type){
			Ajax.prototype.send.call({
				url : url,
				
				data : data,
				
				onsuccess: callback && function(eventArgs){
					callback(eventArgs.data);
				},
				
				dataType : type,
				
				type : "POST"
				
			});
		},
		
		/// <summary>
		/// 发送一个表单
		/// </summary>
		/// <params name="theForm" type="HTMLFormElement">表单</params>
		/// <params name="url" type="String">地址</params>
		/// <params name="callback" type="Function" optional="true">返回信息处理函数，参数为信息</params>
		/// <params name="type" type="String" optional="true">类型，见<see cref="Array.prototype.type" /></params>
		postf: function(theForm, callback, type){
			theForm = document.getDom(theForm);
			Ajax[theForm.method.toLowerCase() == "get" ? "get" : "post"](theForm.action, HTMLFormElement.load.call(theForm,"string"), callback, type);
		},
		
		/// <summary>
		/// 获取一个值，然后更新到一个元素或对象的  value  属性。
		/// </summary>
		/// <params name="obj" type="Element">元素</params>
		/// <params name="url" type="String">地址</params>
		/// <params name="callback" type="Function" optional="true">回调函数</params>
		/// <params name="loadingMessage" type="String" optional="true">初始化内容</params>
		/// <params name="errorMessage" type="String" optional="true">错误的内容</params>
		update: function(obj, url, callback, loadingMessage, errorMessage) {
			
			obj = document.getDom(obj);
			
			assert.notStatic(obj,"obj不是动态变量");
			
			var n = obj.tagName, attribute = !n || n == "INPUT" || n == "TEXTAREA" ? "value" : "innerHTML";
	
			Ajax.prototype.send.call({
				
				url : url,
				
				data : {
					
					value : obj[attribute],
					
					id : obj.id
					
				},
				
				type : "POST",
				
				onpreinit : loadingMessage !== undefined ? function(){
					obj[attribute] = loadingMessage;
				} : null,
				
				onsuccess : function(eventArgs){
					var value = callback ? callback(eventArgs.data, obj[attribute]) : eventArgs.data;
					obj[attribute] = value;
				},
				
				onerror :  errorMessage !== undefined ? function(){
					obj[attribute] = errorMessage;
				} : null
				
			});
			
			
		}
		
	});
	
	Ajax.prototype.play = Ajax.prototype.send;
	Ajax.play = Ajax.send;
	
	Object.extendIf(document, {
		
		/// <summary>
		/// 根据id返回节点。
		/// </summary>
		/// <params name="id" type="String">id</params>
		/// <params name="id" type="Node">节点</params>
		/// <returns type="Element">元素</returns>
		getDom : function(id){
			return !id ? null : (id.dom || ( typeof id != "string" ? id : document.getElementById(id)) );
		}
		
	})
	
	
	Py.namespace("HTMLFormElement");
	
	/// <summary>
	/// 载入一个表单的数据
	/// </summary>
	/// <params name="type" type="String">数据类型</params>
	/// <value>string   object</value>
	/// <returns type="Object">内容</returns>
	/// <returns type="String">数据</returns>
	HTMLFormElement.load = function(type) {
		var theFrom = this, s = {formname : theFrom.name || theFrom.id}, e, v, t;
		for(var i = 0, len = theFrom.length; i < len; i++){
			e = theFrom[i];
			v = e.value;
			switch(e.tagName){
				case "INPUT":
					t = e.type;
					if(t == "checkbox") v = e.checked ? "on" : "off";
					else if (t == "radio") {
						if(e.checked)s[e.name || e.id] = v;
						continue;
					} else if(t == "button" || t == "submit" || t == "reset")
						continue;
					break;
				case "SELECT":
					t = e.selectedIndex;
					if(e.type != 'select-one' && t != -1){
						var l = e.options.length;
						while(++t < l)
							if(e.options[t].selected)
								v += ',' +e.options[t].value;
					}
					break;
				case "IFRAME":
					if (e.name == 'a_editor' && window.FCKeditorAPI) {
						v = FCKeditorAPI.GetInstance("a_editor").GetXHTML(false).replace(/^\<p\>|\<\/p\>$/g, "");
						break;
					}else if(e.xType == 'Editor'){
						v = e.val();
					}
			}
			
			t = e.name || e.id;
			if(t)
				s[t] = v;
				
		}
		
		if (type == "object") 
			return s;
		else
			return String.param(s);
	}
	
	
	/// <summary>
	/// 判断请求是否修改
	/// </summary>
	/// <params name="xhr" type="XMLHttpRequest">请求</params>
	/// <params name="url" type="String">地址</params>
	/// <returns type="Boolean">布尔</returns>
	XMLHttpRequest.httpNotModified = function( xhr, url ){
		try{
			var xhrRes = xhr.getResponseHeader('Last-Modified');
	
			// 火狐返回状态  200.检查是否修改
			return xhr.status == 304 || xhrRes == XMLHttpRequest.lastModified[url];
		}catch(e){}
		return false;
	 }
	
})(Py);
