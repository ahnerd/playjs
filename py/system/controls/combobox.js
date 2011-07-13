//===========================================
//  组合文本框      combobox.js       A
//===========================================


using("System.Controls.IMenuContainer");
using("System.Controls.CombinedTextBox");
using("System.Controls.ListBox");


namespace(".ComboBox", Py.CombinedTextBox.extend({
	
	

	init: function (options) {
		this.baseCall('init', options);


		this.bindMenuButton('click', this.showDropDownMenu);
		this.setMenuButton('down');
		this.setDropDownMenu(new Py.ListBox().on('changing', Function.bind(this.onSelect, this)));
		
		this.on('change', this.onTextChange);
		
		this.items = this.dropDownMenu.items;
		
	},
	
	onSelect: function (value) {
		this.setText(Element.prototype.getText.call(value));
		
		this.hideDropDownMenu();
		
		return false;
	},
	
	onTextChange: function (e) {
		var d = new Date(this.getText());
		if(!isNaN(d.getYear()))
			this.dropDownMenu.setValue(d);
	},
	
	hideDropDownMenu: function (e) {
		
		if(e && this.dropDownMenu.contains(e.target))
			return;
		
		this.trigger('dropdownmenuclosing');
		this.dropDownMenu.hide();
		document.un('mouseup', this.onMouseUp);
		
		 if(e)
		     	this.checkHidding(e.target);
	},

	onInitDropDownMenu: Function.empty





}).implementIf(Py.IMenuContainer));