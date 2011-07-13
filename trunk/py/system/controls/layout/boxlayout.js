//===========================================
//  BoxLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

using("System.Controls.Layout.AdvanceLayout");
using("System.Controls.Splitter");
using("System.Controls.ScrollableControl");
imports("Resources.*.Layout.Box");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.BoxLayout = Py.Layout.AdvanceLayout.extend({

	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'box',
	
	/**
	 * 当被子类重写时，实现生成一个区的实例。
	 * @method createRegion
	 * @param {Control} container 容器控件。
	 * @param {String} dock 方向。
	 * @param {Number} index 编号。
	 * @protected
	 */
	createRegion: function(container, dock) {
		var type;
		switch (dock) {
			case "top":
			case "bottom":
				type = "VerticalRegion";
				break;
			case "left":
			case "right":
				type = "HorizonalRegion";
				break;
			default:
				type = "Region";
				break;
		}
		return new Py.Layout.BoxLayout[type]({
			container: container,
			name: dock
		});
	},
	
	initLayoutCore: function(container) {
		
		this.baseCall('initLayoutCore', container);
	
		// 新建用来存储分区的区。
		var regions = container.regions = container.content.appendChild(document.create('div', 'x-region-container'));
		
		var me = this, map;
		
		if (container.layoutDirection === 'horizonal') {
			me.layoutX = me.updateX;
			map = "left fill right";
		} else {
			me.layoutY = me.updateY;
			map = "top bottom middle";
		}
		
		// 新建区。
		String.map(map, function(dock, index) {
			return me.createRegion(container, dock, index);
		}, regions);
		
	},
	
	uninitLayoutCore: function(){
		
		this.baseCall('uninitLayoutCore', container);
		container.content.find('.x-region-container').remove();
	},
	
	onControlAdded: function(container, item, index) {
		var region = container.regions[item.dock];
		
		
		if (region) 
			region.show().setContent(item);
		else{
			item.dock = 'fill';
			this.onControlAdded(container, item, index);
		}
		
	},
	
	onControlRemoved: function(container, item, index) {
		var region = container.regions[item.dock];
		region.dom.remove();
		region.content = null;
		region.hide();
	},
	
	
	// 假设目前是   上 中 下   三层
	
	layoutX: function(container) {
		var regions = container.regions, size = container.content.getWidth();
		
		// 设置父区宽。
		regions.wrapY.setWidth(size);
		
		//  设置3区的宽。
		regions.top.setWidth(size);
		regions.middle.setWidth(size);
		regions.bottom.setWidth(size);
	},
	
	/**
	 * 对所属控件内的控件在 Y 方向重新布局。
	 * @param {Object} container
	 */
	layoutY: function(container) {
		var regions = container.regions, size = container.content.getHeight();
		
		// 设置父区高。
		regions.wrapX.setHeight(size);
		
		//  设置3区的宽。
		regions.left.setHeight(size);
		regions.fill.setHeight(size);
		regions.right.setHeight(size);
	},
	
	/**
	 * 重新布局当前布局Y方向。
	 * @param {Object} container
	 */
	updateX: function(container) {
		var regions = container.regions,
			center = regions.fill,  // 容器大小。
			containerWidth = container.content.getWidth(),
			left = regions.left.getCurrenSize('x'),
			right = regions.right.getCurrenSize('x');
		
		// 重新设置容器内部区范围。
		regions.wrapX.setWidth(containerWidth);
		center.dom.style.left = left + 1 + 'px';
		center.setWidth(containerWidth - left - right - 2);
	},
	
	/**
	 * 在左右(上下)布局完成后重新计算中间区的大小。
	 * @param {Object} container
	 */
	updateY: function(container) {
	
		var regions = container.regions,
			middle = regions.middle,  // 容器大小。
			containerHeight = container.content.getHeight(),
			top = regions.top.getCurrenSize('y'),
			bottom = regions.bottom.getCurrenSize('y');
		
		// 重新设置容器内部区范围。
		regions.wrapY.setHeight(containerHeight);
		middle.dom.style.top = top + 1 + 'px';
		middle.setHeight(containerHeight - top - bottom - 2);
		
	}
	
}));


(function() {

	var names = {
		top: 'Bottom',
		right: 'Left',
		bottom: 'Top',
		left: 'Right'
	}, namesC = {
		top: 'marginTop',
		right: 'marginRight',
		bottom: 'marginBottom',
		left: 'marginLeft'
	};
	
	/**
	 * @class Py.Layout.BorderLayout.Region
	 * @extends Py.Layout.DefaultLayout.Region
	 */
	var Region = Py.ScrollableControl.extend({
	
		xType: 'region',
		
		content: null,
		
		onResizeX: Function.empty,
		
		onResizeY: Function.empty,
		
		create: function(options) {
			return document.create('div', 'x-region-' + options.name);
		},
		
		init: function(options) {
		
			var container = options.container;
			container.regions.wrapX = container.regions.wrapY = container.regions;
			this.content = this.dom;
			this.renderTo(container.regions);
			
		}
		
	});
	
	/**
	 * 表示支持折叠的面包容器。
	 */
	var PanelRegion = Region.extend({
	
		init: function(options) {
		
			var container = options.container;
			
			this.header = this.insert(document.create('div', 'x-header x-region-header'), 'afterBegin').append(document.create('h3', ''));
			
			this.hide();
			
			this.renderTo(container.regions);
		},
		
		setContent: function(content) {  
			
			content.addClass('x-box');
			this.baseCall('setContent', content);
			
			if (content.split > -1) {
				this.setSplit(content.split);
			}
			
			
			if ('minSize' in content) this.minSize = content.minSize;
			if ('maxSize' in content) this.maxSize = content.maxSize;
			if ('collapsable' in content) this.setCollapsable(content.collapsable);
			
		},
		
		/*
		 setContent: function(panel){
		 if(this.content !== this.dom){
		 this.content.remove();
		 }
		 
		 // 如果被渲染的是已经为一个容器， 强制复制到目前区。
		 if (panel instanceof ScrollableControl) {
		 this.delegate = panel;
		 this.header = panel.header.renderTo(this);
		 this.header.className = 'x-header x-region-header';
		 this.content = panel.content.renderTo(this);
		 this.heightFix = panel.heightFix;
		 this.widthFix = panel.widthFix;
		 Py.Class.addCallback(this, 'onResizeX', Function.bind(panel.onResizeX, panel));
		 Py.Class.addCallback(this, 'onResizeY', Function.bind(panel.onResizeY, panel));
		 
		 } else {
		 
		 this.content = panel.renderTo(this);
		 this.heightFix = Element.getSize(panel.getDom(), 'height', 'bp');
		 this.widthFix = Element.getSize(panel.getDom(), 'width', 'bp');
		 
		 
		 this.header = Py.$(this.insert(document.create('div', 'x-header x-region-header'), 'afterBegin').append(document.createElement('h3')));
		 
		 
		 
		 this.header.hide();
		 
		 this.setWidth(panel.getSize().x);
		 this.setHeight(panel.getSize().y);
		 
		 }
		 
		 if(panel.split > -1){
		 this.setSplit(panel.split);
		 }
		 
		 if('minSize' in panel)
		 this.minSize = panel.minSize;
		 if('maxSize' in panel)
		 this.maxSize = panel.maxSize;
		 if('name' in panel)
		 this.setTitle(panel.name);
		 if('collapsable' in panel)
		 this.setCollapsable(panel.collapsable);
		 
		 panel.addClass('x-box');
		 },
		 */
		/**
		 * 当分割条执行resize事件后执行。
		 * @param {Object} e 事件信息。
		 */
		onSplitterAfterResize: Function.empty,
		
		getCurrenSize: function(direction){
			return this.state === 1 ? this.getSize()[direction] : 32;
		},
		
		minSize: 102,
		
		maxSize: 400,
		
		/**
		 * 当分割条执行resize事件之前执行。
		 * @param {Object} e 事件信息。
		 */
		onSplitterBeforeResize: function(e) {
			//e.fromEl = this.dom;
			e.min = this.minSize;
			e.max = Math.min(this.getMaxSize(), this.maxSize);
		},
		
		
		
		setCollapsable: function(value) {
		
			if (value !== false) {
			
				if (!this.collapseItem) {
					this.collapseItem = this.addHeaderItem('x-icon-' + this.name, this.collapse, '折叠');
				}
				
				
				
				if (!this.collapseProxy) {
					this.collapseProxy = Element.parse('<div class="x-region-proxy"><a href="javascript://打开" title="打开" class="x-icon x-icon-' + names[this.name].toLowerCase() + '"></a></div>');
					this.collapseProxy.addClass('x-region-' + this.name);
					this.collapseProxy.renderTo(this.get('parent'));
					this.collapseProxy.on('click', Function.bind(this.onProxyClick, this));
					this.collapseProxy.hide().setStyle(namesC[this.name], -28);
				}
				
			} else if(this.collapseItem)
				this.collapseItem.hide();
				
			return this;
			
		},
		
		onProxyClick: function(e) {
			if (/x-icon/.test(e.srcElement.className)) {
				this.expand();
			} else {
				this.state === 3 ? this.hidePopup() : this.popup();
			}
		},
		
		/**
		 * 当前的折叠的状态。
		 *
		 * 1 - 打开
		 * 1.5  - 正在关闭
		 * 2 - 折叠
		 * 2.5 - 正在打开
		 * 3 - 弹出
		 */
		state: 1,
		
		collapseDuration: 500,
		
		/**
		 * 折叠当前区域。
		 */
		collapse: function() {
			var me = this;
			
			if (me.state !== 1) return me;
			
			me.state = -2;
			
			// 中间区位置。
			
			me.onResize();
			
			// splitter 关闭。
			this.splitter.hide();
			
			this.dom.animate(namesC[this.name], -this.getInnerSize(), this.collapseDuration, function() {
			
				me.collapseProxy.show().animate(namesC[me.name], 0, me.collapseDuration / 2);
				
				me.state = 2;
				
			});
			
			
			return me;
			
		},
		
		/**
		 * 展开当前区。
		 */
		expand: function() {
			var me = this, collapseDuration = this.collapseDuration;
			
			if (me.state < 0) return me;
			
			if (me.state === 3) {
				me.collapseItem.show();
				//   collapseDuration = 0;
			
			
			}
			
			
			me.state = -1;
			
			
			// 删除代理。
			me.collapseProxy.style[namesC[this.name]] = '-28px';
			
			
			me.dom.animate(namesC[this.name], 0, collapseDuration, function() {
				
				me.collapseProxy.hide();
			
				// 显示 spltter
				me.splitter.show();
				me.state = 1;
				//  me.container.layout.updateX(me.container);
				me.onResize();
				
			});
			
			
			
			return me;
		},
		
		/**
		 * 弹出区。
		 */
		popup: function() {
			var me = this;
			
			if (me.state < 0) return me;
			
			me.state = -3;
			
			document.on('mousedown', function(e) {
				
				var target = e.target;
			
				// 如果当前不是弹出状态， 撤销。
				if (me.state < 0 || me.dom.contains(target)) return;

				document.un('mousedown', arguments.callee);
				
				if (me.state === 3) {
					while (target) {
						if (target == me.collapseProxy) {
							return;
						}
						target = target.parentNode;
					}
					
					me.hidePopup();
					
				}
			});
			
			
			me.collapseItem.hide();
			
			
			this.addClass('x-region-popup');
			this.dom.animate(namesC[this.name], 25, this.collapseDuration, function() {
				me.state = 3;
			});
			
			
		},
		
		/**
		 * 取消弹出。
		 */
		hidePopup: function() {
			var me = this, animate = {};
			
			if (me.state < 0) return me;
			
			me.state = -2;
			this.dom.animate(namesC[this.name], -this.getWidth(), this.collapseDuration, function() {
				me.collapseItem.show();
				
				me.removeClass('x-region-popup');
				me.state = 2;
			});
			
		},
		
		toggleCollapse: function() {
			this.state == 2 ? this.expand() : this.collapse();
			
			return this;
		},
		
		setSplit: function(value) {
		
			if (value !== false) {
			
				// 如果已经创建过 splitter -> show
				if (this.splitter) {
					this.splitter.show();
				} else {
				
					// 创建对象。
					this.splitter = new Py.Splitter(this.name, this, value > 1).renderTo(this.dom);
					
					// 设置初始状态。
					this.splitter.setStyle(names[this.name].toLowerCase(), 0);
				}
			} else if (this.splitter) {
				this.splitter.hide();
			}
			
			if (value !== null) this.setStyle('padding' + names[this.name], 6);
			
			
			return this;
		}
		
	});
	
	Object.extend(Py.Layout.BoxLayout, {
	
		Region: Region,
		
		HorizonalRegion: PanelRegion.extend({
		
		
			getMaxSize: function() {
				return this.content.getSize().x + this.container.regions.fill.content.getSize().x;
			},
			
			onResizeX: function() {
			
				// 调用 middle 重写中间层高。
				this.container.layout.updateX(this.container);
			},
			
			getInnerSize: function() {
				return this.getWidth();
			},
			
			onResizeY: function() {
			
				// 刷新代理。
				if (this.collapseProxy) this.collapseProxy.setHeight(this.getHeight() - 2);
			}
			
		}),
		
		VerticalRegion: PanelRegion.extend({
		
			minSize: 22,
		
			getMaxSize: function() {
				return this.content.getSize().y + this.container.regions.middle.content.getSize().y;
			},
			
			onResizeX: function() {
			
				// 刷新代理。
				if (this.collapseProxy) this.collapseProxy.setWidth(this.getWidth() - 2);
			},
			
			getInnerSize: function() {
				return this.getHeight();
			},
			
			/**
			 * 设置当前区高度，同时改变更新容器布局。
			 * @param {Object} value
			 */
			onResizeY: function() {
			
				// 调用 middle 重写中间层高。
				this.container.layout.updateY(this.container);
				
			}
			
		})
	
	});
	
	Py.Layout.BoxLayout.VerticalRegion.prototype.onResize = Py.Layout.BoxLayout.VerticalRegion.prototype.onResizeY;
	
	
	Py.Layout.BoxLayout.HorizonalRegion.prototype.onResize = Py.Layout.BoxLayout.HorizonalRegion.prototype.onResizeX;
	
	if (navigator.isIE6) {
	
		Py.Class.addCallback(Py.Layout.BoxLayout.VerticalRegion.prototype, 'onResizeX', function() {
			if (this.splitter) this.splitter.setWidth(this.getWidth());
		});
		
		
		Py.Class.addCallback(Py.Layout.BoxLayout.HorizonalRegion.prototype, 'onResizeY', function() {
			if (this.splitter) this.splitter.setHeight(this.getHeight());
		});
		
	}
	
	
	
	
})();
