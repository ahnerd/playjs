
Py.imports("Resources.*.Container.Accordion");
Py.using("System.Controls.Control");
Py.namespace(".Accordion", Py.Control.extend({
	/**
	 * 默认配置。
	 * @type Object
	 */
	options: {
		
	},
	
	/**
	 * xType
	 * @type String
	 */
	xType: 'accordion',
	
	create:function(options){
		var me=this;
		this.container=$(options.id);
		this.handles = this.container.findAll('h3');
		this.content=this.container.findAll(options.contentClass||('.x-' +this.xType+'-container'));
		return this.container;
	},
	
	init:function(options){
		var me=this;
		this.dom.on('click',function(e){trace(e.target);
			   if(e.target.tagName.toLowerCase()=='h3'&&e.target.className!='x-collapsable'){
			   	  me.action(e.target);
			   }
			});
	},
	
	action:function(currentEle){
		this.handles.removeClass('x-collapsable');
		currentEle.addClass('x-collapsable');
		this.content.setStyle('display','none');
		currentEle.get('parent').get('next').setStyle('display','block');
		this.onChange();
	},
	onChange:function(){
		
	}
	
}));




