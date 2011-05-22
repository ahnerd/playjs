//===========================================
//  BorderLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.Layout.DefaultLayout");
Py.using("System.Controls.Splitter");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.BorderLayout = Py.Layout.DefaultLayout.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'border',
	
	distance: [6, 6, 6, 6],
	
	splitter: [true, true, true, true],
	
	/**
	 * 初始化布局。
	 * @method initLayout
	 * @param {Control} container 容器的控件。
	 */
	initLayout: function(container){
		
		this.baseCall('initLayout', container);
		
		
	},
	
	layoutCore: function(container) {
		this.baseCall('layoutCore', container);
		this.installSplitter(container, 'left');
	},
	
	installSplitter: function(container, region, handle){
		var regions = container.regions,
			regionEl = regions[region],
			target = regionEl.get('first');
		
		
		if(!target || regionEl.splitter) return;
		
		var splitter = regionEl.splitter = new Py.Splitter(region, target, handle);
		
		splitter.renderTo(regionEl.nest.parentNode);
		splitter.container = container;
		splitter.onbeforeresize = this.onSplitterBeforeResize;
		splitter.onresize = this.onSplitterResize;
		
		this.updateRegion(container, region);
	},
	
	updateRegion: function(container, region){
		var splitter = container.regions[region].splitter,
			sum = Py.Layout.DefaultLayout.prototype.updateRegion.call(this, container, region);
		
		if(splitter)
			splitter.dom.style[region] = sum - 6 + 'px';
	},
	
	onSplitterBeforeResize: function(tg, current){
		var container = this.container, regionEl = container.regions[this.direction];
		switch (Py.Layout.DefaultLayout._dock[this.direction]) {
			case 0:   // 垂直
				current.max = regionEl.offsetHeight + regionEl.nest.offsetHeight;
				break;
			case 1:   // 水平
				current.max = regionEl.offsetWidth + regionEl.nest.offsetWidth;
				break;
		}
		
		current.min = 0;
		current.fromEl = current.getSize(regionEl);
		trace("aa" + current.from);
		
	},
	
	onSplitterResize: function(tg, current){
		var container = this.container;
		current.getBound(current.fromEl);
		container.layout.updateRegion(container, this.direction);
	}
	
}));

