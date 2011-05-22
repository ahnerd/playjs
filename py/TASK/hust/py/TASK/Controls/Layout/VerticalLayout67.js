//===========================================
//  BorderLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.Layout.AdvanceLayout");
Py.using("System.Controls.Splitter");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.VerticalLayout = Py.Layout.AdvanceLayout.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'vertical',
	
	/**
	 * 四个方向之间距离。
	 * @type Array
	 * @property distance
	 */
	padding: '2px 6px 6px 6px',
	
	/**
	 * 当被子类重写时，实现生成一个区的实例。
	 * @method createRegion
	 * @param {Control} container 容器控件。
	 * @param {String} dock 方向。
	 * @param {Number} index 编号。
	 * @protected
	 */
	createRegion: function(container, dock, index){
		var type;
		switch(dock) {
			case "top":
			case "bottom":
				type = "HeightRegion";
				break;
			case "left":
			case "right":
				type = "WidthRegion";
				break;
			case "middle":
				type = "MiddleRegion";
				break;
			case "fill":
				type = "CenterRegion";
				break;
		}
		return new Py.Layout.BorderLayout[type](container, dock, index);
	},
	
	initLayout: function(container){
		
	container.append('<div class="x-region-top"></div><div class="x-region-middle"><div class="x-region-left"></div><div class="x-region-fill"></div><div class="x-region-right"></div></div><div class="x-region-bottom"></div>');
	
		String.map("top right bottom left middle fill", Function.bind(function(dock, index){
			return this.createRegion(container, dock, index); 
		}, this), container.regions = {});
		
		this.baseCall('initLayout', container);
				
	},
	
	onControlAdded: function(container, item, index){
		var region = container.regions[item.dock];
		
		if(region)
			region.setPanel(item);
		else
			this.baseCall('onControlAdded', arguments);
		
	},  
	
	layoutXCore: function(container){
		var regions = container.regions, size = container.getSize().x;
		
		//  设置3区的宽。
		regions.top.setWidth(size);
		regions.middle.setWidth(size);
		regions.bottom.setWidth(size);
	},
	
	layoutYCore: function(container){
		
		// 更新middle区。
		container.regions.middle.update();
	}
	
}));


(function(){
	
	
	/**
	 * @class Py.Layout.BorderLayout.Region
	 * @extends Py.Layout.DefaultLayout.Region
	 */
	var Region = Py.Control.extend({
		
		/**
		 * 当分割条执行resize事件后执行。
		 * @param {Object} e 事件信息。
		 */
		onSplitterAfterResize: function(e){
			this.update();
		},
		
		/**
		 * 当分割条执行resize事件之前执行。
		 * @param {Object} e 事件信息。
		 */
		onSplitterBeforeResize: function(e){
			var m = this._map;
			e.fromEl = this.dom[m];
			e.min = this.minSize;
			e.max = Math.min(this.dom[m] + this.nest[m], this.maxSize);
		},
		
		headerSize: 0,
		
		setPanel: function(panel){
			if(this.panel){
				this.panel.remove();
			}
			
			this.panel = panel.renderTo(this.dom);
		},
		
		setTitle: function(value){
			if(!this.title){
				this.title = this.append(document.createDiv('x-region-title'));
				this.headerSize = 30;
			}
			
			this.title.innerHTML = value;
		},
		
		getTitle: function(){
			return this.title.innerHTML;
		},
		
		/**
		 * 初始化当前控件。
		 * @param {Control} container 容器控件。
		 * @param {String} dock 方向。
		 * @param {Number} index 编号。
		 */
		constructor: function(container, name, index){
			
			this.container = container;
			
			this.dom = container.find(".x-region-" + name);
			
			/*
if (index < 4) {
				var size = parseFloat(container.getStyle('padding-' + name)) || 0;
				this.dom.style[name] = size + 'px';
				container.setStyle('padding-' + name, 0);
				
			}
*/
			
			//var split = container.split || container.layout.split;
		
			//if(split[index] !== false && index < 4) {
			//	this.splitter = new Py.Splitter(name, this, split[index]).renderTo(this.nest.parentNode);
			
			//	this.update();
			//}
			
			//this._map = index % 2 ? 'offsetWidth' : 'offsetHeight';
			//this.minSize = container.minSize ? container.minSize[index] : 40;
			//this.maxSize = container.maxSize ? container.maxSize[index] : 9999;
			
		},
		
		setWidth: function(value){
			this.panel.setWidth(value);
		},
		
		setHeight: function(value){
			this.panel.setHeight(value - this.headerSize);
		},
		
		/**
		 * 更新当前值。
		 */
		update: function(){
			
			
		}
		
	})
	

Object.extend(Py.Layout, {
	
	Region: Region,
	
	WidthRegion: Region.extend({
		
		
		setWidth: function(value){
			this.panel.setWidth(value);
			
			this.container.regions.fill.update();
		}
		
	}),
	
	HeightRegion: Region.extend({
		
		/*
setPanel: function(panel){
			this.baseCall('setPanel', panel);
			this.setWidth(this.container.getWidth());
		},
*/
		
		setHeight: function(value){
			
			// 设置本panel大小。
			this.panel.setSize(null, value - this.headerSize);
			
			// 调用 middle 重写中间层高。
			this.container.regions.middle.update();

		}
		
	}),
	
	MiddleRegion: Region.extend({
		
		update: function(){
			var container = this.container, regions = container.regions;
			var top = regions.top.getSize().y;
			var bottom = regions.bottom.getSize().y;
			this.dom.style.marginTop = top + 'px';
			this.dom.style.marginBottom = bottom + 'px';
			this.setHeight(container.getSize().y - top - bottom);
		},
		
		setWidth: function(value){
			
			// 设置本panel大小。
			this.dom.setWidth(value);
			
			// 调用 fill 重写中间宽。
			this.container.regions.fill.update();
			
		},
		
		setHeight: function(value){
			
			var regions = this.container.regions;
			this.dom.setHeight(value);
			regions.left.setHeight(value);
			regions.fill.setHeight(value);
			regions.right.setHeight(value);

		}
		
	}),
	
	CenterRegion:  Region.extend({
		
		widthSize: navigator.isIE6 ? 2 : 0,
	
		update: function(){
			var container = this.container, regions = container.regions;
			var left = regions.left.getSize().x;
			var right = regions.right.getSize().x;
			this.dom.style.marginLeft = left + 'px';
			this.dom.style.marginRight = right + 'px';
			this.setWidth(container.getSize().x - left - right);
		}
		
	})
	
});

	
})();
