

Py.using("System.Controls.ContainerControl");

Py.namespace('Py', 'Balloontip', Py.ContainerControl.extend({
	
	options: {
		hide: 0,
		renderTo: true
	},
	
	xType: 'balloontip',
	
	init: function(options){
		this.baseCall('init', options);
		if (options.closable != null)
			this.addHeaderItem('x-icon-balloontip-close', options.closable ? this.close : this.hide);
		delete options.closable;
	},
	
	setAuthor: function(direction){
		if(! this.author )
			this.author = this.append(document.createDiv());
		this.author.className = "x-balloontip-anchor x-balloontip-anchor-" + direction;
		
		return this;
	},
	
	setAuthorPosition: function(value){
		this.authorPosition = value;
		if(this.author){
			var className = this.author.className;
			this.author.setStyle(({
				l: 'left',
				r: 'right',
				b: 'bottom',
				t: 'top'
			})[className.charAt(className.length - 1)], value);
		}
	},
	
	getAuthorPosition: function(){
		return this.authorPosition;
	}
	
}));
