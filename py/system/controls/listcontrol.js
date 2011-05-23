


Py.using("System.Controls.Control");
Py.using("System.Controls.IParentControl");


Py.ListControl = Py.Control.extend({
	
	create: function(){
		var dom = document.createDiv('x-' + this.xType);
		dom.appendChild(document.create('ul', 'x-list-container x-' + this.xType + '-container'));
		return dom;
	},
	
	onControlAdded: Function.empty,
	
	onControlRemoved: Function.empty,
	
	init: function(options){
		
		this.controls = new Py.ListControl.ListItemCollection(this);
		
		this.initChildren(options);
		
		this.content = this.get('first', 'ul');
	},

	initItem: function(childControl){
		
		var li = document.create('li', 'x-list-content x-' + this.xType + '-content');
		li.appendChild(childControl.getDom());
		
		return li;
	}
	
	
}).implement(Py.IParentControl);




Py.ListControl.ListItemCollection = Py.Control.ControlCollection.extend({

	onAdd: function(childControl){
		var me = this.owner,
			li = me.initItem(childControl);
		me.content.appendChild(li);
		childControl.parent = me;
		me.onControlAdded(childControl, this.length);
	},
	
	onInsert: function(childControl, index){
		var me = this.owner,
			li = me.initItem(childControl),
			dom = this[index]; 
		me.content.insertBefore(li, dom ? dom.get('parent') : null);
		childControl.parent = me;
		me.onControlAdded(childControl, index);
	},
	
	onRemove: function(childControl, index){
		var me = this.owner;
		me.onControlRemoved(childControl);
		me.content.removeChild(childControl.get('parent'));
		childControl.parent = null;
	}
	
});
