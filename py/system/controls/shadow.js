//===========================================
//  实现阴影                         surround.js          A
//===========================================



Py.using("System.Controls.Surround");
Py.imports("Resources.*.Control.Shadow");


Py.Element.implement({
	
	/**
	 * 设置元素阴影。
	 * @param {String/Boolean} shadow 是否打开阴影。
	 */
	setShadow: function(shadow){
		return Py.Element.toggleSurround(this, "x-shadow", shadow);
	}
	
}, 2);
