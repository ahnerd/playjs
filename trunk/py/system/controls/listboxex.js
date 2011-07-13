//===========================================
//  列表选择的多选功能   listboxex.js         A
//===========================================





using("System.Controls.ListControl");
imports("Resources.*.Form.ListBox");




Py.ListBox.implement({
	
	
	selectionMode: 'one',  //    none multiSimple   multiExtended
	
	
	
	toggleSelectedItem: function (e) {
		this.selectItem(me[e]);
	},
	
	getSelectedIndex: function () {
		return this.controls.indexOf(this.getSelectedItem());
	},
	
	setSelectedIndex: function (index) {
		return this.selectItem[this.controls[index]];
	},
	
	getSelectedItem: function () {
		return this.selectionMode == 'one' ? this.selectedItem : this.selectedItems[0];
	},
	
	selectItem: function(item){
		var sel = this.selectedItem;
		this.unselectItem(sel);
		if(sel != item){
			this.selectedItem = item;
			item.getParent().addClass('x-selected');
		}
		
		return  this;
	},
	
	unselectItem: function(item){
		this.selectedItem = null;
		if (item)
			item.getParent().removeClass('x-selected');
			
		return  this;
	},
	
	getSelectedIndecies: function () {
		return Object.update(this.selectedItems, function (item, index) {
			return index;
		}, []);
	},
	
	getSelectedItems: function () {
		if(!this.selectedItems ) this.selectedItems  = [];
		return this.selectionMode == 'one' ? this.selectedItem : this.selectedItems[0];
	},
	
	selectItems: function(items){
		this.selectedItems.add(items);
	}
	
});