

//Py.namespace("System.Dom.DragEx");
Py.using("System.Dom.Drag");


(function(p){
	
	/**
	 * @class Point
	 */
	var Point = p.Point,
	
		/**
		 * @class Element
		 */
		Element = p.Element,
		
		/**
		 * Element.styleNumber 。
		 * @type Function
		 */
		styleNumber = Element.styleNumber,
			
		/**
		 * 表示一个拖动元素。
		 * @class Target
		 */
		Target = p.Class({
			
			/**
			 * 改变当前对象的目标。
			 * @param {Element} elem 元素。
			 */
			change: function(elem){
				
				var me = this;
						
				// 设置目标可拖动。
				Element.setMovable(elem);
					
				me.target = elem;
				me.from = elem.getLeftTop();
				me.to = me.from.clone();
				
				return me;
				
			},
			
			/**
			 * 计算当前的元素新位置。
			 */
			calculate: function(){
				var me = this;
				
				//当前位置的改变量 和 鼠标的偏移量相同。
				me.to.set(me.from.x + dm.delta.x, me.from.y + dm.delta.y);
			},
			
			/**
			 * 更改当前元素的位置偏移。
			 * @param {Number} x 值。
			 * @param {Number} y 值。
			 */
			offset: function(x, y){
				var me = this;
				
				if (y && x) {
					
					// 保存偏位置。
					me.offsets = new Point(x, y);
					me.from.add(x, y);
				}
			},
			
			/**
			 * 删除当前元素的位置偏移。
			 */
			clearOffset: function(){
				var me = this;
				
				if(me.offsets){
					me.from.sub(me.offsets);
					delete me.offsets;
				}
			},
			
			/**
			 * 移动到当前的新位置。
			 */
			move: function(){
				this.target.setLeftTop(this.to);
			}
			
		}),
		
		dm = Py.DragDrop.Manager,
		
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
			 * @type Object
			 */
			options: {
				
				start: function(current, e){
					
					// 事件目标。
					var c = dm.current,

						target = c.target = Py.dataIf(current, 'drag');
					
					// 返回处理元素。
					return target.dom || target;
				},
				
				stop: function(e){
					
				},
				
				prevent: function(e){
					
				},
				
				drag: function(e){
					
				}
				
			},
			
			/**
			 * 拖动管理类。
			 * @namespace Py.DragDrop.Manager
			 */
			Manager: {
			
				/**
				 * 设置某个元素的拖动。
				 * @param {Element} elem 元素。
				 * @param {Element} handler 拖动句柄。
				 * @param {Object} options 拖动选项。
				 * start - 开始拖动
				 * stop - 停止拖动
				 */
				start: function(elem, handler, options){
					
					// 如果设置句柄，则在句柄保存目标，否则句柄即目标。
					handler = handler || elem;
					
					var d =  p.data(handler, 'drag');
					d.options = options || dd.options;
					d.target = elem;
					
					// 设置 handle 处理事件。
					handler
						.setUnselectable()  // 设置句柄不可选。避免在 IE 触发事件。
						.on   ('mousedown', startDrag)
						.draggable = false;  // 使自带的 dragstart 失效。
				},
				
				/**
				 * 停止拖动。
				 * @param {Element} handle 拖动句柄。
				 */
				stop: function(handle){
					handle.un  ('mousedown', startDrag);
				},
				
				/**
				 * 暂停当前正在进行的拖动。
				 * @param {Document} doc 文档。
				 */
				pause: function(doc){
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
				onDrag: function(e){
					
					// 计算下一个位置。
					dm.dragImage.calculate();
					
					// 触发 drag ， 如果同意移动，则移动位置。
					if(dm.eventArgs._dispatch(dm.target, 'drag', e)){
						
						// 移动所有需要的元素。
						dm.dragImage.move();
						dm.elements.forEach(move);
						
						return true;
					}
				},
				
				/**
				 * 当 drop 事件 return false 执行。
				 * @param {Event} e 事件参数。
				 */
				onInvalidDrop: function(e){
					
					// 移回
					bak(dm.dragImage);
					dm.elements.forEach(bak);
					
				},
				
				/**
				 * 更新当前的鼠标效果。
				 * @param {Document} doc 文档。
				 * @param {Boolean} in 如果 true， 表示设置当前的样式，否则删除当前样式。
				 * <code>
				 * 
				 * // 是否在拖动
				 * if(!this.eventArgs)
				 * 		doc.setStyle('cursor', '');
				 * else
				 *      doc.setStyle('cursor', this.eventArgs.dataTransfer.dropEffect);
				 * 
				 * </cpde>
				 */
				changeType: function(doc, type){
					//doc.dom.style.cursor = type;
				},
					
				/**
				 * 当前正在拖动的镜像。
				 * @type Py.DragDrop.Target
				 */
				dragImage: new Target(),
				
				/**
				 * 参数。
				 * @type Py.DragDrop.EventArgs
				 */
				eventArgs: null,
				
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
				 * 当前正在被拖动的所有元素。
				 * @type Array
				 */
				elements: [],
				
				/**
				 * 当前引发拖动事件的对象。
				 * @type Element
				 */
				target: null
			
			},
			
			/**
			 * 拖动时数据处理工具。
			 * @class DataTransfer
			 */
			DataTransfer: p.Class({
				
				/**
				 * 拖动时的效果。
				 * @param {Object} format
				 * 1.none - 被拖动对象不能放在这个地方,出了文本以外的所有对象都默认该值,也就是说只能拖动到text里面,其它放置对象不能接收拖动对象。
				 * 2.move - 表示被拖动对象应该移动到放置对象上。
				 * 3.copy - 表示拖动的对象应该复制到放置对象上。
				 * 4.link - 表示放置对象将会浏览到被拖动的对象,这个只能是URL时才有效果。
				 */
				dropEffect: "none",      //  none    move    copy      link
				
				/**
				 * 拖动时可放的效果。
				 * @param {Object} format
				 * 1.uninitialized - 没有为拖动的对象设置任何动作,拒绝任何动作。
				 * 2.none - 被拖动的对象上不允许任何动作.拒绝任何动作。
				 * 3.copy - 只允许dropEffect中的copy。
				 * 4.link - 只允许dropEffect中的link。
				 * 5.copyLink - 只允许dropEffect中的copy和link。
				 * 6.copyMove - 只允许dropEffect中的copy和Move。
				 * 7.linkMove - 只允许dropEffect中的link和Move。
				 * 8.all - 允许所有的dropEffect。
				 */
				effectAllowed: "all", //   uninitialized
				
				/**
				 * 获取正在拖动的文件。
				 */
				files: [],
				
				/**
				 * 获取当前拖动的类型。
				 */
				types: 'element',
				
				/**
				 * 删除当前拖动的数据。
				 * @param {String} format 数据。
				 */
				clearData: function(format){
					P.clearData(this, format);
				},
				
				/**
				 * 设置当前拖动的数据。
				 * @param {String} format 数据。
				 * @param {String} data 一个字符串。
				 */
				setData: function(format, data){
					p.setData(this, format, data);
				},
				
				/**
				 * 获取当前拖动的数据。
				 * @param {String} format 数据。
				 */
				getData: function(format){
					return p.dataIf(this, format);
				},
				
				/**
				 * 增加拖动的元素。
				 * @param {Element} elem 元素。
				 */
				addElement: function(elem){
					dm.elements.push(new dd.Target().change(elem));
				},
				
				/**
				 * 设置拖动的句柄。
				 * @param {Element} elem 元素。
				 * @param {Number} x 偏移坐标。
				 * @param {Number} y 偏移坐标。
				 */
				setDragImage: function(elem, x, y){
					dm.dragImage.change(elem).offset(x, y);
				}
				
			}, true),
			
			/**
			 * 表示默拖动事件参数。
			 */
			EventArgs: Py.EventArgs.extend({
				
				/**
				 * 改变当前事件。
				 * @param {Element} target 目标。
				 * @param {String} type 事件分类。
				 * @param {Event} e 事件参数。
				 * @private
				 */
				_dispatch: function(target, type, e){
					
					var me = this;
					me.orignal = e;
					me.type = type;
					me.returnValue = true;
					me.cancelBubble = false;
					return target.trigger(type, me);
					
				},
				
				/**
				 * 初始化。
				 */
				constructor: function(){
					
					var me = this;
					
					me.dataTransfer = new dd.DataTransfer();
					me.target = dm.dragImage;
					me.srcElement = dm.target;
				},
				
				/**
				 * 阻止冒泡。
				 * @method stopPropagation
				 */
				stopPropagation : function(){
					this.orignal.stopPropagation();
				},
				
				/**
				 * 停止默认。
				 * @method preventDefault
				 */
				preventDefault : function(){
					this.orignal.preventDefault();
					this.returnValue = false;
				}
				
			}),
			
			Target: Target
			
		}),
		
		/**
		 * Manager 简写。
		 * @type Py.DragDrop.Manager
		 */
		dm = dd.Manager;
	
	/// #region 工具
	
	/**
	 * 计算并移动位置。
	 * @param {Target} target 目标。
	 */
	function move(tg){
		tg.calculate();
		tg.move();
	}
	
	/**
	 * 将元素移回初始位置。
	 * @param {Object} target 目标。
	 */
	function bak(tg){
		
		// 删除偏位置。
		tg.clearOffset();

		// 使用  animate， 使回去时候更平滑。
		tg.target.animate({
			
			lefttop: tg.from
			
		});

	}
	
	/// #endregion
	
	/// #region 拖动
	
	/**
	 * 处理 mousedown 事件。
	 * @param {Event} e 事件参数。
	 */
	function startDrag(e){
		
		// 左键才继续
		if(e.which != 1 || dm.isDragging)
			return;
			
		// 设置当前处理  mousemove 的方法。
		// 初始需设置 onDrag
		// 由 onDrag 设置为 dm.onDrag
		dm.handler = onDrag;
		
		// 保存最开始的鼠标位置。
		dm.from.set( e.pageX, e.pageY);
		dm.delta.set( 0, 0 );
		
		// 暂时保存导致事件发生的目标。
		dm.target = this;
		
		// 设置文档  mouseup 和   mousemove
		Element.getDocument(e.srcElement).on('mouseup', stopDrag).on('mousemove', drag);
		
	}
	
	/**
	 * 处理化拖动。
	 * @param {Event} e 事件。
	 * @param {Document} doc 发生事件的文档。
	 */
	function onDrag(e, doc){
		
		// 更新拖动。
		dm.elements.length = 0;
		
		// 载入当前的配置。
		// 刷新当前的拖动对象。 
		// 生成当前处理的数据。
		var dat = p.data(dm.target, 'drag'), evt = dm.eventArgs = new dd.EventArgs(), tg = dat.options.start(dm.target = dat.target, evt);
		
		// 默认对 target 进行操作。
		dm.options = dat.options;
		dm.dragImage.change(tg);
		dm.handler = dm.onDrag;
		
		dm.onBeforeDrag(e);
		
		// 对目标元素触发 dragstart 事件。如果事件被阻止，则终止拖动。
		if(evt._dispatch(dm.target, 'dragstart', e)){
			dm.changeType(doc, true);
			dm.handler(e);
		} else
			dm.pause(doc);
	}
	
	/**
	 * 处理 mousemove 事件。
	 * @param {Event} e 事件参数。
	 */
	function drag(e){
		dm.handler(e, this);
	}
	
	/**
	 * 处理 mouseup 事件。
	 * @param {Event} e 事件参数。
	 */
	function stopDrag(e){
		
		// 左键
		if(e.which != 1)
			return;
			
		// 检查是否拖动。
		// 有些浏览器效率较低，肯能出现这个函数多次被调用。
		// 为了安全起见，检查 isDragging 变量。
		if (dm.eventArgs){
			
			//触发 dragend 如果事件正常返回 ， 停止运动, 否则先移回老位置。
			var result = dm.onAfterDrag(e);
			result &= dm.eventArgs._dispatch(dm.target, 'dragend', e);
			
			if(!result) {
				
				// 如果drop 或 dragend 默认事件
				// 阻止， 说明这次为无效 drop ，触发这个函数，
				// 一般在这个函数可实现把拖动目标还原到开始处。
				dm.onInvalidDrop(e);
			} 
			
			dm.options.stop(dm.target, dm.eventArgs);
			
			// 改变结束的鼠标类型，一般这个函数将恢复鼠标样式。
			dm.changeType(this, false);
			
			// 删除无用的 eventArgs 。
			delete dm.eventArgs;
		
		}
		
		dm.pause(this);
	}
	
	/// #endregion
	
	
	// 补充 DOM 事件。
	p.defineDomEvents('dragstart drag dragend', empty, empty, empty);
	
	/**
	 * @class Element
	 */
	Element.implement({
		
		/**
		 * 使当前元素支持拖动。
		 * @param {Element} [handler] 拖动句柄。
		 * @return this
		 */
		setDraggable: function(handler){
			if(handler !== false)
				dm.start(this, handler === true ? 0 : handler);
			else
				dm.stop(this);
			return this;
		}
		
	}, 2, 3);
		
	

})(Py);







	
	
	
Ext.dd.StatusProxy = function(config){
    Ext.apply(this, config);
    this.id = this.id || Ext.id();
    this.el = new Ext.Layer({
        dh: {
            id: this.id, tag: "div", cls: "x-dd-drag-proxy "+this.dropNotAllowed, children: [
                {tag: "div", cls: "x-dd-drop-icon"},
                {tag: "div", cls: "x-dd-drag-ghost"}
            ]
        }, 
        shadow: !config || config.shadow !== false
    });
    this.ghost = Ext.get(this.el.dom.childNodes[1]);
    this.dropStatus = this.dropNotAllowed;
};

Ext.dd.StatusProxy.prototype = {
    
    dropAllowed : "x-dd-drop-ok",
    
    dropNotAllowed : "x-dd-drop-nodrop",

    
    setStatus : function(cssClass){
        cssClass = cssClass || this.dropNotAllowed;
        if(this.dropStatus != cssClass){
            this.el.replaceClass(this.dropStatus, cssClass);
            this.dropStatus = cssClass;
        }
    },

    
    reset : function(clearGhost){
        this.el.dom.className = "x-dd-drag-proxy " + this.dropNotAllowed;
        this.dropStatus = this.dropNotAllowed;
        if(clearGhost){
            this.ghost.update("");
        }
    },

    
    update : function(html){
        if(typeof html == "string"){
            this.ghost.update(html);
        }else{
            this.ghost.update("");
            html.style.margin = "0";
            this.ghost.dom.appendChild(html);
        }        
    },

    
    getEl : function(){
        return this.el;
    },

    
    getGhost : function(){
        return this.ghost;
    },

    
    hide : function(clear){
        this.el.hide();
        if(clear){
            this.reset(true);
        }
    },

    
    stop : function(){
        if(this.anim && this.anim.isAnimated && this.anim.isAnimated()){
            this.anim.stop();
        }
    },

    
    show : function(){
        this.el.show();
    },

    
    sync : function(){
        this.el.sync();
    },

    
    repair : function(xy, callback, scope){
        this.callback = callback;
        this.scope = scope;
        if(xy && this.animRepair !== false){
            this.el.addClass("x-dd-drag-repair");
            this.el.hideUnders(true);
            this.anim = this.el.shift({
                duration: this.repairDuration || .5,
                easing: 'easeOut',
                xy: xy,
                stopFx: true,
                callback: this.afterRepair,
                scope: this
            });
        }else{
            this.afterRepair();
        }
    },

    
    afterRepair : function(){
        this.hide(true);
        if(typeof this.callback == "function"){
            this.callback.call(this.scope || this);
        }
        this.callback == null;
        this.scope == null;
    }
};
