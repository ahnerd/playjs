




using("System.Controls.ITargetedControl");
using("System.Controls.ContentControl");
using("System.Controls.ListControl");

/// #region MenuItem


namespace(".MenuItem", Py.ContentControl.extend({
	
	tpl: '<a class="x-contextmenustrip-item"><span></span></a>',
	
	subMenu: null,
	
	xType: 'menuitem',
	
	/**
	 * 
	 */
	init: function(options){
		this.setUnselectable();
		this.content = this.get('last');
		this.setIcon('none');
		this.on('mouseover', this.onMouseEnter);
		this.on('mouseout', this.onMouseLeave);
	},
	
	setSubMenu: function(menu){
		if (menu) {
			this.subMenu = menu;
			this.subMenu.renderTo().hide();
			menu.floating = false;
			this.addClass('x-contextmenustrip-item-arrow');
			this.on('mouseup', this._cancelHideMenu);
		} else {
			menu.floating = true;
			this.removeClass('x-contextmenustrip-item-arrow');
			this.un('mouseup', this._cancelHideMenu);
		}
	},
	
	_cancelHideMenu: function(e){
		e.stopPropagation();
	},
	
	toggleIcon: function(icon, val){
		this.icon.toggleClass(icon, val);
		return this;
	},
	
	onMouseEnter: function(){
		
		// 使父菜单打开本菜单，显示子菜单。
		this.parent.showSub(this);

	},
	
	_hideTargetMenu: function(e){
		var tg = e.relatedTarget;
		while(tg && tg.className != 'x-menu') {
			tg = tg.parentNode;
		}
		
		if (tg) {   
			var dt = Py.data(tg, 'control');
			
			
			tg.hideSub();
		}
		
	},
	
	onMouseLeave: function(e){
		
		// 没子菜单，需要自取消激活。
		// 否则，由父菜单取消当前菜单的状态。
		// 因为如果有子菜单，必须在子菜单关闭后才能关闭激活。
		
		if(!this.subMenu)
			 this.deactive();
			 
	},
	
	active: function(){
		this.get('parent').className = 'x-list-content x-contextmenustrip-content x-active'; 
	},
	
	deactive: function(){
		this.get('parent').className = 'x-list-content x-contextmenustrip-content';
	}
}));


namespace(".MenuItemSeperator", Py.MenuItem.extend({
	
	tpl: '<a class="x-menu-seperator"></a>',
	
	init: Function.empty
	
}));

String.map("Selected Checked Disabled", function(key){
	var p = Py.MenuItem.prototype, c = key.toLowerCase();
	p['set' + key] = function(value){
		return this.toggleIcon(c, this[c] = !!value);
	};
	
	p['get' + key] = function(){
		return this[c];
	};
});




namespace(".Menu", Py.ListControl.extend({
	
	xType: 'contextmenustrip',
	
	options: {
		renderTo: null,
		shadow: 'rb' 
	},
	
	init: function(options){
		var me = this;
		
		if(options.menuItems){
			options.controls = options.menuItems;
			
			delete    options.menuItems;
		}
		
		this.initChildren('items');
		
		Py.setData(this.dom, 'control', this);
		
		
		// 绑定节点和控件，方便发生事件后，根据事件源得到控件。
	},
	
	installHandle: function(){
		
	},
	
	uninstallHandle: function(){
		
	},
	
	/**
	 * 当前菜单依靠某个控件显示。
	 * @param {Control} ctrl 方向。
	 */
	showByX: function(ctrl){
		
		// 显示节点。
		this.dom.show();
		
		// 获得理论显示的位置。
		var p = ctrl.getOffsets(), size = ctrl.getSize().add(-6, 0), x = p.x + size.x, msize = this.getSize(), doc = document.getSize();
		
		// 显示右边出界。
		if(x + msize.x >= doc.x) {
			
			// 计算显示左边的位置。
			x = p.x - size.x;
			
			// 保证大于 0 不显示外面 。
			x = Math.max(x, 0);
		}
		
		p.x = x;
		p.y -= 5;
		
		// 显示下面出界。
		if(p.y + msize.y >= doc.y) {
			
			// 计算显示左边的位置。
			p.y -= size.y;
		}
		
		// 如果还是超界，安装上下句柄。
		if(p.y < 0)
			this.installHandle();
		else 
			this.uninstallHandle();
		
		this.bringToFront(ctrl);
		
		// 设置位置。
		this.setOffset(p);
		return this;
	},
	
	adjust: function(p, size, fixX){
		var msize = this.getSize(), doc = document.getSize();
		
		p.x += size.x + fixX;
		
		if(x + size.x >= doc.x)
			x -= size.x;
		
		x = Math.max(x, 0);
		
		if(y + size.y >= doc.y)
			y -= size.y;
			
		if(y < 0) {
			this.installHandle();
		} else 
			this.uninstallHandle();
			
			
		return {
			x: x,
			y: y
		}
	},
	
	/**
	 * 关闭本菜单。
	 */
	onHide: function(){
		
		// 先关闭子菜单。
		this.hideSub();
	},
	
	/**
	 * 打开本菜单子菜单。
	 * @protected
	 */
	showSub: function(item){
		
		// 如果不是右键的菜单，在打开子菜单后监听点击，并关闭此子菜单。
		if(!this.floating)
			document.one('mouseup', Function.bind(this.hideSub, this));
		
		// 隐藏当前项子菜单。
		this.hideSub();
		
		// 激活本项。
		item.active();
		
		if (item.subMenu) {
			
			// 设置当前激活的项。
			this.currentSubMenu = item;
			
			// 显示子菜单。
			item.subMenu.showByX(item);
			
		}
	},
	
	/**
	 * 关闭本菜单打开的子菜单。
	 * @protected
	 */
	hideSub: function(){
		
		// 如果有子菜单，就隐藏。
		if(this.currentSubMenu) {
			
			// 关闭子菜单。
			this.currentSubMenu.subMenu.hide();
			
			// 取消激活菜单。
			this.currentSubMenu.deactive();
			this.currentSubMenu = null;
		}
	},
	
	onShow: function(){
		this.floating = true;
		document.one('mouseup', Function.bind(this.hide, this));
	}
	
}).implement(Py.ITargetedControl));




/// #endregion