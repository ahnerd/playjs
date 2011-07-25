






Py.IToolTip = {
	
	
	/**
	 * 当指针在具有指定工具提示文本的控件内保持静止时，工具提示保持可见的时间期限。-1表示不自动隐藏。 0 表示始终不显示。
	 * @type Number
	 */
	autoPopDelay: -1,
	
	/**
	 * 工具提示显示之前经过的时间。
	 * @type Number
	 */
	initialDelay: 1000,
	
	/**
	 * 指针从一个控件移到另一控件时，必须经过多长时间才会出现后面的工具提示窗口。
	 * @type Number
	 */
	reshowDelay: 100,
	
	showAt: function(x, y){
		
	},
	
	showBy: function(ctrl){
		
	},
	
	/**
	 * 设置某个控件工具提示。
	 */
	setToolTip: function(ctrl, caption){
		var me = this;
		if(ctrl.tooptip){
			ctrl.tooptip.unsetToolTip(ctrl);
		}
		ctrl.tooptip = me;
		
		var data = Py.data(ctrl, 'tooltip');
		
		ctrl.on('mouseover', data.on = function (e) {
			if(me.autoPopDelay !== 0) {
				me.timer = setTimeout(function(){
					me.showAt(ctrl);
				}, me.initialDelay);
				
				if(me.autoPopDelay > 0){
					setTimeout(function(){
						me.hide();
					}, me.autoPopDelay);
				}
			}
		});
		
		ctrl.on('mouseout', data.un = function (e) {
			if(me.showAlways) {
				me.timer = setTimeout(function(){
					me.showAt(ctrl);
				}, me.initialDelay);
			}
		});
		
		if(caption)
			me.setText(caption);
	},
	
	unsetToolTip: function(ctrl){
		ctrl.un('mouseover', Py.getData(ctrl, 'tooltip');
	},
	
	onShow: function(x, y){
		
		if(this.automaticDelay >= 0) {
			this.timer = setTimeout(Function.bind(this.hide, this), this.automaticDelay);
		}
		
	},
	
	stopTimer: function(){
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
	
}  ;
