



Py.using("System.Controls.TextBox");

Py.namespace(".MarkedTextBox", Py.TextBox.extend({
	
	init: function(){
		this.on('keydown', this.onKeyDown);
	},
	
	onKeyDown: function(e){
		if(e.which){
			
		}
	},
	
	setMark: function(mark){
		this.setText(mark);
		
		this._value = [];
		for(var i = 0; i < mark.length; i++) {
			if(mark.charAt(i) == '_')
				this._value.push('0');
		}
	},
	
	setFormat: function(){
		
	}
	
}));