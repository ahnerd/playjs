//===========================================
//  BorderLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.Layout.BoxLayout");
Py.imports("Resources.Share.Layout.Border");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.BorderLayout = Py.Layout.BoxLayout.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'border',
	
	createRegion: function(container, dock) {
			
		 if(dock == "middle"  )
			return new Py.Layout.BorderLayout.Region({
				container: container,
				name: dock,
				layout: this
			});
			
			
		return this.baseCall('createRegion', container, dock);
	
	}
	
}));


(function(){
	
	Py.Layout.BorderLayout.Region = Py.Layout.BoxLayout.Region.extend({
		
		init: function(options){
			this.baseCall('init', options);
			
			this.content = this.dom;
			
			options.container.regions.fill = options.layout.createRegion(options.container, 'fill').renderTo(this);
			options.container.regions.left = options.layout.createRegion(options.container, 'left').renderTo(this);
			options.container.regions.right = options.layout.createRegion(options.container, 'right').renderTo(this);
			delete   options.layout;
			
			options.container.regions.wrapX = this.dom;
		
		},
		
		widthFix: 0,
		
		heightFix: 0,
		
		setHeight: function(value){
			this.dom.setHeight(value);
			this.container.regions.left.setHeight(value);
			this.container.regions.fill.setHeight(value);
			this.container.regions.right.setHeight(value);
			
			return this;
		},
		
		/*
getHeight: function(){
			return this.dom.getHeight();
		},
*/
		
		setWidth: function(value){
			this.container.layout.updateX(this.container)  ;
			
			return this;
		}/*
,
		
		getWidth: function(){
			return this.dom.getWidth();
		}
*/
		
	});
	
	
})();
