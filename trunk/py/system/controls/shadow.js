//===========================================
//  实现阴影                         surround.js          A
//===========================================



using("System.Controls.Surround");
imports("Resources.*.Control.Shadow");


Element.implement({
	
	/**
	 * 设置元素阴影。
	 * @param {String/Boolean} shadow 是否打开阴影。
	 */
	setShadow: function(shadow){
		return Element.toggleSurround(this, "x-shadow", shadow);
	}
	
}, 2);
