// 调试时引入文件

Py.debug = true;


Class.prototype.toString = function(){
	if(this.xType)
		return this.xType;
	else
		return this.constructor.toString();
};