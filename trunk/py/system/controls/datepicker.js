//===========================================
//  组合文本框      datepicker.js       A
//===========================================


using("System.Controls.IMenuContainer");
using("System.Controls.CombinedTextBox");
using("System.Core.Date");
using("System.Controls.MonthCalender");


namespace(".DatePicker", Py.CombinedTextBox.extend({
	
	

	init: function (options) {
		this.baseCall('init', options);


		this.bindMenuButton('click', this.showDropDownMenu);
		this.setMenuButton('date');
		this.setDropDownMenu(new Py.MonthCalender().on('changing', Function.bind(this.onSelect, this)));
		
		this.on('change', this.onTextChange);
		
	},
	
	format: 'yyyy/M/d',
	
	onSelect: function (value) {
		this.setText(value.toString(this.format));
		
		this.hideDropDownMenu();
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
	
	resizeDropDownMenu: false,

	onInitDropDownMenu: Function.empty





}).implementIf(Py.IMenuContainer));