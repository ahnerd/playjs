
			
			/**
			 * 显示当前元素。
			 * @method show
			 * @param {Number} duration=500 时间。
			 * @param {String} [type] 方式。
			 * @return {Element} this
			 */
			show: function(d, type) {
				
				var me = this;
				
				me.dom.show(d, function(){
					me.trigger('show');
				}, type);
				
				return   me;
			},
	
			/**
			 * 隐藏当前元素。
			 * @method hide
			 * @param {Number} duration=500 时间。
			 * @param {String} [type] 方式。
			 * @return {Element} this
			 */
			hide: function(d, type) {
				
				var me = this;
				
				me.dom.hide(d, function(){
					me.trigger('hide');
				}, type);
				
				return   me;
			},