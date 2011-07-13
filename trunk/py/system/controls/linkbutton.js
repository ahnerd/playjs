//===========================================
//  链接按钮   linkbutton.js         A
//===========================================





using("System.Controls.Control");
imports("Resources.*.Button.LinkButton");


namespace(".LinkButton", Py.Control.extend({
	
	tpl: '<a class="x-linkbutton" href="javascript://" target="_blank"></a>',
	
	setUrl: function(value){
		this.setAttr('href', value);
	},
	
	getUrl: function(){
		return this.getAttr('href');
	}
	
}));