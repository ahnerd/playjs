


Py.using("System.Data.CollectionBase");



///  #region ControlCollection


/**
 * 控件集合。
 * @class ControlCollection
 */
Py.Control.ControlCollection = Py.Data.CollectionBase.extend({
		
	constructor: function(owner){
		this.owner = owner;
	},
	
	check: function(childControl){
		
		// 如原来控件已经有父节点，先删除。
		if(childControl.parent){
			childControl.parent.controls.remove(childControl);
		}
		
		return childControl;
	},
	
	onInsert: function(item, index){
		item.parent = this.owner;
		this.owner.onControlAdded(item, index);
	},
	
	onRemove: function(item, index){
		this.owner.onControlRemoved(item, index);
		item.parent = null;
	}
});

/// #endregion



Py.IParentControl = {
	
	alternativeName: 'items',
	
	initChildren: function(options){
		
		var name = this.alternativeName;
		
		if(options[ name ]){
			options.controls = options[ name ];
			delete options[ name ];
		}
		
		this[ name ] = this.controls;
		
	},
	
	findControl: function(fn){
		if (typeof fn == 'string') {
			var id = fn;
			fn = function(ctrl) {
				return ctrl.getDom().id === id;
			};
		}
			
		for(var controls = this.controls, i = 0; i < controls.length; i++){
			var ct = controls[i], r;
			if(fn(ct))
				return ct;
			
			if (ct.findControl) {
				r = ct.findControl(fn);
				if(r)
					return r;
			}
		}
		
		
		return null;
		
	}
	
	
};