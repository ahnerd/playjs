//===========================================
//  DefaultLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.Layout.LayoutEngine");




(function(){
	
	
	var 
		
		/**
		 * 找到一个方法的 padding 表。
		 * @type Object
		 * @private
		 */
		mapPadding = {
			bottom: 'paddingTop',
			left: 'paddingRight',
			top: 'paddingBottom',
			right: 'paddingLeft'
		},
		
		/**
		 * 默认的布局方式。
		 * @class DefaultLayout
		 */
		DefaultLayout = Py.Layout.DefaultLayout = Py.Layout.LayoutEngine.extend({
			
			/**
			 * xType
			 * @type String
			 * @property xType
			 */
			xType: 'default',
			
			/**
			 * 初始化布局。
			 * @method initLayout
			 * @param {Control} container 容器的控件。
			 */
			initLayoutCore: function(container){
				
				var me = this,
					
					// 用于布局的容器。
					content = container.content;
				
				// 设置目标可移动。
				Py.Element.setMovable(content);
			    
				// 生成 left top right bottom fill 区域。
				container.regions = content.append('<div class="x-layout-top"></div><div class="x-layout-middle"><div class="x-layout-left"></div><div class="x-layout-fill"></div><div class="x-layout-right"></div></div><div class="x-layout-bottom"></div>');
				
				String.map("top right bottom left fill", function(dock, index){
					return me.createRegion(container, dock, index); 
				}, container.regions);
				
				
			},
			
			/**
			 * 当被子类重写时，实现生成一个区的实例。
			 * @method createRegion
			 * @param {Control} container 容器控件。
			 * @param {String} dock 方向。
			 * @param {Number} index 编号。
			 * @protected
			 */
			createRegion: function(container, dock, index){
				return new DefaultLayout.Region(container, dock, index);
			},
			
			/**
			 * 取消和容器的关联。
			 * @method uninitLayout
			 * @param {Control} container 容器的控件。
			 */
			uninitLayoutCore: function(container){
				
				// 移除增加的节点。
				container.get(function(n){return /$x-layout/.test(n.className);}).remove();
				
				// 删除 regions 。
				delete container.regions;
			},
			
			/**
			 * 容器添加一个子控件后执行。
			 * @method onControlAdded
			 * @param {Control} container 容器的控件。
			 * @param {Control} item 项。
			 * @param {Number} index 位置。
			 */
			onControlAdded: function(container, item){ 
		
				// 当前的区。
				var region = container.regions[item.dock];
				
				// 非法 dock。
				if(region)
				
					// 在这个 region 添加子元素。
					region.add(item);
				
				else
				
					// 和默认的元素一样使用绝对方式。
					this.baseCall('onControlAdded', arguments);
				
				
			},
				
			/**
			 * 处理移的节点。
			 * @method onRemove
			 * @param {Control} item 项。
			 * @param {Control} container 容器的控件。
			 */
			onControlRemoved: function(container, item){
				
				// 当前的区。
				var region = container.regions[item.dock];
				
				// 非法 dock。
				if(region)
				
					// 在这个 region 添加子元素。
					region.remove(item);
				
				else
				
					// 和默认的元素一样使用绝对方式。
					this.baseCall('onControlRemoved', arguments);
			}
		});

	/**
	 * 实现动态大小的布局。
	 */
	Py.Layout.register(DefaultLayout);
	
	/**
	 * 默认容器的区。
	 * @class DefaultLayout.Region
	 */
	DefaultLayout.Region = Py.Control.extend({
		
		/**
		 * 容器。
		 * @type Control
		 */
		container: null,
		
		/**
		 * 用来被此区约束的节点。
		 * @type Element
		 */
		nest: null,
		
		/**
		 * 当前区的名字。
		 * @type String
		 */
		name: null,
		
		/**
		 * 生成新的区域。
		 * @param {Control} container 容器控件。
		 * @param {String} dock 方向。
		 * @param {Number} index 编号。
		 */
		constructor: function(container, name, index){
			
			// 字段。
			this.name = name;
			this.container = container;
			
			// 距离。
			var dom = this.dom = container.find('.x-layout-' + name);
			
			
			// 保存用来更新的层。
			if(index < 4) {
				var distance = container.split,  /// API
					n = this.nest = dom.get(index == 0 || index == 3 ? 'next' : 'previous');
					
				n.style[name] = '0px';
				
				if(distance)
					dom.style[mapPadding[name]] = distance[index] + 'px';
				
				// 绑定更新函数。
				this.update = index % 2 ? this.updateX : this.updateY;
				
			}
			
			this.init(container, name, index);
		},
		
		/**
		 * 在当前regions加入一个对象。重新计算大小。
		 * @param {Control} item 项。
		 */
		add: function(item){
				
			// 添加类。
			item.addClass('x-layout-default');
			
			this.insert(item.getDom(), this.name == 'bottom' ? 'afterBegin' : 'beforeEnd');
			
			// 理论上，应该由布局器通过 layout 来调用这个函数，而不是在 add 时候调用。
			// 这里因为 defaultLayout 属于自动布局， 所以放弃重写 layout ，自动去调  update();
			this.update();
		},
		
		/**
		 * 在当前regions移去一个对象。重新计算大小。
		 * @param {Control} item 项。
		 */
		remove: function(item){
			
			this.remove(item.getDom());
				
			// 添加类。
			item.removeClass('x-layout-default');
			
			this.update();
		},
		
		/**
		 * 更新垂直方向。
		 */
		updateY: function() {
			
			// 设置相邻的区 top/bottom
			this.nest.style[this.name] = this.dom.offsetHeight  + 'px';

		},
		
		/**
		 * 更新水平方向。
		 */
		updateX: function() {
			
			var sum = 0.9,
				dom = this.dom,
				region = this.name,
				n = dom.firstChild;
				
			// 统计内部所有元素宽。
			// IE6/7/9 无法自动根据子元素的宽生成父元素的宽。 
			// 这里为了使以上浏览器正确得到宽，统计所有子节点的宽。
			// 然后赋予父元素。
			for(; n; n = n.nextSibling)
				sum += n.offsetWidth + Py.Element.getSize(n, 'width', 'm');
			
			// 设置区域大小。
			dom.setWidth(sum);
			
			sum += parseFloat(dom.style[mapPadding[region]]) || 0;
			
			this.nest.style[region] =  sum + 'px';
		},
		
		
		// 对边上的 Region ， update 分别是自己方向的更新。
		// 对中间的 Region ， update 不做任何事----全部用 css 计算。
		
		/**
		 * 更新当前值。
		 */
		update: Function.empty
	});
	
})();



