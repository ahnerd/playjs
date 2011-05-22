//===========================================
//  DefaultLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.Layout.LayoutEngine");




(function(){
	
	
	var DefaultLayout = Py.Layout.DefaultLayout = Py.Layout.LayoutEngine.extend({
		
		/**
		 * xType
		 * @type String
		 * @property xType
		 */
		xType: 'default',
		
		distance: [0, 0, 0, 0],
		
		/**
		 * 初始化布局。
		 * @method initLayout
		 * @param {Control} container 容器的控件。
		 */
		initLayout: function(container){
			
			this.baseCall('initLayout', container);
			Py.Element.setMovable(container.dom);
			
			// 生成 left top right bottom fill 区域。
			container.dom.innerHTML = '<div class="x-layout-top"></div><div class="x-layout-middle"><div class="x-layout-left" style="width:0px;"></div><div class="x-layout-fill"></div><div class="x-layout-right" style="width:0px;"></div></div><div class="x-layout-bottom"></div>';
			
			var middle = container.get('first', 1),
				center = middle.get('first', 1),
				distance = container.distance || this.distance,
				i = 0;
				
			container.regions = {fill: center};
			
			Object.each(Py.Layout.DefaultLayout._paddingMap, function(padding, region){
				var regionEl = container.regions[region] = container.find('.x-layout-' + region),
					nest = regionEl.nest = i % 2 ? center : middle;
				regionEl.style[padding] = distance[i++] + 'px';
				nest.style[region] = '0px';
			}); 
		
		},
		
		/**
		 * 取消和容器的关联。
		 * @method uninitLayout
		 * @param {Control} container 容器的控件。
		 */
		uninitLayout: function(container){
			container.dom.innerHTML = '';
			this.baseCall('uninitLayout', container);
			delete container.regions;
		},
		
		updateRegion: function(container, region){
			
			var regionEl = container.regions[region], sum = 1, n;
			
			
			switch(Py.Layout.DefaultLayout._dock[region]){
				case 0:   // 垂直
					sum = regionEl.offsetHeight;
					break;
					
				case 1:   // 水平
					
					// 统计内部所有元素宽。
					// IE6/7/9 无法自动根据子元素的宽生成父元素的宽。 
					// 这里为了使以上浏览器正确得到宽，统计所有子节点的宽。
					// 然后赋予父元素。
					for(n = regionEl.firstChild; n; n = n.nextSibling)
						sum += n.offsetWidth + Py.Element.widthMargin(n);
						
					// 设置区域大小。
					regionEl.setWidth(sum);
					
					// 计算中间域 left/right 。
					sum += parseFloat(regionEl.style[Py.Layout.DefaultLayout._paddingMap[region]]);
					
					break;
				default:
					return 0;
			}
			
			regionEl.nest.style[region] =  sum + 'px';
			
			return sum;
		},
			
		/**
		 * 容器添加一个子控件后执行。
		 * @method onControlAdded
		 * @param {Control} container 容器的控件。
		 * @param {Control} item 项。
		 */
		onControlAdded: function(container, item){
			
			this.onControlInserted(container, -1, item);
		},
		
		/**
		 * 容器添加一个子控件后执行。
		 * @method onControlAdded
		 * @param {Control} container 容器的控件。
		 * @param {Number} index 位置。
		 * @param {Control} item 项。
		 */
		onControlInserted: function(container, index, item){
	
			// 简写。
			var styleNumber = Py.Element.styleNumber,
			
				// 区。
				region = item.dock;
			
			this.onAdd(item, container);
			
			// 非法 dock。
			if(!(region in Py.Layout.DefaultLayout._dock)){
				return this.baseCall('onControlInserted', container, index, item);
			
			}
			
			container.regions[region].insert(item.dom, region == 'bottom' ? 'afterBegin' : 'beforeEnd');
			
			// 如果四周，需更新位置。
			this.updateRegion(container, region);
			
		},
			
		/**
		 * 处理移的节点。
		 * @method onRemove
		 * @param {Control} item 项。
		 * @param {Control} container 容器的控件。
		 */
		onRemove: function(item, container){
			this.baseCall('onRemove', item, container);
			
			this.updateRegion(container, item.dock);
		}
	}),
	
	Region = Py.Control.extend({
			
		container: null,
		
		nest: null,
		
		name: null,
		
		/**
		 * 生成新的区域。
		 * @param {String} name 名字。如 'top bottom left right fill'
		 */
		constructor: function(dom, container, name){
			this.name = name;
			this.container = container;
			this.dom = dom;
			this.init();
		},
		
		init: function(){
			this.nest = this
		},
		
		/**
		 * 在当前regions加入一个对象。重新计算大小。
		 */
		add: function(item){
			this.dom.insert(item.dom, this.name == 'bottom' ? 'afterBegin' : 'beforeEnd');
			// 如果四周，需更新位置。
			this.update();
		},
		
		setSize: function(){
			
		},
		
		updateY: function(){
			
			var sum = this.dom.offsetHeight;
			this.container.regions.middle.dom.style[this.name] = sum  + 'px';
			return sum;
		},
		
		
		updateX: function(){
			
		},
		
		update: Function.empty
	});

	/**
	 * 实现动态大小的布局。
	 */
	Py.Layout.register(DefaultLayout);
	
	
	Object.extend(DefaultLayout, {
		
		/**
		 * 找到一个方法的 padding 表。
		 * @type Object
		 * @private
		 */
		_paddingMap: {
			bottom: 'paddingTop',
			left: 'paddingRight',
			top: 'paddingBottom',
			right: 'paddingLeft'
		},
		
		_dock: {
			left: 1,
			top: 0,
			right: 1,
			bottom: 0,
			fill: 2,
			center: 2
		},
		
		/**
		 * 在 DefaultLayout 中表示一区域。
		 */
		Region: Region,
		
		Horizontal: Region.extend({
			
			update: function(){
				
				
				var sum = 1,
					dom = this.dom,
					region = this.name,
					n = dom,
					padding = Py.Layout.DefaultLayout._paddingMap[region];
				// 统计内部所有元素宽。
				// IE6/7/9 无法自动根据子元素的宽生成父元素的宽。 
				// 这里为了使以上浏览器正确得到宽，统计所有子节点的宽。
				// 然后赋予父元素。
				for(n = n.firstChild; n; n = n.nextSibling)
					sum += n.offsetWidth + Py.Element.widthMargin(n);
					
				// 设置区域大小。
				dom.setWidth(sum);
				
				sum += parseFloat(dom.style[padding]);
				
				this.container.regions.fill.dom.style[region] =  sum + 'px';
				
				return sum;
				
			}
			
		})

	});


})();



