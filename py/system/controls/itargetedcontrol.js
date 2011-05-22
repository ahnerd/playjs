


(function(){
	
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
	
	
	

// 支持基于某个控件显示。
Py.ITargetedControl = {
	
	position: 'rb',
	
	animateType: 'opacity',
	
	onHide: Function.empty,
	
	hide: function(){
		
		// 先关闭子菜单。
		this.onHide();
		
		// 执行关闭。
		this.dom.hide(this.duration.close, null, this.animateType);
		
		return this;
	},
	
	onShow: Function.empty,
	
	show: function(x, y){
		var p = Py.Element.getXY(x, y);
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
	
	showBy: function(ctrl){
		this.dom.show();
		this.alignBy(ctrl, this.position, this.offsetX, this.offsetY);
	},
	
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
	
	onStartOverflowY: function(){
		
	}
};



	
	
	
})()  ;