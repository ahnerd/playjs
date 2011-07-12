//===========================================
//  菜单按钮   splitbutton.js         A
//===========================================



Py.imports("Resources.*.Button.SplitButtons")   ;
Py.using("System.Controls.MenuButton");



Py.namespace(".SplitButton", Py.MenuButton.extend({
	
	// tpl: '<a class="x-button">\
				// <span class="x-button-container">\
					// <button type="button"><span class="x-button-label"></span></button>\
				// </span>\
			// </a>',
	
	checkHidding: function (target) {
		if(this.menuButton.contains(target))
			this._hidding = true;
	},

	onInitDropDownMenu: function(){
		
		this.addClass('x-splitbutton');
		this.find('.x-button-container').append(document.create('span', 'x-split').setHtml('&nbsp;'));
		this.menuButton = this.find('.x-button-container').append(document.create('span', 'x-button-menu').setHtml('&nbsp;'));
		this.menuButton.on('click', Function.bind(this.showDropDownMenu, this));
	}

}));
