

Py.using("System.Dom.Element");


(function(p) {
	
	/**
	 * @class Point
	 */
	var Point = p.Point,
			
		/**
		 * 表示一个拖动元素。
		 * @class Target
		 */
		Target = p.Class({
			
			/**
			 * 改变当前对象的目标。
			 * @param {Element} elem 元素。
			 */
			change: function(elem) {
				
				var me = this;
				
				me.dom = elem;
				me.from = elem.getOffset();
				me.to = me.from.clone();
				
			},
			
			/**
			 * 计算当前的元素新位置。
			 */
			calculate: function() {
				var me = this;
				
				//当前位置的改变量 和 鼠标的偏移量相同。
				me.to.set(me.from.x + dm.delta.x, me.from.y + dm.delta.y);
			},
			
			/**
			 * 把目标移回开始位置。
			 */
			back: function() {
				this.to = this.from;
				dm.delta.set(0, 0);
				this.move();
			},
			
			/**
			 * 移动到当前的新位置。
			 */
			move: function() {
				this.dom.setOffset(this.to);
			}
			
		}),
		
		/**
		 * Function.empty。
		 * @type Function
		 */
		empty = Function.empty,
		
		/**
		 * @namespace Py.DragDrop
		 */
		dd = p.namespace('Py.DragDrop', {
			
			/**
			 * 表示一个拖动元素。
			 * @class Target
			 */
			Target: Target,
			
			/**
			 * @type Object
			 */
			options: {
				
				/**
				 * 开始拖动。
				 * @param {Element} current 源。
				 * @param {Event} e 事件。
				 */
				start: function(current, e) {
					
					// 事件目标。
					var c = dm.current, tg = c.target = Py.dataIf(current, 'dragTarget') || current;
					
					e.data = c;
					
					// 如果都正常。
					if(tg.trigger('dragstart', e)) {
						
						c.change(tg.dom || tg);
						
						dm.onBeforeDrag(e);
						
						return true;
					}
					
					return false;
				},
				
				/**
				 * 放开拖动。
				 * @param {Event} e 事件。
				 */
				stop: function(e) {
					e.data = dm.current;
					var result = dm.onAfterDrag(e);
					return dm.current.target.trigger('dragend', e) && result;
				},
				
				/**
				 * 非法停止拖动。
				 * @param {Event} e 事件。
				 */
				prevent: function(e) {
					dm.current.back(); 
					dm.onInvalidDrop(e);
				},
				
				/**
				 * 拖动。
				 * @param {Event} e 事件。
				 */
				drag: function(e) {
					
					var c = e.data = dm.current;
					
					c.calculate();
					
					if(c.target.trigger('drag', e)) {
						
						c.move();
						dm.onDrag(e);
						
					}
						
				}
				
			},
			
			/**
			 * 拖动管理类。
			 * @namespace Py.DragDrop.Manager
			 */
			Manager: {
				
				/**
				 * 鼠标开始坐标。
				 * @type Point
				 */
				from: new Point(),
				
				/**
				 * 当前鼠标总变化量。
				 */
				delta: new Point(),
				
				/**
				 * 当前引发拖动事件的对象。
				 * @type Target
				 */
				current: null,
				
				/**
				 * 当前选项。
				 */
				options: null,
				
				/**
				 * 检查发生的事件是否允许 Drag 。
				 * @param {Event} e
				 */
				checkEvent: function(e) {
					return e.which == 1;
				},
				
				/**
				 * 暂停当前正在进行的拖动。
				 * @param {Document} doc 文档。
				 */
				pause: function(doc) {
					doc.un('mousemove', drag).un('mouseup', stopDrag);
				},
				
				/**
				 * 在开始拖动前初始化拖动变量。
				 * @param {Event} e 事件参数。
				 */
				onBeforeDrag: empty,
				
				/**
				 * 在拖动之后的默认处理函数。
				 * @param {Event} e 事件参数。
				 */
				onAfterDrag: Function.returnTrue,
				
				/**
				 * 在鼠标改变位置时，移动被拖动对象的位置。
				 * @param {Event} e 事件参数。
				 */
				onDrag: empty,
				
				/**
				 * 当 drop 事件 return false 执行。
				 * @param {Event} e 事件参数。
				 */
				onInvalidDrop: empty,
				
				/**
				 * 更新当前的鼠标效果。
				 * @param {Document} doc 文档。
				 * @param {Boolean} in 如果 true， 表示设置当前的样式，否则删除当前样式。
				 */
				changeType: function(doc, type) {
					doc.getDom().setUnselectable(!!type).style.cursor = type;
				},
			
				/**
				 * 设置某个元素的拖动。
				 * @param {Element} elem 元素。
				 * @param {Object} options 拖动选项。
				 * 提供最底层的拖动事件。
				 * start - 开始拖动
				 * stop - 停止拖动
				 * drag - 拖动。
				 * prevent - 阻止拖动。
				 */
				start: function(elem, options) {
					
					// 保存选项。
					p.setData(elem, 'drag', options);
					
					elem
						.on   ('mousedown', startDrag)
						.draggable = false;  // 使自带的 dragstart 失效。
				},
				
				/**
				 * 设置元素根据句柄拖动。
				 * @param {Element} elem 元素。
				 * @param {Element} handler 句柄。
				 * @param {Object} options 拖动选项。
				 */
				set: function(elem, handler, options) {
					
					if(handler !== false) {
						if(handler && handler.getDom)
							Py.setData(handler, 'dragTarget', elem);
						else
							handler = elem;
						
						Py.Element.setMovable(elem.dom || elem);
						
						dm.start(handler, options || dd.options);
					}else
						dm.stop(elem);
				},
				
				/**
				 * 停止拖动。
				 * @param {Element} handle 拖动句柄。
				 */
				stop: function(handle) {
					handle.un  ('mousedown', startDrag);
				}
			
			}
			
		}),
		
		/**
		 * Manager 简写。
		 * @type Py.DragDrop.Manager
		 */
		dm = dd.Manager  ;
	
	
	/// #region 拖动
	
	/**
	 * 处理 mousedown 事件。
	 * @param {Event} e 事件参数。
	 */
	function startDrag(e) {
		
		// 左键才继续
		if(!dm.checkEvent(e) || dm.options)
			return;
		
		// 设置当前处理  mousemove 的方法。
		// 初始需设置 onDrag
		// 由 onDrag 设置为    onDrag
		dm.handler = onDrag;
		
		// 保存最开始的鼠标位置。
		dm.from.set( e.pageX, e.pageY);
		dm.delta.set( 0, 0 );
		
		// 暂时保存导致事件发生的目标。
		dm.current = this;
		
		// 设置文档  mouseup 和   mousemove
		Element.getDocument(e.srcElement).on('mouseup', stopDrag).on('mousemove', drag);
		
	}
	
	/**
	 * 开始准备拖动。
	 * @param {Event} e 事件。
	 * @param {Document} doc 发生事件的文档。
	 */
	function onDrag(e, doc) {
		
		// 载入当前的配置。
		// 刷新当前的拖动对象。 
		// 生成当前处理的数据。
		var current = dm.current, dat = p.data(current, 'drag');
		
		// 设置句柄。
		dm.handler = dat.drag;
		
		// 新的目标。
		dm.current = new Target();
		dm.options = dat;
		
		if (dat.start(current, e, doc)) {
			
			dm.changeType(doc, current.getStyle('cursor'));
			dm.handler(e, doc);
		} else {
			
			// 删除无用的数据 。
			dm.options = dm.current = null;
			
			// 停止。
			dm.pause(doc);
		}
	}
	
	/**
	 * 处理 mousemove 事件。
	 * @param {Event} e 事件参数。
	 */
	function drag(e) {

		dm.delta.set( e.pageX - dm.from.x, e.pageY - dm.from.y ) ;
		
		// 调用函数处理。
		dm.handler(e, this);
	}
	
	/**
	 * 处理 mouseup 事件。
	 * @param {Event} e 事件参数。
	 */
	function stopDrag(e) {
		
		// 左键
		if(!dm.checkEvent(e))
			return;
			
		// 检查是否拖动。
		// 有些浏览器效率较低，肯能出现这个函数多次被调用。
		// 为了安全起见，检查 current 变量。
		if (dm.options) {
			
			// 结束全部事件。
			dm.options.stop(e, this) || dm.options.prevent(e, this);
			
			// 改变结束的鼠标类型，一般这个函数将恢复鼠标样式。
			dm.changeType(this, '');
			
			// 删除无用的数据 。
			dm.options = dm.current = null;
		
		}
		
		dm.pause(this);
	}
	
	/// #endregion
	
	/// #region Element
	
	/**
	 * @class Element
	 */
	Element.implement({
		
		/**
		 * 使当前元素支持拖动。
		 * @param {Element} [handler] 拖动句柄。
		 * @return this
		 */
		setDraggable: function(handler) {
			dm.set(this.getDom(), handler);
			return this;
		}
		
	}, 2);
	
	/// #endregion
	
})(Py ) ;



