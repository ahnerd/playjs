//===========================================
//  请求   Ajax.js
//===========================================


(function(p){
	
	/**
	 * 处理异步请求的功能。
	 * @class Ajax
	 */ 
	p.namespace("Py", "Ajax", p.Class({
		
		
		/**
		 * 初始化当前请求。
		 * @param {Object} obj 配置对象。
		 * @constructor Ajax
		 */
		constructor: function(obj){
			if(obj)
				Object.extend(this, obj);
		},
		
		/**
		 * 发送请求前检查。
		 * @param {Object} data 数据。
		 * @return {Boolean} 是否可发。
		 */
		check: function(data){
			if(!this.activeXhr) return true;
			switch (this.link){
				case 'cancel':
					this.abort();
					return true;
				case 'wait':
					this.one('complete', function(){
						this.send(data, true);
						return false;
					});
					return false;
			}
			return true;
		},
		
		/**
		 * 发送请求。
		 */
		send : function(data, chain){
				
			assert(this.url, "地址必须不空");
		
			/**
			 * 当前实例。
			 * @type Ajax
			 */
			var me = this,
				
				/**
				 * 类型。
				 * @type String
				 */
				type = me.type && me.type.toUpperCase() || "GET",
				
				/**
				 * 当前请求。
				 * @type String
				 */
				url = me.url,
				
				/**
				 * 是否异步请求。
				 */
				async = me.async !== false;
				
			/**
			 * 数据。
			 * @type String
			 */
			data = data || me.data || "";
			
			if (!me.check(data)) {
				return me;
			}
			
			me.trigger("send", chain);
			
			/// #region 数据
			
			// 如果开始不是字符串, 改成参数
			if(typeof data !== 'string')
				data = String.param(data);
			
			// get  请求
			if (data.length && type == 'GET') {
				url += (/\?/.test(url) ? '&' : '?') + data;
				data = null;
			}
			
			/// #endregion
			
			/// #region 打开
			
			/**
			 * 是否完成。
			 * @type Boolean
			 */
			var requestDone = false,
				
				/**
				 * 请求对象。
				 * @type XMLHttpRequest
				 */
				xhr = me.activeXhr = me.xhr || new XMLHttpRequest();
	
			try {
			
			    if (me.username) 
				    xhr.open(type, url, async, me.username, me.password);
			    else 
				    xhr.open(type, url, async);
			} catch (e) {
				
				me.activeXhr = null;
				//  出现错误地址时  ie 在此产生异常
			    trace.error(e.message);
				me.status = "error";
				me.trigger("error", xhr);
				me.trigger("complete", xhr);
			    return me;
			}
			
			/**
			 * 添加请求头。
			 * @param {String} value 名。
			 * @param {String} key 值。
			 */
			var srh = function(value, key){
				xhr.setRequestHeader(key, value);
			};
				
			try {
				if(me.urlEncoded)
					srh('contentType', 'application/x-www-form-urlencoded' + (me.encoding ? '; charset=' + me.encoding : ''));
				if(me.headers)
					Object.each(me.headers, srh);
					
			} catch (e) {
			
			} 
			
			/// #endregion
			
			/// #region 发送
			
			// 监视 提交是否完成
			var onreadystatechange = xhr.onreadystatechange = function(flag, isTimeout){
				
				if (xhr.readyState == 0) {		//没有任何状态
					xhr.onreadystatechange = Function.empty;
				} else if (!requestDone && xhr && (xhr.readyState == 4 || isTimeout)) {
					requestDone = true;
					
					xhr.onreadystatechange = Function.empty;
					
					me.activeXhr = null;
					
					//判断是否超时
					if (isTimeout) {
						xhr.abort();
						me.trigger("timeout", xhr);
					}
					
					// 获取状态。
					me.status = isTimeout || (!XMLHttpRequest.isOk(xhr) ? (xhr.statusText || 'error') : 'success');
					
					if (me.status == 'success') {
						me.trigger("success", xhr[/xml/.test(xhr.getResponseHeader('content-type')) ? 'responseXML' : 'responseText']);
					}else{
						me.trigger("error", xhr);
					}
					
					me.trigger("complete", xhr);
					
					xhr = null;
				}
				
			};
			
			//异步时，定义计时器跟踪状态
			if (async && me.timeouts > 0) {
				setTimeout(function(){
					if (xhr && !requestDone) 
						onreadystatechange(0, "timeout");
				}, me.timeouts);
			}
			
			
			try {
				xhr.send(me.data);
			} catch (e) {
				
				//  opera  将在此出现错误
				trace.error(e.message);
				onreadystatechange(0, "error");
			}
			
			// 不是同步时，火狐不会自动调用 onreadystatechange
			if (!async) 
				onreadystatechange();
			
			/// #endregion
			
			return me;
					
		},
		
		/**
		 * xType
		 * @type String
		 */ 
		xType : "ajax",
			
		/**
		 * 停止当前的请求。
		 */
		abort : function(){
			if(this.activeXhr) {
				this.activeXhr.abort();
				this.trigger("abort");
				this.activeXhr = null;
			}
		}
								   
	}).addEvents() );
	
	String.map("get post", function(k){
	
		/**
		 * 快速请求一个地址。
		 * @param {Object} url 地址。
		 * @param {Object} data 数据。
		 * @param {Object} callback 成功回调函数。
		 * @param {Object} type 类型。
		 */
		return function(url, data, onsuccess, onerror, timeouts, ontimeout){
			new Ajax({
				url: url,
				data: data,
				onsuccess: onsuccess,
				onerror: onerror,
				timeouts: timeouts,
				ontimeout: ontimeout,
				type: k
			}).send();
		};
	}, Ajax);
	
})(Py);
