//===========================================
//  在一个目标对齐           itargetedcontrol.js          A
//===========================================



using("System.Dom.Element");


(function(){
	
	/*
var names = {
		r: 'right',
		b: 'bottom',
		l: 'left',
		t: 'top'
	}, nameC = {
		r: 'x',
		b: 'y', 
		l: 'x',
		t: 'y'
	};
*/
	
	
	/**
	 * 基于某个控件，设置当前控件的位置。改函数让控件显示都目标的右侧。
	 * @param {Controls} ctrl 目标的控件。
	 * @param {Number} offsetX 偏移的X大小。
	 * @param {Number} offsetY 偏移的y大小。
	 */
	var alignByRight = function(ctrl, offsetX, offsetY){
		    var ctrlRegion = ctrl.getBound(),
				size = this.getSize(),
				documentSize = document.getSize(),
				expectedX = ctrlRegion.right + offsetX,
				expectedY = ctrlRegion.top + offsetY;
			
			// 如果显示之后超出了屏幕右方。
			if( expectedX + size.x > documentSize.x ) {
				
				// 移到左边。
				expectedX = Math.max(0, ctrlRegion.left - size.x - offsetX);
			}
			
			// 如果垂直部分超出了。进行上移。
			if( expectedY + size.y > documentSize.y) {
				//  expectedY = Math.max(0, documentSize.y - size.y);
				expectedY = ctrlRegion.bottom - size.y - offsetY;
				
				if(expectedY < 0){
					expectedY = 0;
					this.onOverflowY(documentSize.y);
				}
			}
				
			this.setPosition(expectedX, expectedY);
	}, alignByBottom =  function(ctrl, offsetX, offsetY){
		var ctrlRegion = ctrl.getBound(),
				size = this.getSize(),
				documentSize = document.getSize(),
				expectedY = ctrlRegion.bottom + offsetY,
				expectedX = ctrlRegion.left + offsetX;
			
			// 如果显示之后超出了屏幕右方。
			if( expectedY + size.y > documentSize.y ) {
				
				// 移到左边。
				expectedY = ctrlRegion.top - size.y - offsetX;
				
				if(expectedY < 0){
					expectedY = 0;
					this.onOverflowY(documentSize.y);
				}
			}
			
			// 如果垂直部分超出了。进行上移。
			if( expectedX + size.x > documentSize.x) {
				//  expectedY = Math.max(0, documentSize.y - size.y);
				expectedX = Math.max(0, ctrlRegion.right - size.x - offsetX);
			}
				
			this.setPosition(expectedX, expectedY);
	};
	
		/*
		// 依靠某个控件或节点定位显示。
		// 复杂的计算。
		alignBy: function (ctrl, position, offsetX, offsetY){
			
return;
			// 获得理论显示的位置。
			var targetBound = ctrl.getBound(),
				mySize = this.getSize(),
				docBound = document.getBound(),
				p1 = position.charAt(0),
				d1 = names[p1],
				x,
				y;
			x = docBound[d1] - targetBound[d1]
			
			// 显示右边出界。
			if(x + msize.x >= doc.x) {
				
				// 计算显示左边的位置。
				x = p.x - size.x;
				
				// 保证大于 0 不显示外面 。
				x = Math.max(x, 0);
			}
			
			p.x = x;
			p.y -= 5;
			
			// 显示下面出界。
			if(p.y + msize.y >= doc.y) {
				
				// 计算显示左边的位置。
				p.y -= size.y;
			}
			
			// 如果还是超界，安装上下句柄。
			if(p.y < 0)
				this.installHandle();
			else 
				this.uninstallHandle();
			
			this.bringToFront(ctrl);
			
			// 设置位置。
			this.setOffset(p);
			return this;

		},
	*/	
	
	// 支持基于某个控件显示。
	Py.ITargetedControl = {
		
		position: 'rt',
		
		animateType: 'opacity',
		
		hide: function(){
			
			// 先关闭子菜单。
			this.onHide();
			
			// 执行关闭。
			this.dom.hide(this.duration.close, null, this.animateType);
			
			return this;
		},
		
		show: function(x, y){
			var p = Element.getXY(x, y);
			this.setOffset(p).dom.show(this.duration.open, null, this.animateType);
			this.onShow();
			
			return this;
		},
		
		/**
		 * 显示特效使用的时间。 0 为不使用特效。
		 * @type Number
		 */
		duration: {
			close:  0,
			open: 0
		},
		
		offsetX: 0,
		
		offsetY: 0,
		
		showBy: function(ctrl,  offsetX, offsetY){
			this.dom.show(this.duration.open);
			(this.position == 'rt' ? alignByRight : alignByRight).call(this,ctrl, offsetX, offsetY);
		},
		onOverflowY: function(){
			
		}
	};

})()  ;