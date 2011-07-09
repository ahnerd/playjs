//===========================================
//  调试工具   debug.js  A
//===========================================

Py.debug = true;


Py.Object.prototype.toString = function(){
	if(this.xType)
		return this.xType;
	else
		return this.constructor.toString();
};