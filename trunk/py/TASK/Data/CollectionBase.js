


(function(){
	

/**
 * 控件集合。
 * @class CollectionBase
 */
Py.namespace("Py.Data", "CollectionBase", Py.Class({
		
	length: 0,
	
	onAdd: function(item){
		return this.onInsert(item, this.length);
	},
	
		onInsert: Function.empty,
		
		onRemove: Function.empty,
		
		onBeforeSet: Function.empty,
		
		onAfterSet: Function.empty,
		
		check: function(ctrl){
			return ctrl;
		},
		
		add: function(item){
			item = this.check(item);
			Array.prototype.push.call(this, item);
			this.onAdd(item);
			return item;
		},
		
		addRange: function(args){
			args = Object.isArray(args) ? args : arguments;
			this.onBeforeSet(args);
			Array.prototype.forEach.call(args, this.add, this);
			this.onAfterSet(args);
		},
		
		insert: function(index, item){
			
			if(!(index > 0 && index < this.length)){
				return this.add(item);
			}
			
			item = this.check(item);
			
			Array.prototype.insert.call(this, index, item);
			
			this.onInsert(item, index + 1);
			
			return item;
		},
		
		clear: function(){
			this.onBeforeSet(index);
			clear(this);
			this.onAfterSet(index);
				
			return this;
		},
		
		remove: function(item){
			var index = this.indexOf(item);
			this.removeAt(index);
			return index;
		},
		
		removeAt: function(index){
			var item = this[index];
			if(item){
				Array.prototype.splice.call(this, index, 1);
				delete this[this.length];
				this.onRemove(item, index);
			}
				
			return item;
		},
			
		set: function(index, item){
			this.onBeforeSet(index);
			if(typeof index == 'number'){
				assert(index >= 0 && index < this.length, '设置的 index 超出范围。请确保 {0} <= index < {1}', 0, this.length);
				this.onInsert(item, index);
				this.onRemove(this[index], index);
				this[index] = item;
			} else{
				clear(this);
				index.forEach(this.add, this);
			}
			this.onAfterSet(index);
			return this;
		}
			
	}));
	
	String.map("indexOf contains forEach each invoke lastIndexOf", Array.prototype, Py.Data.CollectionBase.prototype);
	
	function clear(arr){
		while (arr.length) {
			var item = arr[--arr.length];
			delete arr[arr.length];
			arr.onRemove(item, arr.length);
		}
	}

})();
