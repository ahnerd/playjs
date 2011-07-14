//===========================================
//  菜单按钮   splitbutton.js         A
//===========================================



imports("Resources.*.Button.SplitButtons")   ;
using("System.Controls.MenuButton");



namespace(".SplitButton", Py.MenuButton.extend({
	
	tpl: '<a class="x-button x-splitbutton">\
				<span class="x-button-container">\
					<span class="x-button-content">\
						<button   type="{type}"><span class="x-button-label">按钮</span></button><span class="x-split">&nbsp;</span><span class="x-button-arrow" onclick="" tabindex="0">&nbsp;</span>\
					</span>\
				</span>\
			</a>',
	
	checkHidding: function (target) {
		if(this.subButton.contains(target))
			this._hidding = true;
	},

	onInitDropDownMenu: function(){
		
		this.subButton = this.find('.x-button-arrow');
		this.subButton.on('click', Function.bind(this.showDropDownMenu, this));
	}

}));
