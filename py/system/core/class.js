

			
			/**
			 * 扩充类的静态成员。
			 * @param {Object} obj
			 */
			statics: function(obj){
				assert(obj, "Py.Native.prototype.statics(obj): 参数 {obj} 不能为空。", obj);
						
				return applyIf(this, obj);
			},