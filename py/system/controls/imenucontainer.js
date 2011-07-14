//===========================================
//  菜单容器      imenucontainer.js       A
//===========================================



Py.IMenuContainer = {
	
	duration: 0,
	
	resizeDropDownMenu: true,

	setDropDownMenu: function(dropDownMenu){
		
		if(!this.dropDownMenu){
			this.onInitDropDownMenu();
			dropDownMenu.setStyle('position', 'absolute');
		}
		
		this.dropDownMenu = dropDownMenu;
		
		dropDownMenu.hide();
		
		if(!(dropDownMenu.dom || dropDownMenu).parentNode){
			dropDownMenu.renderTo(this.get('parent'));
		}
		
	},
	
	realignDropDownMenu: function (offsetX, offsetY) {
		var ctrlRegion = this.getBound(),
			dropDownMenu = this.dropDownMenu,
			size = this.getSize(),
			documentSize = document.getSize(),
			expectedY = ctrlRegion.bottom + offsetY,
			expectedX = ctrlRegion.left + offsetX;
		
		// 如果显示之后超出了屏幕右方。
		if( expectedY + size.y > documentSize.y ) {
			
			// 移到左边。
			expectedY = ctrlRegion.top - size.y - offsetX;
			
			if(expectedY < 0){
				expectedY = 0;
				this.onOverflowY(documentSize.y);
			}
		}
		
		// 如果垂直部分超出了。进行上移。
		if( expectedX + size.x > documentSize.x) {
			//  expectedY = Math.max(0, documentSize.y - size.y);
			expectedX = Math.max(0, ctrlRegion.right - size.x - offsetX);
		}
			
		dropDownMenu.setPosition(expectedX, expectedY);
	},
	
	onOverflowY: function (max) {
		if(this.dropDownMenu.onOverflowY)
			this.dropDownMenu.onOverflowY(documentSize.y);
	},
	
	showDropDownMenu: function(){
		
		if(this._hidding){
			this._hidding = false;
			return ;	
		}
		
		this.trigger('dropdownmenuopening');
		this.dropDownMenu.show(this.duration);
		this.realignDropDownMenu(0, 0);
		if(this.resizeDropDownMenu)
			this.dropDownMenu.setSize(this.getSize().x);
		this.trigger('dropdownmenuopened');
		
		if(!this.handleMouseUp){
			this.handleMouseUp = Function.bind(this.hideDropDownMenu, this);
		}
		
		document.on('mouseup', this.handleMouseUp);
	},
	
	hideDropDownMenu: function (e) {
		
		if(this.dropDownMenu.contains(e.target))
			return;
		
		this.trigger('dropdownmenuclosing');
		this.dropDownMenu.hide();
		document.un('mouseup', this.handleMouseUp);
		
		this.checkHidding(e.target);
	},
	
	checkHidding: function (target) {
		if(this.dom.contains(target))
			this._hidding = true;
	}

	
	
};
