


Py.using("System.Controls.Mask");


Py.Mask.implement({
	
	setContent: function(value){
		
		var content = this.conetnt;
		
		if(!content)
			this.conetnt = content = this.dom.append(document.createDiv('x-mask-content'));
			
		content.innerHTML = value;
		content.setStyle('marginLeft', -content.getSize().x / 2);
		content.setStyle('marginTop', -content.getSize().y / 2);
		
		return this;
	},
	
	getContent: function(){
		return this.conetnt ? this.conetnt.innerHTML : '';
	}
	
});
