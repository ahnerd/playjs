//===========================================
//  列表选择   listbox.js         A
//===========================================





Py.using("System.Controls.ListControl");
Py.imports("Resources.*.Form.ListBox");


Py.namespace(".ListBox", Py.ListControl.extend({
	
	xType: 'listbox',
	
	selectionMode: 'one',  //    none multiSimple   multiExtended
	
	init: function(options){
		
		this.initChildren('items');
		
		this.on('click', this.onClick);
	},
	
	initItem: function(item){
		if(!item.getDom){
			item = document.createTextNode(item);
		}
		return item.setUnselectable();
	},
	
	toggleSelectedItem: function (item, e) {
		this.selectItem(item);
	},
	
	onClick: function (e) {
		var me = this.controls, node = e.target;
		while(node){
			if(node.tagName === 'LI'){
				for(var i = me.length; i--;){
					if((me[i].dom || me[i]).parentNode === node){
						this.toggleSelectedItem(me[i], e);
						return;
					}
				}
			}
			node = node.parentNode;
		}
	},
	
	selectedItem: null,
	
	getSelectedIndex: function () {
		return this.controls.indexOf(this.getSelectedItem());
	},
	
	setSelectedIndex: function (index) {
		return this.selectItem[this.controls[index]];
	},
	
	getSelectedItem: function () {
		return this.selectedItem;
	},
	
	selectItem: function(item){
		var sel = this.selectedItem;
		this.unselectItem(sel);
		if(sel != item){
			this.selectedItem = item;
			item.get('parent').addClass('x-selected');
		}
		
		return  this;
	},
	
	unselectItem: function(item){
		this.selectedItem = null;
		if (item)
			item.get('parent').removeClass('x-selected');
			
		return  this;
	}
	
}));