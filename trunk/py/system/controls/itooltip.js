


using("System.Controls.ITargetedControl");




Py.IToolTip = Object.extend({
	
	
	/**
	 * 当指针在具有指定工具提示文本的控件内保持静止时，工具提示保持可见的时间期限。-1表示不自动隐藏。
	 * @type Number
	 */
	autoPopDelay: -1,
	
	/**
	 * 工具提示显示之前经过的时间。
	 * @type Number
	 */
	InitialDelay: 1000,
	
	/**
	 * 指针从一个控件移到另一控件时，必须经过多长时间才会出现后面的工具提示窗口。
	 * @type Number
	 */
	reshowDelay: 100,
	
	/**
	 * 是否显示本提示。
	 * @param {Object} ctrl
	 */
	showAlways: true,
	
	showBy: function(ctrl){
		
	},
	
	setToolTip: function(ctrl, caption){
		ctrl.tooptip = this;
		this.setText(caption);
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
	
}, Py.ITargetedControl);
