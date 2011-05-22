

Py.using("System.Controls.Surround");
Py.imports("Resources.*.Control.Resizing");


(function(p){
	var
		/**
		 * Element 简写。
		 * @type Element
		 */
		Element = p.Element,
		
		/**
		 * 更新位置。
		 * @param {Object} e
		 */
		update = function(e) {
			// 设置当前大小。
			e.update(e.srcElement, e.from, e.fromPosition);	
		},
	
		/**
		 * 大小修改管理类。
		 * @namespace p.ResizeManager
		 */
		rm = p.ResizeManager = {
			
			/**
			 * 安装可移动的层。
			 * @param {Element} elem 元素。
			 * @param {Element} handle 拖动句柄。
			 * @param {Element} options 配置。
			 * @param {String} direction 安装的方向， 'lt t rt r rb b lb l'选择。
			 * options 需如下值：
			 * start  - 返回改变大小的代理。
			 * prevent - 错误改变大小的回调。
			 * resize - 改变大小时执行。
			 * stop  - 停止改大小。
			 */
			install: function(elem, handle, options, direction){
				
				if(options)
					p.setData(elem, 'resize', options);
				
				p.setData(handle, 'resizeTarget', elem);
				
				var data = p.data(handle, 'resize');
				
				data.fixX = /l/.test(direction) ? 1 : -1;
				data.fixY = /t/.test(direction) ? 1 : -1;
				
				handle.on('mousedown', direction.length == 2 ? startXY : /l|r/.test(direction) ? startX : startY);
			},
			
			/**
			 * 代理选项。
			 * @type Object
			 */
			optionsWithProxy: {
				
				/**
				 * 开始改变大小时处理函数。
				 * @param {Object} e 状态。
				 * @return {Element} 代理元素。
				 */
				start: function(e){
					return p.Control.getProxy('x-resize-proxy').alignTo(e.target.dom || e.target);
				},
				
				/**
				 * 正在改变大小时处理函数。
				 * @param {Object} e 状态。
				 */
				resize: update,
				
				/**
				 * 结束改变大小时处理函数。
				 * @param {Object} e 状态。
				 */
				stop: function(e){
					
					e.update(e.target, e.getSize(e.target), e.getPosition(e.target));
					
					e.srcElement.hide();
					
				}
				
			},
			
			/**
			 * 不代理选项。
			 * @type Object
			 */
			optionsWithoutProxy: {
				
				/**
				 * 开始改变大小时处理函数。
				 * @param {Object} e 状态。
				 * @return {Element} 代理元素。
				 */
				start: function(current){
					return current.target;
				},
				
				/**
				 * 正在改变大小时处理函数。
				 * @param {Object} e 状态。
				 */
				resize: update,
				
				/**
				 * 结束改变大小时处理函数。
				 * @param {Object} e 状态。
				 */
				stop: Function.empty
			},
			
			/**
			 * 改变文档的样式。
			 * @param {Document} doc
			 * @param {String} type 类型。
			 */
			changeType: function(doc, type){
				doc.getDom().setUnselectable(!!type).style.cursor = type;
			}
			
		},
		
		/**
		 * 像素。
		 * @type String
		 */
		px = 'px',
		
		/**
		 * 开始函数。
		 * @type Function
		 */
		startX,

		/**
		 * 开始函数。
		 * @type Function
		 */
		startY,

		/**
		 * 开始函数。
		 * @type Function
		 */
		startXY = function(e){
			startX.call(this, e);
			startY.call(this, e);
		};
	
	[['X', 'left', 'Width', 'x', 40], ['Y', 'top', 'Height', 'y', 0]].forEach(function(v, k){
		var X = v[0],
			x = v[3],
			getSize = 'get' + v[2],
			setSize = 'set' + v[2],
			resizeXY = 'resize' + x,
			pageXY = 'page' +X,
			beforeResizeXY = 'before' + resizeXY,
			
			/**
			 * 当前拖动信息。/当前拖动的目标。
			 * @type Object
			 */
			current = {
				
				/**
				 * fix 。
				 * @type Number
				 */
				fix: 1,
				
				/**
				 * 实际发生改大小的元素。
				 * @type Element
				 */
				target: null,
			
				/**
				 * 当前处理 mousemove 的函数。
				 * @type Function
				 */
				handler: null,
				
				/**
				 * 最小值。
				 * @type Number
				 */ 
				min: v[4],
				
				/**
				 * 最大值。
				 * @type Number
				 */
				max: 9999,
				
				/**
				 * 目标。
				 * @type Element
				 */ 
				srcElement: null,
				
				/**
				 * 类型。
				 * @type String
				 */
				type: resizeXY,
				
				/**
				 * 当前选项。
				 * @type Object
				 */
				options: null,
				
				/**
				 * 开始位置。
				 * @type Number
				 */ 
				fromXY: 0,   // 鼠标 位置
				
				/**
				 * 变化的大小。
				 * @type Number
				 */ 
				delta: 0,
				
				/**
				 * 初始大小。
				 * @type Number
				 */
				from: 0,
				
				/**
				 * 当前代理。
				 * @type Element
				 */
				heightProxy: null,
				
				/**
				 * 开始 left top  。
				 * @type Number
				 */
				fromPosition: 0,
				
				/**
				 * 获取一个元素的位置。
				 * @param {Element} pos 获取位置的内容。
				 * @return {Point} 返回。
				 */
				getPosition: function(tg){
					return tg.getOffset()[x];
				},
				
				/**
				 * 获取一个元素的大小。
				 * @param {Element} sizeEl 获取大小的内容。
				 * @return {Number} 返回宽或高。
				 */
				getSize: function(tg){
					return tg[getSize]();
				},
				
				/**
				 * 设置一个元素的位置。
				 * @param {Element} pos 设置位置的内容。
				 * @param {Point} posxy 位置。
				 */
				setPosition: function(tg, pos){
					(tg.dom || tg).style[v[1]] = pos + px;
				},
				
				/**
				 * 处理当前元素更新后的大小。
				 * @param {Element} size 设置大小的内容。
				 * @param {Element} pos 设置位置的内容。
				 * @param {Point} sizexy 大小。
				 * @param {Point} posxy 位置。
				 */
				update: function(tg, size, pos){
					
					var me = this;
					
					me.setSize(tg, me.clip(size));
					
					// 检查补丁。
					if (me.fix > 0) {
						
						//减目标的 left|top 大小。
						me.setPosition(tg, pos + me.delta);
					}
				},
				
				/**
				 * 返回在 [min, max) 内的最后值。
				 */
				clip: function(size){
					
					var me = this;
					
					size -= me.delta * me.fix;//   trace(size + " 最后");
					
					// 如在允许范围之外。
					if(size < me.min || size >= me.max){
						
						// 取最小（大）值。
						size = size < me.min ? me.min : me.max; 
						me.delta = size - me.from;
					}
					
					return size;
				},
				
				/**
				 * 处理当前元素更新后的大小。
				 * @param {Element} size 设置大小的内容。
				 * @param {Element} pos 设置位置的内容。
				 * @param {Point} sizexy 设置大小。
				 * @param {Point} posxy 位置。
				 */
				setSize: function(tg, size){
					tg[setSize](size);
					
				}
			},
			
			/**
			 * 处理鼠标按下的事件。
			 * @param {Event} e 事件。
			 */
			startResize = function(e, isXY){
				
				// 单击
				if(e.which != 1) 
					return;
				
				// 保存拖动目标。如 .x-resizer-rb
				current.srcElement = this;
				
				// 保存开始位置。
				current.fromXY = e[pageXY];
				
				// 准备 resize 操作。
				current.handler = preResize;
				
				// 等待操作。
				Element.getDocument(e.srcElement).on('mouseup', stopResize).on('mousemove', resize);
			},
			
			/**
			 * 初始化 resize 效果。
			 * @param {Event} e 事件。
			 * @param {Document} doc 文档。
			 */
			preResize = function(e, doc){
				
				// 拖动事件触发。    
				var me = current.srcElement,
				
					// tg   实际被改的对象, 触发事件的对象。
					tg = current.target = me.data.resizeTarget,
					
					// 选项。
					opt = tg.data.resize,
					
					// 代理。
					proxy = opt.start(current);
				
				with(current){
					
					// 选项。
					options = opt;
					
					// 代理。
					srcElement = proxy;
					
					// 绑定。
					origal = e;
					
					// fix 。
					fix = me.data.resize['fix' + X];
					
					// 类型。
					type = resizeXY;
						
					// 初始化 处理 resize 的对象。
					handler = onResize;
				}
				

				// 目标触发  beforeresizex
				if (tg.trigger(beforeResizeXY, current)) {
					
					// 获取初始值。
					current.from = current.getSize(proxy);
						
					// 获取位置。
					current.fromPosition = current.getPosition(proxy);
					
					// 改变鼠标效果。
					rm.changeType(doc, me.getStyle('cursor'));
					
					// 首次。
					current.handler(e, doc);
					
				}
			},
			
			/**
			 * 处理 resize 。
			 * @param {Event} e 事件。
			 */
			onResize = function(e){
				
				// 移动位置。
				current.delta = (e[pageXY] - current.fromXY);
				
				// 绑定。
				current.origal = e;
				
				current.options.resize(current);
					
				
			},
			
			/**
			 * 处理 resize 事件。
			 * @param {Event} e 事件。
			 */
			resize = function(e){
				current.handler(e, this);
			},
			
			/**
			 * 停止 resize 事件。
			 * @param {Object} e
			 */
			stopResize = function(e){
					
				// 不是单击。
				if(e.which != 1)
					return;
				
				// 不存在或调用 resizeend 。
				if (current.options){
					
					// 绑定。
					current.origal = e;
					
					// 停止事件。
					current.options.stop(current);
					
					// 删除拖动效果。
					rm.changeType(this, '');
					
					// 移除当前移动
					current.origal = current.options = current.srcElement = current.target = null;
				}
					
				// 结束拖动。
				this.un('mousemove', resize).un('mouseup', stopResize);
			};
			
		if(!k)
			startX = startResize;
		else
			startY = startResize;
		
	});
	
	/**
	 * @class Element
	 */
	Element.implement({
		
		/**
		 * 使当前元素支持拖动。
		 * @param {Element} proxy 拖动句柄。
		 * @param {String} direction 安装的方向， 'lt t rt r rb b lb l'选择。
		 * @return this
		 */
		setResizable: function(proxy, direction){
			
			var me = this;
			
			Py.Surround.toggle(me, 'x-resizable', direction, function(e, direction){
				rm.install(me, e, null, direction);
			});
			
			p.setData(me, 'resize', proxy ? rm.optionsWithProxy : rm.optionsWithoutProxy);
		}
		
	}, 2, 3);
	
})(Py);

