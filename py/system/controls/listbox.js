





Py.using("System.Controls.ListControl");
Py.imports("Resources.*.Form.ListBox");


Py.namespace("Py", "ListBox", Py.ListControl.extend({
	
	xType: 'listbox',
	
	selectionMode: 'one',  //    none multiSimple   multiExtended
	
	initItem: function(item){
		if(!item.getDom){
			item = document.createTextNode(item);
		}
		
		item = this.baseCall('initItem', item);
		
		var me = this;
		item.setUnselectable();
		item.onclick = function(e){
			me.selectItem(this);
		};
		
		
		return item;
	},
	
	selectedItem: null,
	
	selectItem: function(item){
		var sel = this.selectedItem;
		this.unselectItem(sel);
		if(sel != item){
			this.selectedItem = item;
			item.addClass('x-selected');
		}
		
	},
	
	unselectItem: function(item){
		this.selectedItem = null;
		if (item)
		item.removeClass('x-selected');
	},
	
	selectItems: function(items){
		
	}
	
}));