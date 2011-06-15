
    /**
     * Get the number of objects in the map
     *
     * @signature function(map)
     * @param map {Object} the map
     * @return {Integer} number of objects in the map
     */
    objectGetLength :
    ({
      "count": function(map) {
        return map.__count__;
      },

      "default": function(map)
      {
        var length = 0;

        for (var key in map) {
          length++;
        }

        return length;
      }
    })[(({}).__count__ == 0) ? "count" : "default"],



	
	  
		/**
		 * 判断一个对象是否空。
		 * @param {Object} object 所有变量，但不允许函数。
		 * @return {Boolean} 除了null, undefined, 空字符数组,其它变量认为不空。
		 */
		isEmpty: function(object) {

			assert(!Object.isFunction(object), "Object.isEmpty 不允许函数");

			//if (object == null) return true;

			//if (typeof object == "object" && !Object.isArray(object)) for (var name in obj) return false;

			return object == null || object.length === 0;
		},
		
		
		
		
	
	
	
	
	getObject: function(path, root) {
				
				assert(path, "Object.value(path, root): 参数 path 不能为空。");
				
				// 依次遍历。
				for (var obj = root || w, i = 0, t, n = path.split ? path.split('.') : path; t = n[i]; ++i) {
					
					// 如果对象空。
					if (obj[t] == undefined) {
							
						// 创建空对象，用于下次继续循环。
						obj[t] = {};
					}
					
					// 进行第二次循环。
					obj = obj[t];
				}
	
				return obj;
			},
			
			
			
