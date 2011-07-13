//===========================================
//  菜单按钮   memubutton.js         A
//===========================================



imports("Resources.*.Form.MenuButtons")   ;
using("System.Controls.IMenuContainer");
using("System.Controls.Button");



namespace(".MenuButton", Py.Button.extend({
	
	// tpl: '<a class="x-button x-menubutton">\
				// <span class="x-button-container">\
					// <button type="button"><span class="x-button-label"></span><span class="x-button-menu">&nbsp;</span></button>\
				// </span>\
			// </a>',
			
	// init: function (options) {
		// this.baseCall('init', options);
// 		
		// //  this.find('.x-button-menu').on('click', Function.bind(this.onMenuButtonClick))
	// },
	
	onInitDropDownMenu: function () {
		this.addClass('x-menubutton');
		this.button.append(document.create('span', 'x-button-menu').setHtml('&nbsp;'));
		this.on('click', this.showDropDownMenu);
	}
	
}).implement(Py.IMenuContainer));
