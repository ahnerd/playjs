//===========================================
//  阴影扩展                        maskex.js          A
//===========================================


using("System.Controls.Mask");


Py.Mask.implement({
	
	setText: function(value){
		
		var content = this.conetnt;
		
		if(!content)
			this.conetnt = content = this.dom.append(document.create('div', 'x-mask-content'));
			
		content.innerHTML = value;
		content.setStyle('marginLeft', -content.getSize().x / 2);
		content.setStyle('marginTop', -content.getSize().y / 2);
		
		return this;
	},
	
	getText: function(){
		return this.conetnt ? this.conetnt.innerHTML : '';
	}
	
});
