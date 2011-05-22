



Py.using("System.Controls.Surround");
Py.imports("Resources.*.Control.Shadow");


Py.Element.implement({
	
	/**
	 * 设置元素阴影。
	 * @param {String/Boolean} shadow 是否打开阴影。
	 */
	setShadow: function(shadow){
		return Py.Surround.toggle(this, "x-shadow", shadow === true ? ['r', 'b', 'rb'] : shadow);
	}
	
}, 2);
