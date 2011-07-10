//===========================================
//  可作为容器的控件接口   icontainercontrol.js         A
//===========================================


Py.using("System.Data.Collection");



///  #region ControlCollection


/**
 * 控件集合。
 * @class ControlCollection
 */
Py.Control.ControlCollection = Py.Collection.extend({
		
	constructor: function(owner){
		this.owner = owner;
	},
	
	initItem: function(childControl){
		
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

/**
 * 可作为容器的控件接口。
 * @interface
 * 实现这个接口的函数必须实现 2 个函数:
 * onControlAdded(elem, index) 和  onControlRemoved(elem, index)
 */
Py.IContainerControl = {
	
	/**
	 * 获取目前所有子控件。
	 * @type {Py.Control.ControlCollection}
	 * @name controls
	 */
	
	initChildren: function () {
		this.controls = new Py.Control.ControlCollection(this);
	},
	
	/**
	 * 使用指定函数或 ID 获取指定的子控件。
	 * @param {String/Function} fn 查找的控件的ID/查找过滤的函数。
	 * @param {Boolean} child=true 是否深度查找。
	 * @return {Control} 控件。
	 */
	findControl: function(fn, child){
		if (typeof fn == 'string') {
			var id = fn;
			fn = function(ctrl) {
				return (ctrl.dom || ctrl).id === id;
			};
		}
			
		for(var controls = this.controls, i = 0; i < controls.length; i++){
			var ct = controls[i], r;
			if(fn(ct))
				return ct;
			
			if (child !== false && ct.findControl) {
				r = ct.findControl(fn, child);
				if(r)
					return r;
			}
		}
		
		
		return null;
		
	}
	
	
};