

		
		/**
		 * 对每个成员调用函数。
		 * @method invoke
		 * @param {Function} fn 参数。
		 * @param {Array} args 参数。
		 */
		invoke: function(fn, args){
			
			args = args || [];
			
			ap.forEach.call(this.doms, function(dom){
				dom[fn].apply(dom, args);
			});
			
			return this;
			
		},
		
		
		
		
		
		
		
	function copyProps(elem, target){
		props.forEach(function(v){
			target.style[v] = elem.getStyle(v);
		})  ;
	}