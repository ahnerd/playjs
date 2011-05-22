





Py.using("System.Dom.Element");




Py.IFormControl = {
		
	setState: function(state, toggle){
		this.toggleClass('x-' + state, this[state] = toggle !== false);
	},
	
	getDisabled: function(){
		return this.dom.disabled ;
	},
	
	setDisabled: function(value){ 
	
		this.dom.disabled = value !== false ? 'disbaled' : '';
		this.setState('disabled', value);
	},
	
	getReadOnly: function(){
		return this.dom.readOnly ;
	},
	
	setReadOnly: function(value){ 
	
		this.dom.readOnly = value !== false;
		this.setState('readonly', value);
	},
	
	setName: function(value){
		this.dom.name = value;
	},
	
	getName: function(){
		return this.dom.name;
	}
	
};