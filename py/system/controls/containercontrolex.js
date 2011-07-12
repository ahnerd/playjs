//===========================================
//   支持容器布局     containercontrolex.js      A
//===========================================


Py.using("System.Controls.ContainerControl");
Py.using("System.Controls.Layout.LayoutEngine");
Py.using("System.Controls.IContainerControl");



Py.ContainerControl.implement(Py.IContainerControl).implement({
	
	layout: 'none',
	
	_raiseEvents: function(name, ct, item, index){
		
		this.trigger(name, {
			target: item,
			position: index
		});
			
		// 添加一个项目控件。
		this.layout[ct](this, item, index);
		
		// 重新布局。
		this.performLayout();
		
	},
	
	onControlAdded: function(item, index){
		return this._raiseEvents('controladded', 'onControlAdded', item, index);
	},
	
	onControlRemoved: function(item, index){
		return this._raiseEvents('controlremoved', 'onControlRemoved', item, index);
	},
	
	/**
	 * 当被子类重写时，渲染控件。
 	 * @method init
 	 * @param {Object} options 配置。
 	 * @protected
	 */
	initChildren: function() {
		this.controls = new Py.ContainerControl.ControlCollection(this);
	
		Py.Layout[this.layout].initLayout(this);
	},

	suspendLayout: function(){
		if(this.layouting) this.layouting++;
		else this.layouting = 1;
		return this;
	},
	
	resumeLayout: function(performLayout){
		if(this.layouting && --this.layouting === 0 && performLayout !== false) {
			this.performLayout(true);
		}
		return this;
	},
	
	setLayout: function(name){
		
		if(typeof name == 'string'){
			assert(name in Py.Layout, "不存在名为 {0} 的 layout 方式(缺少 using(\"System.Controls.Layout.{0}\"))", name);
			name = Py.Layout[name];
		}
			
		// 如果新布局和原布局一样，直接返回即可。
		if(this.layout.xType == name.xType)
			return this;
			
		// 原布局取消绑定。
		this.layout.uninitLayout(this);
		
		// 初始化新布局。
		name.initLayout(this);
		
		return this.performLayout();
	},
	
	performLayout: function(){
		
		if(!this.layouting){

			this.layouting = 1;
				
			try {
	
				this.layout.layout(this);
				
			} finally{
				
				this.layouting = 0;
				
			}
		}
		
		return this;
	}
	
});


Py.ContainerControl.ControlCollection = Py.Control.ControlCollection.extend({
		
	onBeforeSet: function(){
		this.owner.suspendLayout();
	},
		
	onAfterSet: function(){
		this.owner.resumeLayout();
	}
	
});
