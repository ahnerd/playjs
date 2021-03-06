//===========================================
//  列表选择   listbox.js         A
//===========================================





using("System.Controls.ListControl");
imports("Resources.*.Form.ListBox");


namespace(".ListBox", Py.ListControl.extend({
	
	xType: 'listbox',
	
	//    selectionMode: 'one',  //    none multiSimple   multiExtended
	
	init: function(options){
		
		this.base('init', options);
		
		this.on('click', this.onClick);
	},
	
	toggleSelectedItem: function (item, e) {
		if(this.trigger('changing', item))
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
	
	onChange: function () {
		this.trigger('change');
	},
	
	selectItem: function(item){
		var sel = this.selectedItem;
		this.unselectItem(sel);
		if(sel != item){
			this.selectedItem = item;
			(item.dom || item).parentNode.addClass('x-selected');
			this.onChange();
		}
		
		return  this;
	},
	
	unselectItem: function(item){
		this.selectedItem = null;
		if (item)
			(item.dom || item).parentNode.removeClass('x-selected');
			
		return  this;
	}
	
}));