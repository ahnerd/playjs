




Py.using("System.Controls.Button");



Py.namespace("Py", "MenuButton", Py.Button.extend({

	setSubMenu: function(subMenu){
		
		this.content.append(document.create('span', 'x-button-menu'));
		
		this.subMenu = subMenu;
		
		this.on('click', this.onClick);
	},
	
	onClick: function(e){
		this.subMenu.showBy(this);
		
		document.one('mouseup', Function.bind(this.subMenu.hide, this.subMenu));
	}

}));
